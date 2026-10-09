/**
 * Rutas de medios (servidas desde /public).
 * Para reemplazar la película, sustituí los archivos manteniendo estas rutas o editá los valores.
 * El video debe ser un MP4 H.264 sin audio, 16:9, cuyo último cuadro empalme con el primero.
 */
export interface MediaConfig {
  film: {
    desktop: string;
    mobile: string;
    poster: string;
    posterFallback: string;
    /** Ancho (px) por debajo del cual se carga la versión liviana. */
    mobileMaxWidth: number;
  };
  /** Fotogramas reales extraídos de la película (miniaturas del capítulo "Recorrido"). */
  frames: {
    aerial: string;
    corner: string;
    terraces: string;
    facade: string;
  };
}

/** Prefijo de despliegue (p. ej. `/altai-ridge-web/` en GitHub Pages). */
const base = import.meta.env.BASE_URL;
const asset = (path: string): string => `${base}${path}`;

export const media: MediaConfig = {
  film: {
    desktop: asset('media/altai-film-1080.mp4'),
    mobile: asset('media/altai-film-720.mp4'),
    poster: asset('media/poster.webp'),
    posterFallback: asset('media/poster.jpg'),
    mobileMaxWidth: 900,
  },
  frames: {
    aerial: asset('media/frames/f_36.jpg'),
    corner: asset('media/frames/f_9.jpg'),
    terraces: asset('media/frames/f_14.jpg'),
    facade: asset('media/frames/f_30.jpg'),
  },
};
