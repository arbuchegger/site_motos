import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { motorcycles, copy, formatDailyPrice } from '@/lib/content';
import { ReservationLink } from '@/components/site';
import { Motorcycle360 } from '@/components/motorcycle-360';
import { RelatedMotorcycles } from '@/components/related-motorcycles';
import { BackToTop } from '@/components/back-to-top';

export const dynamicParams = false;
export function generateStaticParams() { return motorcycles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const moto = motorcycles.find(item => item.slug === slug);
  if (moto) return {
    title: { absolute: `${moto.name} | Aluguel em João Pessoa` },
    description: `${moto.summary} Confira as diárias da ${moto.name} em João Pessoa, PB, veja a moto em 360° e consulte disponibilidade pelo WhatsApp.`,
    alternates: { canonical: `/motos/${moto.slug}/` },
  };
  return { title: 'Moto não encontrada', robots: { index: false } };
}
export default async function MotorcyclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moto = motorcycles.find(item => item.slug === slug);
  if (!moto) notFound();
  return <main id="conteudo" className="detail-page detail-desktop-layout detail-mobile-layout">
    <BackToTop />
    <div className="container"><nav className="breadcrumb" aria-label="Localização"><a href="/#motos"><ArrowLeft size={16} aria-hidden="true" />Todas as motos</a><span aria-hidden="true">/</span><span aria-current="page">{moto.name}</span></nav>
      </div><section className="detail-hero detail-hero-360" aria-labelledby="moto-title">
        <Motorcycle360 key={moto.slug} moto={moto} />
        <div className="detail-heading"><p className="detail-category">{moto.category}</p><h1 id="moto-title" className={moto.name.length > 37 ? 'moto-title-long' : moto.name.length > 32 ? 'moto-title-medium' : undefined}>{moto.name}<span className="accent">.</span></h1><p className="detail-summary">{moto.summary}</p></div>
        <div className="detail-overview"><p className="moto-description">{moto.description}</p><div className="daily-price detail-price"><span>Diária · dias de semana</span><strong>{formatDailyPrice(moto.dailyPrice)}<small>/dia</small></strong><span className="rental-weekend-price">Finais de semana e feriados: {formatDailyPrice(moto.weekendDailyPrice)}/dia</span></div><p className="detail-mobile-summary">{moto.summary}</p><dl className="specs"><div><dt>Cilindrada</dt><dd>{moto.displacement}</dd></div><div><dt>Cor / versão</dt><dd>{moto.color}</dd></div><div><dt>Transmissão</dt><dd>{moto.transmission}</dd></div><div><dt>Consumo de referência (WMTC)</dt><dd>{moto.fuelConsumption}</dd></div></dl><p className="consumption-note">Referência BMW: 4,8 l/100 km (≈ 20,8 km/l), no ciclo WMTC. O consumo real varia com combustível, pilotagem, carga e trajeto. <a href="https://www.bmw-motorrad.co.uk/en/models/adventure/r1300gs/technicaldata.html" target="_blank" rel="noopener noreferrer">Ficha técnica BMW<span className="sr-only"> (abre em nova aba)</span></a>.</p><div className="detail-consultation"><ReservationLink motoSlug={moto.slug}>Consultar pelo WhatsApp</ReservationLink><p className="detail-note">Escolha as datas e os equipamentos para enviar sua consulta pelo WhatsApp.</p></div></div>
      </section>
      <div className="container"><section className="detail-features" aria-labelledby="features-title"><div><h2 id="features-title">Conheça a moto<span className="accent">.</span></h2><p className="ideal-label">Combina com</p><p className="ideal-description">{moto.idealFor}</p></div><div><ul className="feature-list">{moto.features.map(feature => <li key={feature.title}><Check size={20} aria-hidden="true" /><div><h3>{feature.title}</h3><p>{feature.description}</p></div></li>)}</ul><p className="specification-note">{copy.specificationsNote}</p></div></section>
      <section className="detail-contact" aria-labelledby="consult-title"><div><h2 id="consult-title">Gostou da {moto.model}?</h2><p>{copy.detailConsultation}</p><p className="consult-secondary">Documentação, prazo e condições da locação são combinados na conversa.</p></div><ReservationLink motoSlug={moto.slug}>Consultar pelo WhatsApp</ReservationLink></section>
      <a className="back-catalog text-link" href="/#motos">Continuar vendo motos <ArrowUpRight size={20} aria-hidden="true" /></a>
      <RelatedMotorcycles motorcycles={motorcycles.filter(item => item.slug !== moto.slug)} />
    </div>
  </main>;
}
