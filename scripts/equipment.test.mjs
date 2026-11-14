import test from 'node:test';
import assert from 'node:assert/strict';
import { equipment, equipmentPrice, rentalQuote } from '../lib/equipment.ts';

test('as faixas cobram pelo período e mudam somente nos limites da tabela', () => {
  const jacket = equipment[0];
  for (const [days, price] of [[1,90],[3,90],[4,135],[10,135],[11,180],[30,180]]) assert.equal(equipmentPrice(jacket, days), price);
});
test('soma diárias de semana, fim de semana e equipamento sem multiplicar a faixa pelos dias', () => {
  const quote = rentalQuote(619,719,4,2,[equipment[0].id]);
  assert.deepEqual(quote, { motorcycle:2676, equipment:135, total:2811 });
  assert.equal(rentalQuote(619,719,3,0,[]).equipment,0);
});
test('todos os 18 itens têm identificação única e três preços', () => {
  assert.equal(equipment.length,18);
  assert.equal(new Set(equipment.map(e=>e.id)).size,18);
  assert.ok(equipment.every(e=>e.prices.length===3 && e.prices.every(p=>p>0)));
});
test('recusa períodos, contagens ou equipamentos inválidos e não duplica a seleção', () => {
  for (const days of [0,31,NaN,1.5]) assert.throws(()=>equipmentPrice(equipment[0],days));
  assert.throws(()=>rentalQuote(619,719,3,4,[]));
  assert.throws(()=>rentalQuote(619,719,3,0,['inexistente']));
  assert.equal(rentalQuote(619,719,3,0,[equipment[0].id,equipment[0].id]).equipment,90);
});
