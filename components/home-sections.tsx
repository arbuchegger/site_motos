'use client';

import { useEffect, useRef } from 'react';
import { Bike, MessageCircle, KeyRound, ChevronDown } from 'lucide-react';
import { copy, site } from '@/lib/content';
import { WhatsAppLink } from '@/components/site';
import { ServiceArea } from '@/components/service-area';

const icons = [Bike, MessageCircle, KeyRound];
const questions = [
  ['Quais são os requisitos para alugar?', 'É necessário ter pelo menos 18 anos e CNH válida na categoria A. Também solicitamos RG, CPF e comprovante de residência atualizado.'],
  ['Quais documentos preciso enviar?', 'Envie RG, CPF, CNH na categoria A e comprovante de residência emitido há no máximo 90 dias. Todos os documentos podem ser enviados em PDF ou foto legível pelo WhatsApp.'],
  ['O que está incluso na diária?', 'Consulte pelo WhatsApp os itens incluídos na sua locação, como seguro, assistência e franquia de quilometragem, além de eventuais custos adicionais. Confirme as condições antes de reservar.'],
  ['Qual é o período mínimo de aluguel?', 'O período mínimo de aluguel é de uma diária. Consulte pelo WhatsApp a disponibilidade para as datas da sua viagem.'],
  ['Como funciona o pagamento da reserva?', 'Para reservar, é necessário um adiantamento de 50% do valor total da locação. Esse valor é descontado do total do aluguel, sem cobrança adicional. Para uma ou mais diárias, o percentual é calculado sobre todo o período reservado.'],
  ['Posso viajar pelo Nordeste com a GS?', 'Sim. As viagens podem ir até 500 km além da região metropolitana de João Pessoa. Informe seu roteiro pelo WhatsApp antes de reservar para confirmar se ele está dentro da área permitida.'],
  ['E se a moto apresentar um problema?', 'Entre em contato com a Leandro MotorFast pelo WhatsApp e envie fotos, vídeos e outros registros do ocorrido para análise da seguradora. A cobertura, uma eventual isenção e a responsabilidade por custos dependerão da análise e das condições do seguro e do contrato de locação.'],
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
      <div className="restored-contact-intro"><h2 id="contact-title">Fale com a gente</h2><p>Diga qual cor da GS te interessou e conte seus planos pelo Nordeste. A Leandro MotorFast responde com valores, disponibilidade e orientações para a retirada.</p><WhatsAppLink /></div>
      <div><dl className="dados"><div><dt>WhatsApp e telefone</dt><dd><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></dd></div><div><dt>Onde estamos</dt><dd><address>{site.address.street}<br />{site.address.city}</address></dd></div><div><dt>Horário de atendimento</dt><dd>{site.hours.weekdays}<br />{site.hours.saturday}</dd></div></dl><p className="demo-note">{copy.demoContact}</p></div>
    </div></div></section></>}
  </div>;
}
