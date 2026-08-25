'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Frase {
  id: number;
  texto: string;
  autor: string;
  imagen: string;
}

const frases: Frase[] = [
  // Oscar Wilde
  {
    id: 1,
    texto: "Sé tú mismo, los demás puestos ya están ocupados.",
    autor: "Oscar Wilde",
    imagen: "/autores/Wilde.jpg",
  },
  {
    id: 2,
    texto: "Con la libertad, los libros, las flores y la luna, ¿quién no puede ser feliz?",
    autor: "Oscar Wilde",
    imagen: "/autores/Wilde.jpg",
  },
  // Fiódor Dostoyevski
  {
    id: 3,
    texto: "El secreto de la existencia no consiste solamente en vivir, sino en saber para qué se vive.",
    autor: "Fiódor Dostoyevski",
    imagen: "/autores/Fyodor.jpg",
  },
  {
    id: 4,
    texto: "La belleza salvará al mundo.",
    autor: "Fiódor Dostoyevski",
    imagen: "/autores/Fyodor.jpg",
  },
  // Vincent Van Gogh
  {
    id: 5,
    texto: "Prefiero morir de pasión que de aburrimiento.",
    autor: "Vincent Van Gogh",
    imagen: "/autores/Vincent.jpg",
  },
  {
    id: 6,
    texto: "Qué sería de la vida si no tuviéramos el valor de intentar algo nuevo?",
    autor: "Vincent Van Gogh",
    imagen: "/autores/Vincent.jpg",
  },
  // José Asunción Silva
  {
    id: 7,
    texto: "Soñar es ver la vida de otro modo y darle al alma su verdadero cielo.",
    autor: "José Asunción Silva",
    imagen: "/autores/Silva.jpg",
  },
  {
    id: 8,
    texto: "Las cosas vivas son bellas, pero las cosas soñadas son sublimes.",
    autor: "José Asunción Silva",
    imagen: "/autores/Silva.jpg",
  },
  // Franz Kafka
  {
    id: 9,
    texto: "Todo lo que amas, eventualmente se perderá, pero al final, el amor volverá de una forma diferente.",
    autor: "Franz Kafka",
    imagen: "/autores/Franz.jpg",
  },
  {
    id: 10,
    texto: "El punto de inflexión en la vida es la comprensión de que todo está por venir.",
    autor: "Franz Kafka",
    imagen: "/autores/Franz.jpg",
  },
];

export default function FrasesPage() {
  const [fraseActual, setFraseActual] = useState<Frase | null>(null);

  const obtenerFraseAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    setFraseActual(frases[indiceAleatorio]);
  };

  useEffect(() => {
    obtenerFraseAleatoria();
  }, []);

  if (!fraseActual) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Esferas de luz ambiental (coincidentes con el dashboard) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta Principal en Glassmorphism */}
      <div className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-pink-500/20 text-center flex flex-col items-center shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all duration-300">
        
        {/* Badge superior estilo chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-6 backdrop-blur-md">
          <span>✨</span> Inspiración para ti
        </div>

        {/* Imagen del Autor con borde rosa brillante */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-5 rounded-2xl overflow-hidden border border-pink-400/30 shadow-[0_0_20px_rgba(244,63,94,0.25)] bg-slate-950/50 flex items-center justify-center group">
          <img
            src={fraseActual.imagen}
            alt={fraseActual.autor}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Nombre del Autor */}
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 mb-3 tracking-wide">
          {fraseActual.autor}
        </h2>

        {/* Frase Cita */}
        <blockquote className="text-pink-100/90 font-serif italic text-base sm:text-lg leading-relaxed mb-8 px-2">
          "{fraseActual.texto}"
        </blockquote>

        {/* Acciones */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={obtenerFraseAleatoria}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-sm transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
          >
            <span>🎲</span> Otra frase
          </button>

          <Link
            href="/dashboard"
            className="w-full py-3.5 bg-slate-950/50 hover:bg-slate-950/80 text-pink-200/80 font-semibold rounded-2xl text-sm border border-pink-500/20 transition backdrop-blur-md"
          >
            Volver al panel principal
          </Link>
        </div>
      </div>
    </main>
  );
}