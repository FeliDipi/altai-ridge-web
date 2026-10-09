import { gsap, MQ, ScrollTrigger } from './gsap';

/**
 * Composición de la capa audiovisual persistente.
 *
 * Cada estado define la ventana visible (clip-path inset con radio), el encuadre interno del
 * video (escala, desplazamiento y parallax) y la intensidad del velo oscuro. Las secciones
 * registran tramos de scroll "de A a B"; un único director calcula el estado a partir de la
 * posición actual, de modo que el resultado es determinista sin importar el orden de creación
 * ni los saltos por anclas. La reproducción del video nunca depende del scroll.
 */
export type FilmStateName =
  | 'full'
  | 'framed'
  | 'panorama'
  | 'vertical'
  | 'square'
  | 'dominant'
  | 'dominantEnd'
  | 'circle'
  | 'open'
  | 'journey'
  | 'closing';

interface Box {
  t: number;
  r: number;
  b: number;
  l: number;
  radius: number;
}

type ByDevice = number | ((mobile: boolean) => number);

interface FilmState {
  box: (w: number, h: number, mobile: boolean) => Box;
  scale: ByDevice;
  x: ByDevice;
  y: ByDevice;
  /** Desplazamiento vertical sutil (parallax) dentro de la ventana, en %. */
  py?: ByDevice;
  dim: number;
}

const full = (): Box => ({ t: 0, r: 0, b: 0, l: 0, radius: 0 });

const states: Record<FilmStateName, FilmState> = {
  full: { box: full, scale: 1, x: 0, y: 0, dim: 0.24 },
  framed: {
    box: (w, _h, m) => {
      const g = m ? 10 : Math.round(w * 0.016);
      return { t: g, r: g, b: g, l: g, radius: m ? 14 : 18 };
    },
    scale: 1.03,
    x: 0,
    y: 0,
    dim: 0.46,
  },
  panorama: {
    box: (w, h, m) =>
      m
        ? { t: h * 0.11, r: w * 0.05, b: h * 0.44, l: w * 0.05, radius: 10 }
        : { t: h * 0.13, r: w * 0.06, b: h * 0.33, l: w * 0.06, radius: 8 },
    scale: (m) => (m ? 1.1 : 1.12),
    x: 0,
    y: (m) => (m ? -16 : -4),
    py: (m) => (m ? -1.5 : -2.5),
    dim: 0.06,
  },
  vertical: {
    box: (w, h, m) =>
      m
        ? { t: h * 0.09, r: w * 0.18, b: h * 0.38, l: w * 0.18, radius: 10 }
        : { t: h * 0.09, r: w * 0.08, b: h * 0.09, l: w * 0.56, radius: 8 },
    scale: (m) => (m ? 1.14 : 1.16),
    x: (m) => (m ? 0 : 24),
    y: (m) => (m ? -14 : 0),
    py: (m) => (m ? 1.5 : 2.5),
    dim: 0.06,
  },
  square: {
    box: (w, h, m) => {
      if (m) {
        const s = w * 0.9;
        return { t: h * 0.1, r: w * 0.05, b: Math.max(h - h * 0.1 - s, 0), l: w * 0.05, radius: 10 };
      }
      const s = Math.min(h * 0.72, w * 0.44);
      const t = (h - s) / 2;
      return { t, r: w - w * 0.08 - s, b: t, l: w * 0.08, radius: 8 };
    },
    scale: (m) => (m ? 1.14 : 1.16),
    x: (m) => (m ? 0 : -20),
    y: (m) => (m ? -18 : 0),
    py: (m) => (m ? -1.5 : -2.5),
    dim: 0.06,
  },
  dominant: {
    box: (w, h, m) =>
      m
        ? { t: h * 0.09, r: w * 0.04, b: h * 0.4, l: w * 0.04, radius: 10 }
        : { t: h * 0.1, r: w * 0.41, b: h * 0.1, l: w * 0.04, radius: 8 },
    scale: 1.2,
    x: (m) => (m ? 0 : -18),
    y: (m) => (m ? -15 : 0),
    dim: 0.06,
  },
  dominantEnd: {
    box: (w, h, m) =>
      m
        ? { t: h * 0.09, r: w * 0.04, b: h * 0.4, l: w * 0.04, radius: 10 }
        : { t: h * 0.1, r: w * 0.41, b: h * 0.1, l: w * 0.04, radius: 8 },
    scale: 1.06,
    x: (m) => (m ? 0 : -18),
    y: (m) => (m ? -15 : 0),
    dim: 0.06,
  },
  circle: {
    box: (w, h, m) => {
      const r = Math.min(w, h) * (m ? 0.3 : 0.17);
      return { t: h / 2 - r, r: w / 2 - r, b: h / 2 - r, l: w / 2 - r, radius: r };
    },
    scale: 1.12,
    x: 0,
    y: 0,
    dim: 0.04,
  },
  open: { box: full, scale: 1, x: 0, y: 0, dim: 0.44 },
  journey: { box: full, scale: 1.04, x: 0, y: 0, dim: 0.66 },
  closing: { box: full, scale: 1, x: 0, y: 0, dim: 0.36 },
};

