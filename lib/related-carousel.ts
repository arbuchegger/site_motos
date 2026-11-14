export function loopCarouselPosition(position: number, cycleWidth: number, centerOffset = 0) {
  if (cycleWidth <= 0) return position;
  const offset = (((position + centerOffset) % cycleWidth) + cycleWidth) % cycleWidth;
  return cycleWidth + (offset < 1 || cycleWidth - offset < 1 ? 0 : offset) - centerOffset;
}
