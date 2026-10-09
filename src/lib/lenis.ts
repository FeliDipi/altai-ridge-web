import type Lenis from 'lenis';

/** Única instancia de Lenis, creada y destruida por <SmoothScroll />. */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null): void => {
  instance = lenis;
};

export const getLenis = (): Lenis | null => instance;

const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Navega a un ancla respetando el smooth scroll (o el scroll nativo si está desactivado). */
export function scrollToTarget(target: string | HTMLElement): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  // Una sección fijada (pin) se mide por su espaciador: el elemento en sí puede estar desplazado.
  const spacer = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : null;
  const destination = spacer ?? el;
  if (instance) {
    // `force`: el menú puede haber detenido Lenis justo antes de navegar.
    instance.start();
    instance.scrollTo(destination, { duration: 1.6, easing: easeOutExpo, force: true });
  } else {
    destination.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  // Mueve el foco al destino para teclado y lectores de pantalla, sin provocar otro salto.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
