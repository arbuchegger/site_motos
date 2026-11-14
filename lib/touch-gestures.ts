export function swipeDirection(dx: number, dy: number, pointerType: string) {
  const touch = pointerType !== 'mouse';
  if (Math.abs(dx) < (touch ? 14 : 50) || Math.abs(dx) <= Math.abs(dy) * (touch ? 0.65 : 1.5)) return 0;
  return dx < 0 ? 1 : -1;
}
export function canSwipeCatalog(pointerType: string, width: number) {
  return pointerType !== 'mouse' || width < 1100;
}
