import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { HeaderBoundary } from '@/components/header-boundary';
import { Footer } from '@/components/site';
import { site } from '@/lib/content';
import './globals.css';
import './restored-sections.css';
import './experimental-editorial.css';
import './motorcycle-showcase.css';
import './hero-responsive.css';
import './motorcycle-detail.css';
const socialImage = '/images/paraiba-motorfast-whatsapp.png';
export const metadata: Metadata = {
  metadataBase: new URL('https://paraibamotorfast.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.fullName,
    title: 'Paraíba MotorFast | BMW R 1300 GS',
    description: 'Planeje sua viagem de BMW R 1300 GS por João Pessoa e pelo Nordeste. Consulte a disponibilidade pelo WhatsApp.',
    images: [{ url: socialImage, width: 600, height: 600, alt: 'Símbolo PM da Paraíba MotorFast' }],
  },
  twitter: {
    card: 'summary',
    images: [socialImage],
  },
  title: { default: `${site.fullName} | BMW R 1300 GS no Nordeste`, template: `%s | ${site.fullName}` },
  description: 'Aluguel diário da BMW R 1300 GS em João Pessoa. Conheça as seis opções na Paraíba MotorFast e consulte disponibilidade e condições pelo WhatsApp.',
  icons: {
    icon: [{ url: '/favicon-pm.png', type: 'image/png', sizes: '96x96' }],
    apple: '/apple-touch-icon.png?v=4',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fallbackHeader = (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/">{site.fullName}</a>
        <a href="/#motos">Motos</a>
      </div>
    </header>
  );
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <HeaderBoundary fallback={fallbackHeader}><Header /></HeaderBoundary>
        {children}
        <Footer />
      </body>
    </html>
  );
}
