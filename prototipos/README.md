# Protótipo hi-fi

```bash
node prototipos/gerar-standalone.mjs
```

Isso produz **`prototipos/vertice-hi-fi-standalone.html`** — um arquivo só, de
1,5 MB, que abre por clique duplo. Sem `npm install`, sem servidor, sem rede: a
fonte e as treze imagens vêm embutidas em base64 dentro do próprio HTML. Dá para
mandar por e-mail ou WhatsApp para quem vai avaliar o design, e funciona no
computador da pessoa sem que ela instale nada.

## Por que o arquivo gerado não está versionado

O `.gitignore` ignora `prototipos/*-standalone.html`, e isso é aplicação
deliberada da **invariante 9** do [README](../README.md): nada que uma ferramenta
consiga gerar de novo entra no git.

São 1,5 MB. Cada ajuste de design — mudar um espaçamento, trocar uma palavra —
gravaria 1,5 MB novos no histórico, porque o git guarda o blob inteiro a cada
versão. Vinte iterações de design custariam 30 MB permanentes num repositório
cujo fonte tem 1,7 MB. É a mesma classe de erro que colocou 619 MB de cache do
npm no commit inicial, só que mais fácil de justificar — e por isso mais
perigosa.

O que está versionado é o que não se regenera: o fonte, a fonte tipográfica e o
gerador. Um comando reconstrói o resto.

## Estrutura

```
prototipos/
├── gerar-standalone.mjs         Node puro, zero dependência. Troca marcadores por data: URI.
├── src/vertice-hi-fi.html       O fonte. É aqui que se edita.
├── fontes/archivo-latin.woff2   Archivo variável, subconjunto latino (90 KB)
└── vertice-hi-fi-standalone.html  Gerado. Não versionado.
```

O gerador é uma substituição de marcadores e nada mais: `__FONTE__` e
`__IMG:cg-160__` viram `data:` URI. Ele falha se sobrar algum marcador — um
protótipo com imagem quebrada não deveria chegar a ninguém.

Por que gerar em vez de escrever o arquivo final direto: 1,5 MB de base64 no meio
do código torna o fonte impossível de ler e o diff impossível de revisar. O fonte
fica editável; o build fica portátil.

## O que dá para fazer

A barra escura do topo é a ferramenta, não o produto.

| Controle | O que faz |
|---|---|
| **Tela** | Home, ficha da moto e Design System |
| **Largura** | Celular 390, Tablet 834, Desktop |
| **Tema** | Sistema, claro, escuro |

Dentro do protótipo: filtrar o catálogo por categoria, abrir a gaveta do menu
(largura de celular), navegar para a ficha de qualquer moto pelo cartão, trocar a
foto na ficha com o mouse ou com as setas ← →, e arrastar o eixo de largura da
fonte na página de Design System.

### O seletor de largura funciona por `@container`, não por `@media`

Este é o detalhe técnico que vale aprender daqui.

O jeito comum de mostrar um layout responsivo é pôr a página num `<iframe>` da
largura desejada. Funciona, mas obriga o protótipo a ser um arquivo separado — e
o pedido aqui era um arquivo só.

A saída é `container-type: inline-size` no palco. Todas as regras responsivas são
`@container tela (max-width: …)` em vez de `@media`. Elas passam a responder à
largura **daquele elemento**, não da janela. Trocar para "Celular" reflui o
layout exatamente como o aparelho reflui: a navegação some, o botão de menu
aparece, o catálogo vira uma coluna e a CTA gruda no rodapé.

Verificado com o palco em 372 px: `.nav-desk` em `display:none`, `.bt-menu` em
`flex`, `.barra-cta` em `block`, grade em 1 coluna, e `scrollWidth == clientWidth`
— sem estouro horizontal.

---

## A direção de design

### O painel de instrumentos

Uma moto informa por números grandes, legíveis a 60 km/h e sob sol forte:
cilindrada, marcha, velocidade. A página adota o mesmo vocabulário, em três
escalas — é isso que dá unidade ao conjunto:

