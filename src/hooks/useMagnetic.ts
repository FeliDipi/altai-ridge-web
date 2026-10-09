import type { RefObject } from 'react';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

const MAX_OFFSET = 12;

/** Atracción magnética moderada hacia el puntero. Solo en escritorio con puntero fino. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.28): void {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || strength <= 0) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motionOk}`, () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: EASE.soft });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: EASE.soft });
        const clamp = gsap.utils.clamp(-MAX_OFFSET, MAX_OFFSET);
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
          yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
    },
    { dependencies: [strength] },
  );
}
