# Design

Todo o CSS do site está em `app/globals.css`. Um arquivo, 16 KB.

Antes de mudar qualquer coisa visual, entenda a decisão que estrutura o resto:
**este site não usa classes utilitárias para layout.** O Tailwind está instalado,
mas o que ele fornece aqui é o reset, os tokens do `@theme inline` e o que o
shadcn precisa. O layout é escrito em **classes semânticas** — `.hero`,
`.moto-card`, `.steps`, `.detail-hero` — com CSS de verdade.

Por que isso importa: um JSX cheio de `flex gap-4 rounded-lg md:grid-cols-2`
mistura estrutura e aparência na mesma linha. Aqui o `.tsx` diz **o que a coisa
é** e o CSS diz **como ela se parece**. Você consegue redesenhar o site inteiro
sem tocar em um `.tsx`. Mantenha assim.

---

## Tokens

Definidos em `:root`, redefinidos dentro de
`@media (prefers-color-scheme: dark)`. Não há botão de tema — o site segue o
sistema operacional do visitante.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--background` | `#fafaf8` | `#1a1d19` | Fundo da página |
| `--foreground` | `#222521` | `#f1f3ed` | Texto principal |
| `--surface` | `#f0f0ed` | `#232721` | Cartões, blocos elevados |
| `--muted` | `#eaeae6` | `#2d322b` | Fundos discretos |
| `--muted-foreground` | `#676b65` | `#b0b6a9` | Texto secundário |
| `--border` | `#dcded6` | `#394034` | Bordas e divisores |
| `--accent` | `#f47745` | `#f47745` | **Preenchimento**, nunca texto |
| `--accent-ink` | `#b74416` | `#ff956a` | **Texto** em cor de destaque |
| `--radius` | `8px` | `8px` | Raio padrão |

### Por que `--accent` e `--accent-ink` são dois tokens

É a decisão de acessibilidade mais importante do arquivo, e a mais fácil de
desfazer sem perceber.

| Combinação | Contraste | Veredito |
|---|---|---|
| `--accent` (`#f47745`) como **texto** sobre o fundo claro | **2,65:1** | Reprova. WCAG AA exige 4,5:1. |
| `--accent-ink` (`#b74416`) como **texto** sobre o fundo claro | **5,22:1** | Passa |
| Texto `#191b19` **sobre** `--accent` (botão preenchido) | **6,25:1** | Passa |

O laranja funciona como fundo de botão e falha como cor de texto. Por isso são
tokens separados. **Nunca escreva texto com `--accent`.** Se você precisa de
texto laranja, é `--accent-ink`.

Os demais pares, para referência:

| Par | Claro | Escuro |
|---|---|---|
| Texto principal sobre fundo | 14,83:1 | 15,23:1 |
| Texto secundário sobre fundo | 5,20:1 | 8,19:1 |
| Destaque em texto sobre fundo | 5,22:1 | 7,91:1 |

`--border` contra o fundo é **1,30:1** — proposital. Borda é separação visual,
não informação; se ela precisasse ser lida, seria texto.

---

## Breakpoints

```
                              540px    768px      1024px            1600px
  ├──────────┬─────────────────┼─────────┼──────────┼─────────────────┤
   ≤359px      360–540           541–767   768–1023    1024–1599         ≥1600
   mínimo      celular           celular   tablet      desktop           amplo
                                  largo
```

São escritos como `max-width` (o site é mobile-first no comportamento, ainda que
o CSS base descreva o desktop):

| Query | O que muda |
|---|---|
| `min-width: 1600px` | hero ganha altura (`min-height: 670px`) |
| `max-width: 1023px` | catálogo vai a 2 colunas, `.container` estreita para `100% - 48px` |
| `max-width: 767px` | menu vira gaveta, `.desktop-nav` some, hero reflui |
| `max-width: 540px` | catálogo vai a 1 coluna, hero troca para `object-fit: contain` |
| `max-width: 359px` | ajustes de sobrevivência para telas muito estreitas |

**O corte em 540px é o mais interessante.** Abaixo dele o hero muda de
`object-fit: cover` para `contain`, com `width: 145%` e `left: -39%`. Em telas
estreitas o recorte do `cover` cortava a moto ao meio; a alternativa foi mostrar
a imagem inteira e deslocá-la. Se você trocar a imagem do hero, **teste em 360px
de largura** — esses números são específicos daquela foto.

O `.container` encolhe em degraus: `100% - 48px` → `100% - 40px` → `100% - 32px`.
A margem lateral nunca some. Texto colado na borda da tela é ilegível.

---

## Tipografia

**Outfit variável**, peso 100–900, self-hosted em
`public/fonts/outfit-latin.woff2`, com `font-display: swap`. Fallback:
`Arial, sans-serif`.

Nenhuma requisição a CDN de fonte. Isso é privacidade (o Google Fonts vê o IP de
cada visitante), performance (uma conexão a menos) e resiliência (o site não
depende de um domínio de terceiro).

O `h1` do hero usa `clamp(38px, 8.9vw, 65px)` no mobile — escala com a viewport
entre um piso e um teto, sem saltos entre breakpoints. É o padrão a seguir para
qualquer título novo.

`letter-spacing` fica negativo nos títulos grandes (`-1.8px` a `-2.5px`).
Tipografia grande precisa de tracking menor; sem isso as letras parecem soltas.

---

## Movimento