interface Values {
  t: number;
  r: number;
  b: number;
  l: number;
  radius: number;
  scale: number;
  x: number;
  y: number;
  py: number;
  dim: number;
}

const KEYS: readonly (keyof Values)[] = ['t', 'r', 'b', 'l', 'radius', 'scale', 'x', 'y', 'py', 'dim'];

const isMobile = (): boolean => window.matchMedia(MQ.mobile).matches;
const resolve = (v: ByDevice | undefined, m: boolean): number => (v === undefined ? 0 : typeof v === 'function' ? v(m) : v);

function valuesOf(name: FilmStateName): Values {
  const m = isMobile();
  const s = states[name];
  const box = s.box(window.innerWidth, window.innerHeight, m);
  return {
    t: box.t,
    r: box.r,
    b: box.b,
    l: box.l,
    radius: box.radius,
    scale: resolve(s.scale, m),
    x: resolve(s.x, m),
    y: resolve(s.y, m),
    py: resolve(s.py, m),
    dim: s.dim,
  };
}

function lerpValues(a: Values, b: Values, p: number): Values {
  const out = { ...a };
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * p;
  return out;
}

export interface FilmEls {
  frame: HTMLElement;
  media: HTMLElement;
  dim: HTMLElement;
  parallax: HTMLElement;
}

export function getFilmEls(): FilmEls | null {
  const frame = document.getElementById('film-frame');
  const media = document.getElementById('film-media');
  const dim = document.getElementById('film-dim');
  const parallax = document.getElementById('film-parallax');
  if (!frame || !media || !dim || !parallax) return null;
  return { frame, media, dim, parallax };
}

/* ——— Director ——— */

interface Segment {
  id: string;
  st: ScrollTrigger;
  from: FilmStateName;
  to: FilmStateName;
  ease: (p: number) => number;
}

let segments: Segment[] = [];
let segmentSeq = 0;
const proxy: Values = { t: 0, r: 0, b: 0, l: 0, radius: 0, scale: 1, x: 0, y: 0, py: 0, dim: 0.24 };
let smoothing = 0.35;

const px = (n: number): string => `${Math.max(0, Math.round(n * 10) / 10)}px`;

function apply(v: Values): void {
  const els = getFilmEls();
  if (!els) return;
  els.frame.style.clipPath = `inset(${px(v.t)} ${px(v.r)} ${px(v.b)} ${px(v.l)} round ${px(v.radius)})`;
  gsap.set(els.media, { scale: v.scale, xPercent: v.x, yPercent: v.y });
  gsap.set(els.parallax, { yPercent: v.py });
  els.dim.style.opacity = String(v.dim);
}

function compute(): Values {
  // Descarta tramos cuyos ScrollTriggers ya fueron eliminados (cambio de breakpoint, StrictMode).
  segments = segments.filter((s) => ScrollTrigger.getById(s.id) === s.st);
  const y = window.scrollY;
  let current: Segment | null = null;
  for (const s of segments) {
    if (y >= s.st.start && (!current || s.st.start >= current.st.start)) current = s;
  }
  if (!current) return valuesOf('full');
  const span = Math.max(current.st.end - current.st.start, 1);
  const p = gsap.utils.clamp(0, 1, (y - current.st.start) / span);
  return lerpValues(valuesOf(current.from), valuesOf(current.to), current.ease(p));
}

function update(immediate = false): void {
  const v = compute();
  if (immediate || smoothing <= 0) {
    gsap.killTweensOf(proxy);
    Object.assign(proxy, v);
    apply(proxy);
    return;
  }
  gsap.to(proxy, { ...v, duration: smoothing, ease: 'power3.out', overwrite: true, onUpdate: () => apply(proxy) });
}

/** Inicia el director (una vez, desde la capa de película). Devuelve la limpieza. */
export function initFilmDirector(): () => void {
  smoothing = window.matchMedia(MQ.reduce).matches ? 0 : 0.35;
  const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => update() });
  const onRefresh = () => update(true);
  ScrollTrigger.addEventListener('refresh', onRefresh);
  update(true);
  return () => {
    st.kill();
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    gsap.killTweensOf(proxy);
  };
}

/** Registra un tramo de scroll en el que la película pasa del estado `from` al `to`. */
export function filmScrollTransition(opts: {
  trigger: Element;
  start: string;
  end: string | (() => string);
  from: FilmStateName;
  to: FilmStateName;
  ease?: string;
}): ScrollTrigger {
  const id = `film-${++segmentSeq}`;
  const st = ScrollTrigger.create({
    id,
    trigger: opts.trigger,
    start: opts.start,
    end: opts.end,
    invalidateOnRefresh: true,
  });
  segments.push({ id, st, from: opts.from, to: opts.to, ease: gsap.parseEase(opts.ease ?? 'power2.inOut') });
  return st;
}
