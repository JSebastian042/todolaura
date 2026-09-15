'use client';

import { useState, useEffect, useRef } from 'react';
import { cancionesFavoritas } from '@/app/data/songs';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

function formatTime(time: number): string {
  if (isNaN(time) || !isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function MusicaPage() {
  const [indiceActual, setIndiceActual] = useState<number>(() =>
    Math.floor(Math.random() * cancionesFavoritas.length)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancionActual = cancionesFavoritas[indiceActual];

  // Cargar audio al cambiar de canción y reproducir si ya estaba activo
  useEffect(() => {
    if (audioRef.current && cancionActual) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [indiceActual, cancionActual]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const siguienteCancion = () => {
    setIndiceActual((prev) => (prev + 1) % cancionesFavoritas.length);
  };

  const anteriorCancion = () => {
    setIndiceActual((prev) => (prev - 1 + cancionesFavoritas.length) % cancionesFavoritas.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoTiempo = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = nuevoTiempo;
      setCurrentTime(nuevoTiempo);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      <audio
        ref={audioRef}
        src={cancionActual.audio}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={siguienteCancion}
        preload="metadata"
      />

      <AmbientBackground />

      <div className="relative bg-rose-950/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(244,114,182,0.15)] max-w-md sm:max-w-lg w-full text-center border border-pink-500/20 flex flex-col items-center transition-all">
        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-6 w-full justify-center">
          <span className="text-xl sm:text-2xl">✨</span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400">
            Tu Playlist <span className="text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.4)]">Laura</span>
          </h1>
          <span className="text-xl sm:text-2xl">💖</span>
        </div>

        {/* Portada */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-300/30 bg-rose-900/30 flex items-center justify-center group">
          <img
            src={cancionActual.portada}
            alt={`Portada de ${cancionActual.album}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info Canción */}
        <div className="mb-5 w-full px-2 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate drop-shadow-sm">
            {cancionActual.titulo}
          </h2>
          <p className="text-lg sm:text-xl font-medium text-pink-200/90 truncate mt-0.5">
            {cancionActual.artista}
          </p>
          <p className="text-xs sm:text-sm font-light text-pink-300/60 truncate mt-0.5">
            {cancionActual.album}
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full mb-6">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-pink-950/80 rounded-lg appearance-none cursor-pointer accent-pink-400 focus:outline-none"
          />
          <div className="flex justify-between text-xs font-medium text-pink-300/70 mt-2 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles de Reproducción */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6 text-pink-200">
          <button
            onClick={anteriorCancion}
            className="hover:text-pink-400 transition hover:scale-110 active:scale-95 cursor-pointer p-2"
            title="Anterior"
          >
            <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={siguienteCancion}
            className="hover:text-pink-400 transition hover:scale-110 active:scale-95 cursor-pointer p-2"
            title="Siguiente"
          >
            <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
            </svg>
          </button>
        </div>

        <BackButton />
      </div>
    </main>
  );
}