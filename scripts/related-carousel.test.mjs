import test from 'node:test';
import assert from 'node:assert/strict';
import { loopCarouselPosition } from '../lib/related-carousel.ts';
test('carousel recenters repeated motorcycles in both directions without changing visible position', () => {
  assert.equal(loopCarouselPosition(0, 500), 500);
  assert.equal(loopCarouselPosition(400, 500), 900);
  assert.equal(loopCarouselPosition(500, 500), 500);
  assert.equal(loopCarouselPosition(1000, 500), 500);
  assert.equal(loopCarouselPosition(1100, 500), 600);
  assert.equal(loopCarouselPosition(499.8, 500), 500);
  assert.equal(loopCarouselPosition(-40, 500, 40), 460);
  assert.equal(loopCarouselPosition(960, 500, 40), 460);
});
