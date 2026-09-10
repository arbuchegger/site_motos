# Registro de decisões

Uma decisão por seção, em ordem cronológica. Cada uma responde quatro perguntas:
**contexto** (o que era verdade antes), **decisão** (o que passou a valer),
**consequência** (o que isso custou ou liberou) e, quando houver, **cicatriz** (o
que deu errado e tornou a decisão necessária).

Regra sem motivo é regra que alguém remove no próximo refactor. Por isso o motivo
mora aqui, e não na cabeça de quem estava presente.

---

## D1 — `.gitignore` na raiz

**Data:** 2026-09-09 · **Commit:** `d8683dc` · **Status:** aplicada

**Contexto.** O repositório não tinha `.gitignore` na raiz. O único existente
ficava em `outputs/vertice-motos/`, e suas regras `/outputs/` e `/work/` eram
relativas a ele mesmo — apontavam para `outputs/vertice-motos/outputs/`, um
caminho que nunca existiu. Um arquivo que parecia proteger e não protegia nada.

**Decisão.** Um `.gitignore` na raiz, organizado por categoria, com a cicatriz
escrita em comentário dentro do próprio arquivo.

**Consequência.** Impede a reincidência. **Não** desfaz nada — arquivo já
rastreado continua rastreado. Foi preciso D2 e D4 para isso.

**Cicatriz.** O commit inicial levou `work/npm-cache/`: 619 MB e 2.743 dos 2.863
arquivos versionados, num projeto cujo fonte tem 1,7 MB.

---

## D2 — Achatar o projeto para a raiz

**Data:** 2026-09-10 · **Commit:** `3ea078b` · **Status:** aplicada

**Contexto.** O site vivia em `outputs/vertice-motos/`, com `work/` ao lado
guardando insumos. Essa é a estrutura de trabalho da ferramenta que gerou o
projeto — `outputs` e `work` são conceitos do gerador, não do produto.

**Decisão.** Subir tudo para a raiz. Um repositório, um app, `package.json` onde
qualquer pessoa espera encontrar.

**Alternativa considerada.** Manter o site em `site/` e `docs/` ao lado. Faz
sentido se um segundo projeto (um backend, por exemplo) for entrar no mesmo
repositório. Descartada porque a invariante 1 diz que não haverá servidor — e
estrutura para um futuro que a arquitetura proíbe é complexidade sem retorno.

**Consequência.** Qualquer ferramenta de front-end que espera `package.json` na
raiz passa a funcionar sem configuração. Commits antigos referenciam caminhos que
não existem mais; o mapeamento está em [`01-estrutura.md`](01-estrutura.md).

---

## D3 — Remover os PNGs masters, preservar os prompts

**Data:** 2026-09-10 · **Commit:** `3ea078b` · **Status:** aplicada

**Contexto.** `work/motorcycle-assets/` tinha 13 PNGs de cerca de 2 MB cada,
26 MB no total. São os arquivos originais das imagens; os `.webp` derivados em
`public/images/` somam 1,1 MB e são o que o site realmente serve. Junto deles
havia dois JSONs de 24 KB com os prompts que geraram cada imagem.

**Decisão.** PNGs saem do repositório. Os JSONs de prompt viram documentação em
`docs/prompts-imagens-*.json`.

**Raciocínio.** Os `.webp` são o produto; os PNGs são insumo de uma etapa que já
terminou. Versionar 26 MB num projeto de 1,7 MB é exatamente o hábito que este
repositório deveria ensinar a não ter. Os prompts, ao contrário, são baratos e
reproduzíveis: com eles qualquer pessoa regenera as imagens ou cria uma nova moto
no mesmo estilo visual.

**Consequência.** Se for preciso um recorte diferente ou uma resolução maior, o
master não está mais aqui — regenera-se pelo prompt. É uma troca consciente:
26 MB no clone de todo mundo, para sempre, contra um retrabalho eventual.

**Dívida gerada.** Os JSONs carregam caminhos absolutos da máquina de origem
(`C:/Users/artur/...`). Inofensivos, mas é a categoria de coisa que se vaza sem
perceber. Limpar na Fase 2.

---

## D4 — Reescrever o histórico

**Data:** 2026-09-10 · **Status:** validada localmente, pendente na `main`

**Contexto.** Depois de D1 e D2, o índice estava limpo — mas `git clone` ainda
baixava **227 MB**. Os blobs continuavam dentro do `Initial commit`. Git é
imutável: apagar um arquivo cria um commit que diz "não tem mais", sem remover o
que já foi gravado.

**Decisão.** `git filter-repo --invert-paths --path work/`, precedido de
`git bundle create --all` como backup.

**Medido.** **227 MB → 1,4 MB**, com os commits e suas mensagens preservados.

