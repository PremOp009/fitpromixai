import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Security check for Vercel Cron
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV !== 'development'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersRef = collection(db, 'users');
    // Filter for users where status === "trial"
    const q = query(usersRef, where('status', '==', 'trial'));
    const querySnapshot = await getDocs(q);

    const now = new Date();
    const expiredUsers = [];

    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      
      let hasExpired = false;
      
      // Check if trial has expired based on trialEndsAt or createdAt
      if (userData.trialEndsAt) {
        const trialEndsAt = userData.trialEndsAt.toDate ? userData.trialEndsAt.toDate() : new Date(userData.trialEndsAt);
        if (now >= trialEndsAt) hasExpired = true;
      } else if (userData.createdAt) {
        const createdAt = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
        const trialEndsAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (now >= trialEndsAt) hasExpired = true;
      }

      if (hasExpired && userData.email) {
        expiredUsers.push({ id: userDoc.id, email: userData.email, name: userData.name || userData.displayName || 'Subject' });
      }
    }

    const emailPromises = expiredUsers.map(async (user) => {
      // 1. Send Resend Email
      await resend.emails.send({
        from: 'FitpromixAI Matrix <onboarding@resend.dev>', // Change to your verified domain if available
        to: user.email,
        subject: 'Your Matrix Trial has Expired ⚠️',
        html: `
          <div style="background-color: #000000; color: #ffffff; font-family: monospace; padding: 40px; border: 2px solid #00ffff; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00ffff; text-transform: uppercase; letter-spacing: 2px; font-size: 24px;">Attention ${user.name}</h1>
            <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
              Your 7-day trial of the FitpromixAI Matrix has successfully concluded. 
              <br/><br/>
              Access to Kinetic Data generation, custom routines, and AI terminal processing has been temporarily <strong style="color: #ff0055;">PAUSED</strong>.
            </p>
            <div style="background-color: #0a0a0a; padding: 20px; border-left: 4px solid #00ffff; margin: 30px 0;">
              <p style="margin: 0; color: #00ffff; font-weight: bold; font-size: 18px;">SYSTEM STATUS: AWAITING UPGRADE</p>
            </div>
            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              To restore your neural link and retain all saved kinetic arrays, you must initialize a premium uplink.
            </p>
            <a href="https://fitpromixai.vercel.app/dashboard/premium" style="display: inline-block; background-color: #00ffff; border: 2px solid #00ffff; color: #000000; text-decoration: none; padding: 15px 30px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px;">
              [ UPGRADE TO PREMIUM ]
            </a>
            <p style="color: #666666; font-size: 12px; margin-top: 50px; border-top: 1px dashed #333333; pt-4;">
              END OF TRANSMISSION // FITPROMIXAI MATRIX SYS-CORE
            </p>
          </div>
        `
      });

      // 2. Update user status in Firestore to prevent duplicate emails
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        status: 'expired'
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ 
      success: true, 
      processed: expiredUsers.length 
    });

  } catch (error: any) {
    console.error('Error processing expired trials:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
