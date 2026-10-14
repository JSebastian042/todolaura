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

export type CategoriaRecuerdo = string;

export interface AlbumComment {
  id: string;
  albumId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Recuerdo {
  id: string;
  titulo: string;
  fecha: string;
  categoria: string;
  descripcion: string;
  notaAmor?: string;
  imagenUrl?: string;
  mediaType?: 'image' | 'video';
  emojis: string;
  author?: string;
  comments?: AlbumComment[];
}

export interface DictionaryItem {
  id?: string;
  palabra: string;
  significado: string;
  categoria?: string;
  author?: string;
}
