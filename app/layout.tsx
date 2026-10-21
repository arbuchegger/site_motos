import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/site';
import { site } from '@/lib/content';
import './globals.css';
import './restored-sections.css';
export const metadata: Metadata = {
  title: { default: `${site.fullName} | BMW R 1300 GS no Nordeste`, template: `%s | ${site.fullName}` },
  description: 'Aluguel diário da BMW R 1300 GS em João Pessoa. Conheça as seis opções na Leandro MotorFast e consulte disponibilidade e condições pelo WhatsApp.',
  robots: { index: false, follow: true }, // Remova index:false ao publicar com dados reais.
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml' }, { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    apple: '/apple-touch-icon.png',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header />{children}<Footer /></body></html>;
}
