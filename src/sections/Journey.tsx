import { useRef, useState } from 'react';
import { journey, type JourneyStage } from '../data/chapters';
import { RevealLines } from '../components/ui/RevealLines';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition } from '../lib/film';
import { EASE, MQ, ScrollTrigger, gsap, useGSAP } from '../lib/gsap';

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  useChapter('recorrido', ref);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // El fondo continúa a pantalla completa, con un velo más denso para leer las etapas.
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top 35%', from: 'open', to: 'journey' });

      const stages = gsap.utils.toArray<HTMLElement>('.stage', el);
      const mm = gsap.matchMedia();
      mm.add({ ok: MQ.motionOk, reduce: MQ.reduce }, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        stages.forEach((stage, i) => {
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: EASE.out },
            onStart: () => stage.classList.add('is-active'),
            onReverseComplete: () => stage.classList.remove('is-active'),
          });
          if (reduce) {
            tl.fromTo(stage.querySelectorAll('.stage__title .line__inner, .js-stage'), { opacity: 0 }, { opacity: 1, duration: 0.5 });
          } else {
            tl.fromTo(stage.querySelector('.stage__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.soft })
              .fromTo(stage.querySelector('.stage__thumb'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', duration: 1.2 }, 0.15)
              .fromTo(stage.querySelectorAll('.stage__title .line__inner'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08 }, 0.2)
              .fromTo(stage.querySelectorAll('.js-stage'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35);
          }
          // Cada etapa se activa al entrar en pantalla y se desactiva solo si se vuelve hacia atrás.
          ScrollTrigger.create({
            trigger: stage,
            start: `top ${78 - i * 2}%`,
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="recorrido" ref={ref} className="chapter journey" aria-labelledby="recorrido-title">
      <header className="journey__head">
        <p className="micro eyebrow">06 — {journey.eyebrow}</p>
        <RevealLines id="recorrido-title" className="display journey__title" lines={journey.title} />
      </header>
      <ol className="journey__list">
        {journey.stages.map((stage, i) => (
          <Stage key={stage.index} stage={stage} flip={i % 2 === 1} />
        ))}
      </ol>
    </section>
  );
}

function Stage({ stage, flip }: { stage: JourneyStage; flip: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li className={`stage ${flip ? 'stage--flip' : ''}`}>
      <span className="micro stage__index js-stage">
        <span className="stage__dot" aria-hidden="true" />
        {stage.index}
      </span>
      <span className="stage__rule" aria-hidden="true" />
      <span className="stage__thumb" aria-hidden="true">
        {imageFailed ? (
          <span className="stage__thumb-missing micro">{stage.image}</span>
        ) : (
          <img src={stage.image} alt="" loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
        )}
      </span>
      <h3 className="stage__title" aria-label={stage.title}>
        <span className="line" aria-hidden="true">
          <span className="line__inner">{stage.title}</span>
        </span>
      </h3>
      <p className="stage__text js-stage">{stage.text}</p>
    </li>
  );
}
