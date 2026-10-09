/**
 * Datos editables del sitio.
 * ⚠️ Los datos de contacto son PLACEHOLDERS: reemplazarlos por los reales antes de publicar.
 */
export interface SiteConfig {
  name: { line1: string; line2: string; full: string };
  navNotes: readonly [string, string];
  contact: {
    email: string;
    phoneLabel: string | null;
    phoneHref: string | null;
    /** Mientras sea true se muestra una nota indicando que los datos son provisionales. */
    isPlaceholder: boolean;
  };
}

export const site: SiteConfig = {
  name: { line1: 'ALTAI', line2: 'RIDGE', full: 'ALTAI RIDGE' },
  navNotes: ['Proyecto residencial', 'Arquitectura y paisaje'],
  contact: {
    email: 'contacto@altairidge.example',
    phoneLabel: '+00 000 000 000',
    phoneHref: '+00000000000',
    isPlaceholder: true,
  },
};
