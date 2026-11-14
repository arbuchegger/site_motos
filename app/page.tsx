import { HeroSlideshow } from '@/components/hero-slideshow';
import { motorcycles, copy } from '@/lib/content';
import { MotorcycleShowcase } from '@/components/motorcycle-showcase';
import { HomeSections } from '@/components/home-sections';
import { ArrowUp } from 'lucide-react';

export const metadata = {
  title: 'Aluguel de motos em João Pessoa, PB',
  description: 'Aluguel de motos em João Pessoa para viagens pela Paraíba e pelo Nordeste. Conheça as opções de BMW R 1300 GS, veja as diárias e consulte a disponibilidade.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return <main id="conteudo">
    {motorcycles.map(moto => <link key={moto.slug} rel="preload" as="image" href={`/images/bmw-r1300gs/showcase-contact/${moto.slug.replace(/^bmw-r1300gs-/, '')}.webp`} />)}
    <HeroSlideshow />
    <HomeSections section="how" />
    <section className="section container catalog catalog-showcase" id="motos" aria-labelledby="catalog-title"><div className="section-heading section-heading-centered"><h2 id="catalog-title">{copy.catalogTitle.split(/(Seu estilo)/i).map((part, index) => /^Seu estilo$/i.test(part) ? <span className="heading-accent" key={index}>{part}</span> : part)}<span className="heading-accent">.</span></h2><p>{copy.catalogDescription}</p></div><MotorcycleShowcase motorcycles={motorcycles} /></section>
    <HomeSections />
    <section className="section rental-guide" aria-labelledby="rental-guide-title">
      <div className="container">
        <div className="rental-guide-content section-heading-centered">
          <h2 id="rental-guide-title">Aluguel de motos <span className="heading-accent">em João Pessoa</span></h2>
          <p>Explore o litoral e o interior da Paraíba ou planeje uma viagem pelo Nordeste. Compare as seis versões da BMW R 1300 GS e confira as diárias para as datas da sua viagem.</p>
          <p>Você pode incluir equipamentos na estimativa. A disponibilidade e a retirada são combinadas pelo WhatsApp.</p>
          <a className="button button-primary" href="#motos">Ver motos e diárias <ArrowUp size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  </main>;
}
