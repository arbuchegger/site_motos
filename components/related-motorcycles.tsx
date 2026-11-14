'use client';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { formatDailyPrice, type Motorcycle } from '@/lib/content';
import { loopCarouselPosition } from '@/lib/related-carousel';

export function RelatedMotorcycles({ motorcycles }: { motorcycles: Motorcycle[] }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = track.current;
    if (!list) return;
    let timer: ReturnType<typeof setTimeout>;
    const cycle = () => {
      const cards = list.querySelectorAll<HTMLElement>('article');
      return cards[motorcycles.length]?.getBoundingClientRect().left - cards[0]?.getBoundingClientRect().left || 0;
    };
    const center = () => {
      const width = cycle();
      if (!width) return;
      const card = list.querySelector('article');
      const inset = getComputedStyle(card!).scrollSnapAlign === 'center' ? (list.clientWidth - card!.getBoundingClientRect().width) / 2 : 0;
      const next = loopCarouselPosition(list.scrollLeft, width, inset);
      if (Math.abs(next - list.scrollLeft) > 1) list.scrollTo({ left: next, behavior: 'instant' });
    };
    const settle = () => { clearTimeout(timer); timer = setTimeout(center, 180); };
    const resize = new ResizeObserver(center);
    resize.observe(list);
    list.addEventListener('scroll', settle, { passive: true });
    center();
    return () => { clearTimeout(timer); resize.disconnect(); list.removeEventListener('scroll', settle); };
  }, [motorcycles.length]);
  function move(direction: number) {
    const list = track.current;
    if (!list) return;
    const card = list.querySelector('article');
    list.scrollBy({ left: direction * ((card?.getBoundingClientRect().width ?? list.clientWidth) + 24), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className="related-motorcycles" aria-labelledby="related-title">
    <div className="related-heading"><h2 id="related-title">Não gostou? <span className="accent">Dê uma olhada nessas também.</span></h2>
    </div>
    <div className="related-viewport">
      <div className="related-controls"><button type="button" onClick={() => move(-1)} aria-label="Ver motos anteriores" aria-controls="related-track"><ArrowLeft size={22} /></button><button type="button" onClick={() => move(1)} aria-label="Ver próximas motos" aria-controls="related-track"><ArrowRight size={22} /></button></div>
    <div className="related-track" ref={track} id="related-track" tabIndex={0} role="region" aria-label="Outras cores da BMW R 1300 GS. Arraste ou toque nas motos laterais."
      onClickCapture={event => {
        if (getComputedStyle(event.currentTarget.querySelector('article')!).scrollSnapAlign !== 'center' || !event.currentTarget.closest('.detail-mobile-layout') || event.detail === 0) return;
        const card = (event.target as HTMLElement).closest('article');
        if (!card) return;
        const rect = card.getBoundingClientRect(), viewport = event.currentTarget.getBoundingClientRect();
        const delta = rect.left + rect.width / 2 - (viewport.left + viewport.width / 2);
        if (Math.abs(delta) > rect.width / 2) { event.preventDefault(); event.stopPropagation(); move(delta > 0 ? 1 : -1); }
      }} onKeyDown={event => {
        if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }}>
      {[...motorcycles, ...motorcycles, ...motorcycles].map((moto, index) => <article key={`${index}-${moto.slug}`} className="related-moto" aria-hidden={index < motorcycles.length || index >= motorcycles.length * 2 || undefined}>
        <a href={`/motos/${moto.slug}`} tabIndex={index < motorcycles.length || index >= motorcycles.length * 2 ? -1 : undefined} className="related-photo"><img src={`/images/bmw-r1300gs/cutouts/${moto.slug}.webp`} alt={moto.name} width={1024} height={683} loading="eager" /></a>
        <h3><a href={`/motos/${moto.slug}`} tabIndex={index < motorcycles.length || index >= motorcycles.length * 2 ? -1 : undefined}>{moto.color}</a></h3><p>{moto.summary}</p>
        <div className="related-price"><span>A partir de <strong>{formatDailyPrice(moto.dailyPrice)}</strong> /dia</span><a href={`/motos/${moto.slug}`} tabIndex={index < motorcycles.length || index >= motorcycles.length * 2 ? -1 : undefined} aria-label={`Ver detalhes da ${moto.name}`}><ArrowUpRight size={22} /></a></div>
      </article>)}
    </div>
    </div>
  </section>;
}
