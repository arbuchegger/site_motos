'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import { copy } from '@/lib/content';
import { ButtonLabel } from '@/components/button-label';
import { swipeDirection } from '@/lib/touch-gestures';

const slides = [
  { src: '/images/experiments/racing-red-sunset-film-1678.webp', asset: 'racing-red', width: 1678, height: 937, label: 'Racing Red nas dunas da praia', title: ['O Nordeste', 'te espera!'], description: copy.heroDescription },
  { src: '/images/experiments/light-white-praia-final-2048.webp', asset: 'light-white', width: 2048, height: 1144, label: 'Light White à beira-mar', title: ['Light', 'White'], description: 'Branco marcante para explorar o Nordeste.\nNa sua GS, o horizonte é um convite.' },
  { src: '/images/experiments/triple-black-road-grain-2048.webp', asset: 'triple-black', width: 2048, height: 1144, label: 'Triple Black na estrada', title: ['Triple', 'Black'], description: 'Presença discreta, espírito de aventura.\nDescubra o Nordeste na sua Triple Black.' },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const manualRef = useRef(false);
  const suppressLink = useRef(false);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const selectSlide = (index: number) => {
    manualRef.current = true;
    setManual(true);
    setActive((index + slides.length) % slides.length);
  };
  const startSwipe = (event: PointerEvent<HTMLElement>) => {
    suppressLink.current = false;
    if (event.pointerType === 'mouse' || (event.target as HTMLElement).closest('button')) return;
    if (!event.isPrimary) { gesture.current = null; return; }
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const endSwipe = (event: PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    suppressLink.current = Math.abs(dx) > 10 || Math.abs(dy) > 10;
    const direction = swipeDirection(dx, dy, event.pointerType);
    if (direction) selectSlide(active + direction);
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      if (!window.matchMedia('(min-width: 768px)').matches) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [role="slider"], [role="tablist"]')) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom <= 84 || rect.top >= window.innerHeight) return;
      if (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 84) < Math.min(rect.height, window.innerHeight) * .5) return;
      event.preventDefault();
      manualRef.current = true;
      setManual(true);
      setActive(index => (index + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  useEffect(() => {
    if (manual) return;
    const timer = window.setInterval(() => {
      if (!manualRef.current) setActive(index => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [manual]);

  return <section ref={heroRef} className={`hero hero-slideshow${manual ? ' is-manual' : ''}`} aria-labelledby="hero-title"
    onPointerDown={startSwipe} onPointerUp={endSwipe}
    onPointerMove={event => {
      const start = gesture.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (swipeDirection(dx, dy, event.pointerType)) {
        event.currentTarget.setPointerCapture(event.pointerId);
        endSwipe(event);
      }
    }}
    onPointerCancel={() => { gesture.current = null; suppressLink.current = true; }}
    onClickCapture={event => { if (suppressLink.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } }}>
    <div className="hero-slides" aria-label="Paisagens com a BMW R 1300 GS">
      {slides.map((slide, index) => <picture key={slide.src} className={`hero-slide${active === index ? ' is-active' : ''}`} data-model={slide.asset} aria-hidden={index !== active}>
        <source media="(max-aspect-ratio: 4/5), (min-width:600px) and (max-width:767px) and (orientation:portrait), (min-width:768px) and (max-width:1399px) and (orientation:portrait)" srcSet={`/images/experiments/${slide.asset}-mobile-film.webp`} />
        <img src={slide.src}
        srcSet={[960, 1600, slide.width].map(width => `${slide.asset === 'racing-red' ? `/images/experiments/racing-red-sunset-film-${width}.webp` : slide.asset === 'light-white' ? `/images/experiments/light-white-praia-final-${width}.webp` : `/images/experiments/triple-black-road-grain-${width}.webp`} ${width}w`).join(', ')}
        sizes="100vw"
        alt={`BMW R 1300 GS ${slide.label}. Imagem ilustrativa.`} width={slide.width} height={slide.height} fetchPriority={index === 0 ? 'high' : 'low'} decoding={index === 0 ? 'auto' : 'async'} /></picture>)}
      <a className="hero-photo-link" href={`/motos/bmw-r1300gs-${slides[active].asset}/`} aria-label={`Ver detalhes da BMW R 1300 GS ${slides[active].label}`} draggable={false} onClick={event => {
        if (suppressLink.current && event.detail !== 0) event.preventDefault();
      }} />
    </div>
    <div className="hero-shade" />
    <div className="container hero-content">
      <div className={`hero-copy${active > 0 ? ' hero-copy-monochrome' : ''}`} key={slides[active].asset}>
        <p className="eyebrow hero-copy-secondary">{copy.heroEyebrow}</p>
        <div className="hero-title-reveal">
          <h1 id="hero-title" aria-label={slides[active].title.join(' ')}>
            {slides[active].title.map((line, lineIndex) => (
              <span className={`hero-title-line${lineIndex === 1 ? ' hero-title-accent' : ''}`} key={line} aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>
        </div>
        <div className="hero-copy-secondary">
          <p className="hero-description">{slides[active].description.split('\n').map((line, index) => <span className="hero-description-line" key={index}>{line}</span>)}</p>
          <div className="actions"><a className="button button-primary" href={active === 0 ? '#motos' : `/motos/bmw-r1300gs-${slides[active].asset}/`}><ButtonLabel>{active === 0 ? 'Escolher minha GS' : 'Saiba mais'} <ArrowDown size={19} aria-hidden="true" /></ButtonLabel></a></div>
        </div>
      </div>
    </div>
    <div className="hero-slide-controls" role="group" aria-label="Controles das fotos do banner">
      {slides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Mostrar ${slide.label}`} aria-pressed={active === index} onClick={() => selectSlide(index)}><span /></button>)}
    </div>
  </section>;
}
