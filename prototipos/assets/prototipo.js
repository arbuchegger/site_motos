/* ============================================================
   Interações do protótipo. Sem dependência, sem build.

   Regra que vale para tudo aqui: o estado visual e o estado
   anunciado para leitor de tela mudam na MESMA linha. Trocar a
   cor sem trocar o aria- é o jeito mais comum de fazer uma
   interface bonita e inutilizável.
   ============================================================ */
(function () {
  'use strict';

  var raiz = document.documentElement;

  /* --- Tema -------------------------------------------------
     O shell passa ?tema=claro|escuro|sistema. Sem parâmetro, o
     protótipo segue o sistema operacional, como o site real. */
  var tema = new URLSearchParams(location.search).get('tema');
  if (tema === 'claro' || tema === 'escuro') raiz.setAttribute('data-tema', tema);

  /* --- Gaveta do celular ------------------------------------ */
  var gaveta = document.querySelector('.gaveta');
  var abrir = document.querySelector('.botao-menu');

  function definirGaveta(aberta) {
    if (!gaveta || !abrir) return;
    gaveta.dataset.aberta = String(aberta);
    abrir.setAttribute('aria-expanded', String(aberta));
    // Trava a rolagem do fundo enquanto a gaveta está por cima.
    document.body.style.overflow = aberta ? 'hidden' : '';
    if (aberta) {
      var primeiro = gaveta.querySelector('a, button');
      if (primeiro) primeiro.focus();
    } else {
      abrir.focus();
    }
  }

  if (gaveta && abrir) {
    abrir.addEventListener('click', function () {
      definirGaveta(gaveta.dataset.aberta !== 'true');
    });
    gaveta.addEventListener('click', function (evento) {
      // Fecha ao clicar no fundo, no X, ou em qualquer link de destino.
      if (evento.target.closest('.gaveta-fundo, [data-fechar], a')) definirGaveta(false);
    });
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && gaveta.dataset.aberta === 'true') definirGaveta(false);
    });
  }

  /* --- Filtro de categoria ----------------------------------
     Filtra no cliente, sem recarregar. Usa o atributo hidden em
     vez de display:none para que o cartão saia da árvore de
     acessibilidade junto com a tela. */
  var filtro = document.querySelector('.filtro');
  var contagem = document.querySelector('.contagem');

  if (filtro) {
    var cartoes = Array.prototype.slice.call(document.querySelectorAll('.cartao'));

    filtro.addEventListener('click', function (evento) {
      var botao = evento.target.closest('button');
      if (!botao) return;

      var alvo = botao.dataset.categoria;

      filtro.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === botao));
      });

      var visiveis = 0;
      cartoes.forEach(function (cartao) {
        var mostra = alvo === 'todas' || cartao.dataset.categoria === alvo;
        cartao.hidden = !mostra;
        if (mostra) visiveis++;
      });

      if (contagem) {
        contagem.textContent = visiveis === 1
          ? '1 modelo nesta categoria.'
          : visiveis + ' modelos nesta categoria.';
      }
    });
  }

  /* --- Galeria da ficha -------------------------------------
     Troca a foto principal e move o foco com as setas, como
     qualquer grupo de rádio nativo faria. */
  var galeria = document.querySelector('.galeria-miniaturas');
  var fotoPrincipal = document.querySelector('.galeria-principal img');
  var legenda = document.querySelector('.galeria-legenda');

  if (galeria && fotoPrincipal) {
    var botoes = Array.prototype.slice.call(galeria.querySelectorAll('button'));

    function selecionar(indice) {
      var botao = botoes[indice];
      if (!botao) return;
      var miniatura = botao.querySelector('img');

      fotoPrincipal.src = botao.dataset.grande;
      fotoPrincipal.alt = botao.dataset.alt || miniatura.alt;
      botoes.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === indice)); });
      if (legenda) legenda.textContent = botao.dataset.legenda || '';
      botao.focus();
    }

    galeria.addEventListener('click', function (evento) {
      var botao = evento.target.closest('button');
      if (botao) selecionar(botoes.indexOf(botao));
    });

    galeria.addEventListener('keydown', function (evento) {
      var passo = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
      if (!passo) return;
      evento.preventDefault();
      var atual = botoes.indexOf(evento.target.closest('button'));
      selecionar((atual + passo + botoes.length) % botoes.length);
    });
  }

  /* --- Partida do painel ------------------------------------
     Único movimento não pedido da página: as leituras acendem em
     sequência, como o cluster da moto no momento da ignição.
     O CSS já respeita prefers-reduced-motion; aqui só disparamos. */
  var painel = document.querySelector('.painel-grade');
  if (painel) requestAnimationFrame(function () { painel.dataset.partida = 'true'; });
})();
