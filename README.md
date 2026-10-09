# ALTAI RIDGE — web inmersiva

Una película arquitectónica persistente con capítulos editoriales. Stack: React + TypeScript (estricto), GSAP + ScrollTrigger, Lenis y Zustand, empaquetado con Vite.

## Uso

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # chequeo de tipos + build de producción en dist/
npm run preview
```

> Vite 6 se usa porque Vite 8 requiere Node ≥ 22.12 (esta máquina tiene 22.11).

## Dónde editar

| Qué | Archivo |
|---|---|
| Nombre del proyecto, notas de navegación, contacto | `src/config/site.ts` |
| Rutas del video, poster y fotogramas | `src/config/media.ts` |
| Todos los textos y capítulos | `src/data/chapters.ts` |
| Paleta, tipografía y tiempos | `src/styles/base.css` (`:root`) |
| Ventanas y velos de la película por capítulo | `src/lib/film.ts` (`states`) |

**⚠️ Los datos de contacto son placeholders** (`contacto@altairidge.example`). Reemplazalos en `src/config/site.ts` y poné `isPlaceholder: false`. No hay formulario: el CTA abre el cliente de correo.

## Material audiovisual

- `public/media/altai-film-1080.mp4` (escritorio) y `altai-film-720.mp4` (móvil, por debajo de 900 px): H.264, sin audio, loop sin salto. El último segundo y medio se funde con el primero.
- `public/media/poster.webp` / `poster.jpg`: se muestran mientras carga el video, si el autoplay falla o con movimiento reducido.
- `public/media/frames/*.jpg`: fotogramas reales de la película para las miniaturas de "Recorrido".

Si falta el video, se muestra el poster. Si también falta el poster, aparece un placeholder con las rutas que hay que completar.

## Arquitectura

- `FilmLayer` monta **un único** `<video>` fijo que nunca se remonta. Su reproducción es independiente del scroll.
- `lib/film.ts` es un director central: cada sección registra tramos de scroll del tipo "del estado A al B", y la máscara (`clip-path`), el encuadre y el velo se calculan a partir de la posición de scroll. Así el resultado es determinista ante saltos por anclas o cambios de tamaño.
- `SmoothScroll` crea una sola instancia de Lenis conectada al ticker de GSAP y a ScrollTrigger. Se desactiva con `prefers-reduced-motion`.
- El store de Zustand (`store/useExperience.ts`) guarda solo estados discretos: menú, capítulo activo, estado del video y preferencias de movimiento.
- Accesibilidad:
  - El botón "Pausar movimiento" detiene el video y la deriva ambiental.
  - El video se pausa cuando la pestaña no está visible.
  - Con movimiento reducido no hay pin, parallax ni smooth scroll, y el video arranca pausado.
