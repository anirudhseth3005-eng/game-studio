// Extracts every inline <script> from an HTML file and runs `node --check` on it.
// This is GOLDEN RULE #8 automated: never reply with a build that has a syntax error.
import { readFileSync, writeFileSync, mkdtempSync } from 'fs';
import { execFileSync } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';

const file = process.argv[2];
if (!file) { console.error('usage: node checkjs.mjs <file.html>'); process.exit(2); }

const html = readFileSync(file, 'utf8');
// <script> tags that do NOT have a src= attribute (those are CDN loads, nothing to check)
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const dir = mkdtempSync(join(tmpdir(), 'gg-check-'));

let m, i = 0, bad = 0;
while ((m = re.exec(html)) !== null) {
  const code = m[1];
  const lines = code.split('\n').length;
  // line number in the HTML where this script block starts
  const startLine = html.slice(0, m.index).split('\n').length;
  const tmp = join(dir, `block${i}.js`);
  writeFileSync(tmp, code);
  try {
    execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
    console.log(`  ✅ inline script #${i + 1} (HTML line ${startLine}, ${lines} lines) — syntax OK`);
  } catch (e) {
    bad++;
    const out = (e.stderr || '').toString().replace(new RegExp(tmp, 'g'), `${file} block#${i + 1}`);
    console.error(`  ❌ inline script #${i + 1} (starts at HTML line ${startLine}):`);
    console.error(out.split('\n').map(l => '     ' + l).join('\n'));
  }
  i++;
}

if (i === 0) { console.error('  ⚠️  no inline <script> found — is that the right file?'); process.exit(1); }
if (bad > 0) { console.error(`\n  ${bad} script block(s) FAILED. Fix before shipping.`); process.exit(1); }
console.log(`  🎉 all ${i} inline script block(s) pass node --check`);
