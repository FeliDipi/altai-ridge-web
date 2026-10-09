import { useEffect, useRef, useState } from 'react';
import { media } from '../config/media';
import { useExperience } from '../store/useExperience';
import { initFilmDirector } from '../lib/film';
import { useGSAP } from '../lib/gsap';
import { registerFilmApi } from '../lib/filmApi';

const pickSource = (): string =>
  window.innerWidth < media.film.mobileMaxWidth ? media.film.mobile : media.film.desktop;

/**
 * Capa audiovisual persistente. Se monta una sola vez en <App /> y nunca se remonta:
 * las secciones solo modifican su composición (máscara, encuadre y velo) mediante GSAP.
 */
export function FilmLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // La fuente se elige una única vez para no reiniciar la reproducción al redimensionar.
  const [src] = useState(pickSource);
  const [posterFailed, setPosterFailed] = useState(false);
  const videoStatus = useExperience((s) => s.videoStatus);
  const motionPaused = useExperience((s) => s.motionPaused);
  const setVideoStatus = useExperience((s) => s.setVideoStatus);

  // Director de composición: único responsable de la máscara, el encuadre y el velo.
  useGSAP(() => initFilmDirector());

  // API imperativa (play/pause) para controles que requieren un gesto del usuario.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    return registerFilmApi({
      play: () =>
        video.play().then(
          () => setVideoStatus('playing'),
          () => setVideoStatus('blocked'),
        ),
      pause: () => video.pause(),
    });
  }, [setVideoStatus]);

  // Eventos del elemento de video → estado global (solo cambios discretos).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlaying = () => setVideoStatus('playing');
    const onPause = () => {
      if (useExperience.getState().videoStatus !== 'blocked') setVideoStatus('paused');
    };
    const onError = () => setVideoStatus('error');
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);
    const source = video.querySelector('source');
    source?.addEventListener('error', onError);
    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      source?.removeEventListener('error', onError);
    };
  }, [setVideoStatus]);

  // Reproducción según la preferencia de movimiento (pausa voluntaria o prefers-reduced-motion).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (motionPaused) {
      video.pause();
      return;
    }
    video.play().catch(() => setVideoStatus('blocked'));
  }, [motionPaused, setVideoStatus]);

  // Pausa el video mientras la pestaña no es visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let resumeOnShow = false;
    const onVisibility = () => {
      if (document.hidden) {
        resumeOnShow = !video.paused;
        video.pause();
      } else if (resumeOnShow && !useExperience.getState().motionPaused) {
        video.play().catch(() => setVideoStatus('blocked'));
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [setVideoStatus]);

  const failed = videoStatus === 'error';

  return (
    <div className="film" aria-hidden="true">
      <div id="film-frame" className="film__frame">
        <div id="film-parallax" className="film__parallax">
          <div id="film-media" className="film__media">
            <div className="film__drift">
              {!failed && (
                <video
                  ref={videoRef}
                  className="film__video"
                  muted
                  playsInline
                  loop
                  autoPlay={!motionPaused}
                  preload="auto"
                  poster={media.film.poster}
                  disablePictureInPicture
                  tabIndex={-1}
                >
                  <source src={src} type="video/mp4" />
                </video>
              )}
              {failed && !posterFailed && (
                <picture>
                  <source srcSet={media.film.poster} type="image/webp" />
                  <img
                    className="film__video"
                    src={media.film.posterFallback}
                    alt=""
                    onError={() => setPosterFailed(true)}
                  />
                </picture>
              )}
              {failed && posterFailed && (
                <div className="film__placeholder">
                  <p>Material audiovisual pendiente</p>
                  <code>{src}</code>
                  <code>{media.film.posterFallback}</code>
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="film-dim" className="film__dim" />
        <div className="film__shade film__shade--top" />
        <div className="film__shade film__shade--bottom" />
      </div>
    </div>
  );
}
