export type Equipment = { id: string; name: string; group: 'Proteção' | 'Bagagem'; prices: readonly [number, number, number]; replacement: number | null; note?: string };
// Valores por PERÍODO da tabela de junho/2026; indenizações do anexo do contrato.
export const equipment: Equipment[] = [
  { id:'jaqueta', name:'Jaqueta convencional com forro', group:'Proteção', prices:[90,135,180], replacement:900 },
  { id:'parka', name:'Jaqueta parka com forro', group:'Proteção', prices:[110,165,220], replacement:1400 },
  { id:'botas', name:'Botas impermeáveis', group:'Proteção', prices:[80,120,160], replacement:650 },
  { id:'calca', name:'Calça com forro', group:'Proteção', prices:[80,120,160], replacement:800 },
  { id:'full-face', name:'Capacete full face', group:'Proteção', prices:[80,120,160], replacement:700 },
  { id:'pinlock', name:'Capacete articulado com Pinlock', group:'Proteção', prices:[110,165,220], replacement:1300 },
  { id:'luvas-verao', name:'Luvas de verão', group:'Proteção', prices:[20,30,40], replacement:100 },
  { id:'luvas-inverno', name:'Luvas de inverno impermeáveis', group:'Proteção', prices:[30,45,60], replacement:300 },
  { id:'top-46', name:'Top-case Givi 46 L · policarbonato', group:'Bagagem', prices:[70,105,140], replacement:750 },
  { id:'top-52', name:'Top-case Givi 52 L · policarbonato', group:'Bagagem', prices:[125,185,250], replacement:1500 },
  { id:'top-56', name:'Top-case Givi 56 L · policarbonato', group:'Bagagem', prices:[125,185,250], replacement:2000 },
  { id:'top-58', name:'Top-case Givi 58 L · alumínio com encosto', group:'Bagagem', prices:[200,300,400], replacement:3800 },
  { id:'lateral-21', name:'Malas laterais Givi 21 L · policarbonato (par)', group:'Bagagem', prices:[70,105,140], replacement:900 },
  { id:'lateral-22', name:'Malas laterais Givi 22 L · policarbonato (par)', group:'Bagagem', prices:[125,185,250], replacement:1500 },
  { id:'lateral-36', name:'Malas laterais Givi 36 L · alumínio (par) com tanques de gasolina', group:'Bagagem', prices:[400,600,800], replacement:6000 },
  { id:'tanque', name:'Bolsa Givi de tanque 5 L / Givi Stank 40 L', group:'Bagagem', prices:[50,75,100], replacement:null, note:'A tabela reúne as duas opções na mesma linha. Confirme a opção desejada. O contrato informa R$ 600 de referência para a bolsa de tanque de 5 L; consulte o valor da outra opção.' },
  { id:'punho', name:'Protetor de punho Givi para frio extremo', group:'Proteção', prices:[50,75,100], replacement:500 },
  { id:'front-side', name:'Bolsa para protetor de motor Front Side', group:'Bagagem', prices:[40,60,80], replacement:390 },
];
export const equipmentConditions = 'Equipamentos disponíveis somente junto com a locação de uma moto. Confirme tamanhos, compatibilidade e disponibilidade antes da reserva. Os extras não estão cobertos pelo seguro da moto. Em caso de danos, furto ou roubo, poderá haver cobrança de indenização conforme o contrato, inclusive além da caução.';
export function equipmentPrice(item: Equipment, days: number) {
  if (!Number.isInteger(days) || days < 1 || days > 30) throw new RangeError('Informe de 1 a 30 dias.');
  return item.prices[days <= 3 ? 0 : days <= 10 ? 1 : 2];
}
export function rentalQuote(weekdayRate: number, weekendRate: number, days: number, weekendDays: number, selected: string[]) {
  equipmentPrice(equipment[0], days);
  if (!Number.isInteger(weekendDays) || weekendDays < 0 || weekendDays > days) throw new RangeError('Confira os dias de fim de semana e feriado.');
  if (selected.some(id=>!equipment.some(item=>item.id===id))) throw new RangeError('Equipamento não encontrado.');
  const motorcycle = (days-weekendDays)*weekdayRate + weekendDays*weekendRate;
  const extras = equipment.filter(item=>selected.includes(item.id)).reduce((sum,item)=>sum+equipmentPrice(item,days),0);
  return { motorcycle, equipment:extras, total:motorcycle+extras };
}
