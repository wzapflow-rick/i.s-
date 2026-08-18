import sharp from "sharp";
import path from "node:path";

// [arquivo, chroma] — "green" ou "blue"
const JOBS = [
  ["tub-chocolate", "green"],
  ["tub-morango", "green"],
  ["tub-pistache", "blue"],
  ["tub-mais-sabores", "green"],
];

const RAW_DIR = path.resolve("public/products/_raw");
const OUT_DIR = path.resolve("public/products");

for (const [name, chroma] of JOBS) {
  const src = path.join(RAW_DIR, `${name}.png`);
  const out = path.join(OUT_DIR, `${name}.png`);

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const px = Buffer.from(data);

  for (let i = 0; i < px.length; i += channels) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];

    // "Chromaness": quão dominante é a cor de fundo neste pixel.
    let key;
    if (chroma === "green") {
      key = g - Math.max(r, b); // alto = muito verde
    } else {
      key = b - Math.max(r, g); // alto = muito azul
    }

    // Threshold com feather: <=10 opaco, >=60 transparente, linear no meio.
    const LO = 10;
    const HI = 60;
    let alpha;
    if (key <= LO) alpha = 255;
    else if (key >= HI) alpha = 0;
    else alpha = Math.round(255 * (1 - (key - LO) / (HI - LO)));

    px[i + 3] = alpha;

    // Despill: onde houve vazamento da cor de fundo, remove o excesso.
    if (alpha > 0 && key > 0) {
      if (chroma === "green") {
        const cap = Math.max(r, b);
        if (g > cap) px[i + 1] = cap;
      } else {
        const cap = Math.max(r, g);
        if (b > cap) px[i + 2] = cap;
      }
    }
  }

  await sharp(px, { raw: { width, height, channels } })
    .png()
    .toFile(out);

  console.log(`[chroma] ${name} (${chroma}) -> ${out}`);
}
