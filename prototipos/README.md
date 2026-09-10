# Protótipos hi-fi

Abra `prototipos/index.html` no navegador. Não precisa de `npm`, servidor ou
build — são arquivos HTML que funcionam por clique duplo.

```
prototipos/
├── index.html              a moldura: troca de tela, largura e tema
├── home.html               protótipo da home
├── moto.html               protótipo da ficha de uma moto
└── assets/
    ├── prototipo.css       tokens e componentes
    └── prototipo.js        interações, sem dependência
```

O `index.html` é só **ferramenta de visualização**. Ele coloca o protótipo num
`<iframe>` da largura escolhida, então os `@media` disparam com a largura real do
documento — é o comportamento do aparelho, não uma simulação. As telas também
abrem sozinhas: `home.html` e `moto.html` funcionam direto.

## O que dá para experimentar

| Interação | Onde |
|---|---|
| Filtrar o catálogo por categoria | Home, seção "Modelos disponíveis" |
| Abrir e fechar a gaveta do menu | Home ou ficha, em largura de celular |
| Trocar a foto da moto (mouse ou setas ← →) | Ficha |
| Alternar claro, escuro e sistema | Barra do topo do `index.html` |
| Ver o painel acender na sequência de ignição | Recarregue a home |

---

## Por que este desenho

### O painel de instrumentos é a ideia

Uma moto informa por números grandes, legíveis a 60 km/h e sob sol forte:
cilindrada, marcha, velocidade. A página adota o mesmo vocabulário.

Isso aparece em três escalas, e é o que dá unidade ao conjunto:

1. **A faixa escura sob o hero** — três leituras alinhadas. É o elemento
   memorável da página; tudo em volta foi mantido quieto para que ele funcione.
2. **O mini-painel de cada cartão** — cilindrada e câmbio, mesmos tipos
   tabulares, reduzidos.
3. **A ficha técnica na página da moto** — a mesma grade, em escala grande.

Números em **algarismos tabulares** (`font-variant-numeric: tabular-nums`) para
alinharem em coluna. Um `160` e um `250` empilhados com larguras diferentes
destroem a leitura de painel.

### Por que cinza frio e não bege

O bege quente (perto de `#F4F1EA`) com serifada de alto contraste é hoje o visual
padrão de qualquer site gerado, e não é a cor de rua nenhuma. A base aqui é
**concreto frio** (`#F3F6F3`) e **asfalto** (`#171C20`) — os dois materiais em
que uma moto de aluguel realmente vive.

### Por que âmbar, e por que dois tokens de âmbar

`#FFB300` é a cor da seta de pisca. É específica do assunto, e distinta do
laranja-coral genérico do site atual.

Os dois tokens não são preferência, são medição:

| Uso | Contraste | Veredito |
|---|---|---|
| `#FFB300` como **texto** sobre o fundo claro | **1,65:1** | Reprova. AA exige 4,5:1. |
| `#7A5100` (`--ambar-tinta`) como **texto** sobre o fundo claro | **6,42:1** | Passa |
| Tinta `#14181B` **sobre** `#FFB300` (botão) | **9,95:1** | Passa |
| `#FFB300` sobre o fundo escuro | **9,56:1** | Passa |

Por isso `--ambar` **preenche** e `--ambar-tinta` **escreve**. No modo escuro o
âmbar puro passa a servir como texto, e o token troca de valor sozinho.

É o mesmo padrão que o site atual já usa (`--accent` e `--accent-ink`) — mantido
de propósito, porque estava certo.

### Tipografia

**Archivo variável**, uma família só, em dois ajustes bem distintos:

- **Display:** eixo de largura aberto em `wdth 112`, peso 700, entreletra
  negativa. Letra alargada é vocabulário de sinalização e de placa.
- **Texto:** largura normal, peso 400.

Uma família com dois ajustes fortes dá mais unidade do que duas famílias que
brigam. E o eixo de largura é justamente o que a Archivo faz bem.

### Movimento: um só, e ele significa alguma coisa

