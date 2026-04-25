"use client";

import { useEffect, useRef, useState } from "react";

interface CanvasPlayerProps {
  totalFrames?: number;
  framePrefix?: string;
  frameExtension?: string;
  padLength?: number;
  fps?: number;
}

export default function CanvasPlayer({
  totalFrames = 162,
  framePrefix = "/frames/ezgif-frame-",
  frameExtension = ".jpg",
  padLength = 3,
  fps = 30,
}: CanvasPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const currentFrameRef = useRef(0);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(padLength, "0");
      img.src = `${framePrefix}${frameNumber}${frameExtension}`;
      
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      
      loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, [totalFrames, framePrefix, frameExtension, padLength]);

  // Render loop
  useEffect(() => {
    if (images.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency
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
        // Calculate dimensions to cover the canvas perfectly (object-fit: cover equivalent)
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
      }
      
      // Advance to next frame
      currentFrameRef.current = (currentFrameRef.current + 1) % totalFrames;
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, fps, totalFrames]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Dark semi-transparent radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      {/* Optional loading state display */}
      {imagesLoaded < totalFrames && (
        <div className="absolute bottom-4 right-4 text-xs font-mono text-cyan-neon/50">
          Loading AI Cores: {Math.floor((imagesLoaded / totalFrames) * 100)}%
        </div>
      )}
    </div>
  );
}
