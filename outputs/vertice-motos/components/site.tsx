import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { site, copy, whatsappUrl, type Motorcycle } from '@/lib/content';
export function Logo() {
  return <a className="logo" href="/" aria-label={`${site.fullName}, página inicial`}>{site.logoImage ? <img src={site.logoImage} alt={site.fullName} width="170" height="40" /> : <><span className="brand-mark" aria-hidden="true">V</span><span className="brand-name">{site.name}<span className="brand-descriptor">{site.descriptor}</span></span></>}</a>;
}
export function WhatsAppLink({ motoName, children, className = 'button button-primary' }: { motoName?: string; children?: React.ReactNode; className?: string }) {
  return <a href={whatsappUrl(motoName)} target="_blank" rel="noopener noreferrer" className={className}><MessageCircle size={19} aria-hidden="true" />{children || 'Falar no WhatsApp'}<span className="sr-only"> (abre em nova aba)</span></a>;
}
export function MotorcycleCard({ moto }: { moto: Motorcycle }) {
  return <article className="moto-card"><a className="moto-photo-link" href={`/motos/${moto.slug}/`} aria-label={`Ver detalhes da ${moto.name}`}><img src={moto.image} alt={moto.images[0].alt} width="1024" height="683" loading="lazy" /></a><div className="moto-card-body"><div className="moto-meta"><span>{moto.category}</span><span>{moto.displacement}</span></div><h3><a href={`/motos/${moto.slug}/`}>{moto.name}</a></h3><p>{moto.summary}</p><a className="card-link" href={`/motos/${moto.slug}/`}>Ver detalhes <ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> da {moto.name}</span></a></div></article>;
}
export function Footer() {
  return <footer className="footer"><div className="container footer-top"><div><Logo /><p>{copy.footerTagline}</p></div><nav aria-label="Navegação do rodapé"><a href="/">Home</a><a href="/#motos">Motos</a><a href="/#como-funciona">Como funciona</a><a href="/#contato">Contato</a></nav><div className="footer-contact"><WhatsAppLink className="text-link" /><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.</p><p>{copy.demoNotice}</p></div></footer>;
}

