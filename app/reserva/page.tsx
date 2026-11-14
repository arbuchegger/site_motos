import type { Metadata } from 'next';
import { RentalCheckout } from '@/components/rental-checkout';
import 'react-day-picker/style.css';
import './rental.css';

export const metadata: Metadata = { title:'Prepare sua reserva', description:'Escolha a moto, o período e os equipamentos para consultar sua reserva pelo WhatsApp.', robots: { index: false, follow: true } };
export default function ReservationPage() { return <main id="conteudo"><RentalCheckout/></main>; }