1. **A faixa escura sob o hero** — três leituras alinhadas. É o elemento
   memorável; tudo em volta foi mantido quieto para que ele funcione.
2. **O mini-painel de cada cartão** — cilindrada e câmbio, os mesmos tipos
   tabulares, reduzidos.
3. **A ficha técnica da moto** — a mesma grade, em escala grande.

Números em algarismos tabulares (`font-variant-numeric: tabular-nums`) para
alinharem em coluna. Um `160` e um `250` empilhados com larguras diferentes
destroem a leitura de painel.

### Cor

Base em **concreto frio** (`#F3F6F3`) e **asfalto** (`#171C20`) — os dois
materiais em que uma moto de aluguel realmente vive. O bege quente perto de
`#F4F1EA` virou o visual padrão de qualquer página gerada, e não é a cor de rua
nenhuma.

Destaque em **âmbar de seta** (`#FFB300`), a cor do pisca. Específica do assunto,
e distinta do laranja-coral genérico.

**Dois tokens de âmbar, e a razão é medida:**

| Uso | Contraste | Veredito |
|---|---|---|
| `#FFB300` como **texto** no fundo claro | **1,65:1** | Reprova. AA exige 4,5:1. |
| `#7A5100` (`--ambar-tinta`) como **texto** no fundo claro | **6,42:1** | Passa |
| Tinta `#14181B` **sobre** `#FFB300` (botão) | **9,95:1** | Passa |
| `#FFB300` no fundo escuro | **9,56:1** | Passa |

Por isso `--ambar` **preenche** e `--ambar-tinta` **escreve**. No modo escuro o
âmbar puro passa a servir como texto, e o token troca de valor sozinho.

Esses números não estão digitados na página de Design System: ela **calcula** o
contraste na hora, pela fórmula da WCAG. Documentação que mente é pior que
documentação que falta.

### Tipografia

**Archivo variável**, uma família só, em dois ajustes bem distintos:

- **Display:** eixo de largura em `wdth 112`, peso 700, entreletra negativa.
  Letra alargada é vocabulário de placa e de sinalização.
- **Texto:** largura normal, peso 400.

A página de Design System traz um controle deslizante que move o eixo `wdth` ao
vivo, de 75 a 125. Em 75 a mesma frase vira ficha técnica; em 125, placa de
rodovia. É o argumento a favor da escolha, mostrado em vez de afirmado.

### Movimento

**Um único movimento não pedido pela pessoa:** as três leituras do painel acendem
em sequência e os números **sobem como um odômetro** — é o cluster da moto na
ignição. 520 ms de fade, escalonado em 100 ms, com os números levando 760 ms e
desacelerando no fim, para chegar em vez de frear.

Tudo o mais responde a uma ação e mostra o que mudou:

| Interação | Tratamento |
|---|---|
| Troca de tela | 240 ms, sobe 8 px |
| **Filtro do catálogo** | FLIP: os cartões que ficam **deslizam** para a posição nova em 260 ms; os que saem encolhem e somem |
| Cartão sob o mouse | Sobe 2 px, a foto cresce 3,5% |
| Troca de foto na ficha | As duas imagens ficam empilhadas e trocam por opacidade — sem pulo de layout |
| Gaveta | 260 ms |
| Botão pressionado | Encolhe para 97,8% |
| Troca de tema | 260 ms, e só quando a pessoa clica |

O FLIP do filtro merece nota: mede-se onde cada cartão está, muda-se o DOM, mede
de novo, e anima-se a diferença. Sem ele, filtrar é um piscar e ninguém entende
o que aconteceu com os cartões.

Não há fade-and-slide-up em cada seção nem transição em cada elemento — esse é o
padrão genérico, e ele dilui justamente o momento que deveria chamar atenção.

