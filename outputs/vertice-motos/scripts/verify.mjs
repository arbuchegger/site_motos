import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
// Verifica os arquivos efetivamente exportados, incluindo links, âncoras e mensagens.
const root = path.resolve('dist/client');
const slugs = ['honda-cg-160', 'honda-bros-160', 'yamaha-fazer-250', 'yamaha-factor-150', 'honda-xre-300', 'honda-pcx'];
const names = ['Honda CG 160', 'Honda Bros 160', 'Yamaha Fazer 250', 'Yamaha Factor 150', 'Honda XRE 300', 'Honda PCX'];
const files = ['index.html', ...slugs.map(slug => `motos/${slug}/index.html`), '404.html'];
let localLinks = 0, whatsappLinks = 0;
for (const [index, file] of files.entries()) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /lang="pt-BR"/, file);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: deve ter um h1`);
  assert.doesNotMatch(html, /(?:Stripe|checkout|R\$|type="password")/i, file);
  const local = [...html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)].map(match => match[1]);
  for (const href of local) {
    const url = new URL(href.replaceAll('&amp;', '&'), 'https://example.invalid');
    const target = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    await access(path.join(root, target));
    if (url.hash) { const targetHtml = await readFile(path.join(root, target), 'utf8'); assert.ok(targetHtml.includes(`id="${url.hash.slice(1)}"`), `Âncora ausente: ${href}`); }
    localLinks++;
  }
  const wa = [...html.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)].map(match => new URL(match[1].replaceAll('&amp;', '&')));
  assert.ok(wa.length > 0, `WhatsApp ausente em ${file}`);
  for (const url of wa) { assert.match(url.pathname, /^\/\d+$/); assert.ok(url.searchParams.get('text')); whatsappLinks++; }
  if (index > 0 && index <= 6) {
    assert.ok(wa.some(url => url.searchParams.get('text').includes(names[index - 1])), `Mensagem incorreta em ${file}`);
    assert.ok(html.includes('-front.webp'), `Segunda foto ausente em ${file}`);
  }
}
console.log(`${files.length} páginas verificadas; ${localLinks} referências locais e ${whatsappLinks} links de WhatsApp válidos. Número fictício: nenhuma mensagem enviada.`);
