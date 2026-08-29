'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Cancion {
  id: number;
  titulo: string;
  artista: string;
  album: string;
  portada: string;
  audio: string;
}

const cancionesFavoritas: Cancion[] = [
  {
    id: 1,
    titulo: "After You",
    artista: "Stray Kids",
    album: "THIS & THAT",
    portada: "/portada/after.jpg",
    audio: "/musica/after.mp3",
  },
  {
    id: 2,
    titulo: "This & That",
    artista: "Stray Kids",
    album: "THIS & THAT",
    portada: "/portada/this.jpg",
    audio: "/musica/this.mp3",
  },
  {
    id: 3,
    titulo: "Razón",
    artista: "Los Caligaris",
    album: "No Es Mi Despedida",
    portada: "/portada/razon.jpg",
    audio: "/musica/razon.mp3",
  },
  {
    id: 4,
    titulo: "Sign of the Times",
    artista: "Harry Styles",
    album: "Harry Styles",
    portada: "/portada/sign.jpg",
    audio: "/musica/sign.mp3",
  },
  {
    id: 5,
    titulo: "Nuestro Juramento",
    artista: "Julio Jaramillo",
    album: "El Sentimental de América",
    portada: "/portada/nuestro.jpg",
    audio: "/musica/nuestro.mp3",
  },
   {
    id: 6,
    titulo: "Amor Narcótico",
    artista: "Chichi Peralta",
    album: "Pa' otro la'o",
    portada: "/portada/amor.jpg",
    audio: "/musica/amor.mp3",
  },
   {
    id: 7,
    titulo: "She's Crazy But She's Mine",
    artista: "Alex Sparrow",
    album: "Single",
    portada: "/portada/gacha.jpg",
    audio: "/musica/gacha.mp3",
  },
];

export default function MusicaPage() {
  const [indiceActual, setIndiceActual] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  useEffect(() => {
    const aleatorio = Math.floor(Math.random() * cancionesFavoritas.length);
    setIndiceActual(aleatorio);
  }, []);

  const cancionActual = cancionesFavoritas[indiceActual];

 
  useEffect(() => {
    if (audioRef.current && cancionActual) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Error de reproducción:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [indiceActual]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Error al iniciar audio:", err);
        setIsPlaying(false);
      });
    }
  };

  const siguienteCancion = () => {
    setIndiceActual((prev) => (prev + 1) % cancionesFavoritas.length);
  };

  const anteriorCancion = () => {
    setIndiceActual((prev) => (prev - 1 + cancionesFavoritas.length) % cancionesFavoritas.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoTiempo = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = nuevoTiempo;
      setCurrentTime(nuevoTiempo);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutos = Math.floor(time / 60);
    const segundos = Math.floor(time % 60);
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  };

  if (!cancionActual) {
    return (
      <main className="min-h-screen bg-rose-950 flex items-center justify-center p-4">
        <p className="text-pink-200 text-lg font-medium animate-pulse">Cargando tu música especial... ✨</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-pink-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden">
      
      
      <audio
        ref={audioRef}
        src={cancionActual.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={siguienteCancion}
        preload="metadata"
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-rose-950/40 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(244,114,182,0.15)] max-w-lg w-full text-center border border-pink-500/20 flex flex-col items-center transition-all duration-300">
        
      
        <div className="flex items-center gap-2 mb-8 w-full justify-center">
          <span className="text-2xl">✨</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400">
            Tu Playlist <span className="text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.4)]">Laura</span>
          </h1>
          <span className="text-2xl">💖</span>
        </div>

        {/* Portada */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mb-8 rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-300/30 bg-rose-900/30 flex items-center justify-center group">
          <img
            src={cancionActual.portada}
            alt={`Portada de ${cancionActual.album}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

       
        <div className="mb-6 w-full px-2 text-left">
          <h2 className="text-3xl font-black text-white tracking-tight truncate drop-shadow-sm">
            {cancionActual.titulo}
          </h2>
          <p className="text-xl font-medium text-pink-200/90 truncate mt-1">
            {cancionActual.artista}
          </p>
          <p className="text-sm font-light text-pink-300/60 truncate mt-1">
            {cancionActual.album}
          </p>
        </div>

       
        <div className="w-full mb-8">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-pink-950/80 rounded-lg appearance-none cursor-pointer accent-pink-400 focus:outline-none"
          />
          <div className="flex justify-between text-xs font-medium text-pink-300/70 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

       
        <div className="flex items-center justify-center gap-8 mb-10 text-pink-200">
          <button 
            onClick={anteriorCancion}
            className="hover:text-pink-400 transition hover:scale-110 active:scale-95"
            title="Anterior"
          >
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button 
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button 
            onClick={siguienteCancion}
            className="hover:text-pink-400 transition hover:scale-110 active:scale-95"
            title="Siguiente"
          >
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
            </svg>
          </button>
        </div>

        
        <Link
          href="/dashboard"
          className="px-8 py-3.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-pink-200 font-bold rounded-full text-base border border-pink-400/30 transition shadow-lg w-full backdrop-blur-md"
        >
          Volver al panel principal
        </Link>
      </div>
    </main>
  );
}