# Leandro MotorFast — versão atual

Vitrine estática de aluguel diário da BMW R 1300 GS, com seis versões e páginas
individuais. A reserva e o atendimento acontecem pelo WhatsApp configurado em
`lib/content.ts`. Não há pagamento, upload de documentos ou cadastro dentro do site.

## Conteúdo e condições

- `lib/content.ts`: identidade, contato, preços, catálogo e textos principais.
- `components/home-sections.tsx`: FAQ, passos e textos resumidos no celular.
- `components/service-area.tsx`: João Pessoa e texto de retirada.
- Mínimo de uma diária e adiantamento de 50% do total, abatido do aluguel.
- Idade mínima de 18 anos; RG, CPF, CNH A e comprovante de residência de até 90 dias.
- Documentos em PDF ou foto legível pelo WhatsApp, sem coleta dentro do site.
- Roteiros de até 500 km além da região metropolitana de João Pessoa, a confirmar.
- Problemas com a moto dependem de registros, análise da seguradora e contrato.

Os preços visíveis são editáveis no catálogo. As imagens são ilustrativas e a
disponibilidade, o ano e os equipamentos devem ser confirmados na reserva.

## Layout e interações

A ordem da página é banner, motos, como funciona, onde estamos, FAQ e contato.
A paleta escura é fixa, independentemente do tema do navegador.

O banner tem três fotos: Light White, Racing Red e Triple Black. Cada foto abre
a página correspondente. Selecionar uma bolinha ou arrastar no celular pausa a
troca automática; um arrasto não deve abrir a página da moto. Os enquadramentos
do celular usam `object-position`.

No celular, os três passos ficam em uma linha. A localização mostra o mapa maior,
com texto e botão abaixo; no computador, mantém cartão de João Pessoa e mapa.
O marcador pulsa e a caixa da cidade aparece ao passar o mouse, sem fixar ao clicar.
O FAQ usa controles nativos expansíveis e respeita movimento reduzido.

Os estilos ficam em `app/globals.css` e `app/restored-sections.css`. A marca em
vetor está em `public/images/leandro-mark.svg`, com versões próprias de favicon.

## Imagens e mapa

O site serve os WebP de `public/images/bmw-r1300gs/`. Os banners finais foram
tratados com Real-ESRGAN (`realesrgan-x4plus`) e entregues em três larguras por
foto: 960, 1600 e 2752 px, ou 2048 px para a Racing Red.

`scripts/prepare-super-resolution.mjs` é uma ferramenta opcional de manutenção:
exige o pacote `sharp` disponível e os PNGs intermediários de Real-ESRGAN em
`output/super-resolution/`. Esses arquivos e a ferramenta externa não entram no
Git. O build normal usa os WebP versionados e não executa esse script.

O mapa usa a malha regional do IBGE em `public/images/nordeste-estados.geojson`.
`node scripts/prepare-map.mjs` regenera `public/images/mapa-nordeste.svg`, sem
dependência de mapa em runtime.
Fonte: https://servicodados.ibge.gov.br/api/v3/malhas/regioes/2?formato=application/vnd.geo%2Bjson&qualidade=minima&intrarregiao=UF

## Build e publicação

```sh
npm ci
npm run build
npm run verify
npm run check
npm run preview
```

`npm run preview` serve a prévia em http://localhost:4173/. O diretório de
hospedagem é `dist/client`; ele é reconstruído e não é versionado.

A indexação continua bloqueada por `robots: { index: false }` em `app/layout.tsx`.
O domínio definitivo e a ativação de indexação pertencem à etapa de publicação.
Enviar esta versão ao GitHub não altera essas configurações.

A referência de consumo (WMTC) nas fichas segue a fonte BMW indicada em cada
página; não é uma medição da frota no Brasil.
