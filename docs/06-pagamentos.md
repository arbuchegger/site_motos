# Pagamentos

**Este site não processa pagamento, e a decisão foi deliberada.** Este documento
existe para explicar o que seria preciso para mudar isso, e por que a escolha
óbvia é a errada.

---

## O bloqueio que já está no código

Antes de qualquer arquitetura, saiba que o gate atual **proíbe** pagamento por
asserção. Em `scripts/verify.mjs`:

```js
assert.doesNotMatch(html, /(?:Stripe|checkout|R\$|type="password")/i, file);
```

Todo HTML exportado é reprovado se contiver a palavra "Stripe", "checkout", um
valor em reais ou um campo de senha. Não é acidente: o gerador do projeto foi
instruído a produzir uma vitrine sem comércio, e escreveu o teste que garante
isso.

**Consequência prática:** no minuto em que você adicionar um botão de pagamento,
`npm run verify` falha. Isso é o comportamento correto. A remoção desse `assert`
não é um detalhe de implementação — é a decisão consciente de mudar o que o
produto é. Faça isso num commit próprio, com o motivo escrito.

---

## Por que "só chamar a API do gateway" não funciona

A resposta intuitiva é: instalar o SDK, colocar a chave, chamar a API. Ela está
errada, e vale entender exatamente por quê.

**Num site estático, todo código é código de cliente.** `npm run build` produz
arquivos que o navegador baixa. Não existe "lado do servidor" onde uma variável
possa viver. Uma chave secreta escrita no fonte:

- vai inteira para o bundle JavaScript;
- aparece em `view-source` e no DevTools;
- é indexada por buscadores que rastreiam arquivos `.js`;
- não é protegida por minificação, ofuscação, `base64` ou variável de ambiente
  do build — todos apenas mudam a aparência da string que o navegador recebe.

Com a chave secreta de um gateway, qualquer pessoa emite reembolso, lê a lista de
clientes e cria cobranças em nome do lojista.

E há um segundo problema, independente do primeiro: **o navegador não é uma fonte
confiável sobre o que foi pago.** Um "sucesso" que chega por redirecionamento de
volta ao site pode ser forjado digitando a URL. É por isso que existe webhook
assinado.

> **A regra:** nada é considerado pago sem um webhook assinado, verificado por um
> servidor. Nunca por retorno de navegador, print de tela ou conferência manual.

---

## As três arquiteturas possíveis

### A. Link de pagamento hospedado — sem servidor

O botão é um `<a href>` para uma URL do próprio gateway. Nada mais.

```
Visitante → clica → Stripe Payment Link / Mercado Pago Checkout Pro
                     (o gateway hospeda a página e processa tudo)
```

| | |
|---|---|
| **Segredo no projeto** | Nenhum. A URL é pública por design. |
| **Dado de cartão** | Nunca toca o site. Fica inteiramente com o gateway. |
| **Escopo de PCI-DSS** | O menor possível (SAQ-A). |
| **Site continua estático** | Sim. Invariante 1 preservada. |
| **Custo de implementação** | Uma linha em `lib/content.ts`. |

**O que você não tem:** valor dinâmico (o preço é fixo no link, criado à mão no
painel), webhook (ninguém no site fica sabendo do pagamento), e nenhuma
confirmação automática — o lojista confere no painel do gateway.

**Quando serve:** exatamente o caso deste site. Aluguel de moto é negociado
(prazo, caução, documentação), não comprado num clique. Um link de sinal ou
reserva com valor fixo cobre o cenário real sem introduzir servidor nenhum.

### B. Função de borda ao lado do estático — o meio-termo

Um endpoint pequeno cria a sessão de checkout e recebe o webhook. O site
continua estático; só esse endpoint roda.

```
Visitante → site estático → POST /api/checkout (Worker)
                                  ↓ chave secreta vive AQUI
                             Gateway → webhook assinado → Worker → registro
```

O projeto já tem o caminho aberto: `wrangler` e `@cloudflare/vite-plugin` estão
nas `devDependencies`, e `.openai/hosting.json` declara `d1: null, r2: null` —
ou seja, a estrutura para banco e storage existe, apenas desligada.

Um esqueleto do que o Worker precisa fazer — **não implementado, ilustrativo**:

