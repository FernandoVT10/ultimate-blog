import { useRef, useEffect } from "react";

import styles from "./MainScreen.module.scss";

type Drop = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
}

class Rain {
  private drops: Set<Drop>;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.drops = new Set;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  createDrop() {
    this.drops.add({
      x: Math.floor(Math.random() * this.canvasWidth),
      y: 0,
      speedX: Math.random() * 5,
      speedY: 5 + Math.random() * 10,
      size: Math.random() * 5,
      color: `hsl(217, 92%, ${80 + Math.random() * 20}%)`,
    });
  }

  update() {
    this.drops.forEach(drop => {
      if(drop.x < 0 || drop.y >= this.canvasHeight) {
        this.drops.delete(drop);
        return;
      }

      drop.x -= drop.speedX;
      drop.y += drop.speedY;
    });

    for(let i = 0; i < 3; i++) {
      this.createDrop();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drops.forEach(drop => {
      ctx.fillStyle = drop.color;
      ctx.fillRect(drop.x, drop.y, drop.size, drop.size);
    });
  }
}


export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // don't run the animation when the window is too small
    if(window.innerWidth < 780) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let animationId: number;

    const rain = new Rain(canvas.width, canvas.height);

    const loop = () => {
      ctx.clearRect(0, 0, 1920, 1080);

      rain.update();
      rain.draw(ctx);

      animationId = requestAnimationFrame(loop);
    };

    loop();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas className={styles.canvas} ref={canvasRef} width={1920} height={1080}></canvas>
  );
}
