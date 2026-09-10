# Como pedir para uma IA

Este documento tem dois públicos.

Se você é **uma IA** com este repositório aberto: leia a seção final,
"Instruções para o agente". Ela é sobre você.

Se você é **uma pessoa** aprendendo a trabalhar com agentes: leia do começo. A
diferença entre um resultado bom e um retrabalho quase nunca está no modelo. Está
no pedido.

---

## Por que o pedido decide o resultado

Um agente não sabe o que você não disse. Ele preenche a lacuna com a suposição
mais provável — e a suposição mais provável raramente é a sua.

Um exemplo real, deste repositório. O pedido foi, na prática, "limpe o que é
código morto". O agente encontrou `next.config.ts` num projeto que não usa Next,
sem `next` nas dependências, e concluiu o óbvio: morto. Apagou.

O arquivo era lido pelo vinext. O `output: 'export'` dentro dele era o que fazia
o build emitir HTML. Sem ele, `vinext build` terminou com **"Build complete" e
código de saída zero**, sem escrever um único `.html`. A falha só apareceu dois
passos depois.

O pedido não estava errado. Estava **incompleto**: não dizia como verificar. Com
"e rode `npm run build && npm run verify` depois de cada remoção", o erro teria
durado trinta segundos em vez de sobreviver a um commit.

**A lição:** o pedido precisa incluir o critério de "está certo", não só o alvo.

---

## A anatomia de um pedido que funciona

Cinco partes. Nem todo pedido precisa das cinco, mas todo pedido ruim está
faltando pelo menos uma.

### 1. Contexto — onde e para quê

> Ruim: "arruma o header"
>
> Bom: "no `components/header.tsx`, o menu mobile não fecha quando o usuário
> clica num link âncora. Acontece no Safari iOS, não no Chrome."

### 2. O alvo — o que muda

> Ruim: "melhora a performance"
>
> Bom: "o `public/images/hero.webp` tem 138 KB e 1672px de largura, e um celular
> de 360px baixa ele inteiro. Quero um `srcset` com 3 larguras, mantendo
> nitidez em tela retina."

Números tornam a conversa verificável. "Melhor" não.

### 3. As restrições — o que não pode mudar

Esta é a parte que as pessoas mais esquecem, e a que mais economiza retrabalho.

> "Não adicione dependência. Não mexa em `components/ui/`. O site precisa
> continuar exportando estático — nada de rota de API."

Se a restrição já está numa invariante do README, **cite o número**: "respeite a
invariante 1". Encurta o pedido e força o agente a abrir o README.

### 4. A verificação — como saber que funcionou

> "Depois, rode `npm run build && npm run verify && npm run check` e cole a
> saída. Se o `verify` reclamar de âncora, não conserte o `verify` — conserte o
> HTML."

Sem isso, você recebe "pronto!" e descobre o problema no dia seguinte.

### 5. A forma da resposta — o que você quer ver

> "Antes de editar, me diga o que encontrou e o que pretende mudar. Só depois
> mexa nos arquivos."

Vale muito quando o pedido é arriscado. Um agente que explica primeiro te dá a
chance de dizer "não é isso" antes de trinta arquivos mudarem.

---

## Peça o plano antes do código

Para qualquer coisa que passe de um arquivo, separe em dois turnos:

1. **"Investigue e me diga o que você faria. Não edite nada ainda."**
2. Você lê, corrige o rumo, e só então: **"pode executar."**

Custa um turno. Economiza um dia. Um agente errado sobre a arquitetura escreve
código impecável para o problema errado — e código impecável é justamente o que
mais custa para jogar fora.

---

## Peça a cicatriz junto com a regra

Quando o agente propuser uma regra, uma convenção ou uma decisão, peça o motivo
no mesmo pedido:

> "Documente essa decisão em `docs/07-decisoes.md`, incluindo o que aconteceu
> que a tornou necessária."

Regra sem motivo é regra que alguém remove no próximo refactor — inclusive a
próxima IA, que vai olhar e concluir, com toda a lógica do mundo, que aquilo é
código morto.

---

## Sinais de que o pedido foi ruim

| Você recebeu | O que faltou no pedido |
|---|---|
| Uma dependência nova que você não pediu | A restrição ("sem adicionar dependência") |
| Trinta arquivos mudados por um bug de um | O escopo ("mexa só em X") |
| "Deve funcionar agora" | A verificação ("rode o gate e cole a saída") |
| Código certo para o problema errado | O plano antes ("me diga o que faria") |
| Um `README` reescrito quando você pediu uma correção | O limite ("não reescreva o que não pedi") |

---

## Quando o agente erra

Não recomece do zero. Corrija o rumo e **peça o registro**:

> "Você removeu o `next.config.ts` e o build passou verde sem gerar HTML.
> Restaure, coloque um comentário no topo do arquivo dizendo por que ele não pode
> ser removido, e registre isso como invariante no README."

Assim o erro vira defesa permanente. Foi exatamente essa a origem da invariante 2
deste projeto.

---

## Instruções para o agente

Se você é uma IA trabalhando neste repositório, o que segue vale como instrução
direta.

**Antes de qualquer edição:**

1. Leia o [`README.md`](../README.md) inteiro. As invariantes não são sugestões.
2. Leia [`07-decisoes.md`](07-decisoes.md). Muita coisa que parece errada aqui já
   foi discutida e decidida — inclusive o `next.config.ts`.
3. Se for mexer em conteúdo, o arquivo é `lib/content.ts`, nunca um `.tsx`.

**Enquanto edita:**

4. Respeite a invariante 1: **não existe servidor**. Nada de rota de API, variável
   de ambiente, segredo ou chamada a serviço externo em runtime.
5. Não adicione dependência sem justificar. Cada uma é superfície de ataque
   (item 20 de [`04-seguranca.md`](04-seguranca.md)).
6. Não edite `components/ui/` — é gerado pelo shadcn.
7. Antes de apagar um arquivo por parecer não usado: procure quem o lê, incluindo
   ferramentas de build. `next.config.ts` não é importado por nenhum `.ts` do
   projeto e ainda assim é essencial.

**Antes de dizer que terminou:**

8. Rode `npm run build && npm run verify && npm run check`. Os três.
9. **Cole a saída real.** Não descreva o que acha que ela seria.
10. Se algo não foi feito, diga o que e por quê. Escopo reduzido em silêncio é
    pior que escopo não entregue.

**Ao commitar** (só quando pedido):

11. Português, imperativo, com o porquê no corpo.
12. Nunca `Co-Authored-By:` nem atribuição de IA.

**O que nunca fazer sem perguntar:**

13. `git push --force`, reescrever histórico, apagar branch.
14. Publicar qualquer coisa fora do repositório.
15. Trocar os dados fictícios por dados reais (ver invariante 4).
