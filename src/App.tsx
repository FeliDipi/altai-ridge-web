import { useEffect } from 'react';
import { FilmLayer } from './components/FilmLayer';
import { SmoothScroll } from './components/SmoothScroll';
import { Nav } from './components/Nav';
import { MotionControl } from './components/MotionControl';
import { ChapterIndicator } from './components/ChapterIndicator';
import { Hero } from './sections/Hero';
import { Concept } from './sections/Concept';
import { Inhabit } from './sections/Inhabit';
import { Materials } from './sections/Materials';
import { Experience } from './sections/Experience';
import { Journey } from './sections/Journey';
import { Closing } from './sections/Closing';
import { MQ, ScrollTrigger } from './lib/gsap';
import { useExperience } from './store/useExperience';

/** Sincroniza preferencias de movimiento con el DOM y recalcula mediciones cuando hay recursos listos. */
function MotionPreferences() {
  const motionPaused = useExperience((s) => s.motionPaused);
  const reducedMotion = useExperience((s) => s.reducedMotion);

  useEffect(() => {
    const mq = window.matchMedia(MQ.reduce);
    const onChange = () => {
      const { setReducedMotion, setMotionPaused } = useExperience.getState();
      setReducedMotion(mq.matches);
      if (mq.matches) setMotionPaused(true);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', motionPaused || reducedMotion);
  }, [motionPaused, reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    ScrollTrigger.sort();
    refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <FilmLayer />
      <SmoothScroll />
      <MotionPreferences />
      <Nav />
      <main id="contenido">
        <Hero />
        <Concept />
        <Inhabit />
        <Materials />
        <Experience />
        <Journey />
        <Closing />
      </main>
      <ChapterIndicator />
      <MotionControl />
    </>
  );
}
