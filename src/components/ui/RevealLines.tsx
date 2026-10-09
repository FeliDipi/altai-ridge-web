import { useRef } from 'react';
import type { HeadingLine } from '../../data/chapters';
import { EASE, MQ, STAGGER, gsap, useGSAP } from '../../lib/gsap';

interface RevealLinesProps {
  lines: HeadingLine[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  /** `scroll`: se revela al entrar en pantalla. `manual`: la anima el componente padre. */
  reveal?: 'scroll' | 'manual';
  start?: string;
  delay?: number;
}

/** Titular dividido en líneas con revelado por máscara (cada línea sube desde su propio recorte). */
export function RevealLines({
  lines,
  as = 'h2',
  className = '',
  id,
  reveal = 'scroll',
  start = 'top 82%',
  delay = 0,
}: RevealLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as as 'h2';
  const label = lines.map((l) => l.text).join(' ');

  useGSAP(
    () => {
      const el = ref.current;
      if (reveal !== 'scroll' || !el) return;
      const inner = el.querySelectorAll('.line__inner');
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          inner,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: EASE.out,
            stagger: STAGGER,
            delay,
            scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
          },
        );
      });
      mm.add(MQ.reduce, () => {
        gsap.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.6, scrollTrigger: { trigger: el, start } });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={`lines ${className}`} aria-label={label}>
      {lines.map((line, i) => (
        <span className="line" key={i} aria-hidden="true">
          <span className="line__inner" style={line.indent ? { paddingLeft: line.indent } : undefined}>
            {line.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}
