'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import { site, copy } from '@/lib/content';
import { WhatsAppLink } from '@/components/site';

const slides = [
  { src: site.heroImage, asset: 'light-white', width: 2752, height: 1536, label: 'Light White à beira-mar' },
  { src: '/images/bmw-r1300gs/banner-racing-red-sr-2048.webp', asset: 'racing-red', width: 2048, height: 1144, label: 'Racing Red nas dunas da praia' },
  { src: '/images/bmw-r1300gs/banner-triple-black-sr-2752.webp', asset: 'triple-black', width: 2752, height: 1536, label: 'Triple Black no mirante da praia' },
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const manualRef = useRef(false);
  const suppressLink = useRef(false);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const selectSlide = (index: number) => {
    manualRef.current = true;
    setManual(true);
    setActive((index + slides.length) % slides.length);
  };
  const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
    suppressLink.current = false;
    if (event.pointerType === 'mouse') return;
    if (!event.isPrimary) { gesture.current = null; return; }
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    suppressLink.current = Math.abs(dx) > 10 || Math.abs(dy) > 10;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      selectSlide(active + (dx < 0 ? 1 : -1));
    }
  };
  useEffect(() => {
    if (manual) return;
    const timer = window.setInterval(() => {
      if (!manualRef.current) setActive(index => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [manual]);

  return <section className="hero hero-slideshow" aria-labelledby="hero-title">    <div className="hero-slides" aria-label="Paisagens com a BMW R 1300 GS" onPointerDown={startSwipe} onPointerUp={endSwipe} onPointerCancel={() => { gesture.current = null; suppressLink.current = true; }}>
      {slides.map((slide, index) => <img key={slide.src} className={`hero-slide${active === index ? ' is-active' : ''}`} src={slide.src}
        srcSet={[960, 1600, slide.width].map(width => `/images/bmw-r1300gs/banner-${slide.asset}-sr-${width}.webp ${width}w`).join(', ')}
        sizes="(max-width: 767px) 180vw, (max-width: 1056px) 1056px, 100vw"
        alt={`BMW R 1300 GS ${slide.label}. Imagem ilustrativa.`} aria-hidden={index !== active} width={slide.width} height={slide.height} fetchPriority={index === 0 ? 'high' : 'low'} decoding={index === 0 ? 'auto' : 'async'} />)}
      <a className="hero-photo-link" href={`/motos/bmw-r1300gs-${slides[active].asset}/`} aria-label={`Ver detalhes da BMW R 1300 GS ${slides[active].label}`} draggable={false} onClick={event => {
        if (suppressLink.current && event.detail !== 0) event.preventDefault();
      }} />
    </div>
    <div className="hero-shade" />
    <div className="container hero-content"><p className="eyebrow">{copy.heroEyebrow}</p><h1 id="hero-title">{copy.heroTitle.split(/(te espera!)/).map((part, index) => part === 'te espera!' ? <span key={index}>{part}</span> : part)}</h1><p className="hero-description">{copy.heroDescription}</p><div className="actions"><a className="button button-primary" href="#motos">Escolher minha GS <ArrowDown size={19} aria-hidden="true" /></a><WhatsAppLink className="button button-glass" /></div></div>
    <div className="hero-slide-controls" role="group" aria-label="Controles das fotos do banner">
      {slides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Mostrar ${slide.label}`} aria-pressed={active === index} onClick={() => selectSlide(index)}><span /></button>)}
    </div>
  </section>;
}
