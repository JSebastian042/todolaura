'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleKeyPress = useCallback((num: string) => {
    setPin((prevPin) => {
      if (prevPin.length < 4) {
        const newPin = prevPin + num;
        if (newPin.length === 4) {
          if (newPin === '1904') {
            setTimeout(() => router.push('/dashboard'), 300);
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
    <main className="flex min-h-screen items-center justify-center bg-pink-50 p-4 select-none">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-xs sm:max-w-sm w-full text-center flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Bienvenida a TodoLaura ❤️</h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">Ingresa el PIN usando la pantalla o el teclado</p>

        
        <div className={`flex justify-center gap-3 mb-6 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                error
                  ? 'bg-red-500 border-red-500'
                  : pin.length > index
                  ? 'bg-pink-500 border-pink-500 scale-110'
                  : 'border-pink-300 bg-transparent'
              }`}
            />
          ))}
        </div>

       
        <div className="h-6 mb-2">
          {error && <p className="text-red-500 text-xs font-semibold">Contraseña incorrecta</p>}
        </div>

      
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {keypad.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-full bg-pink-100 hover:bg-pink-200 active:bg-pink-300 text-pink-700 font-bold text-xl flex items-center justify-center mx-auto transition-colors shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 font-medium text-xs flex items-center justify-center mx-auto transition-colors"
          >
            Borrar
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-full bg-pink-100 hover:bg-pink-200 active:bg-pink-300 text-pink-700 font-bold text-xl flex items-center justify-center mx-auto transition-colors shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 font-bold text-lg flex items-center justify-center mx-auto transition-colors"
          >
            ⌫
          </button>
        </div>
      </div>
    </main>
  );
}