**Por que ainda não está na `main`.** O `filter-repo` troca o hash de todo commit
afetado, inclusive o `Initial commit`. Isso deixou a branch **sem ancestral
comum** com a `main` publicada — e sem ancestral comum o GitHub não abre pull
request ("There isn't anything to compare").

A escolha foi entre force-push imediato na `main` e um PR revisável. Ficou o PR:
os commits foram reaplicados sobre a `main` original, e a remoção de `work/`
virou um commit próprio, onde as 2.758 deleções aparecem na tela de quem revisa.
Num repositório que serve de material de mentoria, ver a limpeza acontecer vale
mais do que tê-la pronta.

**Consequência.** Até o merge, `git clone` continua baixando 227 MB. O commit de
remoção tira do índice, não do histórico.

**Passo pendente, depois do merge:** rodar o `filter-repo` na `main` e dar
`push --force`. É ação destrutiva num repositório de terceiro — combinar com o
dono antes, e avisar quem já clonou. Ver [`02-git-e-branches.md`](02-git-e-branches.md).

---

## D5 — `next.config.ts` fica, e ganha um aviso

**Data:** 2026-09-10 · **Commit:** `7df3046` · **Status:** aplicada, revertendo erro

**Contexto.** O projeto roda em Vite + vinext. `next` não está nas dependências.
Um `next.config.ts` exportando `NextConfig` parecia, por toda evidência
disponível, sobra de um scaffold de Next.

**Erro.** Foi removido em D2.

**O que aconteceu.** O vinext **lê** `next.config.ts` — `loadNextConfig`, em
`node_modules/vinext/dist/cli.js` — e o `output: 'export'` de dentro dele é o que
faz o build emitir HTML estático.

O modo de falhar é o que torna isto útil de registrar: `vinext build` terminou
com **"Build complete" e código de saída zero**. Não avisou nada. Apenas
classificou `/` como `Unknown` e não escreveu nenhum `.html`. A falha só apareceu
no passo seguinte, num `ENOENT` do `prepare-static.mjs` procurando
`dist/client/motos`.

**Decisão.** Restaurar o arquivo com um comentário de cabeçalho explicando por
que ele existe, e promover isso a **invariante 2** do README.

**Consequência.** Duas lições, e a segunda é a que importa mais:

1. Um arquivo pode ser essencial sem ser importado por nenhum `.ts` do projeto.
   Ferramentas de build leem arquivos por convenção de nome.
2. **Código de saída zero não é prova de que o produto foi construído.** Foi por
   isso que `npm run verify` — que inspeciona o HTML exportado, não o fonte —
   virou parte obrigatória do gate.

---

## D6 — Documentação no README, sem `CLAUDE.md`

**Data:** 2026-09-10 · **Status:** aplicada

**Contexto.** A convenção de agentes é um `CLAUDE.md` na raiz com as instruções
do projeto, separado do `README.md` voltado a pessoas.

**Decisão.** Um `README.md` só, servindo aos dois públicos, com `docs/` ao lado.
As instruções específicas para agentes ficam numa seção de
[`03-como-pedir-para-ia.md`](03-como-pedir-para-ia.md).

**Raciocínio.** Dois arquivos de instrução divergem. Sempre. Alguém atualiza um e
esquece o outro, e a partir daí ninguém sabe qual vale. Como este repositório é
material de mentoria, a documentação **é** o produto — e produto duplicado é
produto errado.

**Consequência.** Agentes que procuram `CLAUDE.md` automaticamente não encontram
nada. Mitigação: o `README.md` é a porta de entrada padrão de qualquer
ferramenta, e a primeira seção dele diz explicitamente para onde uma IA deve ir.

---

## D7 — Pagamentos: documentar, não implementar

**Data:** 2026-09-10 · **Status:** aplicada

**Contexto.** O pedido incluía "direcionar como conectar APIs de pagamento".

**Decisão.** [`06-pagamentos.md`](06-pagamentos.md) compara três arquiteturas com
o custo real de cada uma. Nenhum código de pagamento entra. A invariante 1 —
não existe servidor — segue de pé.

**Raciocínio.** Um site estático não tem onde guardar segredo. Implementar
pagamento aqui significa introduzir servidor, e isso muda o que o produto é: os
20 itens de [`04-seguranca.md`](04-seguranca.md) que hoje "não se aplicam"
passariam a se aplicar quase todos. É uma decisão de produto, não uma tarefa de
implementação — e não é minha para tomar.

**Consequência.** O `assert.doesNotMatch(html, /Stripe|checkout|R\$|password/i)`
em `scripts/verify.mjs` continua reprovando qualquer HTML com vocabulário de
pagamento. Isso é o comportamento correto: quem for implementar tem que remover
o `assert` num commit próprio, escrevendo o motivo. A barreira é intencional.

---

## D8 — Manter as dependências em beta

**Data:** 2026-09-10 · **Status:** aceita como dívida

