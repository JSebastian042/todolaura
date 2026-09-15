import { Asignatura } from '@/app/types/content';

export const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;
export const horasTimeline = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const materias: Asignatura[] = [
  {
    id: '1',
    nombre: 'Habilidades para la vida',
    codigo: '603032C',
    grupo: '01',
    dia: 'Lunes',
    horaInicio: 10,
    duracionHoras: 3,
    icono: '📖',
  },
  {
    id: '2',
    nombre: 'Literatura Afrolatinoamericana',
    codigo: '202007C',
    grupo: '2',
    dia: 'Lunes',
    horaInicio: 15,
    duracionHoras: 3,
    icono: '✨',
  },
  {
    id: '3',
    nombre: 'Didáctica de la lengua y la literatura',
    codigo: '202009C',
    grupo: '2',
    dia: 'Martes',
    horaInicio: 15,
    duracionHoras: 3,
    icono: '🎵',
  },
  {
    id: '4',
    nombre: 'Seminario Taller de métodos Literarios I',
    codigo: '202010C',
    grupo: '1',
    dia: 'Miércoles',
    horaInicio: 15,
    duracionHoras: 3,
    icono: '🌷',
  },
  {
    id: '5',
    nombre: 'Géneros discursivos y tipologías textuales',
    codigo: '202008C',
    grupo: '2',
    dia: 'Viernes',
    horaInicio: 15,
    duracionHoras: 3,
    icono: '💌',
  },
];
