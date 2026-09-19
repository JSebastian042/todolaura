'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Heart, Sparkles, Trophy } from 'lucide-react';
import { getActiveUser, USERS, UserProfile } from '@/app/types/auth';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

export default function CuadernosHubPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getActiveUser());

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c0512] via-[#1a081f] to-[#310a21] text-white p-4 sm:p-8 font-sans flex flex-col items-center justify-between relative overflow-hidden select-none">
      <AmbientBackground withTulips />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10 py-4 sm:py-8">
        {/* Badge Superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs sm:text-sm mb-3">
          <Book className="w-3.5 h-3.5 text-pink-400" />
          <span>Nuestras Agendas Semanales</span>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200">
            Cuadernos de la Semana 📒
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Hojas de Lunes a Viernes para escribirnos notas, subir fotitos y mandarnos notas de voz.
          </p>
          <div className="pt-1">
            <span className="text-[11px] text-pink-300/70 bg-pink-950/40 border border-pink-500/20 px-3 py-1 rounded-full inline-block">
              Entrando como: <strong className="text-white font-semibold">{currentUser.displayName} {currentUser.badgeEmoji}</strong>
            </span>
          </div>
        </div>

        {/* Contenedor de Cuadernos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
          
          {/* 1. Cuaderno de Laura */}
          <Link
            href="/dashboard/cuadernos/laura"
            className="group relative rounded-3xl bg-gradient-to-br from-pink-900/80 via-rose-950/90 to-purple-950/80 border-2 border-pink-500/40 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-pink-400 hover:shadow-[0_0_40px_rgba(244,114,182,0.35)] flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            {/* Resplandor interno */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/15 blur-3xl rounded-full pointer-events-none" />

            {/* Efecto Lomo de Libro / Libreta */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-rose-950 border-r border-pink-500/30 flex flex-col justify-around items-center py-4">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-300/40" />
            </div>

            <div className="pl-6">
              {/* Stickers / Emojis de la portada */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform">
                  🌷
                </div>
                <div className="flex gap-1.5 text-lg">
                  <span className="animate-bounce">💖</span>
                  <span>🎀</span>
                  <span>✨</span>
                </div>
              </div>

              {/* Título de la libreta */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400 font-mono">
                  Libreta Personal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-pink-200 transition-colors">
                  Cuaderno de Laura
                </h2>
                <p className="text-xs sm:text-sm text-pink-200/70 leading-relaxed pt-1">
                  Pensamientos dulces, fotitos tiernas, stickers y notas con amor.
                </p>
              </div>
            </div>

            <div className="pl-6 pt-4 border-t border-pink-500/20 flex items-center justify-between text-xs font-semibold text-pink-300 group-hover:text-white transition-colors">
              <span>Abrir páginas de la semana</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">📖 →</span>
            </div>
          </Link>

          {/* 2. Cuaderno de Sebastián */}
          <Link
            href="/dashboard/cuadernos/sebastian"
            className="group relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-950 border-2 border-indigo-500/40 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-sky-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            {/* Resplandor interno */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

            {/* Efecto Lomo de Libro / Libreta */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-slate-950 border-r border-indigo-500/30 flex flex-col justify-around items-center py-4">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-300/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-300/40" />
            </div>

            <div className="pl-6">
              {/* Stickers / Emojis de la portada */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform">
                  ⚽
                </div>
                <div className="flex gap-1.5 text-lg">
                  <span className="animate-bounce">🏆</span>
                  <span>⚡</span>
                  <span>🔥</span>
                </div>
              </div>

              {/* Título de la libreta */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono">
                  Libreta de Estrategia & Amor
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors">
                  Cuaderno de Sebastián
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200/70 leading-relaxed pt-1">
                  Jugadas maestras, memorias del día, foticos y notas de amor para mi reina.
                </p>
              </div>
            </div>

            <div className="pl-6 pt-4 border-t border-indigo-500/20 flex items-center justify-between text-xs font-semibold text-indigo-300 group-hover:text-white transition-colors">
              <span>Abrir páginas de la semana</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">📖 →</span>
            </div>
          </Link>

        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          💡 Puedes entrar a cualquiera de los dos cuadernos para escribirle una cartica o dejarle un audio sorpresa.
        </div>
      </div>

      <BackButton />
    </main>
  );
}