As três leituras do painel acendem em sequência ao carregar a página — como o
cluster da moto no momento da ignição. É o único movimento não pedido pelo
usuário, e existe porque tem sentido no assunto.

Não há fade-and-slide-up em cada seção nem transição em cada cartão. Isso é o
padrão genérico, e ele dilui exatamente o momento que deveria chamar atenção.

Tudo dentro de `@media (prefers-reduced-motion: no-preference)`, com um bloco
`reduce` que desliga animação e transição.

---

## O que muda em relação ao site atual

| | Site atual | Protótipo | Por quê |
|---|---|---|---|
| Hero | Texto sobre a foto, com gradiente | Colunas separadas; no celular a foto vem primeiro | O texto sobre foto exige gradiente pesado para ficar legível, e no celular a solução atual precisa de `object-fit`, `width:145%` e `left:-39%` para a moto não ser cortada |
| Catálogo | Seis cartões, sem filtro | Filtro por categoria | Com seis modelos em quatro categorias, quem quer scooter não deveria rolar por trail |
| CTA no celular | Sai da tela ao rolar | Barra fixa no rodapé | É a única conversão do site |
| Ficha técnica | Lista `dl` discreta | Painel em grade, números grandes | Cilindrada e câmbio são o que decide a escolha |
| Escala tipográfica | Tamanhos soltos por breakpoint | Tokens `--t-12` a `--t-61`, razão 1,25 | Mudar a escala hoje exige caçar dezenas de `font-size` |
| Espaçamento | Números avulsos (8, 12, 14, 20, 22, 26…) | Escala base 4, `--e-1` a `--e-10` | Fecha o vocabulário e estabiliza o ritmo vertical |
| Ícone de seleção | — | Marca de conferido além da cor | Estado nunca só por cor |

---

## Um bug que vale registrar

Na primeira versão, o cabeçalho estourava a largura no celular: eu escondia a
navegação e mostrava o botão de menu, mas **esqueci de esconder o botão de
WhatsApp do cabeçalho**. Marca + botão + menu não cabem em 390px.

O que interessa não é o bug, é como ele foi encontrado. Olhar a captura de tela
não bastou: o Chrome headless no Windows trava a janela num mínimo de 469px por
causa do DPI de 125%, então a imagem saía **cortada** em 390px e parecia
exatamente igual a um estouro de layout. Duas causas diferentes, um sintoma só.

A resposta veio de medir, não de olhar: uma sonda que percorre todos os elementos
e lista os que passam da viewport reportou `scrollWidth == viewport` — ou seja,
não havia estouro naquela largura. O corte era da captura.

E a ferramenta certa para ver o celular de verdade acabou sendo o próprio
`index.html`: um `<iframe>` de 390px tem viewport de 390px, independente do que o
navegador faça com a janela.

Duas lições, e a segunda vale para muito além de CSS:

1. Ao esconder um elemento no celular, verifique **todos** os irmãos dele. O
   estouro veio do que ficou, não do que saiu.
2. **Captura de tela não é medição.** Quando o sintoma e o artefato da ferramenta
   se parecem, meça.

---

## Limites deste protótipo

Não é o site. É uma proposta visual para a Fase 3, feita em HTML puro para poder
ser avaliada sem build.

- **A fonte vem do Google Fonts.** O site real hospeda a Outfit localmente, e por
  bons motivos — privacidade, uma conexão a menos, e não depender de domínio de
  terceiro. Se esta direção for aprovada, a Archivo precisa ser baixada para
  `public/fonts/` antes de qualquer coisa ir ao ar.
- **Só duas telas**, e a ficha usa uma moto só.
- **Nenhum botão envia mensagem.** Os `href` apontam para âncoras da própria
  página.
- **Os dados são os mesmos de `lib/content.ts`**, com a copy reescrita para ser
  mais direta.

Se a direção for aprovada, a migração é: portar os tokens para `app/globals.css`,
depois converter cada bloco em componente React. As classes daqui já são
semânticas justamente para essa passagem ser mecânica.
