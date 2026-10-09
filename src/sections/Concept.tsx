import { useRef } from 'react';
import { concept } from '../data/chapters';
import { RevealLines } from '../components/ui/RevealLines';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition } from '../lib/film';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

export function Concept() {
  const ref = useRef<HTMLElement>(null);
  useChapter('concepto', ref);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);

      // La película se enmarca como una lámina: pantalla completa → marco con bordes redondeados.
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top 20%', from: 'full', to: 'framed' });

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          q('.js-fade'),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE.out,
            stagger: 0.1,
            scrollTrigger: { trigger: q('.concept__body')[0] ?? el, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        );
        gsap.fromTo(
          q('.attr'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: EASE.out,
            stagger: 0.1,
            scrollTrigger: { trigger: q('.concept__attrs')[0] ?? el, start: 'top 88%', toggleActions: 'play none none reverse' },
          },
        );
        gsap.fromTo(
          q('.attr__rule'),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: EASE.soft,
            stagger: 0.1,
            scrollTrigger: { trigger: q('.concept__attrs')[0] ?? el, start: 'top 88%', toggleActions: 'play none none reverse' },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="concepto" ref={ref} className="chapter concept" aria-labelledby="concepto-title">
      <div className="scrim scrim--left" aria-hidden="true" />
      <div className="concept__grid">
        <p className="micro eyebrow">02 — {concept.eyebrow}</p>
        <RevealLines id="concepto-title" className="display concept__title" lines={concept.title} />
        <div className="concept__body">
          <p className="lead js-fade">{concept.body}</p>
        </div>
        <ul className="concept__attrs">
          {concept.attributes.map((a) => (
            <li key={a.index} className="attr panel">
              <span className="micro attr__index">{a.index}</span>
              <span className="attr__rule" aria-hidden="true" />
              <h3 className="attr__title">{a.title}</h3>
              <p className="attr__text">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
