import { media } from '../config/media';

export type ChapterId =
  | 'inicio'
  | 'concepto'
  | 'habitar'
  | 'materiales'
  | 'experiencia'
  | 'recorrido'
  | 'contacto';

export interface Chapter {
  id: ChapterId;
  index: string;
  label: string;
}

export const chapters: readonly Chapter[] = [
  { id: 'inicio', index: '01', label: 'Apertura' },
  { id: 'concepto', index: '02', label: 'Concepto' },
  { id: 'habitar', index: '03', label: 'Habitar' },
  { id: 'materiales', index: '04', label: 'Materiales' },
  { id: 'experiencia', index: '05', label: 'Experiencia' },
  { id: 'recorrido', index: '06', label: 'Recorrido' },
  { id: 'contacto', index: '07', label: 'Contacto' },
];

/** Una línea de titular; `indent` desplaza la línea para componer titulares asimétricos. */
export interface HeadingLine {
  text: string;
  indent?: string;
}

export const hero = {
  welcome: [{ text: 'Bienvenidos' }, { text: 'a Altai Ridge', indent: '0.9em' }] as HeadingLine[],
  intro:
    'Un proyecto residencial donde la arquitectura se abre a la vegetación y a la luz. Terrazas escalonadas, jardines y espacios pensados para habitar el paisaje.',
  cta: 'Descubrir el proyecto',
  explore: 'Desplazá para explorar',
};

export const concept = {
  eyebrow: 'El concepto',
  title: [
    { text: 'Arquitectura' },
    { text: 'que pertenece', indent: '1.4em' },
    { text: 'al paisaje', indent: '0.5em' },
  ] as HeadingLine[],
  body:
    'El edificio se escalona para que cada nivel encuentre su propio jardín. Los volúmenes retroceden, las terrazas se cubren de vegetación y la construcción se funde con el parque que la rodea.',
  attributes: [
    { index: '01', title: 'Volumen escalonado', text: 'Cada nivel retrocede y libera una terraza abierta al cielo.' },
    { index: '02', title: 'Terrazas vegetales', text: 'Jardineras integradas que llevan el parque hacia la altura.' },
    { index: '03', title: 'Luz y transparencia', text: 'Grandes superficies vidriadas y celosías de madera que filtran el sol.' },
  ],
};

export interface InhabitScene {
  index: string;
  label: string;
  title: HeadingLine[];
  text: string;
}

export const inhabit = {
  title: [{ text: 'Habitar' }, { text: 'la naturaleza', indent: '1.1em' }] as HeadingLine[],
  scenes: [
    {
      index: '01',
      label: 'Paisaje',
      title: [{ text: 'El parque como' }, { text: 'punto de partida', indent: '0.8em' }],
      text: 'Senderos, olivos y cipreses acompañan la llegada. El paisaje no rodea al edificio: lo atraviesa.',
    },
    {
      index: '02',
      label: 'Privacidad',
      title: [{ text: 'Intimidad' }, { text: 'entre la vegetación', indent: '0.6em' }],
      text: 'Jardineras y celosías de madera crean filtros naturales entre cada vivienda y su entorno.',
    },
    {
      index: '03',
      label: 'Conexión exterior',
      title: [{ text: 'Cada ambiente' }, { text: 'mira hacia afuera', indent: '1em' }],
      text: 'Terrazas profundas prolongan el interior hacia el aire libre, en todos los niveles.',
    },
  ] as InhabitScene[],
};

export interface MaterialScene {
  index: string;
  title: string;
  text: string;
}

export const materials = {
  eyebrow: 'Arquitectura y materiales',
  scenes: [
    {
      index: '01',
      title: 'Materia',
      text: 'Piedra clara, madera y vidrio. Una paleta serena, en sintonía con la vegetación que la acompaña.',
    },
    {
      index: '02',
      title: 'Luz',
      text: 'La luz natural recorre las fachadas y atraviesa las celosías, cambiando el carácter del edificio a lo largo del día.',
    },
    {
      index: '03',
      title: 'Espacio',
      text: 'Volúmenes que retroceden, terrazas que se abren y jardines que conectan cada nivel.',
    },
  ] as MaterialScene[],
};

export const experience = {
  eyebrow: 'La experiencia de habitar',
  phrase: [{ text: 'El paisaje,' }, { text: 'parte de', indent: '1.2em' }, { text: 'tu casa', indent: '0.4em' }] as HeadingLine[],
  text: 'Vivir entre terrazas verdes, con el parque siempre a la vista.',
};

export interface JourneyStage {
  index: string;
  title: string;
  text: string;
  image: string;
}

export const journey = {
  eyebrow: 'El recorrido del proyecto',
  title: [{ text: 'Del paisaje' }, { text: 'al hogar', indent: '1.2em' }] as HeadingLine[],
  stages: [
    { index: '01', title: 'Visión', text: 'Una idea simple: que la arquitectura y el parque formen un solo lugar.', image: media.frames.aerial },
    { index: '02', title: 'Diseño', text: 'Volúmenes escalonados, terrazas vegetales y una materialidad cálida y precisa.', image: media.frames.corner },
    { index: '03', title: 'Construcción', text: 'Cada detalle se resuelve con atención al oficio y al entorno.', image: media.frames.terraces },
    { index: '04', title: 'Habitar', text: 'Espacios pensados para vivir el paisaje desde adentro.', image: media.frames.facade },
  ] as JourneyStage[],
};

export const closing = {
  eyebrow: 'Contacto',
  title: [{ text: 'Tu próxima' }, { text: 'forma de', indent: '1.3em' }, { text: 'habitar', indent: '0.5em' }] as HeadingLine[],
  cta: 'Conocer el proyecto',
  ctaSubject: 'Quiero conocer Altai Ridge',
  text: 'Escribinos y te acercamos toda la información del proyecto.',
  placeholderNote: 'Datos de contacto provisionales.',
};
