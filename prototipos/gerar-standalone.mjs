/**
 * Gera o arquivo standalone a partir de src/vertice-hi-fi.html.
 *
 * Node puro, sem dependência: `node prototipos/gerar-standalone.mjs`.
 *
 * O que ele faz é só substituir marcadores por data: URI — a fonte e
 * cada imagem entram em base64 dentro do próprio HTML. O resultado é
 * um arquivo que abre por clique duplo, sem rede e sem servidor, e que
 * pode ser mandado por e-mail para quem vai avaliar o design.
 *
 * Por que gerar em vez de escrever o arquivo final à mão: 1,5 MB de
 * base64 no meio do código torna o fonte impossível de ler e de
 * revisar em diff. O fonte fica editável; o build fica portátil.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..');

const IMAGENS = [
  'hero',
  'cg-160', 'cg-160-front',
  'bros-160', 'bros-160-front',
  'fazer-250', 'fazer-250-front',
  'factor-150', 'factor-150-front',
  'xre-300', 'xre-300-front',
  'pcx', 'pcx-front',
];

const comoDataUri = async (arquivo, tipo) =>
  `data:${tipo};base64,${(await readFile(arquivo)).toString('base64')}`;

let html = await readFile(path.join(aqui, 'src', 'vertice-hi-fi.html'), 'utf8');

// Fonte: entre aspas, porque o data: URI tem ; e , que confundem url() sem aspas.
const fonte = await comoDataUri(path.join(aqui, 'fontes', 'figtree-latin.woff2'), 'font/woff2');
html = html.replace('__FONTE__', `"${fonte}"`);

for (const nome of IMAGENS) {
  const marcador = `__IMG:${nome}__`;
  if (!html.includes(marcador)) throw new Error(`Marcador ausente no fonte: ${marcador}`);
  html = html.replace(marcador, await comoDataUri(path.join(raiz, 'public', 'images', `${nome}.webp`), 'image/webp'));
}

const restantes = html.match(/__[A-Z][A-Z:_a-z0-9-]*__/g);
if (restantes) throw new Error(`Marcadores não substituídos: ${[...new Set(restantes)].join(', ')}`);

const saida = path.join(aqui, 'vertice-hi-fi-standalone.html');
await writeFile(saida, html, 'utf8');

const { size } = await stat(saida);
console.log(`${path.relative(raiz, saida)} — ${(size / 1048576).toFixed(2)} MB, ${IMAGENS.length} imagens e 1 fonte embutidas.`);
