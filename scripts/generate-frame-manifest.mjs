import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const framesRoot = path.join(root, 'public', 'Frames');
const outDir = path.join(root, 'src', 'generated');
const outFile = path.join(outDir, 'frameManifest.js');
const imagePattern = /\.(avif|webp|png|jpe?g)$/i;

function naturalFrameSort(a, b) {
  const ax = a.match(/\d+/g)?.map(Number) ?? [0];
  const bx = b.match(/\d+/g)?.map(Number) ?? [0];
  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (ax[i] ?? 0) - (bx[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return a.localeCompare(b);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return imagePattern.test(entry.name) ? [full] : [];
  });
}

if (!fs.existsSync(framesRoot)) {
  throw new Error(`Frame folder not found: ${framesRoot}`);
}

const frames = walk(framesRoot)
  .sort((a, b) => naturalFrameSort(path.basename(a), path.basename(b)))
  .map((file) => `/${path.relative(path.join(root, 'public'), file).split(path.sep).join('/')}`);

if (!frames.length) {
  throw new Error(`No frame images found in ${framesRoot}`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outFile,
  `export const frameUrls = ${JSON.stringify(frames, null, 2)};\nexport const frameCount = ${frames.length};\n`,
);

console.log(`Generated ${frames.length} frame URLs at ${path.relative(root, outFile)}`);
