import { useRef } from 'react';
import { closing } from '../data/chapters';
import { site } from '../config/site';
import { RevealLines } from '../components/ui/RevealLines';
import { ArrowIcon, ButtonLink, UnderlineLink } from '../components/ui/links';
import { useChapter } from '../hooks/useChapter';
import { filmScrollTransition } from '../lib/film';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';

export function Closing() {
  const ref = useRef<HTMLElement>(null);
  useChapter('contacto', ref);
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(closing.ctaSubject)}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // La película recupera la pantalla completa con una composición despejada.
      filmScrollTransition({ trigger: el, start: 'top bottom', end: 'top 25%', from: 'journey', to: 'closing' });

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          el.querySelectorAll('.js-fade'),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE.out,
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 45%', toggleActions: 'play none none reverse' },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="contacto" ref={ref} className="chapter closing" aria-labelledby="contacto-title">
      <div className="scrim scrim--bottom" aria-hidden="true" />
      <div className="closing__main">
        <p className="micro eyebrow js-fade">07 — {closing.eyebrow}</p>
        <RevealLines id="contacto-title" className="display closing__title" lines={closing.title} start="top 80%" />
        <p className="closing__text js-fade">{closing.text}</p>
        <div className="js-fade">
          <ButtonLink href={mailto}>{closing.cta}</ButtonLink>
        </div>
      </div>

      <address className="closing__contact panel js-fade">
        <span className="micro">Escribinos</span>
        <UnderlineLink href={`mailto:${site.contact.email}`} className="closing__link">
          {site.contact.email}
        </UnderlineLink>
        {site.contact.phoneLabel && site.contact.phoneHref && (
          <>
            <span className="micro">Llamanos</span>
            <UnderlineLink href={`tel:${site.contact.phoneHref}`} className="closing__link">
              {site.contact.phoneLabel}
            </UnderlineLink>
          </>
        )}
        {site.contact.isPlaceholder && <span className="micro closing__note">{closing.placeholderNote}</span>}
      </address>

      <footer className="footer">
        <span className="micro">{site.name.full}</span>
        <span className="micro">© {new Date().getFullYear()}</span>
        <UnderlineLink href="#inicio" className="micro footer__top">
          Volver al inicio <ArrowIcon direction="up" />
        </UnderlineLink>
      </footer>
    </section>
  );
}
