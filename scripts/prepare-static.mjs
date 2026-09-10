import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
// Cria URLs portáveis /motos/modelo/ em qualquer hospedagem de arquivos.
// O framework exporta arquivos .html; as cópias index.html dispensam regras de rewrite.
const directory = path.resolve('dist/client/motos');
for (const name of await readdir(directory)) {
  if (!name.endsWith('.html')) continue;
  const destination = path.join(directory, name.slice(0, -5));
  await mkdir(destination, { recursive: true });
  await copyFile(path.join(directory, name), path.join(destination, 'index.html'));
}
console.log('Páginas estáticas prontas em dist/client.');
