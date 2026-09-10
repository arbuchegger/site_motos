# Protótipo hi-fi

```bash
node prototipos/gerar-standalone.mjs
```

Isso produz **`prototipos/vertice-hi-fi-standalone.html`** — um arquivo só, de
1,4 MB, que abre por clique duplo. Sem `npm install`, sem servidor, sem rede: a
fonte e as treze imagens vêm embutidas em base64 dentro do próprio HTML. Dá para
mandar por e-mail ou WhatsApp para quem vai avaliar o design, e funciona no
computador da pessoa sem que ela instale nada.

Duas telas: **home** e **ficha da moto** (as seis motos funcionam).

## Por que o arquivo gerado não está versionado

O `.gitignore` ignora `prototipos/*-standalone.html`, e isso é aplicação
deliberada da **invariante 9** do [README](../README.md): nada que uma ferramenta
consiga gerar de novo entra no git.

São 1,4 MB. Cada ajuste de design gravaria 1,4 MB novos no histórico, porque o
git guarda o blob inteiro a cada versão. Vinte iterações custariam 28 MB
permanentes num repositório cujo fonte tem 1,7 MB. É a mesma classe de erro que
colocou 619 MB de cache do npm no commit inicial, só que mais fácil de
justificar — e por isso mais perigosa.

Versionado fica o que não se regenera: o fonte, a fonte tipográfica e o gerador.

## Estrutura

```
prototipos/
├── gerar-standalone.mjs           Node puro, zero dependência
├── src/vertice-hi-fi.html         O fonte. É aqui que se edita.
├── fontes/figtree-latin.woff2     Figtree variável, subconjunto latino (20 KB)
└── vertice-hi-fi-standalone.html  Gerado. Não versionado.
```

O gerador só troca marcadores por `data:` URI — `__FONTE__` e `__IMG:cg-160__`.
Ele falha se sobrar algum marcador: um protótipo com imagem quebrada não deveria
chegar a ninguém. Escrever o arquivo final à mão não funcionaria — 1,4 MB de
base64 no meio do código tornam o fonte ilegível e o diff impossível de revisar.

## O que dá para fazer

A barra escura do topo é a ferramenta, não o produto: troca de tela, de largura
(celular 390, tablet 834, desktop) e de tema (sistema, claro, escuro).

Dentro do protótipo: filtrar o catálogo por categoria, abrir a gaveta do menu,
navegar para a ficha de qualquer moto pelo cartão, trocar a foto na ficha com o
mouse ou com as setas ← →, e abrir as perguntas da seção Dúvidas.

### O seletor de largura funciona por `@container`, não por `@media`

O jeito comum de mostrar um layout responsivo é pôr a página num `<iframe>` da
largura desejada. Funciona, mas obriga o protótipo a ser um arquivo separado — e
o pedido era um arquivo só.

A saída é `container-type: inline-size` no palco. Todas as regras responsivas são
`@container tela (max-width: …)`. Elas passam a responder à largura **daquele
elemento**, não da janela. Trocar para "Celular" reflui o layout exatamente como
o aparelho reflui.

Verificado com o palco em 372 px: `.nav-desk` em `none`, `.bt-menu` em `flex`,
grade em 1 coluna, e `scrollWidth == clientWidth` — sem estouro horizontal.

---

## A direção de design

