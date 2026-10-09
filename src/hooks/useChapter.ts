import type { RefObject } from 'react';
import type { ChapterId } from '../data/chapters';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { useExperience } from '../store/useExperience';

/** Marca el capítulo activo cuando la sección cruza el centro del viewport (solo al cambiar). */
export function useChapter(id: ChapterId, ref: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) useExperience.getState().setActiveChapter(id);
        },
      });
    },
    { dependencies: [id] },
  );
}
