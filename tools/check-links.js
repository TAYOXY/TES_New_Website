const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const idsByPage = {};
for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p), 'utf8');
  idsByPage[p] = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

const broken = [];
const missingFragments = [];

for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p), 'utf8');
  const refs = [...html.matchAll(/\b(href|src)="([^"]+)"/g)].map((m) => m[2]);
  for (let ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(ref)) {
      if (ref.startsWith('#') && ref.length > 1) {
        const id = decodeURIComponent(ref.slice(1));
        if (!idsByPage[p].has(id)) missingFragments.push(`${p} -> ${ref}`);
      }
      continue;
    }
    const [filePart, frag] = ref.split('#');
    if (!filePart) continue;
    const target = path.resolve(root, decodeURIComponent(filePart));
    if (!fs.existsSync(target)) {
      broken.push(`${p} -> ${ref}`);
      continue;
    }
    if (frag && filePart.endsWith('.html')) {
      const targetPage = path.basename(target);
      if (idsByPage[targetPage] && !idsByPage[targetPage].has(frag)) {
        missingFragments.push(`${p} -> ${ref}`);
      }
    }
  }
}

console.log('BROKEN FILES (' + broken.length + ')');
broken.slice(0, 30).forEach((b) => console.log('  ' + b));
console.log('\nMISSING FRAGMENT TARGETS (' + missingFragments.length + ')');
missingFragments.slice(0, 30).forEach((b) => console.log('  ' + b));