A referência é [dwimoveisjp.vercel.app](https://dwimoveisjp.vercel.app), um site
de imobiliária de bairro em João Pessoa. Ele resolve o mesmo problema que o nosso:
negócio local, catálogo pequeno, conversão única no WhatsApp.

### O que foi copiado da referência, e por quê

| Padrão | Por que funciona |
|---|---|
| **Foto sangrando com o texto por cima**, e o cabeçalho flutuando sem fundo | A foto começa na borda de cima. Uma faixa clara no topo corta a imagem em duas e denuncia o template. |
| **Carta de oferta flutuando sobre o hero** | Mostra que existe produto de verdade, com preço, antes de qualquer rolagem. |
| **Preço na cara** — "R$ 690 por mês" | É a primeira coisa que a pessoa quer saber. Esconder atrás de "consulte" custa contato. |
| **Selos de confiança** logo abaixo da CTA | "Seguro e manutenção inclusos", "Retirada no mesmo dia". Responde a objeção antes de ela virar dúvida. |
| **Badges de status no cartão** — Disponível hoje, Última unidade | Escassez honesta e informação útil no mesmo elemento. |
| **WhatsApp flutuante** | Fica à mão em qualquer ponto da página, em qualquer largura. |
| **Seção de Dúvidas** | CNH, caução, prazo, uso para entrega. São as perguntas que travam o fechamento. |
| **Cantos de 14 px, sombra macia, cartas brancas sobre fundo quente** | Vocabulário de negócio de bairro, não de portfólio de estúdio. |

### Cor: uma marca só, e ela é verde por um motivo funcional

A única conversão do site é WhatsApp. Um botão verde já diz para onde leva antes
de ser lido — e ainda carrega o ícone, para quem não distingue a cor.

**`#0E7A3C`** serve aos dois papéis, e os dois passam em AA:

| Uso | Contraste | |
|---|---|---|
| Branco sobre o verde (botão) | **5,43:1** | AA |
| O verde como texto no fundo claro | **5,02:1** | AA |
| No tema escuro: `#4ADE80` com tinta `#06200F` por cima | **9,87:1** | AAA |
| No tema escuro: `#4ADE80` como texto na carta | **9,27:1** | AAA |

Um token para escrever e preencher, sem a ginástica de manter dois. Os dois
últimos números foram medidos **na página viva**, lendo o `getComputedStyle` dos
botões de verdade — não numa planilha à parte que envelhece sozinha.

O resto é neutro quente: fundo `#F7F6F3`, cartas brancas, texto `#1A1D21`,
secundário `#5C6470`. Âmbar `#8A5300` só no selo "Última unidade".

### Tipografia

**Figtree** variável, uma família, pesos 300–900. Geométrica de altura-x alta e
formas arredondadas: fala como um negócio de bairro. Títulos em 800 com
entreletra negativa; texto em 400.

### Movimento

Só a entrada do hero é iniciada pela página: os dois blocos sobem 18 px em
640 ms, escalonados em 120 ms. O resto responde a uma ação e mostra o que mudou:

| Interação | Tratamento |
|---|---|
| **Filtro do catálogo** | FLIP: os cartões que ficam **deslizam** para a posição nova em 260 ms; os que saem encolhem e somem |
| Troca de tela | 260 ms, sobe 10 px |
| Cartão sob o mouse | Sobe 3 px, a foto cresce 4%, a sombra abre |
| Troca de foto na ficha | As duas imagens empilhadas trocam por opacidade, sem pulo de layout |
| Cabeçalho ao rolar | Ganha fundo e borda — mostra que virou barra fixa |
| Dúvida abrindo | 240 ms, e o chevron gira |
| Gaveta | 280 ms |

O FLIP do filtro merece nota: mede-se onde cada cartão está, muda-se o DOM, mede
de novo, e anima-se a diferença. Sem ele, filtrar é um piscar e ninguém entende o
que aconteceu com os cartões.

Não há fade-and-slide-up em cada seção — esse é o padrão genérico e dilui
justamente o momento que deveria chamar atenção. Tudo dentro de
`prefers-reduced-motion: no-preference`, com um bloco `reduce` que zera animação
e transição.

---

## O que mudou em relação ao site atual

| | Site atual | Protótipo |
|---|---|---|
| Hero | Texto sobre foto com gradiente, cabeçalho sólido cortando a imagem | Cabeçalho flutuante, foto do topo à borda, carta de oferta com preço |
| Preço | Não existe; tudo "sob consulta" | Visível no cartão, no hero e na ficha |
| Catálogo | Seis cartões, sem filtro | Filtro por categoria com FLIP, badge de status |
| Confiança | Nada | Selos no hero e lista do que está incluso na ficha |
| Dúvidas | Não existe | Seis perguntas em `<details>` nativo |
| CTA | Botão no fluxo, some ao rolar | Botão flutuante fixo, em qualquer largura |
| Cor | Coral `#f47745` genérico | Verde funcional, que anuncia o WhatsApp |
| Tipografia | Outfit | Figtree |

---

## Três bugs que valem registrar

### 1. O cabeçalho que estourava no celular

Eu escondia a navegação e mostrava o botão de menu, mas esqueci de esconder o
botão de WhatsApp do cabeçalho. Marca + botão + menu não cabem em 390 px.

**Lição:** ao esconder um elemento no celular, verifique todos os irmãos dele. O
estouro veio do que ficou, não do que saiu.

### 2. A captura de tela que mentiu

Olhar o screenshot não bastou para diagnosticar o bug acima. O Chrome headless
neste Windows trava a janela num mínimo de 469 px por causa do DPI de 125%, e a
imagem sai **cortada** em 390 px — o que parece exatamente igual a um estouro de
layout. Dois problemas diferentes, um sintoma só.

A resposta veio de medir: uma sonda que compara
`getBoundingClientRect().right` com a largura da viewport reportou
`scrollWidth == viewport`. Não havia estouro; o corte era da captura.

**Lição:** captura de tela não é medição. Quando o sintoma e o artefato da
ferramenta se parecem, meça.

### 3. O botão verde com texto claro no tema escuro

`.tela a { color: inherit }` tem especificidade `(0,1,1)`. `.botao-1 { color:
var(--marca-texto) }` tem `(0,1,0)`. O `a` ganhava, e o botão **herdava** a cor
do pai em vez de usar o token. No tema escuro isso dava verde claro com texto
claro — ilegível.

O detalhe cruel: no tema claro o bug passava despercebido, porque os botões
estavam sobre a foto do hero, onde a cor herdada por acaso era branca. Só
aparecia no escuro, e só fora do hero.

Foi encontrado dirigindo a página com `chrome --headless --dump-dom`, lendo o
`getComputedStyle` de cada botão nos dois temas e calculando o contraste real.
O `.tela` na frente das regras resolve.

**Lição:** cor de botão nunca deve depender de herança. E teste de contraste que
lê a página viva encontra o que planilha de paleta não encontra.

---

## Limites

Não é o site. É uma proposta visual para a Fase 3.

- **É protótipo, não código de produção.** As telas são geradas por concatenação
  de string em JavaScript: ótimo para iterar, péssimo para manter. O site
  continua sendo React.
- **Nenhum botão envia mensagem.** Os destinos são âncoras da própria página.
- **Os preços são ilustrativos** — e mostrá-los é decisão de negócio, não de
  layout. Ver a pendência P6 em [`../docs/07-decisoes.md`](../docs/07-decisoes.md).
- **A fonte muda.** O site hospeda a Outfit; esta proposta usa Figtree. Se
  aprovada, a Figtree entra em `public/fonts/`.

Se a direção for aprovada, a migração é: portar os tokens para `app/globals.css`
e converter cada bloco em componente React. Se for reprovada, `rm -rf prototipos/`
e nada mais no repositório é afetado — foi desenhado assim de propósito.
