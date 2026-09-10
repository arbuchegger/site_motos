# Estrutura de pastas

Cada pasta abaixo existe por um motivo. Se você não achar o motivo aqui, a pasta
provavelmente não deveria existir.

```
.
├── app/                    Rotas. Cada pasta é uma URL.
│   ├── globals.css         TODO o CSS do site. Um arquivo só.
│   ├── layout.tsx          Casca comum: <html>, header, footer, metadata
│   ├── page.tsx            "/" — hero, catálogo, como funciona, contato
│   ├── not-found.tsx       "/404.html" no export estático
│   └── motos/[slug]/       "/motos/honda-cg-160/" e as outras cinco
├── components/
│   ├── site.tsx            Logo, WhatsAppLink, MotorcycleCard, Footer
│   ├── header.tsx          Cabeçalho + menu mobile ('use client')
│   ├── gallery.tsx         Troca de foto na página de detalhe ('use client')
│   └── ui/                 shadcn. 60 arquivos, 2 usados. Ver "Dívida" abaixo.
├── hooks/use-mobile.ts     Hook do shadcn. Não usado pelo site.
├── lib/
│   ├── content.ts          TODO o conteúdo. Edite aqui, não nos componentes.
│   └── utils.ts            cn() — merge de classes do shadcn
├── public/                 Servido como está, na raiz do site
│   ├── favicon.svg
│   ├── fonts/              Outfit variável, self-hosted
│   └── images/             13 .webp — o catálogo inteiro
├── scripts/
│   ├── prepare-static.mjs  Roda DEPOIS do build (ver abaixo)
│   ├── preview.mjs         Servidor de prévia local. Nunca vai para produção.
│   └── verify.mjs          O gate. Testa o HTML exportado.
├── docs/                   Você está aqui
├── .openai/hosting.json    Declara dist/client como estático, sem D1 nem R2
├── next.config.ts          NÃO REMOVA. Ver invariante 2 do README.
├── vite.config.ts          Tailwind via postcss + plugin do vinext
├── package.json            Scripts e dependências fixadas
└── .gitignore              A cicatriz dos 619 MB está comentada dentro
```

---

## As três pastas que confundem

### `app/` não é Next, mas parece

A API é a do app router do Next — `layout.tsx`, `page.tsx`, `generateMetadata`,
`generateStaticParams`, `notFound()`. O que executa é o **vinext**, que
implementa essa API sobre Vite. Por isso `next` não está nas dependências mas
`import type { Metadata } from 'next'` funciona: o vinext fornece os tipos.

Consequência prática: **nem tudo do Next existe aqui.** Antes de usar um recurso
do Next que você conhece, confira se o vinext o suporta. Ele mantém uma lista em
`node_modules/vinext/dist/check.js`.

### `scripts/` roda no seu computador, nunca no servidor

Nenhum dos três `.mjs` vai para produção. Eles são ferramentas de build e de
conferência.

`prepare-static.mjs` merece explicação. O build emite
`dist/client/motos/honda-cg-160.html`. Mas o site linka para
`/motos/honda-cg-160/` — com barra no fim. Numa hospedagem de arquivos simples,
esse caminho procura um diretório, não um `.html`. O script então copia cada
`.html` para `<nome>/index.html`. Resultado: a URL funciona em qualquer
hospedagem, sem regra de rewrite. É por isso que ele existe, e é por isso que
`npm run build` é `vinext build && node scripts/prepare-static.mjs` — as duas
metades são o build.

### `components/ui/` é gerado, não escrito

São componentes do shadcn, copiados para dentro do projeto (é assim que o shadcn
funciona: ele não é uma dependência, é um gerador). Não edite à mão — a próxima
atualização sobrescreve.

---

## Dívida conhecida

Estes pontos são reais e estão registrados de propósito. Um repositório-exemplo
que finge não ter dívida ensina a coisa errada.

| Dívida | Tamanho | Fase |
|---|---|---|
| 58 dos 60 componentes em `components/ui/` não são usados. Só `button` e `sheet` entram no site. | ~230 KB de fonte morto | 2 |
| `hooks/use-mobile.ts` não é importado por nada. | 1 arquivo | 2 |
| O JSX está escrito em linhas únicas de até 2.200 caracteres. Um `git diff` nesses arquivos é ilegível. | 5 arquivos | 2 |
| `app/globals.css` tem 16 KB em 22 linhas, com regras minificadas. | 1 arquivo | 3 |
| `npm run lint` acusa 34 erros herdados. | — | 2 |
| `tsconfig.json` ainda inclui `next-env.d.ts` e `.next/types/**` — caminhos que não existem neste projeto. | 3 linhas | 2 |
| Os JSONs de prompt em `docs/` carregam caminhos absolutos da máquina de quem gerou as imagens. | 4 arquivos | 2 |

---

## Como o repositório era antes

Vale registrar, porque explica nomes que você pode encontrar em commits antigos:

```
outputs/vertice-motos/    <- o site inteiro vivia aqui
work/motorcycle-assets/   <- 13 PNGs de ~2 MB, masters das imagens
work/npm-cache/           <- 619 MB de cache do npm, versionados
```

`outputs/` e `work/` eram andaime da ferramenta que gerou o projeto, não layout
de projeto. Foram achatados na Fase 0. O porquê completo, incluindo por que os
PNGs saíram e os JSONs de prompt ficaram, está em
[`07-decisoes.md`](07-decisoes.md).

---

## Onde colocar coisa nova

| Você quer... | Vá para |
|---|---|
| mudar um texto, preço, telefone, endereço | `lib/content.ts` |
| adicionar uma moto ao catálogo | `lib/content.ts` + duas `.webp` em `public/images/` + a lista de slugs em `scripts/verify.mjs` |
| mudar cor, espaçamento, tipografia | `app/globals.css` (tokens em `:root`) |
| criar um bloco reutilizável de UI | `components/` |
| criar uma página | `app/<rota>/page.tsx` |
| adicionar uma checagem ao gate | `scripts/verify.mjs` |
| documentar uma decisão | `docs/07-decisoes.md` |
