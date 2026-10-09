import { useRef } from 'react';
import { inhabit } from '../data/chapters';
import { RevealLines } from '../components/ui/RevealLines';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition, type FilmStateName } from '../lib/film';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

/** Ventana de la película que corresponde a cada composición editorial. */
const WINDOWS: readonly FilmStateName[] = ['panorama', 'vertical', 'square'];

export function Inhabit() {
  const ref = useRef<HTMLElement>(null);
  useChapter('habitar', ref);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const scenes = gsap.utils.toArray<HTMLElement>('.inhabit__scene', el);

      // Del marco a la primera ventana, y luego de ventana en ventana (máscaras que cambian de proporción).
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top top', from: 'framed', to: 'panorama' });
      scenes.slice(1).forEach((scene, i) => {
        filmScrollTransition({
          trigger: scene,
          start: 'top bottom',
          end: 'top top',
          from: WINDOWS[i] ?? 'panorama',
          to: WINDOWS[i + 1] ?? 'square',
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        scenes.forEach((scene) => {
          gsap.fromTo(
            scene.querySelectorAll('.js-fade'),
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: EASE.out,
              stagger: 0.1,
              scrollTrigger: { trigger: scene, start: 'top 45%', toggleActions: 'play none none reverse' },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="habitar" ref={ref} className="chapter inhabit" aria-labelledby="habitar-title">
      {inhabit.scenes.map((scene, i) => (
        <article key={scene.index} className={`inhabit__scene inhabit__scene--${i + 1}`} aria-label={scene.label}>
          <div className="inhabit__stage">
            {i === 0 && (
              <RevealLines id="habitar-title" className="display inhabit__title" lines={inhabit.title} start="top 75%" />
            )}
            <div className="inhabit__copy">
              <p className="micro eyebrow js-fade">
                03.{scene.index} — {scene.label}
              </p>
              <RevealLines as="h3" className="inhabit__heading" lines={scene.title} start="top 85%" />
              <p className="inhabit__text js-fade">{scene.text}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
