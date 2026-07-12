"use client";

// Simulates an AI image-editing call. Everything runs on a <canvas> in the
// visitor's browser: no network request, no API key, no external service.
// It picks a stylized visual effect based on keywords in the instruction
// and composites it at the marker point, so the point → instruction → edit
// loop is fully demonstrable offline.

export type Marker = { x: number; y: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function pickEffect(instruction: string) {
  const s = instruction.toLowerCase();
  if (/leather|patch/.test(s)) return "leather";
  if (/wood|grain/.test(s)) return "wood";
  if (/remove|delete|erase/.test(s)) return "remove";
  if (/logo|embroide|emblem|monogram/.test(s)) return "logo";
  if (/red|blue|green|yellow|purple|pink|orange|teal/.test(s)) return "tint";
  return "glow";
}

function extractColor(instruction: string): string {
  const map: Record<string, string> = {
    red: "#e5484d", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308",
    purple: "#a855f7", pink: "#ec4899", orange: "#f97316", teal: "#14b8a6",
  };
  const s = instruction.toLowerCase();
  for (const key in map) if (s.includes(key)) return map[key];
  return "#6e5bff";
}

// Simulated processing delay so the UI's loading state feels real.
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runFakeEdit(
  sourceDataUrl: string,
  marker: Marker,
  instruction: string
): Promise<string> {
  const img = await loadImage(sourceDataUrl);
  await wait(1400 + Math.random() * 900);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const cx = marker.x * canvas.width;
  const cy = marker.y * canvas.height;
  const radius = Math.max(canvas.width, canvas.height) * 0.11;
  const effect = pickEffect(instruction);

  ctx.save();

  switch (effect) {
    case "leather": {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "#8a5a34");
      grad.addColorStop(0.7, "#6b4423");
      grad.addColorStop(1, "rgba(107,68,35,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      // stitching
      ctx.strokeStyle = "rgba(245,235,220,0.6)";
      ctx.lineWidth = Math.max(2, radius * 0.03);
      ctx.setLineDash([radius * 0.08, radius * 0.06]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "wood": {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "#b6875a");
      grad.addColorStop(1, "rgba(150,105,60,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(90,60,30,0.35)";
      ctx.lineWidth = 2;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy + i * (radius / 4));
        ctx.quadraticCurveTo(cx, cy + i * (radius / 4) + 10, cx + radius, cy + i * (radius / 4));
        ctx.stroke();
      }
      break;
    }
    case "remove": {
      // Simulate removal with a blurred, sampled patch over the area.
      ctx.filter = "blur(18px)";
      ctx.drawImage(
        canvas,
        Math.max(0, cx - radius * 1.4), Math.max(0, cy - radius * 1.4),
        radius * 2.8, radius * 2.8,
        cx - radius, cy - radius,
        radius * 2, radius * 2
      );
      ctx.filter = "none";
      break;
    }
    case "logo": {
      ctx.fillStyle = "rgba(245,245,247,0.92)";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#6e5bff";
      ctx.lineWidth = radius * 0.05;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#171a20";
      ctx.font = `${Math.round(radius * 0.35)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("A", cx, cy + 2);
      break;
    }
    case "tint": {
      const color = extractColor(instruction);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    default: {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "rgba(110,91,255,0.55)");
      grad.addColorStop(1, "rgba(110,91,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();

  // "AI generated (demo)" badge in the corner so it's always clear this
  // isn't a real model output.
  const badgeText = "Simulated edit — demo mode";
  ctx.font = `${Math.round(canvas.width * 0.02)}px 'JetBrains Mono', monospace`;
  const metrics = ctx.measureText(badgeText);
  const pad = canvas.width * 0.012;
  const boxW = metrics.width + pad * 2;
  const boxH = canvas.width * 0.045;
  ctx.fillStyle = "rgba(11,12,15,0.75)";
  ctx.fillRect(canvas.width - boxW - pad, canvas.height - boxH - pad, boxW, boxH);
  ctx.fillStyle = "#8a7bff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    badgeText,
    canvas.width - boxW - pad + pad,
    canvas.height - boxH / 2 - pad
  );

  return canvas.toDataURL("image/png");
}