Tudo dentro de `prefers-reduced-motion: no-preference`, com um bloco `reduce` que
zera animação e transição, e com o odômetro escrevendo o valor final direto
quando o movimento está desligado. Movimento involuntário provoca náusea e
enxaqueca em quem tem desordem vestibular; não é preferência estética.

---

## O que muda em relação ao site atual

| | Site atual | Protótipo | Por quê |
|---|---|---|---|
| Hero | Texto sobre a foto, com gradiente | Colunas separadas; no celular a foto vem primeiro | O texto sobre foto exige gradiente pesado para ficar legível, e no celular a solução atual precisa de `object-fit`, `width:145%` e `left:-39%` para a moto não ser cortada |
| Catálogo | Seis cartões, sem filtro | Filtro por categoria, com FLIP | Com seis modelos em quatro categorias, quem quer scooter não deveria rolar por trail |
| CTA no celular | Sai da tela ao rolar | Barra fixa no rodapé | É a única conversão do site |
| Ficha técnica | Lista `dl` discreta | Painel em grade, números grandes | Cilindrada e câmbio são o que decide a escolha |
| Fim da ficha | Só "continuar vendo motos" | Três outros modelos | Quem descartou uma moto está pronto para ver a próxima |
| Escala tipográfica | Tamanhos soltos por breakpoint | Tokens `--t12` a `--t61`, razão 1,25 | Mudar a escala hoje exige caçar dezenas de `font-size` |
| Espaçamento | Números avulsos (8, 12, 14, 20, 22, 26…) | Escala base 4, `--e1` a `--e9` | Fecha o vocabulário e estabiliza o ritmo vertical |
| Seleção | Cor | Cor **e** marca de conferido | Estado nunca só por cor |

---

## Dois bugs que valem registrar

### O cabeçalho que estourava no celular

Eu escondia a navegação e mostrava o botão de menu, mas **esqueci de esconder o
botão de WhatsApp do cabeçalho**. Marca + botão + menu não cabem em 390 px.

Lição: ao esconder um elemento no celular, verifique **todos** os irmãos dele. O
estouro veio do que ficou, não do que saiu.

### A captura de tela que mentiu

Olhar o screenshot não bastou para diagnosticar o bug acima. O Chrome headless
neste Windows trava a janela num mínimo de 469 px por causa do DPI de 125%, e a
imagem sai **cortada** em 390 px — o que parece exatamente igual a um estouro de
layout. Dois problemas diferentes, um sintoma só.

A resposta veio de medir: uma sonda que percorre todos os elementos e compara
`getBoundingClientRect().right` com a largura da viewport reportou
`scrollWidth == viewport`. Não havia estouro naquela largura; o corte era da
captura.

Lição, e vale muito além de CSS: **captura de tela não é medição.** Quando o
sintoma e o artefato da ferramenta se parecem, meça.

O mesmo truque de `chrome --headless --dump-dom` serve para **dirigir** a página —
`.click()` nos controles e ler o estado depois. Foi assim que filtro, gaveta,
galeria, rotas, container queries e troca de tema foram verificados, sem instalar
Playwright.

---

## Limites

Não é o site. É uma proposta visual para a Fase 3.

- **É um protótipo, não código de produção.** As telas são geradas por
  concatenação de string em JavaScript, o que é ótimo para iterar e péssimo para
  manter. O site continua sendo React.
- **Nenhum botão envia mensagem.** Os destinos são âncoras da própria página.
- **A fonte muda.** O site hospeda a Outfit; esta proposta usa Archivo pelo eixo
  de largura. Se a direção for aprovada, a Archivo entra em `public/fonts/`.
- **Os dados são os mesmos de `lib/content.ts`**, com a copy reescrita para ser
  mais direta e as descrições das motos ampliadas.

Se a direção for aprovada, a migração é: portar os tokens para `app/globals.css`,
depois converter cada bloco em componente React. As classes são semânticas
justamente para essa passagem ser mecânica. Se for reprovada, `rm -rf prototipos/`
e nada mais no repositório é afetado — foi desenhado assim de propósito.
