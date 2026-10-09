import { useExperience } from '../store/useExperience';
import { filmApi } from '../lib/filmApi';

/** Control discreto para pausar/reanudar el movimiento y reintentar la reproducción bloqueada. */
export function MotionControl() {
  const motionPaused = useExperience((s) => s.motionPaused);
  const videoStatus = useExperience((s) => s.videoStatus);
  const setMotionPaused = useExperience((s) => s.setMotionPaused);

  const blocked = videoStatus === 'blocked' && !motionPaused;
  const failed = videoStatus === 'error';

  const onClick = () => {
    if (blocked) {
      void filmApi.play();
      return;
    }
    if (motionPaused) {
      setMotionPaused(false);
      void filmApi.play();
    } else {
      setMotionPaused(true);
      filmApi.pause();
    }
  };

  if (failed) {
    return (
      <p className="motion-ctl motion-ctl--note micro" role="status">
        Película no disponible
      </p>
    );
  }

  const label = blocked ? 'Reproducir película' : motionPaused ? 'Reanudar movimiento' : 'Pausar movimiento';

  return (
    <button
      type="button"
      className={`motion-ctl ${blocked ? 'is-blocked' : ''}`}
      aria-pressed={blocked ? undefined : motionPaused}
      aria-label={label}
      onClick={onClick}
    >
      <span className={`motion-ctl__icon ${motionPaused || blocked ? 'is-play' : 'is-pause'}`} aria-hidden="true" />
      <span className="motion-ctl__label micro">{label}</span>
    </button>
  );
}
