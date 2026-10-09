import { create } from 'zustand';
import type { ChapterId } from '../data/chapters';

export type VideoStatus = 'loading' | 'playing' | 'paused' | 'blocked' | 'error';

interface ExperienceState {
  menuOpen: boolean;
  activeChapter: ChapterId;
  videoStatus: VideoStatus;
  /** Pausa voluntaria del usuario (botón "Pausar movimiento"). */
  motionPaused: boolean;
  /** Preferencia del sistema `prefers-reduced-motion`. */
  reducedMotion: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setActiveChapter: (id: ChapterId) => void;
  setVideoStatus: (status: VideoStatus) => void;
  setMotionPaused: (paused: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useExperience = create<ExperienceState>()((set, get) => ({
  menuOpen: false,
  activeChapter: 'inicio',
  videoStatus: 'loading',
  motionPaused: prefersReduced,
  reducedMotion: prefersReduced,
  setMenuOpen: (open) => {
    if (get().menuOpen !== open) set({ menuOpen: open });
  },
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setActiveChapter: (id) => {
    if (get().activeChapter !== id) set({ activeChapter: id });
  },
  setVideoStatus: (status) => {
    if (get().videoStatus !== status) set({ videoStatus: status });
  },
  setMotionPaused: (paused) => {
    if (get().motionPaused !== paused) set({ motionPaused: paused });
  },
  setReducedMotion: (reduced) => {
    if (get().reducedMotion !== reduced) set({ reducedMotion: reduced });
  },
}));
