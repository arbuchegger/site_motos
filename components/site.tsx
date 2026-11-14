import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { ButtonLabel } from '@/components/button-label';
import { site, copy, formatDailyPrice, whatsappUrl, type Motorcycle } from '@/lib/content';
export function Logo() {
  return <a className="logo" href="/" aria-label={`${site.fullName}, página inicial`}>{site.logoImage ? <picture className="brand-logo"><img src={site.logoImage} className="brand-logo-image" alt={site.fullName} width="840" height="292" /></picture> : <><img className="brand-symbol" src="/images/leandro-mark.svg" alt="" width="42" height="42" /><span className="brand-name">{site.name}<span className="brand-descriptor">{site.descriptor}</span></span></>}</a>;
}
export function WhatsAppLink({ motoName, children, className = 'button button-primary' }: { motoName?: string; children?: React.ReactNode; className?: string }) {
  return <a href={whatsappUrl(motoName)} target="_blank" rel="noopener noreferrer" className={className}><ButtonLabel><MessageCircle size={19} aria-hidden="true" />{children || 'Falar no WhatsApp'}</ButtonLabel><span className="sr-only"> (abre em nova aba)</span></a>;
}
export function ReservationLink({ motoSlug, children }: { motoSlug: string; children: React.ReactNode }) {
  return <a href={`/reserva/?moto=${encodeURIComponent(motoSlug)}`} className="button button-primary"><ButtonLabel><MessageCircle size={19} aria-hidden="true" />{children}</ButtonLabel><span className="sr-only"> (preparar reserva antes de abrir o WhatsApp)</span></a>;
}
export function MotorcycleCard({ moto }: { moto: Motorcycle }) {
  return <article className="moto-card"><a className="moto-photo-link" href={`/motos/${moto.slug}/`} aria-label={`Ver detalhes da ${moto.name}`}><img src={moto.image} alt={moto.images[0].alt} width="1024" height="683" loading="lazy" /></a><div className="moto-card-body"><div className="moto-meta"><span>{moto.category}</span><span>{moto.displacement}</span></div><h3><a href={`/motos/${moto.slug}/`}>{moto.name}</a></h3><p>{moto.summary}</p><div className="daily-price"><span>Diária · dias de semana</span><strong>{formatDailyPrice(moto.dailyPrice)}<small>/dia</small></strong><span className="rental-weekend-price">Finais de semana e feriados: {formatDailyPrice(moto.weekendDailyPrice)}/dia</span></div><a className="card-link" href={`/motos/${moto.slug}/`}><ButtonLabel>Ver detalhes <ArrowUpRight size={20} aria-hidden="true" /></ButtonLabel><span className="sr-only"> da {moto.name}</span></a></div></article>;
}
export function Footer() {
  return <footer className="footer"><div className="container footer-top"><div><Logo /><p>Aluguel diário da BMW R 1300 GS no Nordeste. Escolha sua cor e planeje os próximos caminhos com a Paraíba MotorFast.</p></div><div><h3>Navegação</h3><nav aria-label="Navegação do rodapé"><a href="/#motos">Motos</a><a href="/#como-funciona">Como funciona</a><a href="/#duvidas">FAQ</a><a href="/#contato">Contato</a></nav></div><div className="footer-attendance"><h3>Atendimento</h3><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><address>{site.address.street}<br />{site.address.city}</address><p>{site.hours.weekdays}<br />{site.hours.saturday}</p><div className="footer-mobile-logo"><Logo /></div></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} {site.fullName}. Todos os direitos reservados.</p><p>{copy.demoNotice}</p></div></footer>;
}
