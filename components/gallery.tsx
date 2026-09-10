'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export function Gallery({ images, name }: { images: { src: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  return <div className="gallery"><figure><img src={images[active].src} alt={images[active].alt} width="1200" height="800" fetchPriority="high" /><figcaption>Imagens ilustrativas. O modelo real pode apresentar diferenças.</figcaption></figure>{images.length > 1 && <div className="gallery-thumbs" role="group" aria-label={`Fotos da ${name}`}>{images.map((photo, index) => <Button key={photo.src} variant="ghost" className="gallery-thumb" aria-label={`Ver foto ${index + 1} da ${name}`} aria-pressed={index === active} onClick={() => setActive(index)}><img src={photo.src} alt="" width="150" height="100" /><span>{index === 0 ? 'Vista lateral' : 'Vista frontal'}</span></Button>)}</div>}</div>;
}