**Contexto.** O projeto depende de `vinext@1.0.0-beta.5` e `vite@8.0.13`. Beta e
pré-release mudam sem aviso e sem compromisso de compatibilidade.

**Decisão.** Manter. Não migrar para Next ou Astro agora.

**Raciocínio.** A migração é grande, o site funciona, e o objetivo desta etapa é
higiene e documentação — não troca de stack. Trocar framework enquanto se
reorganiza estrutura mistura duas mudanças arriscadas no mesmo intervalo, e
quando algo quebra ninguém sabe qual das duas causou.

**Consequência.** `npm ci` pode quebrar sem que nada no projeto tenha mudado. As
versões estão **fixadas** (`"vinext": "1.0.0-beta.5"`, sem `^`) e o
`package-lock.json` é commitado, então uma instalação limpa reproduz o que
funcionava. Ver item 20 de [`04-seguranca.md`](04-seguranca.md).

**Gatilho para revisitar.** Um `npm ci` que falhe, ou uma necessidade real que o
vinext não suporte.

---

## D9 — Protótipo hi-fi como um arquivo só, gerado, fora do build

**Data:** 2026-09-10 · **Status:** proposta, aguardando aprovação

**Contexto.** A Fase 3 precisa de uma direção visual antes de converter qualquer
componente, e quem aprova o visual nem sempre roda `npm`.

**Decisão.** Um único HTML autocontido — fonte e imagens em base64, roteamento
interno, duas telas (home e ficha) — gerado por `prototipos/gerar-standalone.mjs`
a partir de `prototipos/src/`. Nada entra no build do site.

**Por que um arquivo só.** Ele abre por clique duplo e pode ser mandado por
e-mail ou WhatsApp. Quem avalia não instala nada, não roda servidor e não precisa
de rede.

**Por que gerado.** 1,4 MB de base64 no meio do código tornaria o fonte ilegível
e o diff impossível de revisar. O gerador é substituição de marcadores em Node
puro, sem dependência, e falha se sobrar algum.

**Por que o gerado não é versionado.** É a invariante 9 aplicada onde é tentador
abrir exceção: 1,4 MB a cada ajuste de design, e o git guarda o blob inteiro por
versão. Versionado fica o que não se regenera — fonte, tipografia e gerador.

**Duas direções foram tentadas.** A primeira usava vocabulário de painel de
instrumentos: cantos retos, grade técnica, âmbar de sinalização, números
tabulares e uma tela de Design System. Foi **reprovada** por parecer exercício de
portfólio em vez de negócio real. A segunda segue
[dwimoveisjp.vercel.app](https://dwimoveisjp.vercel.app), um site de imobiliária
de bairro: foto sangrando, preço visível, selos de confiança, dúvidas, WhatsApp
flutuante, cantos arredondados. O Design System saiu — não tinha função num
protótipo de duas telas.

**Decidido e medido:** uma cor de marca só (`#0E7A3C`), verde porque a única
conversão é WhatsApp; 5,43:1 com branco por cima e 5,02:1 como texto, os dois
papéis num token. Ritmo de fundo alternando faixa clara, quente e escura, para a
página não virar um bloco monocromático. E nenhuma moldura de ferramenta: o
arquivo é o site, e o responsivo é `@media` comum.

**Consequência.** Existe um segundo CSS no repositório, e ele **vai** divergir do
site. É dívida aceita e datada: aprovada, os tokens migram para
`app/globals.css` e `prototipos/` some; reprovada, some do mesmo jeito.

---

## Decisões pendentes

Registradas para não se perderem. Nenhuma foi tomada.

| # | Questão | Bloqueia |
|---|---|---|
| P1 | Publicar com dados reais de empresa? Envolve remover `robots: index:false`, trocar telefone e endereço, revisar todo texto que hoje diz "ilustrativo". | Uso em produção |
| P2 | `npm run lint` entra no gate? São 34 erros herdados, a maioria em `components/ui/` que o site não usa. Podar os não usados provavelmente resolve quase tudo. | Fase 2 |
| P3 | Podar os 58 componentes `components/ui/` não usados? Ganho de clareza contra ter que rodar o `shadcn add` de novo se precisar de um deles. | Fase 2 |
| P4 | Expandir o `globals.css` minificado (16 KB em 22 linhas)? É pré-requisito para qualquer trabalho sério de design. | Fase 3 |
| P5 | Adicionar Open Graph e Twitter Card? Cada link compartilhado no WhatsApp — a única conversão do site — hoje aparece sem imagem e sem título. | Fase 3 |
| P6 | Publicar preço no site? O protótipo mostra "R$ 690 por mês"; o site atual diz "sob consulta". É decisão comercial, não de layout: preço público muda a negociação e conflita com a invariante 4 enquanto os dados forem fictícios. | Fase 3 |
