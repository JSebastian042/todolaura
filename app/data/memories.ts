import { Recuerdo, CategoriaRecuerdo } from '@/app/types/content';

export const categoriasAlbum: ('Todos' | CategoriaRecuerdo)[] = [
  'Todos',
  'Citas',
  'Momentos',
  'Viajes',
  'Especiales',
];

export const recuerdosIniciales: Recuerdo[] = [
  {
    id: '1',
    titulo: 'Nuestra primera cita',
    fecha: '14 de Febrero, 2024',
    categoria: 'Citas',
    descripcion: 'Ese día no podía dejar de mirarte y me temblaban un poco las manos de los nervios. Tu sonrisa hizo que todo valiera la pena.',
    notaAmor: 'El día en que mi mundo cambió para siempre ♥',
    emojis: '☕🌹',
    author: 'Sebastián',
  },
  {
    id: '2',
    titulo: 'Paseo bajo la lluvia',
    fecha: '28 de Marzo, 2024',
    categoria: 'Momentos',
    descripcion: 'Nos atrapó la lluvia sin sombrilla y corrimos a refugiarnos. Terminamos muertos de la risa y tomando algo caliente juntos.',
    notaAmor: 'Contigo hasta los días grises tienen los colores más bonitos.',
    emojis: '🌧️✨',
    author: 'Laura',
  },
  {
    id: '3',
    titulo: 'Viaje juntos de fin de semana',
    fecha: '15 de Mayo, 2024',
    categoria: 'Viajes',
    descripcion: 'Explorar lugares nuevos de tu mano es una de mis cosas favoritas en el mundo. Esas fotos al atardecer quedaron hermosas.',
    notaAmor: 'Mi destino favorito siempre será a tu lado 🌷',
    emojis: '🌅🚗',
    author: 'Sebastián',
  },
  {
    id: '4',
    titulo: 'Tarde de películas y snacks',
    fecha: '10 de Julio, 2024',
    categoria: 'Especiales',
    descripcion: 'No necesitábamos salir a ningún lado sofisticado. Solo tus abrazos, cobijas y nuestras canciones favoritas sonando de fondo.',
    notaAmor: 'Tu abrazo es mi lugar seguro.',
    emojis: '🍿🎬',
    author: 'Sebastián',
  },
  {
    id: '5',
    titulo: 'Un detalle inolvidable',
    fecha: '20 de Agosto, 2024',
    categoria: 'Especiales',
    descripcion: 'La forma en que me escuchas y te preocupas por las pequeñas cosas me demuestra cada día lo maravillosa que eres.',
    notaAmor: 'Gracias por ser tan única, Laurita.',
    emojis: '💌🌸',
    author: 'Sebastián',
  },
];
