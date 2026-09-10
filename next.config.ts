// NAO REMOVA. Apesar do nome, este arquivo nao e do Next: o vinext o le
// (loadNextConfig, em vinext/dist/cli.js) e e o `output: 'export'` daqui
// que faz o build emitir HTML estatico em dist/client.
// CICATRIZ: removido por parecer codigo morto na Fase 0. O build passou
// sem erro e nao gerou nenhum .html; so o scripts/prepare-static.mjs
// quebrou depois, com ENOENT em dist/client/motos.
import type { NextConfig } from 'next';

const nextConfig: NextConfig = { output: 'export', trailingSlash: false, images: { unoptimized: true } };

export default nextConfig;
