// Servidor apenas de PRÉVIA LOCAL. Nenhum servidor é necessário na hospedagem.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist/client');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.rsc': 'text/x-component', '.txt': 'text/plain; charset=utf-8' };
try { await stat(path.join(root, 'index.html')); } catch { console.error('Execute npm run build antes de iniciar a prévia.'); process.exit(1); }
createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); return response.end(); }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let filename = path.resolve(root, '.' + pathname);
    if (filename !== root && !filename.startsWith(root + path.sep)) { response.writeHead(403); return response.end(); }
    let status = 200;
    try {
      const info = await stat(filename);
      if (info.isDirectory()) filename = path.join(filename, 'index.html');
      await stat(filename);
    } catch {
      try { await stat(filename + '.html'); filename += '.html'; }
      catch { status = 404; filename = path.join(root, '404.html'); }
    }
    const content = await readFile(filename);
    response.writeHead(status, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Content-Length': content.length, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(400); response.end('Requisição inválida.'); }
}).listen(port, '127.0.0.1', () => console.log(`Prévia local: http://localhost:${port}/`));
