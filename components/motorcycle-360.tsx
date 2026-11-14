'use client';

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Rotate3D } from 'lucide-react';
import { motorcycleSpinCopy as text, type Motorcycle } from '@/lib/content';
import { advanceSpinDrag, getMotorcycleSpin, pacedSpinStep, presentedSpinIndex, releaseSpinSteps, spinLoadingProgress, wrapSpinIndex } from '@/lib/motorcycle-spin';

export function Motorcycle360({ moto }: { moto: Motorcycle }) {
  const instructionsId = useId();
  const frames = useMemo(() => getMotorcycleSpin(moto.slug).slice(0, -1), [moto.slug]);
  const [shown, setShown] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [fallback, setFallback] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [decodedCount, setDecodedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const lastFrameAt = useRef(-Infinity);
  const loaded = useRef(new Set<number>());
  const failed = useRef(new Set<number>());
  const desired = useRef(0);
  const pendingAnnouncement = useRef(false);
  const gesture = useRef<null | { id: number; pointerType: string; x: number; y: number; lastX: number; residual: number; active: boolean; changed: boolean }>(null);

  function announcePresented(index: number) {
    const actual = presentedSpinIndex(index, desired.current, pendingAnnouncement.current, Boolean(gesture.current?.active));
    if (actual !== null && !failed.current.has(actual)) {
      setAnnouncement(`${frames[actual].angle} da ${moto.color}`);
      pendingAnnouncement.current = false;
    }
  }
  function present(index: number) {
    setShown(index);
    setFallback(false);
    announcePresented(index);
  }

  useEffect(() => {
    let disposed = false;
    let readyTimer: ReturnType<typeof setTimeout>;
    lastFrameAt.current = -Infinity;
    loaded.current.clear(); failed.current.clear(); desired.current = 0;
    setDecodedCount(0); setReady(false); setUnavailable(false); setShown(0); setFallback(false);
    const images = frames.map((frame, index) => {
      const image = new Image();
      const fail = () => {
        if (disposed) return;
        failed.current.add(index);
        setUnavailable(true);
      };
      image.onload = async () => {
        try {
          await image.decode();
          if (disposed) return;
          loaded.current.add(index);
          setDecodedCount(loaded.current.size);
          if (loaded.current.size === frames.length) readyTimer = setTimeout(() => { if (!disposed) setReady(true); }, 120);
        } catch { fail(); }
      };
      image.onerror = fail;
      image.src = frame.src;
      return image;
    });
    return () => { disposed = true; clearTimeout(readyTimer); images.forEach(image => { image.onload = null; image.onerror = null; }); };
  }, [frames, attempt]);

  function select(index: number, announce = true) {
    if (!ready || unavailable) return;
    desired.current = wrapSpinIndex(index, frames.length);
    pendingAnnouncement.current = announce;
    if (loaded.current.has(desired.current)) present(desired.current);
  }
  function step(direction: number, announce = true) {
    if (!ready || unavailable) return false;
    const now = performance.now();
    const adjacent = pacedSpinStep(direction, now, lastFrameAt.current);
    if (!adjacent) return false;
    lastFrameAt.current = now;
    select(desired.current + adjacent, announce);
    return true;
  }
  function moveGesture(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId || (current.pointerType === 'mouse' && event.buttons === 0)) return;
    const dx = Math.abs(event.clientX - current.x);
    if (!current.active) {
      if (dx < (current.pointerType === 'mouse' ? 8 : 4)) return;
      current.active = true;
      if (event.type !== 'pointerup') event.currentTarget.setPointerCapture(event.pointerId);
    }
    const next = advanceSpinDrag(current.residual, current.lastX - event.clientX, event.currentTarget.clientWidth, current.pointerType);
    current.lastX = event.clientX;
    current.residual = next.residual;
    if (next.steps) {
      if (step(next.steps, false)) current.changed = true;
    }
  }
  function finish(event: PointerEvent<HTMLDivElement>, complete = false) {
    if (gesture.current?.id !== event.pointerId) return;
    const current = gesture.current;
    const finalStep = complete ? releaseSpinSteps(current.residual, current.active, current.changed, current.pointerType) : 0;
    if (finalStep) step(finalStep, false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    gesture.current = null;
    pendingAnnouncement.current = true;
    announcePresented(loaded.current.has(desired.current) ? desired.current : shown);
  }

  const progress = spinLoadingProgress(decodedCount, frames.length);
  return <div className="motorcycle-spin" data-spin-color={moto.slug} data-spin-ready={ready}>
    <div className="motorcycle-spin-stage" role="region" aria-label={`Visão 360° da ${moto.name}`} aria-describedby={instructionsId} aria-busy={!ready} tabIndex={0}
      onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        if (event.key === 'Home') select(0);
        else if (event.key === 'End') select(frames.length - 1);
        else step(event.key === 'ArrowRight' ? 1 : -1);
      }}
      onPointerDown={event => {
        if (!ready || unavailable || !event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button')) { gesture.current = null; return; }
        lastFrameAt.current = -Infinity;
        gesture.current = { id: event.pointerId, pointerType: event.pointerType, x: event.clientX, y: event.clientY, lastX: event.clientX, residual: 0, active: false, changed: false };
      }}
      onPointerMove={moveGesture}
      onPointerUp={event => { moveGesture(event); finish(event, true); }} onPointerCancel={event => finish(event)} onLostPointerCapture={() => { gesture.current = null; }}>
      <img src={fallback ? moto.image : frames[shown].src} alt={fallback ? `${moto.name}. Imagem ilustrativa.` : `${moto.name} — ${frames[shown].angle}. Imagem ilustrativa.`} width={1536} height={1024} draggable={false} fetchPriority="high" onError={() => { setFallback(true); setUnavailable(true); setReady(false); }} />
      {!ready && <div className="spin-loading-screen">
        <div className="spin-loading" role="progressbar" aria-label="Preparando todas as imagens do 360" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <svg viewBox="0 0 64 64" aria-hidden="true"><circle className="spin-loading-track" cx="32" cy="32" r="27" /><circle className="spin-loading-fill" cx="32" cy="32" r="27" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} /></svg>
          <span>{progress}%</span>
        </div>
        {unavailable ? <div className="spin-loading-error" role="status"><p>Não foi possível carregar todas as fotos.</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button></div> : <p className="spin-loading-caption">Preparando o 360°</p>}
      </div>}
    </div>
    <div className="motorcycle-spin-controls">
      <button type="button" aria-label={text.previous} disabled={!ready || unavailable} onClick={() => step(-1)}><ChevronLeft aria-hidden="true" size={22} /></button>
      <p><Rotate3D size={23} aria-hidden="true" /><b className="spin-preview-label" aria-hidden="true">360°</b><span>360°<small>{unavailable ? text.unavailable : text.hint}</small></span></p>
      <button type="button" aria-label={text.next} disabled={!ready || unavailable} onClick={() => step(1)}><ChevronRight aria-hidden="true" size={22} /></button>
    </div>
    <p id={instructionsId} className="sr-only">{text.hint}. {text.keyboard}</p>
    <p className="spin-disclaimer">{text.disclaimer}</p>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
  </div>;
}
