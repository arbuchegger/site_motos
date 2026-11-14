'use client';


import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WhatsAppLink } from '@/components/site';

export function ServiceArea() {
  const [showCity, setShowCity] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showCity) return;
    const close = (event: PointerEvent) => { if (!markerRef.current?.contains(event.target as Node)) setShowCity(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [showCity]);

  return <section className="section service-area" id="onde-estamos" aria-labelledby="service-title">
    <div className="container">
      <div className="section-heading section-heading-centered revela"><p className="service-eyebrow">NOSSA LOCALIZAÇÃO</p><h2 id="service-title">Onde <span className="heading-accent">estamos</span></h2><p>Sua próxima viagem começa em João Pessoa.</p></div>
      <div className="service-layout">
        <div className="service-info">
          <div className="service-city revela"><MapPin size={26} aria-hidden="true" /><div><h3>João Pessoa</h3><p>Paraíba · Nordeste</p><span className="service-status"><i aria-hidden="true" />Disponível</span></div></div>
          <div className="service-followup revela">
          <p className="service-description">Converse com a gente para combinar a retirada da sua BMW e planejar os próximos quilômetros.</p>
          <WhatsAppLink>Verificar atendimento</WhatsAppLink>
          </div>
        </div>
        <div className="service-map revela">
          <div className="service-map-canvas">
            <img src="/images/mapa-nordeste.svg" width="420" height="460" alt="Mapa do Nordeste com a Paraíba destacada e João Pessoa marcada" loading="lazy" />
            <div ref={markerRef} className={`service-marker${showCity ? ' is-open' : ''}`}>
              <button type="button" className="service-marker-target" aria-label="João Pessoa: atendimento disponível" aria-expanded={showCity} aria-controls="city-tooltip" onClick={() => { if (window.matchMedia('(max-width: 767px)').matches) setShowCity(value => !value); }} onKeyDown={event => { if (event.key === 'Escape') setShowCity(false); }}><span className="radar-dot" /><span className="radar-ring" /><span className="radar-ring radar-ring-delayed" /></button>
              <div className="city-tooltip" id="city-tooltip"><strong>João Pessoa</strong><span><i aria-hidden="true" />Disponível</span></div>
            </div>
          </div>
          <p className="service-map-caption"><span />João Pessoa, PB</p>
        </div>
      </div>
    </div>
  </section>;
}
