import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { motorcycles, copy } from '@/lib/content';
import { WhatsAppLink } from '@/components/site';
import { Gallery } from '@/components/gallery';

export const dynamicParams = false;
export function generateStaticParams() { return motorcycles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const moto = motorcycles.find(item => item.slug === slug);
  return { title: moto ? `${moto.name} para alugar` : 'Moto não encontrada', description: moto ? `${moto.summary} Conheça a ${moto.name} e consulte valores e disponibilidade pelo WhatsApp.` : 'Encontre outros modelos na nossa vitrine.' };
}
export default async function MotorcyclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moto = motorcycles.find(item => item.slug === slug);
  if (!moto) notFound();
  return <main id="conteudo" className="detail-page">
    <div className="container"><nav className="breadcrumb" aria-label="Localização"><a href="/#motos"><ArrowLeft size={16} aria-hidden="true" />Todas as motos</a><span aria-hidden="true">/</span><span aria-current="page">{moto.name}</span></nav>
      <section className="detail-hero" aria-labelledby="moto-title">
        <div className="detail-heading"><p className="detail-category">{moto.category}</p><h1 id="moto-title">{moto.name}<span className="accent">.</span></h1><p className="detail-summary">{moto.summary}</p></div>
        <Gallery images={moto.images} name={moto.name} />
        <div className="detail-overview"><p className="moto-description">{moto.description}</p><dl className="specs"><div><dt>Cilindrada nominal</dt><dd>{moto.displacement}</dd></div><div><dt>Tipo de moto</dt><dd>{moto.category}</dd></div><div><dt>Transmissão</dt><dd>{moto.transmission}</dd></div></dl><WhatsAppLink motoName={moto.name}>Consultar pelo WhatsApp</WhatsAppLink><p className="detail-note">{copy.consultationNote}</p></div>
      </section>
      <section className="detail-features" aria-labelledby="features-title"><div><h2 id="features-title">Conheça a moto<span className="accent">.</span></h2><p className="ideal-label">Combina com</p><p className="ideal-description">{moto.idealFor}</p></div><div><ul className="feature-list">{moto.features.map(feature => <li key={feature.title}><Check size={20} aria-hidden="true" /><div><h3>{feature.title}</h3><p>{feature.description}</p></div></li>)}</ul><p className="specification-note">{copy.specificationsNote}</p></div></section>
      <section className="detail-contact" aria-labelledby="consult-title"><div><h2 id="consult-title">Gostou da {moto.model}?</h2><p>{copy.detailConsultation}</p><p className="consult-secondary">Documentação, prazo e condições da locação são combinados na conversa.</p></div><WhatsAppLink motoName={moto.name}>Consultar pelo WhatsApp</WhatsAppLink></section>
      <a className="back-catalog text-link" href="/#motos">Continuar vendo motos <ArrowUpRight size={20} aria-hidden="true" /></a>
    </div>
  </main>;
}
