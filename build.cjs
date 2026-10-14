// Run after editing either source file; commit the generated dist files too.
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const [source, target] of [
  ['ha-toast-stack.js', 'ha_toast_stack.js'],
  ['ha-toast-stack.css', 'ha-toast-stack.css'],
  ['icon.png', 'icon.png'],
  ['icon@2x.png', 'icon@2x.png'],
]) {
  fs.copyFileSync(path.join(__dirname, source), path.join(output, target));
}
console.log('Built HACS distribution (JavaScript + CSS).');
