"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSequenceProps {
  children?: React.ReactNode;
}

export default function HeroSequence({ children }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  
  // Custom definitions specific to Fitpromixai ezgif frames
  const totalFrames = 162;
  const framePrefix = "/frames/ezgif-frame-";
  const frameExtension = ".jpg";
  const padLength = 3;
  const fps = 30;

  // Preload Images perfectly into an array of HTMLImageElements
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(padLength, "0");
        img.src = `${framePrefix}${frameNumber}${frameExtension}`;
        // Load in background silently
        loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, []);

  // Main Render Loop (Auto Playback)
  useEffect(() => {
    if (images.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    const interval = 1000 / fps;

    const drawFrame = (time: number) => {
      animationFrameId = requestAnimationFrame(drawFrame);
      
      if (time - lastTime < interval) return;
      lastTime = time;

      const img = images[currentFrameRef.current];

      if (img && img.complete && img.naturalWidth > 0) {
          // High fidelity cover dimension match (object-fit cover emulation)
          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = img.naturalWidth / img.naturalHeight;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (canvasRatio > imgRatio) {
              drawWidth = canvas.width;
              drawHeight = canvas.width / imgRatio;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
          } else {
              drawWidth = canvas.height * imgRatio;
              drawHeight = canvas.height;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
          }

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height); // clear artifacts effectively
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
          // Fallback
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Advance to next frame automatically
      currentFrameRef.current = (currentFrameRef.current + 1) % totalFrames;
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // Standard screen height wrapper for auto-playing sequence
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Background auto-playing canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 block"
      />
      
      {/* Cinematic gradient vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* High Absolute Layer: Passes Page overlays exactly onto frame */}
      <div className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center pointer-events-auto">
          {children}
      </div>
      
    </div>
  );
}
