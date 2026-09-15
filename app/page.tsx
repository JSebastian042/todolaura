'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LAURA_PIN, SEBASTIAN_PIN, UserRole } from '@/app/types/auth';

export default function Login() {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [welcomeUser, setWelcomeUser] = useState<UserRole | null>(null);
  const router = useRouter();

  const handleKeyPress = useCallback((num: string) => {
    setPin((prevPin) => {
      if (prevPin.length < 4) {
        const newPin = prevPin + num;
        if (newPin.length === 4) {
          if (newPin === LAURA_PIN) {
            setWelcomeUser('laura');
            sessionStorage.setItem('todolaura_unlocked', 'true');
            sessionStorage.setItem('todolaura_user', 'laura');
            setTimeout(() => router.push('/dashboard'), 600);
          } else if (newPin === SEBASTIAN_PIN) {
            setWelcomeUser('sebastian');
            sessionStorage.setItem('todolaura_unlocked', 'true');
            sessionStorage.setItem('todolaura_user', 'sebastian');
            setTimeout(() => router.push('/dashboard'), 600);
          } else {
            setError(true);
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 600);
          }
        }
        return newPin;
      }
      return prevPin;
    });
  }, [router]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
    setError(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleDelete, handleClear]);

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#120309] via-[#1f0510] to-[#0a0104] p-4 select-none relative overflow-hidden">
      {/* Luz de fondo suave parecida a la imagen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 bg-[#1e0a14]/80 backdrop-blur-xl border border-pink-500/20 p-8 rounded-3xl shadow-2xl max-w-xs sm:max-w-sm w-full text-center flex flex-col items-center">
        
        {/* Pill/Badge superior como en el Dashboard */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-[11px] font-medium text-pink-300 mb-4">
          <span>💖</span> Un rincón especial para ti
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
          Bienvenida a TodoLaura
        </h1>
        <p className="text-xs text-pink-200/60 mb-6">
          Ingresa el PIN usando la pantalla o el teclado
        </p>

        {/* Indicadores de PIN estilo neón */}
        <div className={`flex justify-center gap-3 mb-4 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                error
                  ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : pin.length > index
                  ? 'bg-pink-500 border-pink-400 scale-110 shadow-[0_0_12px_rgba(236,72,153,0.8)]'
                  : 'border-pink-500/30 bg-pink-950/30'
              }`}
            />
          ))}
        </div>

        {/* Mensaje de estado / bienvenida */}
        <div className="h-6 mb-2 flex items-center justify-center">
          {error && <p className="text-red-400 text-xs font-semibold tracking-wide animate-shake">Contraseña incorrecta</p>}
          {welcomeUser === 'laura' && (
            <p className="text-pink-300 text-xs font-bold tracking-wide animate-pulse">
              ¡Bienvenida mi reina Laura! 💖
            </p>
          )}
          {welcomeUser === 'sebastian' && (
            <p className="text-purple-300 text-xs font-bold tracking-wide animate-pulse">
              ¡Bienvenido Sebas! ✨
            </p>
          )}
        </div>

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {keypad.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-2xl bg-pink-950/40 hover:bg-pink-900/50 active:scale-95 text-pink-100 font-bold text-xl flex items-center justify-center mx-auto transition-all border border-pink-500/10 hover:border-pink-500/40 shadow-inner"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="w-16 h-16 rounded-2xl bg-pink-950/20 hover:bg-pink-900/40 active:scale-95 text-pink-300/70 hover:text-pink-200 font-medium text-xs flex items-center justify-center mx-auto transition-all border border-pink-500/10"
          >
            Borrar
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-2xl bg-pink-950/40 hover:bg-pink-900/50 active:scale-95 text-pink-100 font-bold text-xl flex items-center justify-center mx-auto transition-all border border-pink-500/10 hover:border-pink-500/40 shadow-inner"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-16 rounded-2xl bg-pink-950/20 hover:bg-pink-900/40 active:scale-95 text-pink-300/70 hover:text-pink-200 font-bold text-lg flex items-center justify-center mx-auto transition-all border border-pink-500/10"
          >
            ⌫
          </button>
        </div>
      </div>
    </main>
  );
}