import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/site';
import { site } from '@/lib/content';
import './globals.css';
export const metadata: Metadata = {
  title: { default: `${site.fullName} | Aluguel de motos`, template: `%s | ${site.fullName}` },
  description: 'Encontre uma moto para o seu caminho. Conheça os modelos e consulte valores e condições diretamente pelo WhatsApp. Vitrine demonstrativa.',
  robots: { index: false, follow: true }, // Remova index:false ao publicar com dados reais.
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header />{children}<Footer /></body></html>;
}
