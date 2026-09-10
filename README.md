# Vértice Motos

Vitrine estática de aluguel de motos, em português do Brasil. Seis modelos, uma
página de detalhe para cada, e um único caminho de conversão: WhatsApp. Não há
carrinho, cadastro, login ou pagamento — a negociação acontece na conversa.

O site é **demonstrativo**: empresa, telefone, endereço e imagens são fictícios,
e o `layout.tsx` publica `robots: { index: false }` justamente por isso.

Este repositório também é um **projeto-exemplo de mentoria**. Cada decisão
estrutural está documentada com o motivo que a gerou. Se você é uma IA lendo
isto: comece por [`docs/03-como-pedir-para-ia.md`](docs/03-como-pedir-para-ia.md).

**Fonte da verdade, em ordem de precedência:**

1. Este README — invariantes, comandos e gate.
2. [`docs/07-decisoes.md`](docs/07-decisoes.md) — o porquê de cada decisão já tomada.
3. [`docs/04-seguranca.md`](docs/04-seguranca.md) — checklist de segurança 1–20 aplicado a este stack.
4. [`lib/content.ts`](lib/content.ts) — todo o conteúdo do site. Um texto que não está aqui está no lugar errado.
5. O código.

Em conflito, o item de cima vence.

---

## Stack

| Camada | Escolha | Por que importa |
|---|---|---|
| Framework | **vinext** 1.0.0-beta.5 | Roda a API de app router do Next sobre Vite. Lê `next.config.ts` — veja a invariante 2. |
| Build | Vite 8 + `@vitejs/plugin-rsc` | Emite HTML estático em `dist/client`. Nenhum servidor em produção. |
| UI | React 19 + Tailwind 4 | Tailwind entra via `@tailwindcss/postcss`, sem `tailwind.config`. |
| Estilo | CSS próprio em `app/globals.css` | O layout **não** é feito de classes utilitárias. São classes semânticas (`.hero`, `.moto-card`) com tokens em `:root`. |
| Ícones | lucide-react | Único uso de biblioteca de ícone. |
| Fonte | Outfit variável, self-hosted | `public/fonts/outfit-latin.woff2`. Nenhuma requisição a CDN de fonte. |
| Lint / Format | oxlint + oxfmt | Rust. Rápidos o bastante para rodar a cada save. |
| Hospedagem | Qualquer servidor de arquivos | `.openai/hosting.json` aponta `dist/client`. Sem D1, sem R2, sem Worker. |

Node **≥ 22.13.0** (exigido em `package.json:engines`).

---

## Comandos

```bash
npm ci             # instala exatamente o que está no package-lock.json
npm run dev        # servidor de desenvolvimento (vinext dev)
npm run build      # vinext build + scripts/prepare-static.mjs -> dist/client
npm run preview    # serve dist/client em http://localhost:4173, só para conferir
npm run check      # tsc --noEmit. Tipos, sem emitir nada
npm run verify     # valida o HTML JÁ EXPORTADO: links, âncoras, h1, WhatsApp
npm run lint       # oxlint
npm run format     # oxfmt
```

O `verify` é o comando mais importante e o menos óbvio: ele **não** testa o
código-fonte, testa os arquivos que o build produziu. Ele abre cada `.html` em
`dist/client`, segue todo `href`/`src` local até o arquivo no disco, confere que
cada âncora existe no destino e que cada link de WhatsApp carrega a mensagem
certa. É por isso que ele só roda depois do `build`.

---

## Invariantes

Estas não são preferências. Violar qualquer uma delas é um bug, mesmo que os
testes passem.

**1. Não existe servidor em produção.** O build gera arquivos e acabou. Nenhum
segredo, nenhuma variável de ambiente, nenhum banco, nenhuma rota de API. Toda
chave que fosse parar aqui estaria no bundle do navegador — ou seja, vazada.
Feature que precisa de servidor não entra sem antes mudar esta invariante.
Detalhes em [`docs/06-pagamentos.md`](docs/06-pagamentos.md).

**2. `next.config.ts` não é código morto e não pode ser removido.** O projeto
não usa Next, mas o vinext lê esse arquivo, e o `output: 'export'` dentro dele é
o que faz o build emitir HTML. _Cicatriz: o arquivo foi removido por parecer
sobra de Next. O `vinext build` terminou com "Build complete" e código de saída
zero, sem escrever um único `.html`. A falha só apareceu no passo seguinte, num
`ENOENT` do `prepare-static.mjs`._

**3. Todo conteúdo vive em `lib/content.ts`.** Nome, telefone, endereço, títulos,
descrições, catálogo — tudo. Nenhum texto de marketing escrito dentro de um
componente. Quem for editar o site não deve precisar abrir um `.tsx`.

**4. Nenhum dado real de empresa enquanto o site for demonstrativo.** Telefone
fictício, `robots: index:false`, e o rodapé dizendo que é demonstração. Publicar
com dados reais é um checklist, não um commit — está em
[`docs/07-decisoes.md`](docs/07-decisoes.md).

**5. Uma `<h1>` por página.** O `verify.mjs` reprova o build se houver zero ou
duas. Hierarquia de heading é navegação para leitor de tela, não estilo.

