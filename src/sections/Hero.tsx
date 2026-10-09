import { useRef } from 'react';
import { hero } from '../data/chapters';
import { site } from '../config/site';
import { RevealLines } from '../components/ui/RevealLines';
import { ButtonLink } from '../components/ui/links';
import { useChapter } from '../hooks/useChapter';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useChapter('inicio', ref);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const navItems = gsap.utils.toArray<HTMLElement>('.js-intro-nav');
      const mm = gsap.matchMedia();

      mm.add({ ok: MQ.motionOk, reduce: MQ.reduce, desktop: MQ.desktop }, (ctx) => {
        const { reduce, desktop } = ctx.conditions ?? {};

        // Entrada escalonada: tipografía, líneas, navegación y controles.
        const intro = gsap.timeline({ delay: 0.25, defaults: { ease: EASE.out } });
        if (reduce) {
          intro.from([...q('.line__inner'), ...q('.js-hero-fade'), ...navItems], { opacity: 0, duration: 0.6 });
          return;
        }
        intro
          .fromTo(q('.hero__title .line__inner'), { yPercent: 112 }, { yPercent: 0, duration: 1.7, stagger: 0.12 })
          .fromTo(q('.hero__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, stagger: 0.1, ease: EASE.soft }, 0.35)
          .fromTo(navItems, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.06 }, 0.55)
          .fromTo(q('.hero__welcome .line__inner'), { yPercent: 112 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.9)
          .fromTo(q('.js-hero-fade'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 1.05);

        // Salida protagonista: el nombre se separa en dos direcciones mientras la película continúa.
        const lines = q('.hero__title .line');
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } })
          .to(lines[0] ?? [], { xPercent: desktop ? -16 : -6, ease: 'none' }, 0)
          .to(lines[1] ?? [], { xPercent: desktop ? 12 : 6, ease: 'none' }, 0)
          .to(q('.hero__title'), { yPercent: -24, opacity: 0, ease: 'power1.in' }, 0)
          .to(q('.hero__aside, .hero__cue, .hero__rule'), { y: -40, opacity: 0, ease: 'power1.in' }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section id="inicio" ref={ref} className="chapter hero" aria-label={`${site.name.full}, apertura`}>
      <div className="scrim scrim--hero" aria-hidden="true" />
      <RevealLines
        as="h1"
        reveal="manual"
        className="hero__title"
        lines={[{ text: site.name.line1 }, { text: site.name.line2, indent: '0.62em' }]}
      />
      <span className="hero__rule hero__rule--a" aria-hidden="true" />
      <span className="hero__rule hero__rule--b" aria-hidden="true" />

      <div className="hero__aside">
        <RevealLines as="h2" reveal="manual" className="hero__welcome" lines={hero.welcome} />
        <p className="hero__intro js-hero-fade">{hero.intro}</p>
        <div className="js-hero-fade">
          <ButtonLink href="#concepto">{hero.cta}</ButtonLink>
        </div>
      </div>

      <div className="hero__cue panel js-hero-fade">
        <span className="micro hero__cue-index">01 — Apertura</span>
        <span className="hero__cue-track" aria-hidden="true">
          <span className="hero__cue-line" />
        </span>
        <span className="micro">{hero.explore}</span>
      </div>
    </section>
  );
}
