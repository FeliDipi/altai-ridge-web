import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/jost';
import '@fontsource-variable/manrope';
import 'lenis/dist/lenis.css';
import './styles/base.css';
import './styles/film.css';
import './styles/ui.css';
import './styles/sections.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
