interface FilmApi {
  play: () => Promise<void>;
  pause: () => void;
}

let api: FilmApi | null = null;

/** Registra la API del reproductor; devuelve la función de limpieza. */
export function registerFilmApi(next: FilmApi): () => void {
  api = next;
  return () => {
    if (api === next) api = null;
  };
}

export const filmApi = {
  play: (): Promise<void> => api?.play() ?? Promise.resolve(),
  pause: (): void => api?.pause(),
};
