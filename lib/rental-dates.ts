// Calendário de tarifa para João Pessoa/PB. Pontos facultativos e recessos forenses não são feriados da locação.
// Fontes: Portaria MGI 11.460/2025 (nacionais); Lei PB 10.601/2015;
// Lei JP 13.768/2019, art. 5º, e calendário JFPB 2026.
// https://sistemas.jfpb.jus.br/media/SEI_5612511_Portaria_da_Direcao_do_Foro_1-1.pdf
const DAY = 86_400_000;
const fixed: Record<string,string> = {
  '01-01':'Confraternização Universal', '04-21':'Tiradentes', '05-01':'Dia do Trabalho',
  '06-24':'São João · João Pessoa', '08-05':'Data Magna da Paraíba / Nossa Senhora das Neves',
  '09-07':'Independência do Brasil', '10-12':'Nossa Senhora Aparecida', '11-02':'Finados',
  '11-15':'Proclamação da República', '11-20':'Dia da Consciência Negra',
  '12-08':'Nossa Senhora da Conceição · João Pessoa', '12-25':'Natal',
};
function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError('Escolha as datas de retirada e devolução.');
  const time=Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0,10)!==value) throw new RangeError('Confira as datas escolhidas.');
  return time;
}
function easter(year: number) {
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
  const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;
  return Date.UTC(year,month-1,day);
}
export function holidayName(value: string) {
  const time=parseDate(value);
  if (fixed[value.slice(5)]) return fixed[value.slice(5)];
  if (time===easter(new Date(time).getUTCFullYear())-2*DAY) return 'Sexta-feira Santa';
  return undefined;
}
export function rentalPeriod(pickup: string, dropoff: string) {
  const start=parseDate(pickup),end=parseDate(dropoff),days=(end-start)/DAY;
  if (days<1) throw new RangeError('A devolução precisa ser depois da retirada.');
  if (days>30) throw new RangeError('Para mais de 30 diárias, solicite um orçamento pelo atendimento.');
  let premiumDays=0,weekendDays=0,weekdayHolidays=0;
  const holidays: {date:string;name:string}[]=[];
  for(let time=start;time<end;time+=DAY){
    const date=new Date(time),iso=date.toISOString().slice(0,10),name=holidayName(iso),weekend=[0,6].includes(date.getUTCDay());
    if(weekend) weekendDays++;
    if(name){holidays.push({date:iso,name});if(!weekend) weekdayHolidays++;}
    if(weekend||name) premiumDays++;
  }
  return {days,premiumDays,weekendDays,weekdayHolidays,holidays};
}
export function shiftRentalDate(value:string,days:number){return new Date(parseDate(value)+days*DAY).toISOString().slice(0,10);}
export function formatRentalDate(value:string){return new Date(parseDate(value)).toLocaleDateString('pt-BR',{timeZone:'UTC'});}
