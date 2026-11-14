import test from 'node:test';
import assert from 'node:assert/strict';
import { rentalPeriod, holidayName } from '../lib/rental-dates.ts';

test('conta da retirada até a véspera da devolução',()=>{
  assert.deepEqual(rentalPeriod('2026-11-09','2026-11-12'),{days:3,premiumDays:0,weekendDays:0,weekdayHolidays:0,holidays:[]});
  assert.equal(rentalPeriod('2026-11-19','2026-11-20').premiumDays,0);
});
test('feriado nacional em dia útil aplica tarifa maior e identifica a data',()=>{
  const p=rentalPeriod('2026-11-19','2026-11-23');
  assert.equal(p.days,4); assert.equal(p.premiumDays,3); assert.equal(p.weekdayHolidays,1);
  assert.equal(p.holidays[0].date,'2026-11-20'); assert.match(p.holidays[0].name,/Consciência Negra/);
});
test('não cobra duas vezes um feriado que cai no domingo',()=>{
  const p=rentalPeriod('2026-11-14','2026-11-16');
  assert.equal(p.premiumDays,2); assert.equal(p.weekdayHolidays,0);
});
test('reconhece a Sexta-feira Santa móvel e os feriados locais sem transformar ponto facultativo em feriado',()=>{
  assert.match(holidayName('2026-04-03'),/Santa/);
  assert.match(holidayName('2027-03-26'),/Santa/);
  assert.match(holidayName('2026-08-05'),/Paraíba/);
  assert.match(holidayName('2026-06-24'),/São João/);
  assert.equal(holidayName('2026-02-17'),undefined);
  assert.equal(holidayName('2026-06-04'),undefined);
});
test('funciona na virada do ano e valida o intervalo de 1 a 30 dias',()=>{
  assert.equal(rentalPeriod('2026-12-31','2027-01-02').premiumDays,1);
  assert.equal(rentalPeriod('2026-12-01','2026-12-31').days,30);
  for (const range of [['2026-12-02','2026-12-01'],['2026-12-01','2026-12-01'],['2026-12-01','2027-01-01'],['2026-02-30','2026-03-03'],['','']]) assert.throws(()=>rentalPeriod(...range));
});
