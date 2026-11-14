'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Logo, WhatsAppLink } from '@/components/site';
const navigation = [
  { href: '/', label: 'Home' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#motos', label: 'Motos' },
  { href: '/#duvidas', label: 'FAQ' },
  { href: '/#contato', label: 'Contato' },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const motorcyclePage = pathname.startsWith('/motos/');
  const [hideHeader, setHideHeader] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [lightHeader, setLightHeader] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    setHideHeader(false);
    const update = () => {
      const currentY = Math.max(0, window.scrollY);
      if (currentY <= 0) { setHideHeader(false); previousY = 0; return; }
      if (Math.abs(currentY - previousY) < 6) return;
      setHideHeader(currentY > previousY);
      previousY = currentY;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [pathname]);
  useEffect(() => {
    if (!isHome) return;
    const hero = document.querySelector('.hero-slideshow');
    if (!hero) return;
    const catalog = document.getElementById('motos');
    const update = () => {
      const height = headerRef.current?.offsetHeight ?? 84;
      setPastHero(hero.getBoundingClientRect().bottom <= height);
      const sampleY = height + 2;
      const catalogBounds = catalog?.getBoundingClientRect();
      if (catalogBounds && catalogBounds.top <= sampleY && catalogBounds.bottom > sampleY) {
        setLightHeader(false);
        return;
      }
      let element = document.elementFromPoint(8, sampleY);
      while (element) {
        const rgb = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (rgb && (rgb.length < 4 || rgb[3] === 1)) {
          setLightHeader(rgb[0] < 40 && rgb[1] < 40);
          break;
        }
        element = element.parentElement;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(hero);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [isHome]);
  return <header ref={headerRef} data-light-surface={isHome && lightHeader || undefined} data-motorcycle-page={motorcyclePage || undefined} data-reservation-page={pathname.startsWith('/reserva') || undefined} data-scroll-hidden={hideHeader && !open || undefined} className={`site-header${isHome ? ' header-over-hero' : ''}${isHome && !pastHero && !open ? ' is-transparent' : ''}`}><div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Menu principal">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><div className="header-actions"><WhatsAppLink className="button button-primary header-whatsapp" /><Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="menu-button" aria-label="Abrir menu" aria-expanded={open}><Menu size={24} aria-hidden="true" /></SheetTrigger><SheetContent className="mobile-menu" side="right" showCloseButton={false}><div className="mobile-menu-heading"><SheetTitle>Menu</SheetTitle><SheetClose className="menu-button menu-close" aria-label="Fechar menu"><X size={24} aria-hidden="true" /></SheetClose></div><SheetDescription className="sr-only">Navegue pela vitrine de motos.</SheetDescription><nav aria-label="Menu do celular">{navigation.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav><WhatsAppLink /></SheetContent></Sheet></div></div></header>;
}
