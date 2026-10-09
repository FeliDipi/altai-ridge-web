import { useRef } from 'react';
import { experience } from '../data/chapters';
import { RevealLines } from '../components/ui/RevealLines';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition } from '../lib/film';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  useChapter('experiencia', ref);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);

      // La ventana dominante se contrae en una apertura circular…
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top top', from: 'dominantEnd', to: 'circle' });

      // …y el círculo se expande hasta ocupar toda la pantalla mientras crece la frase.
      filmScrollTransition({ trigger: el, start: 'top top', end: 'bottom bottom', from: 'circle', to: 'open', ease: 'power3.inOut' });

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.9 } })
          .fromTo(q('.exp__phrase'), { scale: 0.88 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
          .fromTo(q('.exp__ring'), { scale: 1, opacity: 0.6 }, { scale: 3.2, opacity: 0, ease: 'power2.in', duration: 0.6 }, 0);
        gsap.fromTo(
          q('.js-fade'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: EASE.out,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 20%', toggleActions: 'play none none reverse' },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="experiencia" ref={ref} className="chapter experience" aria-labelledby="experiencia-title">
      <div className="exp__stage">
        <span className="exp__ring" aria-hidden="true" />
        <p className="micro eyebrow exp__eyebrow js-fade">05 — {experience.eyebrow}</p>
        <RevealLines id="experiencia-title" className="display exp__phrase" lines={experience.phrase} start="top 70%" />
        <p className="exp__text js-fade">{experience.text}</p>
      </div>
    </section>
  );
}