```css
@media (prefers-reduced-motion: no-preference) { /* animação de entrada do hero */ }
@media (prefers-reduced-motion: reduce)        { /* desliga TUDO */ }
```

A animação só existe dentro do `no-preference`. O bloco `reduce` zera toda
animação e transição com `!important` e desliga o `scroll-behavior: smooth`.

Isto não é um detalhe de polimento. Movimento involuntário provoca náusea e
enxaqueca em pessoas com desordem vestibular. **Toda animação nova vai dentro do
`no-preference`.** Ver invariante 8 do README.

---

## Acessibilidade — o que já está feito

Herdado do gerador e verificado. Não desfaça:

- `<a class="skip-link" href="#conteudo">` como primeiro elemento do `body`.
- **Uma `<h1>` por página**, checada pelo `verify.mjs`.
- Toda imagem com `alt` descritivo — e `alt=""` nas decorativas (as miniaturas da
  galeria, cujo rótulo já está no botão).
- Todo ícone com `aria-hidden="true"`. Ícone é decoração; o significado está no
  texto ao lado.
- Estado nunca só por cor: galeria usa `aria-pressed`, menu usa `aria-expanded`.
- `width`/`height` explícitos em toda `<img>`, contra layout shift.
- Links externos com `rel="noopener noreferrer"` e aviso em `.sr-only`
  ("abre em nova aba").
- `<nav>` com `aria-label` distinto para cada um (são quatro na página).
- `lang="pt-BR"` no `<html>`.

---

## Regras para mudança visual

1. **Cor nova entra como token em `:root`**, com par claro/escuro. Nunca escreva
   um hex direto numa regra.
2. **Confira o contraste** antes de commitar. AA exige 4,5:1 para texto normal e
   3:1 para texto grande (≥24px ou ≥18,66px em negrito).
3. **Teste em 360px de largura.** É onde o layout quebra primeiro.
4. **Teste no modo escuro.** Ele não é opcional — segue o sistema do visitante,
   e metade das pessoas o usa.
5. **Animação nova vai dentro de `prefers-reduced-motion: no-preference`.**
6. **Não adicione classe utilitária para layout.** Se o `.tsx` está ganhando
   `flex gap-4`, o CSS é que está faltando.
7. **Rode `npm run build && npm run verify`.** Mudança de CSS quebra âncora e
   link com mais frequência do que parece.

---

## Fase 3 — a proposta já existe

Uma direção visual foi prototipada em HTML puro, em `prototipos/`. Rode
`node prototipos/gerar-standalone.mjs` e abra o arquivo que ele produz: **um
arquivo só**, com fonte e imagens embutidas, onde as interações funcionam de
verdade. É o site e só o site — sem moldura de ferramenta.

A proposta em uma linha: **site de negócio local, não de estúdio de design.**
Foto sangrando com o cabeçalho flutuando por cima, carta de oferta com preço
visível, selos de confiança, badges de disponibilidade, seção de dúvidas e
WhatsApp flutuante. A referência é
[dwimoveisjp.vercel.app](https://dwimoveisjp.vercel.app).

Uma cor de marca só, e verde por motivo funcional: a única conversão do site é
WhatsApp, então o botão já diz para onde leva. `#0E7A3C` dá 5,43:1 com branco por
cima e 5,02:1 como texto — os dois papéis num token.

O raciocínio completo está em [`../prototipos/README.md`](../prototipos/README.md).

---

## Fase 3 — o que ainda falta

Esta é a lista de trabalho da fase de design hi-fi, com o motivo de cada item.

| Item | Situação | Por que mexer |
|---|---|---|
| `globals.css` está minificado: 16 KB em 22 linhas | Herdado do gerador | Um `git diff` no CSS hoje é ilegível. Expandir é pré-requisito para qualquer trabalho de design sério. |
| Escala tipográfica implícita | Tamanhos escritos um a um em cada breakpoint | Vira token (`--text-xs` … `--text-4xl`). Hoje mudar a escala exige caçar dezenas de `font-size`. |
| Escala de espaçamento implícita | Números soltos (8, 12, 14, 16, 20, 22, 24, 26, 28, 32, 34…) | Uma escala fecha o vocabulário e faz o ritmo vertical parar de variar. |
| Estados de foco | Existem, mas não auditados | Navegação por teclado precisa de anel de foco visível em **todo** elemento interativo. |
| Sem `favicon` em PNG/ICO | Só `favicon.svg` | Navegadores antigos e alguns agregadores não leem SVG. |
| Sem Open Graph / Twitter Card | Ausente | Link compartilhado no WhatsApp — a única conversão do site — aparece sem imagem e sem título. É a lacuna de maior impacto prático. |
| Sem `sitemap.xml` nem `robots.txt` | Ausente | Só faz sentido quando sair o `robots: index:false`. Ver invariante 4. |
| Hero: 138 KB, uma única `.webp` de 1672px para todas as telas | Sem `srcset` | Um celular de 360px baixa a imagem de desktop inteira. Duas ou três larguras cortam a maior parte disso. |
| Catálogo: 1,1 MB em 13 imagens | `loading="lazy"` nos cards, sem `srcset` | Mesmo problema, multiplicado por seis. O lazy adia, não reduz. |

O item de Open Graph é o que eu atacaria primeiro: custa quinze linhas em
`app/layout.tsx` e muda como cada link compartilhado se apresenta.
