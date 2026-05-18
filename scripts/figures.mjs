// Turn public-domain engraving plates into transparent, recoloured figure
// cutouts: the light paper becomes transparent, the engraved ink becomes a
// glowing gold (angels) or cold steel (demons) figure. Edges are feathered
// so no rectangular plate border survives.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

sharp.cache(false);

const A = path.resolve('public/assets');
const OUT = path.join(A, 'figures');
await mkdir(OUT, { recursive: true });

const GOLD = [247, 211, 132];
const COLD = [150, 214, 230];
const STEEL = [128, 146, 170];
const KNIGHT = [122, 132, 150];  // a dark steel etching, readable in any realm

// source plate, output name, palette
const JOBS = [
  ['extra/para-7.jpg', 'ang-1.png', GOLD],   // the celestial Rose / Madonna
  ['extra/para-4.jpg', 'ang-2.png', GOLD],   // the Cross of light
  ['extra/para-3.jpg', 'ang-3.png', GOLD],   // the golden ladder
  ['extra/para-2.jpg', 'ang-4.png', GOLD],   // the Eagle of souls
  ['fall/fall-1.jpg', 'ang-5.png', GOLD],    // the falling host
  ['extra/para-1.jpg', 'ang-6.png', GOLD],   // Beatrice & the Empyrean
  ['extra/purg-2.jpg', 'ang-7.png', GOLD],   // the angel at the gate
  ['hell/circle-3-gluttony.jpg', 'dem-1.png', COLD],
  ['hell/circle-6-heresy.jpg', 'dem-2.png', COLD],
  ['hell/circle-7-violence.jpg', 'dem-3.png', COLD],
  ['hell/circle-8-fraud.jpg', 'dem-4.png', COLD],
  ['hell/circle-9-treachery.jpg', 'dem-5.png', COLD],
  ['hell/circle-2-lust.jpg', 'dem-6.png', COLD],
  // the faller: a lone figure cut out of the cloud
  ['extra/faller.jpg', 'knight.png', null, 'silhouette', [0.27, 0.26, 0.75, 0.64]],
  ['extra/knight-durer.jpg', 'knight-alt.png', KNIGHT, 'knight', [0.20, 0.05, 0.88, 0.97]],
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

for (const [src, out, tint, mode, crop] of JOBS) {
  const knight = mode === 'knight';
  const silh = mode === 'silhouette';
  let pipeline;
  try {
    let img = sharp(path.join(A, src)).rotate();
    if (crop) {
      const m = await sharp(path.join(A, src)).metadata();
      const W = m.width, H = m.height;
      img = img.extract({
        left: Math.round(crop[0] * W), top: Math.round(crop[1] * H),
        width: Math.round((crop[2] - crop[0]) * W),
        height: Math.round((crop[3] - crop[1]) * H),
      });
    }
    pipeline = img
      .resize({ width: 1080, height: 1080, fit: 'inside', withoutEnlargement: true })
      .ensureAlpha();
  } catch (e) { console.warn('skip', src, e.message); continue; }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const o = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    const ny = (y / h) * 2 - 1;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const R = data[i], G = data[i + 1], B = data[i + 2];
      const lum = 0.299 * R + 0.587 * G + 0.114 * B;

      // ink: bright paper -> 0, dark engraving -> 1
      let ink = clamp((205 - lum) / (205 - 62), 0, 1);
      ink = Math.pow(ink, 0.86);

      // feather: kill the plate border / make a soft floating figure
      const nx = (x / w) * 2 - 1;
      const rad = Math.sqrt((nx / 0.97) ** 2 + (ny / 0.99) ** 2);
      const edge = 1 - smooth(0.80, 1.06, rad);
      const margin =
        smooth(0.02, 0.07, x / w) * smooth(0.02, 0.07, 1 - x / w) *
        smooth(0.02, 0.07, y / h) * smooth(0.06, 0.16, 1 - y / h); // crop the plate caption

      if (silh) {
        // a lone dark faller pulled out of the bright cloud
        let s = clamp((96 - lum) / (96 - 20), 0, 1);   // dark = figure
        s = Math.pow(s, 0.85);
        // soft figure-shaped feather so cloud haze never leaves a halo
        const fEdge = 1 - smooth(0.92, 1.22, Math.sqrt((nx / 0.96) ** 2 + (ny / 0.99) ** 2));
        const fMar =
          smooth(0.0, 0.05, x / w) * smooth(0.0, 0.05, 1 - x / w) *
          smooth(0.0, 0.05, y / h) * smooth(0.0, 0.05, 1 - y / h);
        const a = clamp(s * fEdge * fMar, 0, 1);
        // near-black body, a hair of cool steel on the soft edges
        const lo = [10, 12, 17], hi = [40, 47, 60];
        o[i]     = clamp(hi[0] + (lo[0] - hi[0]) * s, 0, 255);
        o[i + 1] = clamp(hi[1] + (lo[1] - hi[1]) * s, 0, 255);
        o[i + 2] = clamp(hi[2] + (lo[2] - hi[2]) * s, 0, 255);
        o[i + 3] = Math.round(a * 255);
      } else if (knight) {
        // a solid dark-steel body, modelled darker where the ink is dense
        const aRaw = clamp(ink * 1.75, 0, 1);
        const a = clamp(Math.pow(aRaw, 0.80) * edge * margin, 0, 1);
        const lo = [34, 41, 58], hi = [108, 120, 146]; // shadow / lit steel
        o[i]     = clamp(hi[0] + (lo[0] - hi[0]) * ink, 0, 255);
        o[i + 1] = clamp(hi[1] + (lo[1] - hi[1]) * ink, 0, 255);
        o[i + 2] = clamp(hi[2] + (lo[2] - hi[2]) * ink, 0, 255);
        o[i + 3] = Math.round(a * 255);
      } else {
        const a = clamp(ink * edge * margin, 0, 1);
        const shade = 0.40 + 0.60 * ink;
        const core = Math.pow(ink, 4) * 0.35; // hot inner light
        o[i]     = clamp(tint[0] * shade + 255 * core, 0, 255);
        o[i + 1] = clamp(tint[1] * shade + 255 * core, 0, 255);
        o[i + 2] = clamp(tint[2] * shade + 255 * core, 0, 255);
        o[i + 3] = Math.round(a * 255);
      }
    }
  }

  await sharp(o, { raw: { width: w, height: h, channels: 4 } })
    .png({ palette: true, colors: 200, compressionLevel: 9, effort: 9 })
    .toFile(path.join(OUT, out));
  console.log('figure', out, `${w}x${h}`);
}
console.log('figures done');
