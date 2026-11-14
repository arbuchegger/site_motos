import test from 'node:test';
import assert from 'node:assert/strict';
import * as gestures from '../lib/touch-gestures.ts';

test('short intentional touch swipes navigate both ways', () => {
  assert.equal(gestures.swipeDirection(-18, 4, 'touch'), 1);
  assert.equal(gestures.swipeDirection(-24, 6, 'touch'), 1);
  assert.equal(gestures.swipeDirection(24, 6, 'touch'), -1);
});
test('touch remains available on wide iPads while desktop mouse keeps accordion behavior', () => {
  assert.equal(gestures.canSwipeCatalog('touch', 1366), true);
  assert.equal(gestures.canSwipeCatalog('mouse', 1366), false);
  assert.equal(gestures.canSwipeCatalog('mouse', 800), true);
});
test('tap jitter and vertical scrolling do not change slides', () => {
  assert.equal(gestures.swipeDirection(12, 2, 'touch'), 0);
  assert.equal(gestures.swipeDirection(8, 30, 'touch'), 0);
});
test('diagonal touch swipes navigate in both directions', () => {
  assert.equal(gestures.swipeDirection(-18, -25, 'touch'), 1);
  assert.equal(gestures.swipeDirection(18, 25, 'touch'), -1);
});
test('mouse keeps its existing deliberate swipe distance', () => {
  assert.equal(gestures.swipeDirection(24, 2, 'mouse'), 0);
  assert.equal(gestures.swipeDirection(-50, 2, 'mouse'), 1);
});
