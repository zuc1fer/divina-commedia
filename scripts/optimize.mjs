// Downscale + recompress the public-domain plates for the web.
// Originals are reproducible from public/assets/manifest.json.
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

sharp.cache(false);
sharp.simd(true);

const ROOT = path.resolve('public/assets');
const DIRS = ['heaven', 'hell', 'fall'];

for (const d of DIRS) {
  const dir = path.join(ROOT, d);
  for (const f of await readdir(dir)) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const p = path.join(dir, f);
    const tmp = p + '.opt.jpg';
    const before = (await stat(p)).size;
    await sharp(p)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tmp);
    await unlink(p);
    await rename(tmp, p);
    const after = (await stat(p)).size;
    console.log(`${d}/${f}  ${(before / 1e6).toFixed(2)}MB → ${(after / 1e3).toFixed(0)}KB`);
  }
}
console.log('done');
