const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tokensPath = path.join(root, 'tokens', 'design-tokens.json');
const outDir = path.join(root, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function toCssVars(tokens) {
  const lines = [];
  function walk(obj, prefix = '') {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      const name = prefix ? `${prefix}-${key}` : key;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        walk(val, name);
      } else {
        lines.push(`  --${name}: ${val};`);
      }
    });
  }
  walk(tokens);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

function toTsExports(tokens) {
  return `// Generated tokens - do not edit by hand\nexport const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n`;
}

function main() {
  if (!fs.existsSync(tokensPath)) {
    console.error('design-tokens.json not found:', tokensPath);
    process.exit(1);
  }
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  ensureDir(outDir);
  const css = toCssVars(tokens);
  fs.writeFileSync(path.join(outDir, 'tokens.css'), css, 'utf8');
  const ts = toTsExports(tokens);
  fs.writeFileSync(path.join(outDir, 'tokens.ts'), ts, 'utf8');
  console.log('Tokens built to', outDir);
}

main();

