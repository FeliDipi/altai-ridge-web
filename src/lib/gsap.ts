import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Evita recalcular todo cuando la barra de direcciones móvil cambia la altura.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Curvas: desaceleración moderna para navegación/interacción, suave para lo ambiental. */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
  ambient: 'sine.inOut',
} as const;

/** Duraciones de referencia (segundos). */
export const DUR = {
  hover: 0.24,
  reveal: 1.0,
  hero: 1.5,
} as const;

export const STAGGER = 0.09;

export const MQ = {
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899px)',
  reduce: '(prefers-reduced-motion: reduce)',
  motionOk: '(prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export { gsap, ScrollTrigger, useGSAP };
