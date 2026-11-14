'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowLeft, Calendar, ChevronDown, MessageCircle } from 'lucide-react';
import { motorcycles, site } from '@/lib/content';
import { equipment, equipmentConditions, equipmentPrice, rentalQuote } from '@/lib/equipment';
import { rentalPeriod, shiftRentalDate, formatRentalDate } from '@/lib/rental-dates';

const money = (value: number) => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

function openNativeDatePicker(event: MouseEvent<HTMLInputElement>) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // Leave the browser's default date input behavior available.
  }
}
const categories = [
  { name:'Jaquetas', ids:['jaqueta','parka'] },
  { name:'Luvas', ids:['luvas-verao','luvas-inverno'] },
  { name:'Capacetes', ids:['full-face','pinlock'] },
  { name:'Botas e calças', ids:['botas','calca'] },
  { name:'Top-cases', ids:['top-46','top-52','top-56','top-58'] },
  { name:'Malas laterais', ids:['lateral-21','lateral-22','lateral-36'] },
  { name:'Bolsas e outros equipamentos', ids:['tanque','punho','front-side'] },
];
export function RentalCheckout() {
  const [slug,setSlug] = useState(motorcycles[0].slug);
  const [pickup,setPickup] = useState('');
  const [dropoff,setDropoff] = useState('');
  const [today,setToday] = useState('');
  const [includeEquipment,setIncludeEquipment] = useState(false);
  const [selected,setSelected] = useState<string[]>([]);
  useEffect(()=>{
    setToday(new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Fortaleza'}).format(new Date()));
    const requested = new URLSearchParams(window.location.search).get('moto');
    if (requested && motorcycles.some(m=>m.slug===requested)) setSlug(requested);
  },[]);
  const moto = motorcycles.find(m=>m.slug===slug)!;
  let period: ReturnType<typeof rentalPeriod> | null = null;
  let dateError = '';
  if (pickup && today && pickup < today) {
    dateError = 'Escolha uma data de retirada a partir de hoje.';
  } else if (dropoff && today && dropoff <= today) {
    dateError = 'Escolha uma data de devolução a partir de amanhã.';
  } else if (pickup && dropoff) {
    try {
      period=rentalPeriod(pickup,dropoff);
    } catch(error) { dateError=error instanceof Error ? error.message : 'Confira as datas.'; }
  }
  const days=period?.days ?? 1;
  const extras = includeEquipment ? selected : [];
  const quote = period ? rentalQuote(moto.dailyPrice,moto.weekendDailyPrice,days,period.premiumDays,extras) : null;
  const chosen = equipment.filter(item=>extras.includes(item.id));
  const message = [
    `Olá! Gostaria de consultar uma reserva da ${moto.name}.`,
    period ? `Retirada: ${formatRentalDate(pickup)}. Devolução: ${formatRentalDate(dropoff)}. Período: ${days} diária(s), sendo ${days-period.premiumDays} com tarifa de semana e ${period.premiumDays} com tarifa de fim de semana/feriado.` : '',
    period?.holidays.length ? `Feriados no período: ${period.holidays.map(h=>`${formatRentalDate(h.date)} — ${h.name}`).join('; ')}.` : '',
    `Tarifas da moto: ${money(moto.dailyPrice)}/dia na semana e ${money(moto.weekendDailyPrice)}/dia em fins de semana e feriados.`,
    `Moto: ${quote ? money(quote.motorcycle) : 'Escolha as datas'}.`,
    chosen.length ? `Equipamentos:\n${chosen.map(item=>`- ${item.name}: ${money(equipmentPrice(item,days))} pelo período (equivalente a ${money(equipmentPrice(item,days)/days)}/dia)`).join('\n')}` : 'Sem equipamentos adicionais.',
    `Total estimado: ${quote ? money(quote.total) : 'Escolha as datas'}.`,
    period ? `Quilometragem inclusa: ${days*350} km. Caução, lavagem, combustível e km excedente não estão incluídos no total estimado.` : '',
    'Podemos confirmar as datas, a disponibilidade, tamanhos/compatibilidade, a caução e as demais condições? Entendo que os equipamentos extras não estão cobertos pelo seguro da moto.'
  ].join('\n');

  return <div className="rental-checkout">
    <a className="rental-back" href={`/motos/${moto.slug}`}><ArrowLeft size={17} aria-hidden="true"/>Voltar à moto</a>
    <div className="rental-layout">
      <div className="rental-options">
    <header className="rental-heading"><h1>Prepare sua <span className="accent">viagem.</span></h1><p>Escolha os detalhes. A gente confirma tudo pelo WhatsApp.</p></header>

        <section aria-labelledby="rental-moto-title"><h2 id="rental-moto-title">Datas da viagem</h2>
          <p className="rental-chosen-moto">{moto.name}</p>
          <div className="rental-period">
            <label className="rental-field">
              <span>Retirada</span>
              <span className="rental-date-control">
              <input id="rental-pickup" type="date" value={pickup} min={today || undefined} aria-describedby="rental-date-status" onClick={openNativeDatePicker} onChange={event => {
                const value = event.currentTarget.value;
                setPickup(value);
                if (value && dropoff && (dropoff <= value || dropoff > shiftRentalDate(value, 30))) setDropoff('');
              }} />
              <Calendar className="rental-date-icon" size={17} aria-hidden="true" />
              </span>
            </label>
            <label className="rental-field">
              <span>Devolução</span>
              <span className="rental-date-control">
                <input id="rental-dropoff" type="date" value={dropoff} min={pickup && pickup >= today ? shiftRentalDate(pickup, 1) : today ? shiftRentalDate(today, 1) : undefined} max={pickup && pickup >= today ? shiftRentalDate(pickup, 30) : undefined} aria-describedby="rental-date-status" onClick={openNativeDatePicker} onChange={event => setDropoff(event.currentTarget.value)} />
                <Calendar className="rental-date-icon" size={17} aria-hidden="true" />
              </span>
            </label>
          </div>
          <details className="rental-date-info"><summary>Saiba mais<ChevronDown size={17} aria-hidden="true"/></summary><div>
          <p id="rental-date-help" className="rental-note">Escolha a retirada e a devolução. A estimativa vai da retirada à véspera da devolução, de 1 a 30 diárias. Combine os horários no atendimento.</p>
          <p className="rental-note">Escolha a retirada e a devolução para ver a quantidade de diárias e o total.</p>
          <p className="rental-note">{money(moto.dailyPrice)}/dia na semana · {money(moto.weekendDailyPrice)}/dia em sábados, domingos e feriados. Calendário de João Pessoa/PB, com feriados nacionais e locais. Pontos facultativos não alteram a tarifa automaticamente.</p>
          </div></details>
          <div id="rental-date-status" aria-live="polite" aria-atomic="true">{dateError ? <p className="rental-date-error" role="alert">{dateError}</p> : period ? <><p className="rental-date-breakdown"><strong>{days} {days===1?'diária':'diárias'}</strong> · {days-period.premiumDays} de semana a {money(moto.dailyPrice)} + {period.premiumDays} de fim de semana/feriado a {money(moto.weekendDailyPrice)}.</p>
          {period.holidays.length>0 && <div className="rental-holiday-notice"><strong>Seu período inclui {period.holidays.length===1?'um feriado':'feriados'}.</strong><ul>{period.holidays.map(h=><li key={h.date}>{formatRentalDate(h.date)} — {h.name}</li>)}</ul><p>{period.weekdayHolidays>0 ? `A tarifa de feriado já foi aplicada. Acréscimo de ${money(period.weekdayHolidays*(moto.weekendDailyPrice-moto.dailyPrice))} em relação à tarifa de semana.` : 'Esses feriados caem no fim de semana e já estão na tarifa de fim de semana, sem cobrança em dobro.'}</p></div>}</> : null}</div>
        </section>
        <section className="rental-equipment" aria-labelledby="equipment-title"><h2 id="equipment-title">Deseja equipamentos?</h2><p>Leve o que faz sentido para a sua viagem.</p>
          <fieldset className="rental-choice"><legend className="sr-only">Incluir equipamentos</legend>{[[false,'Vou com meus equipamentos'],[true,'Quero adicionar equipamentos']].map(([value,label])=><label key={String(value)}><input type="radio" name="include-equipment" checked={includeEquipment===value} onChange={()=>setIncludeEquipment(Boolean(value))}/>{label}</label>)}</fieldset>
          {includeEquipment && <div className="rental-equipment-list"><a className="rental-summary-jump" href="#resumo-reserva">Ver resumo da reserva</a><p className="rental-note">{period ? `Preços pelo período de ${days} ${days===1?'dia':'dias'}. O valor por dia é a média equivalente, não uma tarifa adicional.` : 'Escolha as datas para consultar os valores dos equipamentos.'}</p>
            <div className="rental-categories">{categories.map(category=>{
              const items = equipment.filter(item=>category.ids.includes(item.id));
              const count = items.filter(item=>selected.includes(item.id)).length;
              return <details className="rental-category" name="equipment-category" key={category.name}><summary><span>{category.name}</span><span className="rental-category-count">{count ? `${count} selecionado${count>1?'s':''}` : `${items.length} opções`}</span><ChevronDown size={18} aria-hidden="true"/></summary><fieldset><legend className="sr-only">{category.name}</legend>{items.map(item=><div className="rental-item" key={item.id}>
                <label className="rental-item-choice"><input type="checkbox" checked={selected.includes(item.id)} onChange={e=>setSelected(current=>e.target.checked?[...current,item.id]:current.filter(id=>id!==item.id))}/><span>{item.name}</span><span className="rental-item-price"><strong>{period ? money(equipmentPrice(item,days)) : '—'}</strong>{period && <small>≈ {money(equipmentPrice(item,days)/days)}/dia</small>}</span></label>
              </div>)}</fieldset></details>;
            })}</div>
            <details className="rental-equipment-guide"><summary>Saiba mais sobre os equipamentos<ChevronDown size={17} aria-hidden="true"/></summary><div><p>{equipmentConditions}</p><p>Os valores abaixo são pelo período completo. As referências de indenização são previstas no contrato para casos de sinistro e não correspondem ao preço do aluguel.</p>
              {categories.map(category=><section className="rental-guide-category" key={category.name}><h3>{category.name}</h3>{equipment.filter(item=>category.ids.includes(item.id)).map(item=><div className="rental-guide-item" key={item.id}><h4>{item.name}</h4><dl>{['1 a 3 dias','4 a 10 dias','11 a 30 dias'].map((range,i)=><div key={range}><dt>{range}</dt><dd>{money(item.prices[i])} / período</dd></div>)}</dl>{item.replacement!==null && <p>Referência de indenização: <strong>{money(item.replacement)}</strong>.</p>}{item.note && <p>{item.note}</p>}</div>)}</section>)}
            </div></details>
          </div>}
        </section>
      </div>
      <aside id="resumo-reserva" className="rental-summary" aria-labelledby="rental-summary-title"><img src={`/images/bmw-r1300gs/cutouts/${moto.slug}.webp`} alt={moto.name} width={1024} height={683}/><h2 id="rental-summary-title">Sua viagem, em resumo</h2><p className="rental-moto-name">{moto.name}</p>{period && <p className="rental-summary-dates">{formatRentalDate(pickup)} → {formatRentalDate(dropoff)}</p>}<dl><div><dt>{period ? `${days} diárias da moto` : 'Diárias da moto'}</dt><dd>{quote ? money(quote.motorcycle) : 'Escolha as datas'}</dd></div>{chosen.map(item=><div key={item.id}><dt>{item.name}</dt><dd>{period ? money(equipmentPrice(item,days)) : '—'}</dd></div>)}{!chosen.length && <div><dt>Equipamentos adicionais</dt><dd>Sem extras</dd></div>}<div className="rental-total" aria-live="polite" aria-atomic="true"><dt>Total estimado</dt><dd>{quote ? money(quote.total) : '—'}</dd></div></dl>
        <p className="rental-note">{period ? `Inclui ${days*350} km.` : 'Cada diária inclui 350 km.'} Caução, lavagem, combustível, km excedente e outras despesas não estão incluídos neste total. Disponibilidade e condições sujeitas à confirmação.</p>
        <>{quote ? <a className="button button-primary" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true"/>Consultar disponibilidade<span className="sr-only"> (abre o WhatsApp em nova aba)</span></a> : <button className="button button-primary" type="button" disabled>Escolha as datas para continuar</button>}</><p className="rental-note rental-summary-footnote">Você envia uma solicitação. A reserva será confirmada no atendimento.</p>
      </aside>
    </div>
  </div>;
}
