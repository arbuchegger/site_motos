import type { ReactNode } from 'react';

export function ButtonLabel({ children }: { children: ReactNode }) {
  return <span className="button-roll"><span className="button-roll-front">{children}</span><span className="button-roll-back" aria-hidden="true">{children}</span></span>;
}
