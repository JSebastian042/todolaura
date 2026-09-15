'use client';

import { useState } from 'react';
import { frases } from '@/app/data/quotes';
import { Frase } from '@/app/types/content';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

export default function FrasesPage() {
  const [fraseActual, setFraseActual] = useState<Frase>(() => {
    const indice = Math.floor(Math.random() * frases.length);
    return frases[indice];
  });

  const obtenerFraseAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    setFraseActual(frases[indiceAleatorio]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      <AmbientBackground />

      <div className="relative max-w-md w-full bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-pink-500/20 text-center flex flex-col items-center shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-5 backdrop-blur-md">
          <span>✨</span> Inspiración para ti
        </div>

        {/* Imagen del Autor */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 rounded-2xl overflow-hidden border border-pink-400/30 shadow-[0_0_20px_rgba(244,63,94,0.25)] bg-slate-950/50 flex items-center justify-center group">
          <img
            src={fraseActual.imagen}
            alt={fraseActual.autor}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Nombre del Autor */}
        <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 mb-2 tracking-wide">
          {fraseActual.autor}
        </h2>

        {/* Frase Cita */}
        <blockquote className="text-pink-100/90 font-serif italic text-sm sm:text-base leading-relaxed mb-6 px-2">
          "{fraseActual.texto}"
        </blockquote>

        {/* Acciones */}
        <div className="flex flex-col w-full gap-2.5">
          <button
            onClick={obtenerFraseAleatoria}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🎲</span>
            <span>Otra frase</span>
          </button>

          <BackButton />
        </div>
      </div>
    </main>
  );
}