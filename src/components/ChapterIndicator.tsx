import { useRef } from 'react';
import { chapters } from '../data/chapters';
import { useExperience } from '../store/useExperience';
import { ScrollTrigger, gsap, useGSAP } from '../lib/gsap';

/** Indicador fijo de capítulo y progreso del recorrido (el progreso se escribe directo en el DOM). */
export function ChapterIndicator() {
  const barRef = useRef<HTMLSpanElement>(null);
  const activeChapter = useExperience((s) => s.activeChapter);
  const chapter = chapters.find((c) => c.id === activeChapter) ?? chapters[0];
  const total = String(chapters.length).padStart(2, '0');

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;
    const setScale = gsap.quickSetter(bar, 'scaleX');
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setScale(self.progress),
    });
  });

  return (
    <div className={`chapter-ind ${activeChapter === 'inicio' || activeChapter === 'contacto' ? 'is-hidden' : ''}`} aria-hidden="true">
      <span className="chapter-ind__count micro">
        {chapter?.index} / {total}
      </span>
      <span className="chapter-ind__track">
        <span ref={barRef} className="chapter-ind__bar" />
      </span>
      <span className="chapter-ind__label micro">{chapter?.label}</span>
    </div>
  );
}
