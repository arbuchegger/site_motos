# Git, branches e o que nunca versionar

## A cicatriz que abre este documento

O commit inicial deste repositório tinha **2.863 arquivos e 645 MB**. O site tem
**104 arquivos e 1,7 MB** de fonte.

A diferença era `work/npm-cache/`: o `_cacache` do npm, commitado inteiro. 619 MB
e 2.743 arquivos — 96% do repositório era o cache de download de dependências.
Mais `work/motorcycle-assets/`, 26 MB de PNGs originais cujas versões `.webp`
otimizadas já estavam em `public/images/`.

Não havia `.gitignore` na raiz. O único existente estava dentro de
`outputs/vertice-motos/` e suas regras `/outputs/` e `/work/` eram relativas a
ele mesmo — apontavam para `outputs/vertice-motos/outputs/`, que nunca existiu.
Um `.gitignore` que parecia proteger e não protegia nada.

Tudo que segue neste documento existe por causa disso.

---

## A regra

> **Nada que uma ferramenta consiga gerar de novo entra no git.**

| Entra | Não entra | Por quê |
|---|---|---|
| `package-lock.json` | `node_modules/`, `.npm/`, `_cacache` | O lockfile É a verdade das versões. O resto é download. |
| `app/globals.css` | `dist/`, `.vinext/` | Fonte versus produto do fonte. |
| `tsconfig.json` | `*.tsbuildinfo` | Config versus cache incremental do compilador. |
| `.env.example` **sem valores** | `.env`, `.env.local`, `*.pem` | O formato do segredo é público; o segredo não. |
| `public/images/*.webp` (1,1 MB no total) | masters PNG de 2 MB cada | O site serve o derivado. O master não agrega nada ao clone. |

O `.gitignore` da raiz codifica isso e traz a cicatriz escrita em comentário.
Leia-o: ele é documentação.

### Como saber se você está prestes a errar

```bash
git add -A
git status --short | wc -l          # esperava 3 arquivos? veio 2.700?
git diff --cached --stat | tail -1  # quantos KB entram neste commit?
```

Um commit de código-fonte que passa de alguns megabytes quase sempre está
levando algo que não devia.

---

## `.gitignore` não desrastreia nada

Este é o ponto que mais confunde, e foi exatamente o que aconteceu aqui.

`.gitignore` só decide sobre arquivos **que o git ainda não conhece**. Um arquivo
já rastreado continua rastreado para sempre, por mais que você o adicione ao
`.gitignore` depois.

São três estados distintos, e cada um exige uma ação:

| Estado | Ação | Resultado |
|---|---|---|
| Nunca foi commitado | `.gitignore` | Resolvido |
| Está no índice, mas você quer manter no disco | `git rm -r --cached <caminho>` | Sai dos próximos commits; continua no histórico |
| Está no histórico e infla o clone | reescrever o histórico | Sai de verdade |

Foi essa escada inteira que este repositório subiu.

---

## Reescrever histórico: quando, como e o preço

Depois de `git rm -r --cached work/`, o repositório ainda pesava **227 MB no
clone**. Os blobs continuavam dentro do `Initial commit`. Git é imutável por
design: apagar um arquivo cria um commit novo que diz "não tem mais", mas não
remove o que já foi gravado.

O comando:

```bash
pip install git-filter-repo
git bundle create ../backup.bundle --all      # backup ANTES. Sempre.
git filter-repo --force --invert-paths --path work/
git remote add origin <url>                   # filter-repo remove o remote
```

Medido neste repositório: **227 MB → 1,4 MB**, com os commits e suas mensagens
preservados.

**Ainda não aplicado na `main`.** O motivo está em [`07-decisoes.md`](07-decisoes.md),
decisão D4, e é instrutivo: reescrever o histórico deixou a branch sem ancestral
comum com a `main` publicada, e sem ancestral comum o GitHub não abre pull
request. Reescrita de histórico e revisão por PR competem entre si — quem
reescrever primeiro perde a segunda.

### O preço

Reescrever histórico **troca o hash de todos os commits afetados**. Quem já tinha
clonado fica com um histórico divergente e precisa refazer o clone. O push exige
`--force`, que sobrescreve o que está no servidor.

Só aceite esse preço quando as três forem verdade:

1. Você tem backup (`git bundle create`).
2. Você sabe quem mais clonou — e consegue avisar.
3. O ganho justifica. 227 MB → 1,4 MB justifica. Corrigir um erro de digitação em
   mensagem de commit não justifica.