**6. Toda imagem tem `alt` descritivo e `width`/`height` explícitos.** O `alt`
porque o catálogo inteiro é imagem; o `width`/`height` porque sem eles o
navegador não reserva espaço e a página pula durante o carregamento.

**7. Estado nunca é comunicado só por cor.** Sempre com ícone, rótulo ou
`aria-*`. A galeria usa `aria-pressed`, o menu usa `aria-expanded`.

**8. `prefers-reduced-motion` é respeitado.** A animação de entrada do hero só
existe dentro de `@media (prefers-reduced-motion: no-preference)`, e há um bloco
`reduce` que desliga toda animação e transição. Movimento é opcional; conteúdo
não.

**9. Nada que uma ferramenta consiga gerar de novo entra no git.** _Cicatriz: o
commit inicial levou `work/npm-cache/` — 619 MB e 2.743 dos 2.863 arquivos
versionados, num projeto cujo fonte tem 1,7 MB. Corrigir exigiu reescrever
o histórico._
Ver [`docs/02-git-e-branches.md`](docs/02-git-e-branches.md).

**10. O link do WhatsApp sempre carrega a mensagem pronta.** Um usuário que
clica na CG 160 abre a conversa com "Tenho interesse na Honda CG 160" já
escrito. É a única conversão do site; um link genérico a desperdiça. O
`verify.mjs` confere modelo por modelo.

---

## Segurança

O checklist completo de 20 itens está em
[`docs/04-seguranca.md`](docs/04-seguranca.md), com o que **não se aplica** a um
site estático e o motivo — para ninguém implementar o substituto errado por
analogia.

O resumo: como não há servidor, não há segredo, sessão, banco ou upload. A
superfície de ataque real deste projeto é **a cadeia de dependências** (item 20)
e **o que se commita** (item 2).

---

## Convenções de código

- **Português no conteúdo, inglês no código.** Textos, comentários e mensagens
  de commit em pt-BR; identificadores, nomes de arquivo e classes CSS em inglês.
- **Classes CSS são semânticas**, não utilitárias: `.moto-card`, não
  `.flex.gap-4.rounded-lg`. O Tailwind está presente pelos tokens e pelo reset,
  mas o layout mora no `globals.css`.
- **`@/` resolve para a raiz** (`tsconfig.json:paths`). Importe `@/lib/content`,
  nunca `../../lib/content`.
- **`'use client'` só onde há estado.** Hoje: `components/header.tsx` (menu) e
  `components/gallery.tsx` (foto ativa). Todo o resto é Server Component.
- **`components/ui/` é território do shadcn.** Não edite à mão. O que for do
  projeto vai em `components/`.
- **Formate com `npm run format`.** Não discuta estilo em revisão.

---

## Antes de dizer que terminou

Rode, nesta ordem, e cole a saída:

```bash
npm run build && npm run verify && npm run check
```

Os três precisam passar. O `verify` **depende** do `build` ter rodado antes —
ele lê `dist/client`, não o fonte. Rodar `verify` sobre um build velho é testar
o código de ontem.

**Não anuncie conclusão sem ter rodado.** "Deve funcionar", "a mudança é
trivial" e "os tipos passam" não são evidência. A invariante 2 nasceu
exatamente de um build que passou verde sem produzir o produto.

`npm run lint` ainda **não** faz parte do gate: há 34 erros herdados, a maioria
em componentes `components/ui/` que o site nem usa. Entrar no gate é a Fase 2 —
ver [`docs/07-decisoes.md`](docs/07-decisoes.md).

---

## Commits

- **Português.** Imperativo, minúsculo depois do prefixo:
  `fix: restaura next.config.ts`.
- **Prefixos:** `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`.
- **O corpo explica o porquê, não o quê.** O diff já mostra o quê. Se a mudança
  nasceu de um erro, descreva o erro — é isso que impede a repetição.
- **Nunca adicione `Co-Authored-By:` nem qualquer atribuição de IA.** O autor é
  a pessoa.
- **Commite só quando pedido.** Não commite por iniciativa própria ao terminar
  uma tarefa.

Convenções de branch, PR e o que fazer com histórico sujo estão em
[`docs/02-git-e-branches.md`](docs/02-git-e-branches.md).

---

## Documentação

| Documento | Para quê |
|---|---|
| [`docs/01-estrutura.md`](docs/01-estrutura.md) | O que é cada pasta e por que ela existe |
| [`docs/02-git-e-branches.md`](docs/02-git-e-branches.md) | Branches, commits, PR, e a limpeza de 645 MB |
| [`docs/03-como-pedir-para-ia.md`](docs/03-como-pedir-para-ia.md) | Como escrever um pedido que uma IA executa bem |
| [`docs/04-seguranca.md`](docs/04-seguranca.md) | Checklist 1–20 aplicado a um site estático |
| [`docs/05-design.md`](docs/05-design.md) | Tokens, breakpoints, tipografia, acessibilidade |
| [`docs/06-pagamentos.md`](docs/06-pagamentos.md) | Como conectar uma API de pagamento — e por que não conectamos |
| [`docs/07-decisoes.md`](docs/07-decisoes.md) | Registro de decisões, com contexto e consequência |

---

## Licença

MIT. Ver [`LICENSE`](LICENSE).
