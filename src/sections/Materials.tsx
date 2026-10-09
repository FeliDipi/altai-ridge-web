import { useRef } from 'react';
import { materials } from '../data/chapters';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition } from '../lib/film';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

export function Materials() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const scenes = gsap.utils.toArray<HTMLElement>('.mat__scene', el);

      // Entrada: la ventana cuadrada se transforma en una ventana dominante y el encuadre vuelve al centro.
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top top', from: 'square', to: 'dominant' });

      const mm = gsap.matchMedia();

      // Escritorio: sección fijada con escenas Materia → Luz → Espacio.
      mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
        gsap.set(scenes.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: EASE.inOut },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        scenes.forEach((scene, i) => {
          const next = scenes[i + 1];
          tl.to(q('.mat__tick-fill')[i] ?? [], { scaleX: 1, duration: 1, ease: 'none' }, i);
          if (!next) return;
          const at = i + 0.72;
          tl.to(scene.querySelectorAll('.line__inner'), { yPercent: -110, duration: 0.3, stagger: 0.04 }, at)
            .to(scene.querySelectorAll('.js-swap'), { opacity: 0, y: -16, duration: 0.25 }, at)
            .set(scene, { autoAlpha: 0 }, at + 0.3)
            .set(next, { autoAlpha: 1 }, at + 0.3)
            .fromTo(next.querySelectorAll('.line__inner'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, stagger: 0.05, ease: EASE.soft }, at + 0.3)
            .fromTo(next.querySelectorAll('.js-swap'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: EASE.soft }, at + 0.4);
        });
        tl.to({}, { duration: 0.3 });
        // Acercamiento progresivo del encuadre a lo largo de las tres escenas.
        filmScrollTransition({
          trigger: el,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.4}`,
          from: 'dominant',
          to: 'dominantEnd',
          ease: 'none',
        });
      });

      // Móvil o movimiento reducido: escenas apiladas, sin fijación.
      mm.add(`${MQ.mobile}, ${MQ.reduce}`, () => {
        filmScrollTransition({ trigger: el, start: 'top top', end: 'bottom bottom', from: 'dominant', to: 'dominantEnd' });
        scenes.forEach((scene) => {
          gsap.fromTo(
            scene.querySelectorAll('.line__inner, .js-swap'),
            { yPercent: 0, opacity: 0 },
            { opacity: 1, duration: 0.9, ease: EASE.out, stagger: 0.06, scrollTrigger: { trigger: scene, start: 'top 85%' } },
          );
        });
      });
    },
    { scope: ref },
  );

  // Se registra después de crear el pin para medir con el espaciador ya aplicado.
  useChapter('materiales', ref);

  return (
    <section id="materiales" ref={ref} className="chapter materials" aria-labelledby="materiales-title">
      <div className="mat__stage">
        <div className="mat__window-space" aria-hidden="true" />
        <div className="mat__panel">
          <p id="materiales-title" className="micro eyebrow">
            04 — {materials.eyebrow}
          </p>
          <ol className="mat__ticks" aria-hidden="true">
            {materials.scenes.map((s) => (
              <li key={s.index} className="mat__tick">
                <span className="mat__tick-fill" />
              </li>
            ))}
          </ol>
          <div className="mat__scenes">
            {materials.scenes.map((s) => (
              <article key={s.index} className="mat__scene">
                <span className="micro mat__index js-swap">{s.index} / 03</span>
                <h3 className="mat__title" aria-label={s.title}>
                  <span className="line" aria-hidden="true">
                    <span className="line__inner">{s.title}</span>
                  </span>
                </h3>
                <p className="mat__text js-swap">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
