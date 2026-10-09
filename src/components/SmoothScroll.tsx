import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { getLenis, setLenis } from '../lib/lenis';
import { useExperience } from '../store/useExperience';

/**
 * Única instancia de Lenis, sincronizada con el ticker de GSAP (sin rAF propio)
 * y con ScrollTrigger. Se desactiva con prefers-reduced-motion. Segura en StrictMode.
 */
export function SmoothScroll() {
  const reducedMotion = useExperience((s) => s.reducedMotion);
  const menuOpen = useExperience((s) => s.menuOpen);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, autoRaf: false });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  // Bloquea el scroll de la página mientras el menú está abierto.
  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.classList.toggle('is-menu-open', menuOpen);
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    return () => document.documentElement.classList.remove('is-menu-open');
  }, [menuOpen]);

  return null;
}
