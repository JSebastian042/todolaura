'use client';

import { useState } from 'react';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

export default function RegaloPage() {
  const [abierto, setAbierto] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      <AmbientBackground />

      {/* Contenedor Principal */}
      <div className="relative bg-rose-950/40 backdrop-blur-xl p-6 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(244,114,182,0.15)] max-w-lg w-full text-center border border-pink-500/20 flex flex-col items-center transition-all">
        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-4 w-full justify-center">
          <span className="text-xl sm:text-2xl">🌷</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400">
            Un Regalo Especial
          </h1>
          <span className="text-xl sm:text-2xl">✨</span>
        </div>

        <p className="text-pink-200/80 text-xs sm:text-sm mb-6 max-w-xs font-medium">
          {abierto 
            ? "Tulipanes que nunca se marchitan, tan especiales como tú." 
            : "Toca el botón para abrir tu regalo virtual..."}
        </p>

        {/* Ilustración Vectorial de Tulipanes */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          <div className={`transition-all duration-700 transform ${abierto ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-40 translate-y-4 filter blur-sm'}`}>
            <svg viewBox="0 0 200 240" className="w-52 h-52 sm:w-64 sm:h-64 drop-shadow-[0_10px_20px_rgba(244,114,182,0.3)]">
              {/* Florero / Lazo */}
              <path d="M75 160 C75 160, 100 170, 125 160 C130 195, 120 220, 100 220 C80 220, 70 195, 75 160 Z" fill="#ffffff" opacity="0.25" stroke="#f472b6" strokeWidth="1.5"/>
              <path d="M85 165 C95 175, 105 175, 115 165" stroke="#fb7185" strokeWidth="3" fill="none" strokeLinecap="round"/>

              {/* TALLOS */}
              <path d="M85 165 Q65 120 60 80" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M100 165 Q100 110 100 65" stroke="#22c55e" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
              <path d="M115 165 Q135 120 140 80" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round"/>

              {/* HOJAS */}
              <path d="M95 140 Q60 120 45 135 Q70 155 95 140 Z" fill="#15803d" opacity="0.85"/>
              <path d="M105 140 Q140 120 155 135 Q130 155 105 140 Z" fill="#16a34a" opacity="0.85"/>

              {/* TULIPÁN IZQUIERDO */}
              <g transform="translate(60, 80)">
                <path d="M-18 0 C-25 -25, -10 -40, 0 -45 C10 -40, 25 -25, 18 0 C10 10, -10 10, -18 0 Z" fill="#fb7185"/>
                <path d="M-18 0 C-20 -20, -5 -35, 0 -45 C-5 -25, -12 -10, -18 0 Z" fill="#f43f5e"/>
                <path d="M18 0 C20 -20, 5 -35, 0 -45 C5 -25, 12 -10, 18 0 Z" fill="#e11d48"/>
                <path d="M-8 0 C-10 -20, 0 -38, 0 -38 C0 -38, 10 -20, 8 0 Z" fill="#fda4af" opacity="0.9"/>
              </g>

              {/* TULIPÁN CENTRO */}
              <g transform="translate(100, 65)">
                <path d="M-22 0 C-30 -30, -12 -50, 0 -55 C12 -50, 30 -30, 22 0 C12 12, -12 12, -22 0 Z" fill="#facc15"/>
                <path d="M-22 0 C-25 -25, -6 -40, 0 -55 C-6 -30, -15 -12, -22 0 Z" fill="#eab308"/>
                <path d="M22 0 C25 -25, 6 -40, 0 -55 C6 -30, 15 -12, 22 0 Z" fill="#ca8a04"/>
                <path d="M-10 0 C-12 -25, 0 -48, 0 -48 C0 -48, 12 -25, 10 0 Z" fill="#fef08a" opacity="0.95"/>
              </g>

              {/* TULIPÁN DERECHO */}
              <g transform="translate(140, 80)">
                <path d="M-18 0 C-25 -25, -10 -40, 0 -45 C10 -40, 25 -25, 18 0 C10 10, -10 10, -18 0 Z" fill="#f472b6"/>
                <path d="M-18 0 C-20 -20, -5 -35, 0 -45 C-5 -25, -12 -10, -18 0 Z" fill="#ec4899"/>
                <path d="M18 0 C20 -20, 5 -35, 0 -45 C5 -25, 12 -10, 18 0 Z" fill="#db2777"/>
                <path d="M-8 0 C-10 -20, 0 -38, 0 -38 C0 -38, 10 -20, 8 0 Z" fill="#fbcfe8" opacity="0.9"/>
              </g>

              {/* DESTELLOS */}
              {abierto && (
                <>
                  <circle cx="45" cy="50" r="3" fill="#fef08a" className="animate-ping"/>
                  <circle cx="155" cy="55" r="2.5" fill="#fbcfe8" className="animate-pulse"/>
                  <circle cx="100" cy="20" r="3.5" fill="#ffffff" className="animate-ping"/>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Botón de Interacción */}
        <button
          onClick={() => setAbierto(!abierto)}
          className="my-5 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-full text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_25px_rgba(244,114,182,0.4)] flex items-center gap-2 cursor-pointer"
        >
          <span>{abierto ? "🌷 Ocultar " : "🎁 Abrir Regalo"}</span>
        </button>

        <BackButton />
      </div>
    </main>
  );
}