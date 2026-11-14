// EDITE AQUI: identidade, contatos, textos e catálogo. Não é necessário painel.
export const site = {
  name: 'Paraíba', descriptor: 'MotorFast', fullName: 'Paraíba MotorFast',
  logoImage: '/images/paraiba-motorfast-logo.png',
  whatsapp: '555499602140', // País + DDD + número, conforme informado.
  phone: '+555499602140', phoneDisplay: '+55 (54) 9960-2140',
  address: { street: 'Local de retirada a combinar', city: 'Nordeste, Brasil' },
  hours: { weekdays: 'Segunda a sexta, 8h às 18h', saturday: 'Sábado, 8h às 12h' },
  heroImage: '/images/bmw-r1300gs/banner-light-white-sr-2752.webp',
  generalMessage: 'Olá! Vi o site da Paraíba MotorFast e gostaria de saber mais sobre o aluguel diário da BMW R 1300 GS.',
  motorcycleMessage: 'Olá! Tenho interesse no aluguel diário da {moto}. Gostaria de saber o valor e a disponibilidade.',
};
export const copy = {
  heroEyebrow: 'BMW R 1300 GS · Aluguel diário no Nordeste',
  heroTitle: 'O Nordeste te espera!',
  catalogTitle: 'Uma GS. Seu estilo', howTitle: 'Como funciona',
  howDescription: 'Escolha a sua cor. A gente combina o próximo passo.',
  contactTitle: 'Seu próximo destino começa numa conversa',
  contactDescription: 'Conte seus planos pelo Nordeste. Consulte a disponibilidade da sua GS e as condições do aluguel diário.',
  footerTagline: 'Entre o litoral e o sertão, vá de GS.',
  heroDescription: 'Explore as praias do Nordeste e sinta a liberdade\nde viajar em uma BMW.',
  catalogDescription: 'Seis versões da BMW R 1300 GS. Escolha a sua próxima aventura.',
  consultationNote: 'Confirme valores, disponibilidade e condições da locação pelo WhatsApp.',
  detailConsultation: 'Vamos planejar seus dias de GS? Consulte a disponibilidade desta cor e as condições da locação.',
  demoContact: 'Confirme local de retirada e horários com a locadora.',
  demoNotice: 'Imagens ilustrativas. Consulte a disponibilidade de cada modelo.',
  specificationsNote: 'Cores e versões de anos diferentes. Imagens geradas por IA. Confirme ano, equipamentos e condições da unidade com a locadora.',
  steps: [
    { title: 'Encontre sua GS.', description: 'Conheça as seis versões da BMW R 1300 GS, confira as fotos e os detalhes de cada moto. Escolha a cor que combina com seu estilo e com a viagem que você quer fazer.' },
    { title: 'Planeje seus dias.', description: 'Chame no WhatsApp e conte suas datas e seu roteiro. Confirme a disponibilidade da moto, o valor das diárias e as condições da locação antes de reservar.' },
    { title: 'Combine a retirada.', description: 'Envie os documentos pelo WhatsApp e confirme o adiantamento de 50%, descontado do aluguel. Combine o local e o horário da retirada, a quilometragem e o roteiro com a Paraíba MotorFast.' },
  ],
};
export type Motorcycle = {
  slug: string; brand: string; model: string; name: string; category: string;
  color: string; dailyPrice: number; weekendDailyPrice: number; fuelConsumption: string; displacement: string; transmission: string; image: string;
  images: { src: string; alt: string }[];
  summary: string; description: string; idealFor: string;
  features: { title: string; description: string }[];
};
export const motorcycles: Motorcycle[] = [
  {
    "slug": "bmw-r1300gs-light-white",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Light White",
    "color": "Light White",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-light-white.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-light-white.webp",
        "alt": "BMW R 1300 GS Light White, vista de três quartos dianteira, sobre fundo branco. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-light-white-traseira.webp",
        "alt": "BMW R 1300 GS Light White, vista de três quartos traseira, sobre fundo branco. Imagem ilustrativa."
      }
    ],
    "summary": "Branco marcante. Horizonte aberto.",
    "description": "A pintura branca destaca as linhas da GS, com banco preto e acabamentos prateados. Motor boxer e posição de pilotagem ereta para explorar novos destinos pelo Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Light White",
        "description": "A pintura branca destaca as linhas da GS, com banco preto e acabamentos prateados."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  },
  {
    "slug": "bmw-r1300gs-triple-black",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Triple Black",
    "color": "Triple Black",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-triple-black.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-triple-black.webp",
        "alt": "BMW R 1300 GS Triple Black, vista de três quartos dianteira, sobre fundo branco. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-triple-black-traseira.webp",
        "alt": "BMW R 1300 GS Triple Black, vista de três quartos traseira, sobre fundo branco. Imagem ilustrativa."
      }
    ],
    "summary": "Presença discreta em qualquer estrada.",
    "description": "A Triple Black combina preto metálico e grafite para uma presença sóbria do litoral às serras. Motor boxer e posição de pilotagem ereta para explorar novos destinos pelo Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Triple Black",
        "description": "A Triple Black combina preto metálico e grafite para uma presença sóbria do litoral às serras."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  },
  {
    "slug": "bmw-r1300gs-racing-blue-trophy",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Racing Blue Trophy",
    "color": "Racing Blue Trophy",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-racing-blue-trophy.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-racing-blue-trophy.webp",
        "alt": "BMW R 1300 GS Racing Blue Trophy, vista de três quartos dianteira, sobre fundo branco. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-racing-blue-trophy-traseira.webp",
        "alt": "BMW R 1300 GS Racing Blue Trophy, vista de três quartos traseira, sobre fundo branco. Imagem ilustrativa."
      }
    ],
    "summary": "O espírito GS em azul, branco e vermelho.",
    "description": "A Trophy traz a identidade esportiva da GS, com tanque azul, laterais inferiores branco/prateadas, detalhes vermelhos e banco preto. Motor boxer e posição de pilotagem ereta para explorar novos destinos pelo Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Racing Blue Trophy",
        "description": "A Trophy traz a identidade esportiva da GS, com tanque azul, laterais inferiores branco/prateadas, detalhes vermelhos e banco preto."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  },
  {
    "slug": "bmw-r1300gs-aurelius-green",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Aurelius Green",
    "color": "Aurelius Green",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-aurelius-green.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-aurelius-green.webp",
        "alt": "BMW R 1300 GS Aurelius Green, vista de três quartos dianteira, sobre fundo branco. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-aurelius-green-traseira.webp",
        "alt": "BMW R 1300 GS Aurelius Green, vista de três quartos traseira, sobre fundo branco. Imagem ilustrativa."
      }
    ],
    "summary": "Verde profundo. Detalhes que fazem diferença.",
    "description": "A Option 719 Tramuntana combina verde metálico com detalhes e aros dourados. Motor boxer e posição de pilotagem ereta para explorar novos destinos pelo Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Aurelius Green",
        "description": "A Option 719 Tramuntana combina verde metálico com detalhes e aros dourados."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  },
  {
    "slug": "bmw-r1300gs-racing-red",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Racing Red",
    "color": "Racing Red",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-racing-red.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-racing-red.webp",
        "alt": "BMW R 1300 GS Racing Red, vista de três quartos dianteira, sobre fundo branco. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-racing-red-traseira.webp",
        "alt": "BMW R 1300 GS Racing Red, vista de três quartos traseira, sobre fundo branco. Imagem ilustrativa."
      }
    ],
    "summary": "Vermelho vivo para novos caminhos.",
    "description": "A pintura Racing Red destaca as linhas da BMW R 1300 GS em contraste com o banco preto e os acabamentos prateados. Motor boxer e posição de pilotagem ereta para explorar novos destinos pelo Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Racing Red",
        "description": "A pintura Racing Red destaca as linhas da BMW R 1300 GS em contraste com o banco preto e os acabamentos prateados."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  },
  {
    "slug": "bmw-r1300gs-light-white-rodas-pretas",
    "brand": "BMW",
    "model": "R 1300 GS",
    "name": "BMW R 1300 GS — Light White · rodas pretas",
    "color": "Light White · rodas pretas",
    "dailyPrice": 619,
    "weekendDailyPrice": 719,
    "fuelConsumption": "≈ 20,8 km/l",
    "category": "Big trail",
    "displacement": "1.300 cc",
    "transmission": "Manual · 6 marchas",
    "image": "/images/bmw-r1300gs/bmw-r1300gs-light-white-rodas-pretas.webp",
    "images": [
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-light-white-rodas-pretas.webp",
        "alt": "BMW R 1300 GS branca com rodas pretas e detalhe azul no tanque, vista dianteira de três quartos. Imagem ilustrativa."
      },
      {
        "src": "/images/bmw-r1300gs/bmw-r1300gs-light-white-rodas-pretas-traseira.webp",
        "alt": "BMW R 1300 GS branca com rodas pretas e detalhe azul no tanque, vista traseira de três quartos. Imagem ilustrativa."
      }
    ],
    "summary": "Branco, preto e um toque de azul.",
    "description": "Pintura branca com rodas de liga pretas, banco preto e detalhe azul no tanque, conforme a referência apresentada. A mesma proposta da R 1300 GS para descobrir o litoral e as serras do Nordeste.",
    "idealFor": "Viagens pelo litoral, serras e interior do Nordeste, respeitando os trajetos e limites combinados na locação.",
    "features": [
      {
        "title": "Light White com rodas pretas",
        "description": "Uma configuração visual da GS branca, com rodas escuras e grafismo azul. Confirme os equipamentos da unidade com a locadora."
      },
      {
        "title": "Motor boxer de 1.300 cc",
        "description": "Dois cilindros opostos e a personalidade característica da família GS."
      },
      {
        "title": "Aluguel diário",
        "description": "Aluguel a partir de uma diária, com adiantamento de 50% do valor total para reservar. Confirme a disponibilidade e a franquia de quilometragem pelo WhatsApp."
      }
    ]
  }
];
export function formatDailyPrice(value: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value); }
export const motorcycleSpinCopy = {
  previous: 'Girar para o ângulo anterior',
  next: 'Girar para o próximo ângulo',
  hint: 'Arraste para explorar',
  unavailable: 'Giro indisponível no momento',
  disclaimer: 'Imagens ilustrativas. O modelo real pode apresentar diferenças.',
  keyboard: 'Use as setas esquerda e direita do teclado para girar a moto.',
};
export function whatsappUrl(motoName?: string) {
  const message = motoName ? site.motorcycleMessage.replace('{moto}', motoName) : site.generalMessage;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
