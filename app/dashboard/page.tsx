'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [mensajeProximamente, setMensajeProximamente] = useState(false);

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMensajeProximamente(true);
    setTimeout(() => {
      setMensajeProximamente(false);
    }, 3000);
  };

  const modulos = [
    {
      titulo: 'Frases Motivacionales',
      descripcion: 'Mensajes especiales para alegrar tu día',
      icono: '✨',
      href: '/dashboard/frases',
      colorGradient: 'from-amber-400/20 to-yellow-500/10 border-amber-400/30 text-amber-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Carta de Amor',
      descripcion: 'Un mensaje escrito desde el corazón',
      icono: '💌',
      href: '/dashboard/carta',
      colorGradient: 'from-rose-500/20 to-red-500/10 border-rose-400/30 text-rose-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Música Favorita',
      descripcion: 'Tu playlist especial para escuchar',
      icono: '🎵',
      href: '/dashboard/musica',
      colorGradient: 'from-purple-500/20 to-indigo-500/10 border-purple-400/30 text-purple-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Regalo Virtual',
      descripcion: 'Una sorpresa hecha especialmente para ti',
      icono: '🌷',
      href: '/dashboard/regalo',
      colorGradient: 'from-pink-500/20 to-rose-400/10 border-pink-400/30 text-pink-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(244,114,182,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Diccionario',
      descripcion: 'Nuestras palabras con significados únicos',
      icono: '📖',
      href: '/dashboard/diccionario',
      colorGradient: 'from-fuchsia-500/20 to-pink-500/10 border-fuchsia-400/30 text-fuchsia-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(217,70,239,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Calendario',
      descripcion: 'Fechas e hitos inolvidables juntos',
      icono: '🗓️',
      href: '/dashboard/calendario',
      colorGradient: 'from-sky-500/20 to-indigo-500/10 border-sky-400/30 text-sky-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Horario de Clases',
      descripcion: 'Tus asignaturas y horarios organizados',
      icono: '📅',
      href: '/dashboard/horario',
      colorGradient: 'from-pink-500/20 to-purple-500/10 border-pink-400/30 text-pink-200',
      hoverGlow: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]',
      isBlocked: false,
    },
    {
      titulo: 'Álbum de Recuerdos',
      descripcion: 'Nuestra historia guardada en fotos (Próximamente)',
      icono: '📸',
      href: '#',
      colorGradient: 'from-rose-900/20 to-pink-950/10 border-rose-500/20 text-rose-300/70',
      hoverGlow: 'hover:shadow-none',
      isBlocked: true,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mensaje flotante cuando toca Álbum */}
      {mensajeProximamente && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-950/95 border border-pink-500/50 text-pink-200 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce text-xs sm:text-sm font-semibold text-center max-w-[90vw]">
          <span>🔒</span>
          <span>¡Próximamente disponible! Un rinconcito especial en construcción 🌷</span>
        </div>
      )}

      <div className="relative max-w-4xl w-full flex flex-col items-center py-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs sm:text-sm font-medium mb-4 backdrop-blur-md">
            <span>💖</span> Un rincón especial para ti
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-100 to-pink-400 tracking-tight drop-shadow-sm">
            Para Laura
          </h1>
          <p className="text-pink-200/70 text-sm sm:text-base mt-3 max-w-md mx-auto font-light">
            Selecciona una tarjeta para explorar el contenido que preparé con mucho cariño.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full px-2 sm:px-0">
          {modulos.map((modulo) => (
            <Link
              key={modulo.titulo}
              href={modulo.href}
              onClick={modulo.isBlocked ? handleAlbumClick : undefined}
              className={`group relative bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border ${modulo.colorGradient} transition-all duration-300 ${modulo.isBlocked ? 'opacity-75 cursor-pointer' : 'hover:-translate-y-1.5 ' + modulo.hoverGlow} flex flex-col justify-between overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {modulo.icono}
                </div>
                
                {modulo.isBlocked ? (
                  <span className="text-[10px] uppercase font-mono bg-rose-950/80 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-full">
                    Próximamente 🔒
                  </span>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-300/60 group-hover:text-pink-300 group-hover:bg-white/10 transition-all">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-pink-200 transition-colors">
                  {modulo.titulo}
                </h2>
                <p className="text-xs sm:text-sm text-pink-200/60 mt-1.5 font-light leading-relaxed">
                  {modulo.descripcion}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-pink-300/40 text-xs font-serif tracking-widest uppercase">
          ✦ Hecho con amor ✦
        </p>
      </div>
    </main>
  );
}