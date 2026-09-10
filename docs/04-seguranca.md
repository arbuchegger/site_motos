# Segurança — checklist 1 a 20

Aplique ao escrever o código, não numa auditoria depois.

Este é um checklist genérico de aplicação web, aplicado a **este** projeto. A
maior parte dos itens **não se aplica**, e isso é a informação mais importante do
documento: onde um item não se aplica, o motivo está escrito. Não implemente o
substituto errado por analogia.

## O que este projeto é, do ponto de vista de segurança

Um site **estático**. `npm run build` produz arquivos em `dist/client` e acabou.
Não há processo rodando em produção, não há banco, não há sessão, não há nenhum
lugar onde um segredo pudesse morar.

Isso elimina de uma vez SQL injection, mass assignment, sequestro de sessão,
escalonamento de privilégio, SSRF e vazamento de dados por API. Não por
competência — por ausência de superfície.

Restam **três** superfícies reais. Elas são o conteúdo útil daqui:

| # | Superfície | Por quê |
|---|---|---|
| **2** | O que se commita | O único jeito de vazar segredo num projeto sem segredo é commitando um. |
| **18/19** | Cabeçalhos e HTTPS | Definidos na hospedagem, não no código. Fáceis de esquecer justamente por isso. |
| **20** | Cadeia de dependências | 558 pacotes instalados. É a superfície de ataque de verdade deste projeto. |

---

## Segredos

### 1. Esconder API keys

**Aplica-se por ausência.** O projeto não tem nenhuma chave, e a invariante 1 do
README existe para que continue assim.

O ponto que a pessoa precisa entender antes de propor qualquer integração:
**num site estático, todo código é código de cliente.** Não existe "esconder"
uma chave aqui. Qualquer string no fonte vai inteira para o navegador, e
`view-source` a exibe.

Se um dia o projeto precisar de um segredo, a resposta não é ofuscar — é
introduzir um servidor. As opções estão em [`06-pagamentos.md`](06-pagamentos.md).

### 2. Limpar secrets do git

**Aplica-se, e é o item nº 1 deste projeto.**

Segredo commitado é segredo vazado. Vale mesmo que você apague no commit
seguinte, mesmo que nunca tenha dado push, mesmo que o repositório seja privado.
No instante em que o objeto existiu no `.git`, ele saiu do seu controle.

A ordem é sempre:

1. **Rotacione a chave.** Agora. Antes de qualquer outra coisa.
2. Limpe o histórico (`git filter-repo`) — isso é faxina, não conserto.
3. Descubra como entrou e feche o caminho.

Antes de todo commit, confira o diff por `sk_`, `whsec_`, `Bearer `,
`postgres://`, `AKIA`, `-----BEGIN`.

O `.gitignore` da raiz já ignora `.env*` e força `.env.example` de volta com `!`.
O `.env.example` é commitado **sem valores** — ele documenta o formato, nunca o
conteúdo.

_Cicatriz relacionada: este repositório já commitou 619 MB de cache do npm por
falta de `.gitignore` na raiz. Não era segredo, mas foi o mesmo mecanismo — nada
olhando o que entrava. Ver [`02-git-e-branches.md`](02-git-e-branches.md)._

---

## Banco de dados

### 3. Chave pública de banco / 4. RLS (Row Level Security)

**Não se aplica. Não existe banco.**

Estes dois itens são postura de Supabase e Firebase, onde o navegador conversa
direto com o banco usando uma chave pública, e a RLS é a única coisa entre um
usuário e a tabela inteira.

Aqui não há banco, nem cliente de banco, nem chave. O catálogo é um array
TypeScript em `lib/content.ts`, compilado para dentro do HTML no build.

_Se algum dia surgir um caminho navegador → banco, a RLS deixa de ser opcional e
passa a ser a primeira coisa a configurar, antes da primeira linha de código._

### 13. Queries parametrizadas

**Não se aplica.** Não existe query. Não existe SQL. Não concatene string em
query no dia em que existir.

---

## Dados

### 5. Criptografia de dados

**Aplica-se parcialmente.**

Em trânsito: **HTTPS obrigatório** (ver item 19). Em repouso: não há dado em
repouso. O site não coleta nada — não há formulário, não há campo de input, não
há `localStorage`, não há cookie, não há analytics.

O usuário sai do site para o WhatsApp, e a partir daí a conversa é entre ele e o
lojista, com a criptografia do WhatsApp. **Nenhum dado pessoal passa por este
projeto em momento algum.** Essa é uma propriedade de design, e vale defendê-la:
o primeiro formulário de contato que alguém adicionar a destrói.

---

## Autenticação e autorização

### 6. Auth no servidor / 7. Restringir acessos / 9. Proteger cookies / 10. Hash nas senhas

**Nenhum se aplica. Não há usuário, sessão, login, cookie ou senha.**

Todas as páginas são públicas e idênticas para todo mundo. Não há nada a
autorizar porque não há nada restrito.

O que precisaria de tratamento equivalente **se** um dia houver área
administrativa: a autenticação teria que morar num servidor de verdade.
Esconder um botão não é autorização, e num site estático **todo** o HTML já está
no computador de quem visita — inclusive o de uma página "escondida".

### 8. Bloquear mass assignment / 14. Validação de inputs / 17. Enxugar respostas de API

**Não se aplicam. Não há input, nem endpoint, nem resposta de API.**

O único dado que sai do site é a mensagem pré-montada na URL do WhatsApp, e ela
vem de constantes em `lib/content.ts` — nunca de algo que o usuário digitou.

