import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
// Verifica os arquivos efetivamente exportados, incluindo links, âncoras e mensagens.
const root = path.resolve('dist/client');
const colors = ['light-white', 'triple-black', 'racing-blue-trophy', 'aurelius-green', 'racing-red', 'light-white-rodas-pretas'];
const slugs = colors.map(color => `bmw-r1300gs-${color}`);
const names = ['Light White', 'Triple Black', 'Racing Blue Trophy', 'Aurelius Green', 'Racing Red', 'Light White · rodas pretas'].map(color => `BMW R 1300 GS — ${color}`);
const files = ['index.html', ...slugs.map(slug => `motos/${slug}/index.html`), '404.html', 'reserva/index.html'];
const canonicalUrls = ['/', ...slugs.map(slug => `/motos/${slug}`)].map(route => `https://paraibamotorfast.com.br${route}`);
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.deepEqual(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort(),
  [...canonicalUrls].sort(),
  'O sitemap deve listar a home e as seis URLs canônicas',
);
let localLinks = 0, whatsappLinks = 0;
for (const [index, file] of files.entries()) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.match(html, /lang="pt-BR"/, file);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: deve ter um h1`);
  assert.doesNotMatch(html, /(?:Stripe|type="password"|Honda|Yamaha|Vértice)/i, file);
  assert.doesNotMatch(html, /mensal|mensalidade|\/mês/i, `Referência mensal residual em ${file}`);
  assert.ok(html.includes('Paraíba'), `Marca ausente em ${file}`);
  if (index === 0) {
    for (const id of ['como-funciona', 'duvidas', 'contato']) assert.ok(html.includes(`id="${id}"`), `Seção ausente: ${id}`);
    assert.equal((html.match(/<details\b/g) || []).length, 6, 'Devem existir seis dúvidas essenciais');
    assert.equal((html.match(/<summary\b/g) || []).length, 6, 'Cada dúvida deve ter seu controle nativo acessível');
    const faq = html.slice(html.indexOf('id="duvidas"'), html.indexOf('id="contato"'));
    assert.match(faq, /Posso alugar equipamentos/, 'Equipamentos devem constar nas dúvidas');
    for (const term of ['25 anos', '2 anos', '350 km', '0,70', '1,30', '80,00', '140,00', 'caução', 'viagens internacionais']) assert.ok(faq.includes(term), `Condição ausente nas dúvidas: ${term}`);
    assert.equal((html.match(/class="passo"/g) || []).length, 3, 'Devem existir três cards de passos');
    assert.ok(html.includes('contato-carta'), 'Cartão de contato ausente');
    const catalogPhotos = [...html.matchAll(/<img\b[^>]*class="showcase-photo"[^>]*>/g)].map(match => match[0]);
    assert.equal(catalogPhotos.length, 6, 'Catálogo deve preparar as seis fotos');
    for (const photo of catalogPhotos) assert.match(photo, /loading="eager"/, 'Foto do catálogo não pode aguardar seleção/rolagem para carregar');
    for (const slug of slugs) {
      const source = `/images/bmw-r1300gs/showcase-contact/${slug.replace(/^bmw-r1300gs-/, '')}.webp`;
      assert.ok([...html.matchAll(/<link\b[^>]*>/g)].some(([tag]) => tag.includes('rel="preload"') && tag.includes('as="image"') && tag.includes(`href="${source}"`)), `Pré-carregamento ausente: ${slug}`);
    }
  }
  if (index <= slugs.length) {
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    assert.equal(canonical && new URL(canonical).href, canonicalUrls[index], `URL canônica incorreta em ${file}`);
    assert.doesNotMatch(html, /diárias? ilustrativas?|vitrine demonstrativa/i, `Texto demonstrativo de preço em ${file}`);
    assert.match(html, /R\$(?:&nbsp;|\s|<!-- -->)*619/, `Diária de semana ausente em ${file}`);
    assert.match(html, /R\$(?:&nbsp;|\s|<!-- -->)*719/, `Diária de fim de semana ausente em ${file}`);
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
    assert.ok(html.includes('detail-page detail-desktop-layout'), `Layout desktop padronizado ausente em ${file}`);
    assert.ok(html.includes('detail-mobile-layout'), `Layout mobile padronizado ausente em ${file}`);
    assert.ok(html.includes('class="detail-mobile-summary"'), `Subtítulo abaixo da diária ausente em ${file}`);
    const related = html.match(/<section class="related-motorcycles"[\s\S]*?<\/section>/)?.[0];
    assert.ok(related, `Carrossel de outras motos ausente em ${file}`);
    assert.ok(!related.includes(`href="/motos/${slugs[index - 1]}"`), `Carrossel não deve repetir a própria moto em ${file}`);
    for (const other of slugs.filter(slug => slug !== slugs[index - 1])) assert.ok(related.includes(`href="/motos/${other}"`), `Cor alternativa ausente: ${other} em ${file}`);
    const consultationLinks = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match=>match[0]).filter(link=>link.includes('Consultar pelo WhatsApp'));
    assert.equal(consultationLinks.length,2, `Devem existir dois acessos à reserva em ${file}`);
    for (const link of consultationLinks) {
      assert.ok(link.includes(`href="/reserva/?moto=${slugs[index - 1]}"`), `A consulta deve passar pelo checkout da moto correta em ${file}`);
      assert.ok(!link.includes('target="_blank"'), `O checkout deve abrir na mesma aba em ${file}`);
    }
    assert.ok(html.includes('20,8 km/l') && html.includes('WMTC'), `Consumo ausente em ${file}`);
    const color = colors[index - 1];
    assert.ok(html.includes(`data-spin-color="${slugs[index - 1]}"`), `Giro da cor correta ausente em ${file}`);
    assert.ok(html.includes('data-spin-ready="false"'), `Giro deve iniciar bloqueado até preparar as imagens em ${file}`);
    assert.ok(html.includes('role="progressbar"') && html.includes('aria-valuenow="0"'), `Indicador inicial de carregamento ausente em ${file}`);
    assert.ok(html.includes(`/360/${color}/0.webp`), `Vista inicial ausente em ${file}`);
    assert.doesNotMatch(html, /gallery-thumbs/, `Miniaturas não devem aparecer em ${file}`);
    for (let frame = 0; frame < 8; frame++) await access(path.join(root, `images/bmw-r1300gs/360/${color}/${frame}.webp`));
  }
}
console.log(`${files.length} páginas verificadas; ${localLinks} referências locais e ${whatsappLinks} links de WhatsApp válidos. Nenhuma mensagem enviada.`);
