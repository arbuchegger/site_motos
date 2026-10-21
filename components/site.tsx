import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { site, copy, formatDailyPrice, whatsappUrl, type Motorcycle } from '@/lib/content';
export function Logo() {
  return <a className="logo" href="/" aria-label={`${site.fullName}, página inicial`}>{site.logoImage ? <img src={site.logoImage} alt={site.fullName} width="170" height="40" /> : <><img className="brand-symbol" src="/images/leandro-mark.svg" alt="" width="42" height="42" /><span className="brand-name">{site.name}<span className="brand-descriptor">{site.descriptor}</span></span></>}</a>;
}
export function WhatsAppLink({ motoName, children, className = 'button button-primary' }: { motoName?: string; children?: React.ReactNode; className?: string }) {
  return <a href={whatsappUrl(motoName)} target="_blank" rel="noopener noreferrer" className={className}><MessageCircle size={19} aria-hidden="true" />{children || 'Falar no WhatsApp'}<span className="sr-only"> (abre em nova aba)</span></a>;
}
export function MotorcycleCard({ moto }: { moto: Motorcycle }) {
  return <article className="moto-card"><a className="moto-photo-link" href={`/motos/${moto.slug}/`} aria-label={`Ver detalhes da ${moto.name}`}><img src={moto.image} alt={moto.images[0].alt} width="1024" height="683" loading="lazy" /></a><div className="moto-card-body"><div className="moto-meta"><span>{moto.category}</span><span>{moto.displacement}</span></div><h3><a href={`/motos/${moto.slug}/`}>{moto.name}</a></h3><p>{moto.summary}</p><div className="daily-price"><span>Diária</span><strong>{formatDailyPrice(moto.dailyPrice)}<small>/dia</small></strong></div><a className="card-link" href={`/motos/${moto.slug}/`}>Ver detalhes <ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> da {moto.name}</span></a></div></article>;
}
export function Footer() {
  return <footer className="footer"><div className="container footer-top"><div><Logo /><p>Aluguel diário da BMW R 1300 GS no Nordeste. Escolha sua cor e planeje os próximos caminhos com a Leandro MotorFast.</p></div><div><h3>Navegação</h3><nav aria-label="Navegação do rodapé"><a href="/#motos">Motos</a><a href="/#como-funciona">Como funciona</a><a href="/#duvidas">FAQ</a><a href="/#contato">Contato</a></nav></div><div className="footer-attendance"><h3>Atendimento</h3><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><address>{site.address.street}<br />{site.address.city}</address><p>{site.hours.weekdays}<br />{site.hours.saturday}</p></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.</p><p>{copy.demoNotice}</p></div></footer>;
}
