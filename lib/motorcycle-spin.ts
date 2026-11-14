export const spinAngles = ['Frente', 'Dianteira esquerda', 'Lateral esquerda', 'Traseira esquerda', 'Traseira', 'Traseira direita', 'Lateral direita', 'Dianteira direita'] as const;
export function getMotorcycleSpin(slug: string) {
  const color = slug.replace(/^bmw-r1300gs-/, '');
  // Rear three-quarter views were supplied in the opposite order.
  const order = [0, 1, 2, 5, 4, 3, 6, 7];
  const frames = spinAngles.map((angle, index) => ({ src: `/images/bmw-r1300gs/360/${color}/${order[index]}.webp`, angle }));
  return [...frames, frames[0]];
}
export function wrapSpinIndex(index: number, count: number) {
  return count > 0 ? ((index % count) + count) % count : 0;
}
export function pacedSpinStep(requested: number, now: number, lastFrameAt: number) {
  return requested && now - lastFrameAt >= 120 ? Math.sign(requested) : 0;
}
export function spinLoadingProgress(decoded: number, total: number) {
  return total > 0 ? Math.min(100, Math.round(decoded / total * 100)) : 0;
}
export function spinDragDistance(width: number, pointerType = 'mouse') {
  return pointerType === 'mouse' ? Math.max(16, width / 14) : Math.min(12, Math.max(8, width / 36));
}
export function dragSpinSteps(distance: number, width: number, pointerType = 'mouse') {
  return Math.trunc(distance / spinDragDistance(width, pointerType));
}
export function advanceSpinDrag(residual: number, delta: number, width: number, pointerType: string) {
  if (pointerType !== 'mouse' && residual * delta < 0) residual = 0;
  const distance = residual + delta;
  const steps = dragSpinSteps(distance, width, pointerType);
  return { steps, residual: distance - steps * spinDragDistance(width, pointerType) };
}
export function releaseSpinSteps(residual: number, active: boolean, changed: boolean, pointerType: string) {
  return pointerType !== 'mouse' && active && !changed && Math.abs(residual) >= 4 ? Math.sign(residual) : 0;
}
export function nextSpinIndex(index: number, direction: number, count: number, failed: ReadonlySet<number>) {
  for (let step = 1; step <= count; step++) {
    const candidate = wrapSpinIndex(index + step * direction, count);
    if (!failed.has(candidate)) return candidate;
  }
  return index;
}
export function presentedSpinIndex(shown: number, requested: number, announce: boolean, dragging: boolean) {
  return announce && !dragging && shown === requested ? shown : null;
}
