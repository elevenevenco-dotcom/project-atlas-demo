"use client";

// Generates a few sample "product photos" entirely on the canvas, so the
// demo has something to click on immediately — no network fetch to a stock
// photo host required.

function drawBase(ctx: CanvasRenderingContext2D, w: number, h: number, colors: [string, string]) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function jacketSample(): string {
  const w = 800, h = 800;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  drawBase(ctx, w, h, ["#2b2f38", "#171a20"]);

  // Jacket silhouette
  ctx.fillStyle = "#3a3f4b";
  ctx.beginPath();
  ctx.moveTo(w * 0.32, h * 0.22);
  ctx.lineTo(w * 0.68, h * 0.22);
  ctx.lineTo(w * 0.8, h * 0.34);
  ctx.lineTo(w * 0.72, h * 0.4);
  ctx.lineTo(w * 0.72, h * 0.86);
  ctx.lineTo(w * 0.28, h * 0.86);
  ctx.lineTo(w * 0.28, h * 0.4);
  ctx.lineTo(w * 0.2, h * 0.34);
  ctx.closePath();
  ctx.fill();

  // Zipper line
  ctx.strokeStyle = "#9a9ba6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.24);
  ctx.lineTo(w * 0.5, h * 0.84);
  ctx.stroke();

  // Collar
  ctx.fillStyle = "#23262e";
  ctx.beginPath();
  ctx.moveTo(w * 0.38, h * 0.22);
  ctx.lineTo(w * 0.5, h * 0.3);
  ctx.lineTo(w * 0.62, h * 0.22);
  ctx.lineTo(w * 0.62, h * 0.18);
  ctx.lineTo(w * 0.38, h * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(245,245,247,0.35)";
  ctx.font = "24px sans-serif";
  ctx.fillText("Denim jacket — sample photo", 24, h - 24);

  return canvas.toDataURL("image/png");
}

function sneakerSample(): string {
  const w = 800, h = 800;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  drawBase(ctx, w, h, ["#e7e2d8", "#c9c2b2"]);

  // Sole
  ctx.fillStyle = "#2c2a28";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.72, w * 0.34, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#f5f5f7";
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.68);
  ctx.quadraticCurveTo(w * 0.18, h * 0.42, w * 0.42, h * 0.36);
  ctx.quadraticCurveTo(w * 0.68, h * 0.3, w * 0.82, h * 0.5);
  ctx.quadraticCurveTo(w * 0.86, h * 0.6, w * 0.8, h * 0.68);
  ctx.closePath();
  ctx.fill();

  // Laces
  ctx.strokeStyle = "#33353f";
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(w * (0.44 + i * 0.06), h * (0.42 + i * 0.02));
    ctx.lineTo(w * (0.5 + i * 0.06), h * (0.52 + i * 0.02));
    ctx.stroke();
  }

  // Swoosh-style accent
  ctx.strokeStyle = "#6e5bff";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.62);
  ctx.quadraticCurveTo(w * 0.55, h * 0.68, w * 0.78, h * 0.55);
  ctx.stroke();

  ctx.fillStyle = "rgba(20,20,24,0.4)";
  ctx.font = "24px sans-serif";
  ctx.fillText("Running shoe — sample photo", 24, h - 24);

  return canvas.toDataURL("image/png");
}

function posterSample(): string {
  const w = 800, h = 800;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  drawBase(ctx, w, h, ["#1c1f26", "#0b0c0f"]);

  // Frame
  ctx.strokeStyle = "#4a4d5a";
  ctx.lineWidth = 14;
  ctx.strokeRect(w * 0.12, h * 0.1, w * 0.76, h * 0.72);

  // "Poster" surface
  ctx.fillStyle = "#e4e4e9";
  ctx.fillRect(w * 0.16, h * 0.14, w * 0.68, h * 0.64);

  // Abstract circle composition inside poster
  const circles: [number, number, number, string][] = [
    [0.35, 0.35, 60, "#ff6b5b"],
    [0.6, 0.5, 90, "#6e5bff"],
    [0.5, 0.65, 40, "#171a20"],
  ];
  circles.forEach(([cx, cy, r, color]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w * cx, h * cy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(245,245,247,0.35)";
  ctx.font = "24px sans-serif";
  ctx.fillText("Framed poster mockup — sample photo", 24, h - 24);

  return canvas.toDataURL("image/png");
}

export type DemoSample = { name: string; dataUrl: string };

export function generateSampleImages(): DemoSample[] {
  return [
    { name: "denim-jacket-sample.png", dataUrl: jacketSample() },
    { name: "running-shoe-sample.png", dataUrl: sneakerSample() },
    { name: "poster-mockup-sample.png", dataUrl: posterSample() },
  ];
}
