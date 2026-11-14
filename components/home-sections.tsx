'use client';

import { useEffect, useRef } from 'react';
import { Bike, MessageCircle, KeyRound, ChevronDown } from 'lucide-react';
import { copy, site } from '@/lib/content';
import { WhatsAppLink } from '@/components/site';
import { ServiceArea } from '@/components/service-area';

const icons = [Bike, MessageCircle, KeyRound];
const questions = [
  ['O que preciso para alugar?', 'É necessário ter pelo menos 25 anos e CNH válida na categoria A, emitida há no mínimo 2 anos. Para a análise da reserva, envie RG, CPF, CNH e comprovante de residência atualizado pelo WhatsApp. Na retirada, apresente a habilitação e um cartão de crédito com limite disponível para a caução. A locação depende da aprovação da documentação e da disponibilidade da moto.'],
  ['Como funcionam as diárias e os quilômetros?', 'O aluguel é cobrado por diária, com tarifas diferentes durante a semana, nos finais de semana e feriados. Cada diária inclui 350 km: por exemplo, 2 diárias dão direito a 700 km. O excedente custa de R$ 0,70 a R$ 1,30 por km, conforme o modelo. O checkout calcula a estimativa pelas datas escolhidas; confirme os horários de retirada e devolução e o orçamento final no atendimento.'],
  ['A moto tem seguro? Preciso de caução?', 'Sim, todas as motos possuem seguro. Na retirada, é necessário bloquear um valor de caução no cartão de crédito, informado antes da contratação. Se o seguro não for acionado e não houver despesas pendentes, o bloqueio é liberado após a devolução e a vistoria, conforme o contrato. Danos, quilômetros extras e outras despesas podem ser descontados. Confirme a franquia, as coberturas e as exclusões do seguro antes de reservar.'],
  ['Posso alugar equipamentos junto com a moto?', 'Sim. Há capacetes, jaquetas, luvas, botas, calça, baús, malas e bolsas, sujeitos à disponibilidade, aos tamanhos e à compatibilidade com a moto. O aluguel de equipamentos é exclusivo para quem também aluga uma motocicleta. Selecione os itens no checkout: os preços são por período de 1 a 3, 4 a 10 ou 11 a 30 dias. Em “Saiba mais sobre os equipamentos”, consulte as condições. Os extras não estão cobertos pelo seguro da moto; danos, furto ou roubo podem gerar indenização conforme o contrato.'],
  ['Como faço a reserva?', 'Escolha a moto, marque a retirada e a devolução e selecione os equipamentos desejados no checkout. Depois, envie o resumo pelo WhatsApp. O atendimento confirma a disponibilidade, os valores, o sinal da reserva, o pagamento e o local de retirada. Combine seu roteiro antes de reservar: viagens internacionais exigem autorização prévia e uma taxa adicional pela documentação. Confira também as condições de cancelamento e remarcação antes de confirmar.'],
  ['Como devo devolver a moto?', 'A moto é entregue com o tanque cheio e deve ser devolvida da mesma forma, no horário combinado. Há uma taxa de lavagem de R$ 80,00 a R$ 140,00, dependendo do estado da moto na devolução. Na vistoria, também são apurados combustível faltante, quilômetros excedentes e eventuais danos na moto ou nos equipamentos alugados. Se precisar alterar a devolução, combine antes com o atendimento.'],
];

export function HomeSections({ section = 'details' }: { section?: 'how' | 'details' }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const region = root.current;
    if (!region) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pending = Array.from(region.querySelectorAll<HTMLElement>('.revela'));
    let frame = 0;
    const reveal = () => {
      frame = 0;
      pending = pending.filter(element => {
        if (!preference.matches && element.getBoundingClientRect().top > window.innerHeight * .92) return true;
        element.dataset.visivel = 'true';
        return false;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(reveal); };
    // Same scroll reveal as the original prototype; no hidden content without JS.
    region.dataset.anima = 'true';
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      delete region.dataset.anima;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
    };
  }, []);

  return <div ref={root} className="restored-sections">
    {section === 'how' ? <section className="section motorfast-how" id="como-funciona" aria-labelledby="how-title">
      <div className="container">
        <div className="section-heading section-heading-centered revela"><h2 id="how-title">Como <span className="heading-accent">funciona</span></h2><p>Três passos, e o terceiro já tem destino: sua próxima aventura.</p></div>
        <ol className="passos">{copy.steps.map((step, index) => {
          const Icon = icons[index];
          return <li className="revela" key={step.title}><div className="passo"><span className="passo-n" aria-hidden="true">{index + 1}</span><div className="passo-icone"><Icon size={23} aria-hidden="true" /></div><h3><span className="step-desktop">{step.title}</span><span className="step-mobile">{["Escolha", "Reserve", "Retire"][index]}</span></h3><p className="step-desktop">{step.description}</p><p className="step-mobile">{["Encontre a GS do seu estilo.", "Combine datas e valores pelo WhatsApp.", "Envie os documentos e combine a retirada."][index]}</p></div></li>;
        })}</ol>
      </div>
    </section> : <><ServiceArea />
    <section className="section motorfast-faq" id="duvidas" aria-labelledby="faq-title">
      <div className="container duvidas-grade">
        <div className="duvidas-intro revela"><span className="faq-badge">FAQ</span><h2 id="faq-title">Dúvida</h2><p>O que mais perguntam antes de fechar. Se a sua não estiver aqui, é só chamar.</p><WhatsAppLink>Tirar uma dúvida</WhatsAppLink></div>
        <div className="duvidas">{questions.map(([question, answer]) => <div className="revela" key={question}><details className="duvida"><summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary><div className="duvida-corpo">{answer}</div></details></div>)}</div>
      </div>
    </section>
    <section className="section" id="contato" aria-labelledby="contact-title"><div className="container revela"><div className="contato-carta">
      <div className="restored-contact-intro"><h2 id="contact-title">Fale com a gente</h2><p>Diga qual cor da GS te interessou e conte seus planos pelo Nordeste. A Paraíba MotorFast responde com valores, disponibilidade e orientações para a retirada.</p><WhatsAppLink /></div>
      <div><dl className="dados"><div><dt>WhatsApp e telefone</dt><dd><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></dd></div><div><dt>Onde estamos</dt><dd><address>{site.address.street}<br />{site.address.city}</address></dd></div><div><dt>Horário de atendimento</dt><dd>{site.hours.weekdays}<br />{site.hours.saturday}</dd></div></dl><p className="demo-note">{copy.demoContact}</p><div className="contact-mobile-action"><WhatsAppLink /></div></div>
    </div></div></section></>}
  </div>;
}
