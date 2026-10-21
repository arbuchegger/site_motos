import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
// Verifica os arquivos efetivamente exportados, incluindo links, âncoras e mensagens.
const root = path.resolve('dist/client');
const colors = ['light-white', 'triple-black', 'racing-blue-trophy', 'aurelius-green', 'racing-red', 'light-white-rodas-pretas'];
const slugs = colors.map(color => `bmw-r1300gs-${color}`);
const names = ['Light White', 'Triple Black', 'Racing Blue Trophy', 'Aurelius Green', 'Racing Red', 'Light White · rodas pretas'].map(color => `BMW R 1300 GS — ${color}`);
const files = ['index.html', ...slugs.map(slug => `motos/${slug}/index.html`), '404.html'];
let localLinks = 0, whatsappLinks = 0;
for (const [index, file] of files.entries()) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /lang="pt-BR"/, file);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: deve ter um h1`);
  assert.doesNotMatch(html, /(?:Stripe|checkout|type="password"|Honda|Yamaha|Vértice)/i, file);
  assert.doesNotMatch(html, /mensal|mensalidade|\/mês/i, `Referência mensal residual em ${file}`);
  assert.ok(html.includes('Leandro'), `Marca ausente em ${file}`);
  if (index === 0) {
    for (const id of ['como-funciona', 'duvidas', 'contato']) assert.ok(html.includes(`id="${id}"`), `Seção ausente: ${id}`);
    assert.equal((html.match(/<details\b/g) || []).length, 7, 'Devem existir sete dúvidas expansíveis');
    assert.equal((html.match(/<summary\b/g) || []).length, 7, 'Cada dúvida deve ter seu controle nativo acessível');
    assert.equal((html.match(/class="passo"/g) || []).length, 3, 'Devem existir três cards de passos');
    assert.ok(html.includes('contato-carta'), 'Cartão de contato ausente');
  }
  if (index <= slugs.length) {
    assert.doesNotMatch(html, /diárias? ilustrativas?|vitrine demonstrativa/i, `Texto demonstrativo de preço em ${file}`);
    assert.match(html, /R\$(?:&nbsp;|\s|<!-- -->)*(?:950|980|990|1[.,](?:000|050|100))/, `Diária ausente em ${file}`);
  }
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
  if (index > 0 && index <= slugs.length) {
    assert.ok(wa.some(url => url.searchParams.get('text').includes(names[index - 1])), `Mensagem incorreta em ${file}`);
    assert.ok(html.includes('20,8 km/l') && html.includes('WMTC'), `Consumo ausente em ${file}`);
    assert.ok(html.includes(`${slugs[index - 1]}-traseira.webp`), `Segunda foto da cor correta ausente em ${file}`);
  }
}
console.log(`${files.length} páginas verificadas; ${localLinks} referências locais e ${whatsappLinks} links de WhatsApp válidos. Nenhuma mensagem enviada.`);