**Nunca reescreva histórico de branch compartilhada sem combinar antes.**

### Se o que vazou foi um segredo

Reescrever o histórico **não conserta** um segredo vazado — apenas limpa. Um
segredo que foi commitado deve ser tratado como comprometido no instante em que
o commit existiu, mesmo que nunca tenha ido para o remote.

A ordem é: **rotacionar a chave primeiro, limpar o histórico depois.** Nunca o
contrário. Ver item 2 de [`04-seguranca.md`](04-seguranca.md).

---

## Branches

`main` é sempre publicável. Nada é commitado direto nela.

```
main
 └── <tipo>/<assunto-curto-em-kebab>
```

| Prefixo | Para |
|---|---|
| `feat/` | funcionalidade nova |
| `fix/` | correção de bug |
| `refactor/` | muda a forma, não o comportamento |
| `docs/` | só documentação |
| `chore/` | infraestrutura, config, dependências |

Exemplos reais deste repositório: `chore/higiene-do-repo`.

**Uma branch, um assunto.** Se no meio do trabalho você achar um bug não
relacionado, anote e abra outra branch. Uma branch que faz duas coisas produz um
PR que ninguém revisa direito e um `revert` que derruba a coisa errada.

**Puxe a `main` antes de começar.** `git switch main && git pull && git switch -c
feat/o-que-for`. Branch que nasce velha vira conflito depois.

---

## Commits

Formato:

```
<tipo>: <o que muda, imperativo, minúsculo>

<por que muda. O diff já mostra o quê.>

<se nasceu de um erro: descreva o erro. É isso que impede a repetição.>

<se houver verificação: cole o comando e a saída.>
```

Exemplo real, do commit `7df3046` deste repositório:

```
fix: restaura next.config.ts, que nao era codigo morto

Na Fase 0 apaguei o arquivo por parecer sobra de Next num projeto
que roda em Vite + vinext. Estava errado: o vinext le next.config.ts
e e o `output: 'export'` dele que faz o build emitir HTML estatico.

O modo como isso falha e o que torna a licao util: sem o arquivo,
`vinext build` termina com "Build complete" e codigo de saida zero,
mas nao escreve nenhum .html.

Verificado depois da restauracao:
  npm run build   -> 8 paginas em dist/client
  npm run verify  -> 237 referencias locais e 30 links de WhatsApp
  npm run check   -> tsc --noEmit sem erros
```

Regras firmes:

- **Português**, imperativo, minúsculo depois do prefixo.
- **Um commit, uma ideia.** Se a mensagem precisa de "e também", são dois commits.
- **Nunca `Co-Authored-By:`** nem qualquer atribuição de IA. O autor é a pessoa.
- **Commite só quando pedido.** Terminar uma tarefa não autoriza commitar.
- **`--no-verify` é proibido.** Se um hook reprovou, conserte a causa.
- **Confira o diff antes.** Procure por `sk_`, `whsec_`, `Bearer `, `postgres://`,
  e por qualquer arquivo que você não reconheça.

---

## Pull request

O corpo do PR responde três perguntas, nesta ordem:

1. **O que muda para quem usa o site?** Se nada muda, diga isso.
2. **Por que desta forma?** Que alternativa você considerou e descartou.
3. **Como você verificou?** Comando e saída colada. "Testei" não é resposta.

Antes de abrir:

```bash
npm run build && npm run verify && npm run check
```

Um PR sem essa saída colada é um PR que pede ao revisor para rodar o gate por
você.

---

## Erros comuns e o que fazer

| Situação | Saída |
|---|---|
| Commitei na `main` sem querer | `git switch -c feat/x && git switch main && git reset --hard origin/main` |
| Commitei um arquivo grande, ainda não dei push | `git reset --soft HEAD~1`, ajuste, commite de novo |
| Commitei um segredo | **Rotacione a chave agora.** Depois limpe o histórico. |
| Preciso trocar a última mensagem | `git commit --amend` — só se ainda não deu push |
| Quero salvar o trabalho e trocar de branch | `git stash push -m "o que é"` |
| Não sei se vou quebrar algo | `git bundle create ../backup.bundle --all` antes |

Nada disso é irrecuperável enquanto você não der `push --force`. Esse é o único
comando aqui que apaga trabalho alheio.
