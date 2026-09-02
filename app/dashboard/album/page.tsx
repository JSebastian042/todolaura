'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Recuerdo {
  id: string;
  titulo: string;
  fecha: string;
  categoria: 'Viajes' | 'Citas' | 'Especiales' | 'Momentos';
  descripcion: string;
  notaAmor?: string;
  imagenUrl?: string; // Opcional por si deseas colocar fotos reales más adelante
  emojis: string;
}

const recuerdos: Recuerdo[] = [
  {
    id: '1',
    titulo: 'Nuestra primera cita',
    fecha: '14 de Febrero, 2024',
    categoria: 'Citas',
    descripcion: 'Ese día no podía dejar de mirarte y me temblaban un poco las manos de los nervios. Tu sonrisa hizo que todo valiera la pena.',
    notaAmor: 'El día en que mi mundo cambió para siempre ♥',
    emojis: '☕🌹',
  },
  {
    id: '2',
    titulo: 'Paseo bajo la lluvia',
    fecha: '28 de Marzo, 2024',
    categoria: 'Momentos',
    descripcion: 'Nos atrapó la lluvia sin sombrilla y corrimos a refugiarnos. Terminamos muertos de la risa y tomando algo caliente juntos.',
    notaAmor: 'Contigo hasta los días grises tienen los colores más bonitos.',
    emojis: '🌧️✨',
  },
  {
    id: '3',
    titulo: 'Viaje juntos de fin de semana',
    fecha: '15 de Mayo, 2024',
    categoria: 'Viajes',
    descripcion: 'Explorar lugares nuevos de tu mano es una de mis cosas favoritas en el mundo. Esas fotos al atardecer quedaron hermosas.',
    notaAmor: 'Mi destino favorito siempre será a tu lado 🌷',
    emojis: '🌅🚗',
  },
  {
    id: '4',
    titulo: 'Tarde de películas y snacks',
    fecha: '10 de Julio, 2024',
    categoria: 'Especiales',
    descripcion: 'No necesitábamos salir a ningún lado sofisticado. Solo tus abrazos, cobijas y nuestras canciones favoritas sonando de fondo.',
    notaAmor: 'Tu abrazo es mi lugar seguro.',
    emojis: '🍿🎬',
  },
  {
    id: '5',
    titulo: 'Un detalle inolvidable',
    fecha: '20 de Agosto, 2024',
    categoria: 'Especiales',
    descripcion: 'La forma en que me escuchas y te preocupas por las pequeñas cosas me demuestra cada día lo maravillosa que eres.',
    notaAmor: 'Gracias por ser tan única, Laurita.',
    emojis: '💌🌸',
  },
];

const categorias = ['Todos', 'Citas', 'Momentos', 'Viajes', 'Especiales'] as const;

