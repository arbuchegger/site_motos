'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLabel } from '@/components/button-label';
import { formatDailyPrice, type Motorcycle } from '@/lib/content';
import { canSwipeCatalog, swipeDirection } from '@/lib/touch-gestures';

function showcaseImage(motorcycle: Motorcycle) {
  return `/images/bmw-r1300gs/showcase-contact/${motorcycle.slug.replace(/^bmw-r1300gs-/, '')}.webp`;
}

function catalogSwipeDirection(dx: number, dy: number, pointerType: string) {
  if (pointerType === 'mouse') return swipeDirection(dx, dy, pointerType);
  if (window.innerWidth < 768) {
    if (Math.abs(dx) < 12 || Math.abs(dx) <= Math.abs(dy)) return 0;
    return dx < 0 ? 1 : -1;
  }
  if (window.matchMedia('(min-width: 768px) and (orientation: landscape)').matches) {
    if (Math.abs(dx) < 22 || Math.abs(dx) <= Math.abs(dy) * 1.3) return 0;
    return dx < 0 ? 1 : -1;
  }
  if (Math.abs(dx) < 8) return 0;
  return dx < 0 ? 1 : -1;
}

export function MotorcycleShowcase({ motorcycles }: { motorcycles: Motorcycle[] }) {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const focusMobileSelection = useRef(false);

  useEffect(() => {
    // Decode hidden panels too, so the next motorcycle can paint immediately.
    root.current?.querySelectorAll<HTMLImageElement>('.showcase-photo').forEach(photo => {
      void photo.decode().catch(() => { /* The image keeps its native error/alt behavior. */ });
    });
  }, [motorcycles]);

  useEffect(() => {
    if (!focusMobileSelection.current) return;
    focusMobileSelection.current = false;
    root.current?.querySelector<HTMLButtonElement>(`.showcase-color[data-color-index="${selected}"]`)?.focus({ preventScroll: true });
  }, [selected]);

  function selectByKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number, mobile: boolean) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % motorcycles.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + motorcycles.length) % motorcycles.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = motorcycles.length - 1;
    else return;
    event.preventDefault();
    event.stopPropagation();
    focusMobileSelection.current = mobile;
    setSelected(next);
    if (!mobile || next === selected) root.current?.querySelector<HTMLButtonElement>(`.${mobile ? 'showcase-color' : 'showcase-trigger'}[data-color-index="${next}"]`)?.focus({ preventScroll: true });
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || !canSwipeCatalog(event.pointerType, window.innerWidth)) {
      touch.current = null;
      return;
    }
    if ((event.target as HTMLElement).closest('a')) return;
    touch.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const direction = catalogSwipeDirection(dx, dy, event.pointerType);
    if (!direction) return;
    suppressClickUntil.current = performance.now() + 350;
    setSelected(index => (index + direction + motorcycles.length) % motorcycles.length);
  }

  const swipeHandlers = {
    onPointerDown: startSwipe,
    onPointerUp: endSwipe,
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      const start = touch.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (event.pointerType !== 'mouse' &&
          Math.abs(dy) >= 12 && Math.abs(dy) >= Math.abs(dx) &&
          window.matchMedia('(max-width: 767px), (min-width: 768px) and (orientation: landscape)').matches) {
        touch.current = null;
        return;
      }
      if (catalogSwipeDirection(dx, dy, event.pointerType)) {
        event.currentTarget.setPointerCapture(event.pointerId);
        endSwipe(event);
      }
    },
    onPointerCancel: () => { touch.current = null; },
  };

  return <div className="motorcycle-showcase" ref={root}>
    <div className="showcase-colors" role="group" aria-label="Carrossel de cores da BMW. Arraste ou escolha uma cor."
      {...swipeHandlers} onClickCapture={event => {
        if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
      }}>
      {motorcycles.map((moto, index) => {
        let offset = (index - selected + motorcycles.length) % motorcycles.length;
        if (offset > motorcycles.length / 2) offset -= motorcycles.length;
        const visible = Math.abs(offset) <= 1;
        const [name, variant] = moto.color.split(' · ');
        const isRacingBlueTrophy = name === 'Racing Blue Trophy';
        return <button
        key={moto.slug} type="button" className="showcase-color" data-color-index={index}
        data-single-line={(isRacingBlueTrophy || name.trim().split(/\s+/).length === 2) || undefined}
        data-position={offset} style={{ '--color-offset': offset } as CSSProperties}
        aria-hidden={!visible} tabIndex={visible ? 0 : -1}
        aria-pressed={selected === index} aria-controls={`showcase-${moto.slug}`}
        onClick={() => setSelected(index)} onKeyDown={event => selectByKeyboard(event, index, true)}
      ><span>{isRacingBlueTrophy ? <>Racing Blue<br className="showcase-mobile-title-break" /> Trophy</> : name}</span>{variant && <small>{variant}</small>}</button>;
      })}
    </div>
    <div className="showcase-panels" {...swipeHandlers} onClickCapture={event => {
      if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
    }}>
      {motorcycles.map((moto, index) => {
        const active = selected === index;
        return <article key={moto.slug} id={`showcase-${moto.slug}`}
          className={`showcase-panel${active ? ' is-selected' : ''}`} aria-labelledby={`showcase-heading-${moto.slug}`}>
          <h3 className="sr-only" id={`showcase-heading-${moto.slug}`}>{moto.name}</h3>
          <button type="button" className="showcase-trigger" data-color-index={index}
            aria-label={`Selecionar ${moto.color}`} aria-expanded={active} aria-controls={`showcase-info-${moto.slug}`}
            onClick={() => setSelected(index)} onKeyDown={event => selectByKeyboard(event, index, false)} />
          <div className="showcase-preview" aria-hidden="true">
            <picture className="showcase-preview-picture"><source media="(min-width:1100px)" srcSet={`/images/bmw-r1300gs/showcase-contact/${moto.slug.replace(/^bmw-r1300gs-/, '')}.webp`} /><img className="showcase-preview-photo" src={`/images/bmw-r1300gs/cutouts/${moto.slug}.webp`} alt="" width="1024" height="683" loading="eager" decoding="async" draggable={false}/></picture>
            <span className="showcase-preview-name">{moto.color}</span>
          </div>
          <div className="showcase-content" aria-hidden={!active} inert={!active}>
            <div className="showcase-content-wrapper">
              <div className="showcase-content-logo" aria-hidden="true">{moto.color}</div>
              <div className="showcase-picture">
                <img className="showcase-photo" src={showcaseImage(moto)} alt={moto.images[0].alt.replace('sobre fundo branco', 'com fundo transparente')}
                  width="1920" height="1080" loading="eager" decoding="async" draggable={false} />
                {active && [-1, 1].map(direction => {
                  const neighbor = motorcycles[(index + direction + motorcycles.length) % motorcycles.length];
                  return <img key={direction} className="showcase-neighbor-photo" data-direction={direction}
                    src={showcaseImage(neighbor)} alt="" width="1920" height="1080" decoding="async" draggable={false} />;
                })}
              </div>
              <div className="showcase-info" id={`showcase-info-${moto.slug}`}>
                <div className="showcase-bottom-text">
                  <p className="showcase-description">{moto.features[0].description}</p>
                  <p className="showcase-price"><span>Diária · dias de semana</span><strong>{formatDailyPrice(moto.dailyPrice)}<small>/dia</small></strong><span className="rental-weekend-price">Finais de semana e feriados: {formatDailyPrice(moto.weekendDailyPrice)}/dia</span></p>
                </div>
                <div className="showcase-bottom-btn-wrapper"><a className="button button-primary showcase-link" href={`/motos/${moto.slug}`} tabIndex={active ? 0 : -1}>
                  <ButtonLabel>Saiba mais <ArrowUpRight size={19} aria-hidden="true" /></ButtonLabel>
                  <span className="sr-only"> sobre a {moto.name}</span>
                </a></div>
              </div>
            </div>
          </div>
        </article>;
      })}
    </div>
  </div>;
}
