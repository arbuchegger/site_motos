import { readdir, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
// Cria URLs portáveis /motos/modelo/ em qualquer hospedagem de arquivos.
// O framework exporta arquivos .html; as cópias index.html dispensam regras de rewrite.
const directory = path.resolve('dist/client/motos');
const origin = 'https://paraibamotorfast.com.br';
const sitemapPaths = ['/'];
for (const name of await readdir(directory)) {
  if (!name.endsWith('.html')) continue;
  const slug = name.slice(0, -5);
  const destination = path.join(directory, slug);
  await mkdir(destination, { recursive: true });
  await copyFile(path.join(directory, name), path.join(destination, 'index.html'));
  sitemapPaths.push(`/motos/${encodeURIComponent(slug)}`);
}
const reservation = path.resolve('dist/client/reserva');
await mkdir(reservation, { recursive: true });
await copyFile(path.resolve('dist/client/reserva.html'), path.join(reservation, 'index.html'));
const entries = sitemapPaths.map(route => `  <url><loc>${origin}${route}</loc></url>`).join('\n');
await writeFile('dist/client/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
console.log('Páginas estáticas prontas em dist/client.');
