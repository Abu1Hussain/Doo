/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  velocity: number;
  length: number;
  maxLength: number;
  progress: number; // 0 to 1
  opacity: number;
}

interface ClickSparkProps {
  color: string; // hex or rgb color matching current status
}

export default function ClickSpark({ color }: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const activeSparks = sparksRef.current;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create 8 sparks equally spaced in radial directions
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        activeSparks.push({
          x,
          y,
          angle,
          velocity: 4 + Math.random() * 2, // smooth speed
          length: 4,
          maxLength: 18 + Math.random() * 10,
          progress: 0,
          opacity: 1,
        });
      }
    };

    window.addEventListener("mousedown", handleClick);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = activeSparks.length - 1; i >= 0; i--) {
        const s = activeSparks[i];
        
        // Update spark progress
        s.progress += 0.045; // speeds up over 400ms duration
        if (s.progress >= 1) {
          activeSparks.splice(i, 1);
          continue;
        }

        // Ease-out deceleration curve
        const easeOut = 1 - Math.pow(1 - s.progress, 2);
        const distance = s.maxLength * easeOut;

        // Spark coordinates
        const startX = s.x + Math.cos(s.angle) * (distance * 0.4);
        const startY = s.y + Math.sin(s.angle) * (distance * 0.4);
        const endX = s.x + Math.cos(s.angle) * distance;
        const endY = s.y + Math.sin(s.angle) * distance;

        // Fade out
        const opacity = 1 - s.progress;

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousedown", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      id="click-spark-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-[10000]"
    />
  );
}
