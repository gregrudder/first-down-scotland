export type BuildCardModel = {
  archetypeLabel: string;
  overall: number;
  verdict: string;
  spent: number;
  cap: number;
  lines: readonly { trait: string; name: string; rating: number }[];
  pageUrl: string;
};

const NAVY = "#0b1220";
const CREAM = "#f4efe4";
const CREAM_DIM = "#c9c2b3";
const GOLD = "#e8b84a";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function paintBuildCard(ctx: CanvasRenderingContext2D, model: BuildCardModel) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const pad = 72;

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 0, width, 8);

  ctx.textBaseline = "top";
  ctx.fillStyle = GOLD;
  ctx.font = "600 26px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("FIRST DOWN SCOTLAND", pad, 48);

  ctx.fillStyle = CREAM;
  ctx.font = "700 56px Georgia, 'Times New Roman', serif";
  ctx.fillText("Build a Quarterback", pad, 92);

  ctx.fillStyle = GOLD;
  ctx.font = "700 46px Georgia, 'Times New Roman', serif";
  ctx.fillText(model.archetypeLabel, pad, 164);

  ctx.fillStyle = CREAM;
  ctx.font = "700 84px Georgia, 'Times New Roman', serif";
  const overall = String(model.overall);
  ctx.fillText(overall, pad, 224);
  const overallWidth = ctx.measureText(overall).width;
  ctx.fillStyle = CREAM_DIM;
  ctx.font = "600 24px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("OVERALL", pad + overallWidth + 20, 248);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 332);
  ctx.lineTo(width - pad, 332);
  ctx.stroke();

  let y = 352;
  model.lines.forEach((line, index) => {
    ctx.fillStyle = GOLD;
    ctx.font = "600 20px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(line.trait.toUpperCase(), pad, y);
    ctx.fillStyle = CREAM;
    ctx.font = "700 32px Georgia, 'Times New Roman', serif";
    ctx.fillText(line.name, pad, y + 26);
    ctx.textAlign = "right";
    ctx.font = "700 36px Georgia, 'Times New Roman', serif";
    ctx.fillText(String(line.rating), width - pad, y + 24);
    ctx.textAlign = "left";
    if (index < model.lines.length - 1) {
      ctx.strokeStyle = "rgba(244, 239, 228, 0.12)";
      ctx.beginPath();
      ctx.moveTo(pad, y + 70);
      ctx.lineTo(width - pad, y + 70);
      ctx.stroke();
    }
    y += 78;
  });

  ctx.strokeStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(width - pad, y);
  ctx.stroke();

  ctx.fillStyle = CREAM;
  ctx.font = "500 26px ui-sans-serif, system-ui, sans-serif";
  const verdictLines = wrapLines(ctx, model.verdict, width - pad * 2).slice(0, 4);
  let verdictY = y + 24;
  for (const verdictLine of verdictLines) {
    ctx.fillText(verdictLine, pad, verdictY);
    verdictY += 34;
  }

  ctx.fillStyle = CREAM_DIM;
  ctx.font = "600 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(`Cap spent ${model.spent} of ${model.cap}`, pad, height - 108);
  ctx.fillStyle = GOLD;
  ctx.fillText(model.pageUrl.replace(/^https?:\/\//, ""), pad, height - 70);
}

export function buildCardBlob(model: BuildCardModel): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Could not draw the card"));
  paintBuildCard(ctx, model);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not export the card"));
    }, "image/png");
  });
}