```js
// O segredo vem do ambiente do Worker. Nunca do código, nunca com fallback.
// `env.STRIPE_SECRET` ausente deve derrubar o boot, não virar undefined.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/checkout' && request.method === 'POST') {
      // O VALOR NUNCA VEM DO CLIENTE. Ele é recalculado aqui, a partir
      // do catálogo do servidor. Aceitar o preço que o navegador mandou
      // é o bug clássico: o visitante edita e paga R$ 0,01.
      const { slug } = await request.json();
      const preco = precoDoCatalogo(slug);   // fonte da verdade: servidor
      if (!preco) return new Response('Modelo inválido', { status: 400 });
      // ...cria a sessão no gateway com `preco` e devolve a URL
    }

    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      // VERIFIQUE A ASSINATURA ANTES DE LER O CORPO.
      // Sem isso, qualquer um envia um POST dizendo "pago".
      const assinatura = request.headers.get('stripe-signature');
      const corpo = await request.text();
      if (!assinaturaValida(corpo, assinatura, env.STRIPE_WEBHOOK_SECRET)) {
        return new Response('Assinatura inválida', { status: 400 });
      }
      // ...só agora registre o pagamento
    }

    return new Response('Não encontrado', { status: 404 });
  },
};
```

Três coisas a notar nesse esqueleto, porque são os erros que aparecem sempre:

1. **O valor é recalculado no servidor.** O que o cliente manda é o *identificador
   do que ele quer*, nunca o *quanto custa*.
2. **A assinatura é verificada antes de o corpo ser interpretado.** Não depois.
3. **O segredo falha no boot se faltar.** `env.X || 'sk_test_...'` é vazamento
   escrito à mão.

**O preço:** a invariante 1 morre. O projeto passa a ter deploy de servidor,
variáveis de ambiente, logs, rotação de chave e um endpoint público que precisa
de rate limit. Não é "só um arquivinho a mais".

### C. Backend completo

Servidor próprio, banco, sessões, painel administrativo. Só se justifica quando
o produto precisa de reserva com estoque, contrato, histórico e conta de usuário
— ou seja, quando deixou de ser uma vitrine.

Nesse ponto, **os 20 itens de [`04-seguranca.md`](04-seguranca.md) que hoje "não
se aplicam" passam a se aplicar quase todos**: auth, autorização, cookies, rate
limit, validação de input, queries parametrizadas, uploads. Reler aquele
documento inteiro deixa de ser opcional.

---

## Comparação

| | A. Link hospedado | B. Função de borda | C. Backend |
|---|---|---|---|
| Servidor em produção | Não | Um endpoint | Sim |
| Segredo a proteger | Nenhum | 2 (API + webhook) | Muitos |
| Valor dinâmico | Não | Sim | Sim |
| Confirmação automática | Não | Sim (webhook) | Sim |
| Invariante 1 preservada | **Sim** | Não | Não |
| Itens de segurança ativos | 3 de 20 | ~8 de 20 | ~18 de 20 |
| Esforço | Minutos | Dias | Semanas |

---

## Contexto brasileiro

Se um dia isto sair do papel, alguns pontos específicos do Brasil:

- **Pix é o meio dominante** e o mais barato. Todo gateway grande daqui gera
  cobrança Pix com QR Code dinâmico e webhook de confirmação. Um QR Code estático
  no rodapé **não** é integração de pagamento: ninguém sabe quem pagou o quê.
- **Gateways com bom suporte a Pix:** Mercado Pago, Asaas, Pagar.me, Efí. O
  Stripe opera no Brasil mas com cobertura de Pix mais limitada.
- **Aluguel de veículo não é venda.** Envolve caução, contrato, verificação de
  CNH e responsabilidade civil. O fluxo de pagamento é a menor parte do problema
  — e provavelmente a última a resolver.
- **LGPD.** No momento em que o site coletar CPF, telefone ou endereço, ele passa
  a tratar dado pessoal: precisa de base legal, política de privacidade,
  finalidade declarada e um caminho para exclusão. Hoje o site não coleta **nada**
  — não há formulário, cookie, `localStorage` ou analytics. Essa é uma propriedade
  valiosa, e o primeiro campo de input a destrói.

---

## O que nunca fazer

| Nunca | Por quê |
|---|---|
| Chave secreta em código de front-end | Vai inteira para o navegador. Ofuscação não protege. |
| Confiar no redirecionamento de "sucesso" | Forjável digitando a URL. Só webhook assinado conta. |
| Aceitar o valor vindo do cliente | Recalcule no servidor a partir do catálogo. |
| Ler o corpo do webhook antes de checar a assinatura | Qualquer um envia um POST dizendo "pago". |
| `process.env.CHAVE \|\| 'sk_live_...'` | O fallback é o vazamento. |
| Guardar número de cartão | Não guarde. Deixe com o gateway. Guarde o `payment_id`. |
| Mostrar preço na vitrine sem alinhar com o lojista | Preço em site é oferta. Ver invariante 4. |

---

## Decisão atual

**Nada implementado.** O site segue com o WhatsApp como única conversão, e o
`assert` do `verify.mjs` segue no lugar, garantindo isso a cada build.

Se a decisão mudar, a ordem é: **A antes de B, sempre.** A maior parte dos
projetos que constroem B descobre depois que A resolvia — e que o custo real de B
não foi o código, foi tudo que passou a existir em volta dele.

Registro em [`07-decisoes.md`](07-decisoes.md).
