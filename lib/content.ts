// EDITE AQUI: identidade, contatos, textos e catálogo. Não é necessário painel.
export const site = {
  name: 'Vértice', descriptor: 'Motos', fullName: 'Vértice Motos',
  logoImage: '', // Opcional: /images/sua-logo.svg. Vazio usa a marca tipográfica.
  whatsapp: '5500000000000', // País + DDD + número, somente dígitos. Número fictício.
  phone: '+5500000000000', phoneDisplay: '(00) 00000-0000',
  address: { street: 'Av. Horizonte, 240, Centro', city: 'Cidade Exemplo, BR' },
  hours: { weekdays: 'Segunda a sexta, 8h às 18h', saturday: 'Sábado, 8h às 12h' },
  heroImage: '/images/hero.webp',
  generalMessage: 'Olá! Vi o site da Vértice Motos e gostaria de saber mais sobre o aluguel de motos.',
  motorcycleMessage: 'Olá! Tenho interesse na {moto} que vi no site. Gostaria de saber o valor e a disponibilidade.',
};
export const copy = {
  heroEyebrow: 'Aluguel de motos. Liberdade para ir.',
  heroTitle: 'Sua próxima moto', heroTitleSecond: 'está', heroTitleAccent: 'aqui.',
  catalogTitle: 'Nossas motos', howTitle: 'Como funciona',
  howDescription: 'Da escolha à conversa, sem complicação.',
  contactTitle: 'Seu próximo caminho começa numa conversa',
  contactDescription: 'Conte para a gente qual moto combina com você. A gente conversa sobre o resto.',
  footerTagline: 'Seu caminho. Sua escolha.',
  heroDescription: 'Para a rotina ou para novos caminhos. Escolha sua moto e consulte as condições diretamente pelo WhatsApp.',
  catalogDescription: 'Uma moto para cada jeito de seguir. Encontre a sua.',
  consultationNote: 'Valores e disponibilidade sob consulta.',
  detailConsultation: 'Consulte valores e disponibilidade diretamente pelo WhatsApp.',
  demoContact: 'Dados de contato fictícios para demonstração.',
  demoNotice: 'Site demonstrativo. Empresa, contatos e imagens são ilustrativos.',
  specificationsNote: 'Ficha ilustrativa, com cilindrada nominal. Ano, versão, equipamentos e condições devem ser confirmados com a locadora.',
  steps: [
    { title: 'Escolha sua moto.', description: 'Conheça os modelos e veja os detalhes da moto que faz sentido para você.' },
    { title: 'Chame no WhatsApp.', description: 'Abra a conversa com a moto escolhida já na mensagem.' },
    { title: 'Combine com a locadora.', description: 'Consulte valores, disponibilidade, documentos e condições diretamente com o proprietário.' },
  ],
};
export type Motorcycle = {
  slug: string; brand: string; model: string; name: string; category: string;
  displacement: string; transmission: string; image: string;
  images: { src: string; alt: string }[];
  summary: string; description: string; idealFor: string;
  features: { title: string; description: string }[];
};
export const motorcycles: Motorcycle[] = [
  {
    slug: 'honda-cg-160', brand: 'Honda', model: 'CG 160', name: 'Honda CG 160', category: 'Urbana', displacement: '160 cc', transmission: 'Manual', image: '/images/cg-160.webp',
    images: [{ src: '/images/cg-160.webp', alt: 'Moto urbana vermelha inspirada na Honda CG 160. Imagem ilustrativa.' }, { src: '/images/cg-160-front.webp', alt: 'Vista frontal ilustrativa da moto urbana vermelha.' }],
    summary: 'Praticidade para acompanhar o seu dia.',
    description: 'Uma escolha versátil para os trajetos do dia a dia. Com postura de pilotagem ereta e porte compacto, a CG 160 é uma opção para quem procura mobilidade na cidade.',
    idealFor: 'Deslocamentos urbanos e rotina de trabalho.',
    features: [{ title: 'Porte compacto', description: 'Uma proposta prática para circular pela cidade.' }, { title: 'Pilotagem ereta', description: 'Uma posição natural para os deslocamentos cotidianos.' }, { title: 'Câmbio manual', description: 'Controle das trocas de marcha ao longo do caminho.' }],
  },
  {
    slug: 'honda-bros-160', brand: 'Honda', model: 'Bros 160', name: 'Honda Bros 160', category: 'Trail', displacement: '160 cc', transmission: 'Manual', image: '/images/bros-160.webp',
    images: [{ src: '/images/bros-160.webp', alt: 'Moto trail grafite inspirada na Honda Bros 160. Imagem ilustrativa.' }, { src: '/images/bros-160-front.webp', alt: 'Vista frontal ilustrativa da moto trail grafite.' }],
    summary: 'Versatilidade para ir um pouco além.',
    description: 'A proposta trail combina uma posição de pilotagem elevada com versatilidade para diferentes trajetos. Uma opção para quem procura uma moto que acompanhe a rotina e novos caminhos.',
    idealFor: 'Trajetos urbanos e caminhos de piso irregular, conforme as condições da locação.',
    features: [{ title: 'Perfil trail', description: 'Uma configuração versátil para diferentes trajetos.' }, { title: 'Posição elevada', description: 'Postura ereta e visão ampla ao pilotar.' }, { title: 'Rodas raiadas', description: 'Um elemento característico da proposta trail ilustrada.' }],
  },
  {
    slug: 'yamaha-fazer-250', brand: 'Yamaha', model: 'Fazer 250', name: 'Yamaha Fazer 250', category: 'Street', displacement: '250 cc', transmission: 'Manual', image: '/images/fazer-250.webp',
    images: [{ src: '/images/fazer-250.webp', alt: 'Moto street azul-escura inspirada na Yamaha Fazer 250. Imagem ilustrativa.' }, { src: '/images/fazer-250-front.webp', alt: 'Vista frontal ilustrativa da moto street azul-escura.' }],
    summary: 'Presença e personalidade em cada trajeto.',
    description: 'Com visual marcante e proposta street, a Fazer 250 combina porte intermediário e posição de pilotagem ereta. Uma alternativa para quem busca uma moto para percursos variados.',
    idealFor: 'Rotina urbana e percursos mais longos, mediante acordo com a locadora.',
    features: [{ title: 'Estilo street', description: 'Linhas marcantes e uma proposta voltada ao asfalto.' }, { title: 'Porte intermediário', description: 'Uma alternativa entre as motos leves e os modelos maiores.' }, { title: 'Câmbio manual', description: 'Trocas de marcha sob o comando de quem pilota.' }],
  },
  {
    slug: 'yamaha-factor-150', brand: 'Yamaha', model: 'Factor 150', name: 'Yamaha Factor 150', category: 'Urbana', displacement: '150 cc', transmission: 'Manual', image: '/images/factor-150.webp',
    images: [{ src: '/images/factor-150.webp', alt: 'Moto urbana prata inspirada na Yamaha Factor 150. Imagem ilustrativa.' }, { src: '/images/factor-150-front.webp', alt: 'Vista frontal ilustrativa da moto urbana prata.' }],
    summary: 'Sua rotina com mais mobilidade.',
    description: 'De proposta urbana e visual direto, a Factor 150 é uma opção para os deslocamentos cotidianos. O porte compacto e a postura ereta combinam com quem quer simplificar o caminho.',
    idealFor: 'Idas ao trabalho, estudo e compromissos na cidade.',
    features: [{ title: 'Vocação urbana', description: 'Uma proposta pensada para os trajetos do dia a dia.' }, { title: 'Porte compacto', description: 'Dimensões contidas para a rotina na cidade.' }, { title: 'Pilotagem ereta', description: 'Postura natural sobre a moto.' }],
  },
  {
    slug: 'honda-xre-300', brand: 'Honda', model: 'XRE 300', name: 'Honda XRE 300', category: 'Trail', displacement: '300 cc', transmission: 'Manual', image: '/images/xre-300.webp',
    images: [{ src: '/images/xre-300.webp', alt: 'Moto trail areia inspirada na Honda XRE 300. Imagem ilustrativa.' }, { src: '/images/xre-300-front.webp', alt: 'Vista frontal ilustrativa da moto trail areia.' }],
    summary: 'Novos caminhos pedem outra perspectiva.',
    description: 'A XRE 300 tem proposta trail e porte mais alto. É uma opção para quem gosta de pilotagem ereta e procura versatilidade para planejar percursos além dos trajetos habituais.',
    idealFor: 'Percursos variados. Confirme os trajetos permitidos com a locadora.',
    features: [{ title: 'Perfil aventureiro', description: 'Um conjunto de porte alto e proposta trail.' }, { title: 'Postura ereta', description: 'Posição de pilotagem elevada para olhar o caminho.' }, { title: 'Rodas raiadas', description: 'Visual característico das motos de uso misto.' }],
  },
  {
    slug: 'honda-pcx', brand: 'Honda', model: 'PCX', name: 'Honda PCX', category: 'Scooter', displacement: '160 cc', transmission: 'Automática', image: '/images/pcx.webp',
    images: [{ src: '/images/pcx.webp', alt: 'Scooter branca inspirada na Honda PCX. Imagem ilustrativa.' }, { src: '/images/pcx-front.webp', alt: 'Vista frontal ilustrativa da scooter branca.' }],
    summary: 'Conforto e praticidade no ritmo da cidade.',
    description: 'Uma scooter de proposta urbana, com carenagem envolvente e transmissão automática. A PCX é uma alternativa para quem valoriza praticidade nos deslocamentos pela cidade.',
    idealFor: 'Deslocamentos urbanos com a praticidade de uma scooter.',
    features: [{ title: 'Câmbio automático', description: 'Dispensa as trocas manuais de marcha durante o trajeto.' }, { title: 'Proposta scooter', description: 'Carenagem e apoio para os pés integrados ao conjunto.' }, { title: 'Perfil urbano', description: 'Uma configuração que combina com a rotina da cidade.' }],
  },
];
export function whatsappUrl(motoName?: string) {
  const message = motoName ? site.motorcycleMessage.replace('{moto}', motoName) : site.generalMessage;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