export default function AlbumPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos');
  const [recuerdoSeleccionado, setRecuerdoSeleccionado] = useState<Recuerdo | null>(null);

  const recuerdosFiltrados = categoriaActiva === 'Todos'
    ? recuerdos
    : recuerdos.filter((r) => r.categoria === categoriaActiva);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#120309] via-[#2d0a1b] to-[#120309] text-white p-4 md:p-8 overflow-hidden font-sans flex flex-col justify-between">
      
      {/* Fondo con Decoración de Tulipanes Ilustrados */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-between items-end px-4">
        <svg className="w-36 h-56 sm:w-56 sm:h-80 text-pink-500 fill-current" viewBox="0 0 100 150">
          <path d="M50 150 Q50 100 30 80 Q10 100 10 130 C10 150 40 150 50 150 Z" opacity="0.4" />
          <path d="M50 150 Q50 90 70 70 Q90 90 90 120 C90 150 60 150 50 150 Z" opacity="0.4" />
          <path d="M50 150 Q50 80 50 40" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M50 40 C30 10 20 40 35 60 C45 70 50 40 50 40 Z" />
          <path d="M50 40 C70 10 80 40 65 60 C55 70 50 40 50 40 Z" />
          <path d="M40 35 C40 10 60 10 60 35 C50 45 40 35 40 35 Z" fill="#f472b6" />
        </svg>

        <svg className="w-48 h-72 sm:w-64 sm:h-96 text-rose-400 fill-current" viewBox="0 0 100 150">
          <path d="M50 150 Q50 70 50 30" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M50 30 C25 0 15 35 30 55 C40 65 50 30 50 30 Z" />
          <path d="M50 30 C75 0 85 35 70 55 C60 65 50 30 50 30 Z" />
          <path d="M38 25 C38 0 62 0 62 25 C50 35 38 25 38 25 Z" fill="#fb7185" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-row justify-between items-center mb-6 gap-2 border-b border-pink-900/50 pb-4">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-200 to-rose-300 bg-clip-text text-transparent">
            Álbum de Recuerdos 📸🌷
          </h1>
          <div className="flex items-center gap-1.5 bg-[#220716]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/20 shadow-sm text-xs sm:text-sm text-pink-200 font-medium">
            <span>Nuestra Historia, Laurita</span>
            <span className="text-rose-400">♥</span>
          </div>
        </header>

        {/* Filtros por Categoría */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {categorias.map((cat) => {
            const isActive = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50'
                    : 'bg-[#220716]/60 text-pink-300/80 hover:bg-[#220716] border border-pink-500/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Estilo Álbum Polaroid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recuerdosFiltrados.map((recuerdo) => (
            <div
              key={recuerdo.id}
              onClick={() => setRecuerdoSeleccionado(recuerdo)}
              className="group cursor-pointer bg-[#1c0612]/80 backdrop-blur-md border border-pink-500/20 hover:border-pink-400/60 rounded-3xl p-4 shadow-xl hover:shadow-pink-900/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Marco estilo Foto Vintage / Polaroid */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#2e0b1f] to-[#1a0410] rounded-2xl border border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
                {recuerdo.imagenUrl ? (
                  <img
                    src={recuerdo.imagenUrl}
                    alt={recuerdo.titulo}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl mb-2 block">{recuerdo.emojis}</span>
                    <span className="text-xs text-pink-300/60 font-mono">
                      [Foto del Recuerdo]
                    </span>
                  </div>
                )}
                {/* Sello de Fecha */}
                <span className="absolute bottom-2 right-2 bg-[#120309]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-pink-300 border border-pink-500/20">
                  {recuerdo.fecha}
                </span>
              </div>

              {/* Detalles del Recuerdo */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base text-pink-100 group-hover:text-pink-300 transition-colors">
                    {recuerdo.titulo}
                  </h3>
                  <span className="text-xs bg-pink-900/40 border border-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full">
                    {recuerdo.categoria}
                  </span>
                </div>
                <p className="text-xs text-pink-200/70 line-clamp-2 mt-2 leading-relaxed">
                  {recuerdo.descripcion}
                </p>
              </div>

              {recuerdo.notaAmor && (
                <div className="mt-3 pt-3 border-t border-pink-500/20 flex items-center gap-1.5 text-[11px] text-rose-300 font-medium italic">
                  <span>🌷</span>
                  <span className="truncate">{recuerdo.notaAmor}</span>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* Modal / Pop-up para ver detalle del recuerdo */}
      {recuerdoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#2a0818] to-[#120309] border border-pink-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-white">
            <button
              onClick={() => setRecuerdoSeleccionado(null)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white bg-pink-950/60 p-2 rounded-full border border-pink-500/20 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <span className="text-5xl block mb-2">{recuerdoSeleccionado.emojis}</span>
              <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-500/30">
                {recuerdoSeleccionado.fecha}
              </span>
              <h2 className="text-2xl font-bold mt-2 text-pink-100">
                {recuerdoSeleccionado.titulo}
              </h2>
            </div>

            <p className="text-sm text-pink-200/90 leading-relaxed mb-6 bg-[#1a0511]/80 p-4 rounded-2xl border border-pink-500/20">
              {recuerdoSeleccionado.descripcion}
            </p>

            {recuerdoSeleccionado.notaAmor && (
              <div className="p-3 bg-pink-950/40 border border-pink-500/30 rounded-2xl text-center text-xs text-rose-300 font-medium italic">
                "{recuerdoSeleccionado.notaAmor}"
              </div>
            )}

            <button
              onClick={() => setRecuerdoSeleccionado(null)}
              className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-pink-900/50"
            >
              Cerrar recuerdo ✨
            </button>
          </div>
        </div>
      )}

      {/* Botón Volver */}
      <div className="relative z-10 max-w-6xl mx-auto w-full mt-2">
        <Link
          href="/dashboard"
          className="w-full py-3.5 bg-slate-950/50 hover:bg-slate-950/80 text-pink-200/80 font-semibold rounded-2xl text-sm border border-pink-500/20 transition backdrop-blur-md flex items-center justify-center"
        >
          Volver al panel principal
        </Link>
      </div>
    </div>
  );
}