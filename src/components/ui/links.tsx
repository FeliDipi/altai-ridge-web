import { useRef, type AnchorHTMLAttributes, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { scrollToTarget } from '../../lib/lenis';
import { useExperience } from '../../store/useExperience';
import { useMagnetic } from '../../hooks/useMagnetic';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

/** Fija el origen del subrayado en el punto por donde entra (o sale) el puntero. */
const setUnderlineOrigin = (e: PointerEvent<HTMLAnchorElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  const p = Math.min(100, Math.max(0, ((e.clientX - r.left) / Math.max(r.width, 1)) * 100));
  e.currentTarget.style.setProperty('--u-origin', `${p}%`);
};

/** Enlace con subrayado que crece desde el punto de interacción. Las anclas usan el smooth scroll. */
export function UnderlineLink({ className = '', onClick, onPointerEnter, onPointerLeave, href, ...rest }: AnchorProps) {
  const setMenuOpen = useExperience((s) => s.setMenuOpen);
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !href?.startsWith('#')) return;
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(href);
  };
  return (
    <a
      href={href}
      className={`u-link ${className}`}
      onClick={handleClick}
      onPointerEnter={(e) => {
        setUnderlineOrigin(e);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setUnderlineOrigin(e);
        onPointerLeave?.(e);
      }}
      {...rest}
    />
  );
}

export function ArrowIcon({ direction = 'right' }: { direction?: 'right' | 'down' | 'up' }) {
  const rotate = direction === 'down' ? 90 : direction === 'up' ? -90 : 0;
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ rotate: `${rotate}deg` }}>
      <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

type ButtonLinkProps = AnchorProps & { variant?: 'solid' | 'ghost'; magnetic?: boolean };

/** Botón-enlace con flecha y atracción magnética moderada (solo puntero fino). */
export function ButtonLink({ variant = 'solid', magnetic = true, className = '', children, href, onClick, ...rest }: ButtonLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const setMenuOpen = useExperience((s) => s.setMenuOpen);
  useMagnetic(ref, magnetic ? 0.28 : 0);
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !href?.startsWith('#')) return;
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(href);
  };
  return (
    <a ref={ref} href={href} className={`btn btn--${variant} ${className}`} onClick={handleClick} {...rest}>
      <span className="btn__label">{children}</span>
      <ArrowIcon />
    </a>
  );
}
