export interface Cancion {
  id: number;
  titulo: string;
  artista: string;
  album: string;
  portada: string;
  audio: string;
}

export interface Frase {
  id: number;
  texto: string;
  autor: string;
  imagen: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
  codigo: string;
  grupo: string;
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  horaInicio: number;
  duracionHoras: number;
  icono: string;
}

export type CategoriaRecuerdo = 'Viajes' | 'Citas' | 'Especiales' | 'Momentos';

export interface Recuerdo {
  id: string;
  titulo: string;
  fecha: string;
  categoria: CategoriaRecuerdo;
  descripcion: string;
  notaAmor?: string;
  imagenUrl?: string;
  emojis: string;
  author?: string;
}

export interface DictionaryItem {
  id?: string;
  palabra: string;
  significado: string;
  categoria?: string;
  author?: string;
}