_No dia em que existir um campo de texto: valide no servidor. Validação de
cliente é conveniência de UX; num site estático ela é apenas decoração, porque o
cliente é totalmente controlável por quem visita._

### 15. Não vazar conteúdo

**Aplica-se de forma invertida, e vale prestar atenção.**

Num site estático não há "vazar por resposta de API" — mas **tudo que entra no
build é público**. Um comentário no código, uma URL de homologação, um e-mail
interno, um caminho de arquivo com o nome de usuário de quem gerou: tudo isso vai
para o HTML e fica lá.

_Dívida real: os JSONs de prompt em `docs/` carregam caminhos absolutos da
máquina de quem gerou as imagens (`C:/Users/artur/...`). São inofensivos, mas são
exatamente a categoria de coisa que se vaza sem perceber. Registrado como dívida
da Fase 2._

---

## Abuso

### 11. Rate limit / 12. Proteção contra bot

**Não se aplicam.** Não há operação a limitar: não há cadastro, envio, compra ou
qualquer ação que consuma recurso do lado do site.

O que sobra é abuso de banda em arquivos estáticos, e isso é problema da
hospedagem, não do código. Qualquer CDN resolve.

### 16. Restringir uploads

**Não se aplica — por design, não por sorte.** Não há upload. As imagens são 13
arquivos `.webp` versionados em `public/images/`.

_Isto é uma decisão de arquitetura que vale proteger: no minuto em que existir
upload de foto de moto, aparecem validação de tipo real (não da extensão), limite
de tamanho, reprocessamento da imagem e armazenamento fora do domínio do site._

---

## Entrega

### 18. Security headers

**Aplica-se, e é o item mais fácil de esquecer, porque não está no código.**

Um site estático não tem como definir cabeçalho HTTP por si só — quem define é a
hospedagem. Configure lá:

| Cabeçalho | Valor sugerido para este site |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' data:; font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

A CSP acima é restritiva de propósito e o site a satisfaz hoje: fonte
self-hosted, imagens locais, nenhum script de terceiro, nenhum iframe.
`'unsafe-inline'` em `style-src` é necessário enquanto o React emitir estilo
inline; some quando isso mudar.

**Reconfira a CSP depois de qualquer mudança que adicione script ou domínio
externo.** Um pixel de analytics quebra a política inteira, e o sintoma é
silencioso.

O `scripts/preview.mjs` já envia `X-Content-Type-Options: nosniff`, mas ele é
**só prévia local** e nunca vai para produção. Não confunda o comportamento dele
com o da hospedagem.

### 19. Forçar HTTPS

**Aplica-se.** HSTS ligado, redirecionamento de HTTP para HTTPS, e nenhum recurso
`http://` na página. O site hoje não referencia nenhum domínio externo — confira
que continua assim antes de publicar.

### 20. Cuidado com dependências

**Aplica-se, e é a maior superfície de ataque real deste projeto.**

`npm ci` instala **558 pacotes**. Cada um roda com as suas permissões durante o
build, e o que eles produzem vai direto para o HTML que os visitantes baixam.
Um pacote comprometido não precisa de servidor para causar dano — ele injeta o
que quiser no build.

Regras:

- **Versões fixadas.** Olhe o `package.json`: as dependências estão em versão
  exata (`react: "19.2.6"`), não em faixa. `package-lock.json` é commitado.
- **Toda dependência nova precisa de justificativa escrita** no PR. "Facilita" não
  é justificativa; economizar trinta linhas de código não paga uma cadeia
  transitiva inteira.
- **Antes de instalar**, confira: o nome está escrito exatamente certo
  (typosquatting vive disso), a última publicação é recente, há mais de um
  mantenedor, e o repositório existe.
- **Nunca instale um pacote sugerido por resultado de busca** sem confirmar que é
  o oficial.
- `npm audit` faz parte da revisão de dependência.

Este projeto usa dependências em beta (`vinext@1.0.0-beta.5`) e uma pré-release
de Vite. É uma escolha consciente do gerador original, e é dívida: beta muda sem
aviso. Registrado em [`07-decisoes.md`](07-decisoes.md).

---

## Resumo em uma tela

| # | Item | Status aqui |
|---|---|---|
| 1 | Esconder API keys | Não há chaves. Num site estático, esconder é impossível. |
| 2 | Limpar secrets do git | **Ativo.** Principal risco. |
| 3 | Chave pública de banco | Não se aplica — sem banco |
| 4 | RLS | Não se aplica — sem banco |
| 5 | Criptografia | HTTPS. Nenhum dado em repouso. |
| 6 | Auth no servidor | Não se aplica — sem usuários |
| 7 | Restringir acessos | Não se aplica — tudo é público |
| 8 | Mass assignment | Não se aplica — sem escrita |
| 9 | Cookies | Não se aplica — nenhum cookie |
| 10 | Hash de senha | Não se aplica — sem senha |
| 11 | Rate limit | Não se aplica — problema da hospedagem |
| 12 | Anti-bot | Não se aplica |
| 13 | Queries parametrizadas | Não se aplica — sem SQL |
| 14 | Validação de input | Não se aplica — sem input |
| 15 | Não vazar conteúdo | **Ativo, invertido:** tudo no build é público |
| 16 | Restringir uploads | Não se aplica — sem upload, por design |
| 17 | Enxugar respostas | Não se aplica — sem API |
| 18 | Security headers | **Ativo.** Configurar na hospedagem. |
| 19 | Forçar HTTPS | **Ativo.** Configurar na hospedagem. |
| 20 | Dependências | **Ativo.** 558 pacotes. Maior superfície. |
