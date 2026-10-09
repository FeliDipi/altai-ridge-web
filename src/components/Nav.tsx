import { useEffect, useRef } from 'react';
import { chapters } from '../data/chapters';
import { site } from '../config/site';
import { useExperience } from '../store/useExperience';
import { EASE, MQ, gsap, useGSAP } from '../lib/gsap';
import { UnderlineLink } from './ui/links';

export function Nav() {
  const activeChapter = useExperience((s) => s.activeChapter);
  const menuOpen = useExperience((s) => s.menuOpen);
  const toggleMenu = useExperience((s) => s.toggleMenu);

  return (
    <>
      <header className="nav">
        <UnderlineLink href="#inicio" className="nav__brand js-intro-nav" aria-label={`${site.name.full}, volver al inicio`}>
          {site.name.full}
        </UnderlineLink>
        <div className="nav__notes" aria-hidden="true">
          {site.navNotes.map((note) => (
            <span key={note} className="js-intro-nav">
              {note}
            </span>
          ))}
        </div>
        <nav className="nav__links" aria-label="Capítulos">
          <ul>
            {chapters.slice(1).map((c) => (
              <li key={c.id} className="js-intro-nav">
                <UnderlineLink
                  href={`#${c.id}`}
                  className={`nav__link ${activeChapter === c.id ? 'is-active' : ''}`}
                  aria-current={activeChapter === c.id ? 'location' : undefined}
                >
                  <span className="nav__dot" aria-hidden="true" />
                  {c.label}
                </UnderlineLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="nav__menu-btn js-intro-nav"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={toggleMenu}
        >
          <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
          <span className="nav__burger" aria-hidden="true" />
        </button>
      </header>
      <MenuOverlay />
    </>
  );
}

function MenuOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const menuOpen = useExperience((s) => s.menuOpen);
  const setMenuOpen = useExperience((s) => s.setMenuOpen);
  const activeChapter = useExperience((s) => s.activeChapter);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ ok: MQ.motionOk, reduce: MQ.reduce }, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce);
        gsap.set(el, { autoAlpha: 0 });
        const t = gsap.timeline({ paused: true });
        if (reduce) {
          t.to(el, { autoAlpha: 1, duration: 0.3 });
        } else {
          t.set(el, { autoAlpha: 1 })
            .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.out })
            .fromTo(
            el.querySelectorAll('.menu__item'),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.9, ease: EASE.out, stagger: 0.07 },
            0.15,
          );
        }
        tl.current = t;
        return () => {
          tl.current = null;
        };
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (menuOpen) {
      t.timeScale(1).play();
      ref.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else {
      t.timeScale(1.6).reverse();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        document.querySelector<HTMLElement>('.nav__menu-btn')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <div id="menu" ref={ref} className="menu" role="dialog" aria-modal="true" aria-label="Menú" inert={!menuOpen}>
      <ol className="menu__list">
        {chapters.map((c) => (
          <li key={c.id} className="menu__row">
            <span className="menu__item">
              <UnderlineLink href={`#${c.id}`} className={`menu__link ${activeChapter === c.id ? 'is-active' : ''}`}>
                <span className="menu__index">{c.index}</span>
                {c.label}
              </UnderlineLink>
            </span>
          </li>
        ))}
      </ol>
      <p className="menu__foot micro">
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
    </div>
  );
}
