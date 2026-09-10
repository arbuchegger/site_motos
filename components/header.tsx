'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Logo, WhatsAppLink } from '@/components/site';
const navigation = [{ href: '/', label: 'Home' }, { href: '/#motos', label: 'Motos' }, { href: '/#como-funciona', label: 'Como funciona' }, { href: '/#contato', label: 'Contato' }];
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Menu principal">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><div className="header-actions"><WhatsAppLink className="button button-primary header-whatsapp" /><Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="menu-button" aria-label="Abrir menu" aria-expanded={open}><Menu size={24} aria-hidden="true" /></SheetTrigger><SheetContent className="mobile-menu" side="right" showCloseButton={false}><div className="mobile-menu-heading"><SheetTitle>Menu</SheetTitle><SheetClose className="menu-button menu-close" aria-label="Fechar menu"><X size={24} aria-hidden="true" /></SheetClose></div><SheetDescription className="sr-only">Navegue pela vitrine de motos.</SheetDescription><nav aria-label="Menu do celular">{navigation.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}</nav><WhatsAppLink /></SheetContent></Sheet></div></div></header>;
}
