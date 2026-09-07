/**
 * Resize public/logo.png into favicon, PWA, Apple touch, and Open Graph sizes.
 * Does not redraw the mark — only scales and pads on navy.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const NAVY = { r: 11, g: 18, b: 32, alpha: 1 };
const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "public/logo.png");

async function square(size, padding = 0) {
  const inner = size - padding * 2;
  const resized = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: NAVY })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: NAVY },
  })
    .composite([{ input: resized, left: padding, top: padding }])
    .png();
}

async function write(rel, image) {
  const dest = path.join(root, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await image.toFile(dest);
  console.log("wrote", rel);
}

const ogText = Buffer.from(`
<svg width="680" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="268" fill="#f4efe4" font-size="54" font-family="Georgia, serif">First Down Scotland</text>
  <text x="0" y="318" fill="#c9c2b3" font-size="26" font-family="ui-sans-serif, system-ui, sans-serif">Learn the NFL, then see what’s on</text>
  <rect x="0" y="348" width="120" height="3" fill="#e8b84a"/>
</svg>
`);

const ogLogo = await sharp(source)
  .resize(360, 360, { fit: "contain", background: NAVY })
  .png()
  .toBuffer();

await mkdir(path.join(root, "public/icons"), { recursive: true });
await write("public/favicon.png", await square(48));
{
  const png = await (await square(32)).toBuffer();
  const ico = Buffer.alloc(22 + png.length);
  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(1, 4);
  ico.writeUInt8(32, 6);
  ico.writeUInt8(32, 7);
  ico.writeUInt16LE(1, 10);
  ico.writeUInt16LE(32, 12);
  ico.writeUInt32LE(png.length, 14);
  ico.writeUInt32LE(22, 18);
  png.copy(ico, 22);
  await writeFile(path.join(root, "public/favicon.ico"), ico);
  console.log("wrote public/favicon.ico");
}
await write("src/app/icon.png", await square(48));
await write("src/app/apple-icon.png", await square(180));
await write("public/icons/apple-touch-icon.png", await square(180));
await write("public/icons/icon-192.png", await square(192));
await write("public/icons/icon-512.png", await square(512));
await write("public/icons/icon-maskable-512.png", await square(512, 56));

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: NAVY },
})
  .composite([
    { input: ogLogo, left: 80, top: 135 },
    { input: ogText, left: 480, top: 0 },
  ])
  .png()
  .toFile(path.join(root, "public/og.png"));
console.log("wrote public/og.png");
