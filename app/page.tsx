import { HeroSlideshow } from '@/components/hero-slideshow';
import { motorcycles, copy } from '@/lib/content';
import { MotorcycleCard } from '@/components/site';
import { HomeSections } from '@/components/home-sections';
export default function Home() {
  return <main id="conteudo">
    <HeroSlideshow />
    <section className="section container catalog" id="motos" aria-labelledby="catalog-title"><div className="section-heading section-heading-centered"><h2 id="catalog-title">{copy.catalogTitle.split(/(Seu estilo)/i).map((part, index) => /^Seu estilo$/i.test(part) ? <span className="heading-accent" key={index}>{part}</span> : part)}<span className="heading-accent">.</span></h2><p>{copy.catalogDescription}</p></div><div className="motorcycle-grid">{motorcycles.map(moto => <MotorcycleCard key={moto.slug} moto={moto} />)}</div><p className="catalog-note">{copy.consultationNote}</p></section>
    <HomeSections section="how" />
    <HomeSections />
  </main>;
}
