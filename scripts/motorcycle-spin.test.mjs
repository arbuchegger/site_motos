import test from 'node:test';
import assert from 'node:assert/strict';
import * as spin from '../lib/motorcycle-spin.ts';

test('rotation wraps in both directions', () => {
  assert.equal(spin.wrapSpinIndex(-1, 8), 7);
  assert.equal(spin.wrapSpinIndex(8, 8), 0);
});
test('fast drag requests expose one adjacent frame per interval, never a jump', () => {
  assert.equal(spin.pacedSpinStep(6, 1000, 0), 1);
  assert.equal(spin.pacedSpinStep(-6, 1000, 0), -1);
  assert.equal(spin.pacedSpinStep(6, 1050, 1000), 0);
  assert.equal(spin.pacedSpinStep(6, 1120, 1000), 1);
});
test('continuous dragging responds to new moves without storing future frames', () => {
  let index = 0, lastFrameAt = -Infinity;
  const seen = [];
  for (const [time, movement] of [[0, 6], [120, 6], [240, -6], [1000, 0]]) {
    const step = spin.pacedSpinStep(movement, time, lastFrameAt);
    if (step) { index = spin.wrapSpinIndex(index + step, 8); lastFrameAt = time; seen.push(index); }
  }
  assert.deepEqual(seen, [1, 2, 1]);
});
test('rotation unlocks only after every image is decoded', () => {
  assert.equal(spin.spinLoadingProgress(0, 8), 0);
  assert.equal(spin.spinLoadingProgress(4, 8), 50);
  assert.equal(spin.spinLoadingProgress(7, 8), 88);
  assert.equal(spin.spinLoadingProgress(8, 8), 100);
});
test('dragging left advances and right reverses at responsive sensitivity', () => {
  assert.equal(spin.dragSpinSteps(100, 700), 2);
  assert.equal(spin.dragSpinSteps(-100, 700), -2);
  assert.equal(spin.dragSpinSteps(50, 350), 2);
});
test('touch rotates with a shorter drag while mouse sensitivity stays unchanged', () => {
  assert.equal(spin.dragSpinSteps(12, 1330, 'touch'), 1);
  assert.equal(spin.dragSpinSteps(20, 1330, 'touch'), 1);
  assert.equal(spin.dragSpinSteps(16, 360, 'touch'), 1);
  assert.equal(spin.dragSpinSteps(-16, 360, 'touch'), -1);
  assert.equal(spin.dragSpinSteps(16, 360, 'mouse'), 0);
  assert.equal(spin.dragSpinSteps(5, 360, 'touch'), 0);
});
test('slow touch samples accumulate and a reversal does not fight old residual movement', () => {
  let residual = 0, frames = 0;
  for (let i = 0; i < 5; i++) {
    const next = spin.advanceSpinDrag(residual, 2, 360, 'touch');
    residual = next.residual; frames += next.steps;
  }
  assert.equal(frames, 1);
  assert.equal(spin.advanceSpinDrag(7, -10, 360, 'touch').steps, -1);
  assert.equal(spin.releaseSpinSteps(7, true, false, 'touch'), 1);
  assert.equal(spin.releaseSpinSteps(7, false, false, 'touch'), 0);
  assert.equal(spin.releaseSpinSteps(7, true, true, 'touch'), 0);
});
test('failed frames are skipped without an endless loop', () => {
  assert.equal(spin.nextSpinIndex(0, 1, 8, new Set([1, 2])), 3);
  assert.equal(spin.nextSpinIndex(0, -1, 8, new Set([7])), 6);
  assert.equal(spin.nextSpinIndex(0, 1, 2, new Set([0, 1])), 0);
});
test('each sequence closes at the front and stays within its own color', () => {
  const frames = spin.getMotorcycleSpin('bmw-r1300gs-light-white');
  assert.equal(frames.length, 9);
  assert.equal(frames[0].src, frames[8].src);
  assert.equal(new Set(frames.map(frame => frame.src)).size, 8);
  assert.ok(frames.every(frame => frame.src.includes('/light-white/')));
});
test('fourth and sixth views exchange positions without changing their images', () => {
  for (const color of ['light-white', 'triple-black']) {
    const frames = spin.getMotorcycleSpin(`bmw-r1300gs-${color}`);
    assert.ok(frames[3].src.endsWith('/5.webp'));
    assert.ok(frames[5].src.endsWith('/3.webp'));
    assert.ok(frames[4].src.endsWith('/4.webp'));
  }
});
test('announcements wait for the displayed frame, including replacement after failure', () => {
  assert.equal(spin.presentedSpinIndex(0, 1, true, false), null);
  assert.equal(spin.presentedSpinIndex(0, 2, true, false), null);
  assert.equal(spin.presentedSpinIndex(2, 2, true, false), 2);
  assert.equal(spin.presentedSpinIndex(2, 2, true, true), null);
  assert.equal(spin.presentedSpinIndex(2, 2, false, false), null);
});
