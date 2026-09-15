'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getActiveUser, UserProfile } from '@/app/types/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unlocked = sessionStorage.getItem('todolaura_unlocked');
    if (unlocked === 'true') {
      setIsAuthorized(true);
      setCurrentUser(getActiveUser());
    } else {
      router.replace('/');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('todolaura_unlocked');
    sessionStorage.removeItem('todolaura_user');
    router.replace('/');
  };

  if (isAuthorized === null || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#120309] via-[#1f0510] to-[#0a0104] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-bounce">💖</div>
          <p className="text-xs text-pink-300/60 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si Laura intenta entrar a /dashboard/album por URL directa, se bloquea con mensaje romántico
  if (pathname === '/dashboard/album' && currentUser.id === 'laura') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#120309] via-[#1f0510] to-[#0a0104] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none">
        <div className="max-w-md w-full bg-[#1e0a14]/90 border border-pink-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-5xl mb-4 animate-bounce">🔒🌷</div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Rinconcito Secreto!</h2>
          <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed mb-6">
            Hola mi reina, esta es la opción secreta que preparé para nosotros. ¡No podrás verla hasta que nos veamos por primera vez! ♥
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-pink-900/40"
          >
            Volver al panel principal ✨
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Barra de sesión superior elegante y responsiva */}
      <header className="w-full bg-[#120309]/90 backdrop-blur-md border-b border-pink-500/15 py-2 px-3 sm:px-6 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base">{currentUser.badgeEmoji}</span>
          <span className="text-[11px] sm:text-xs text-pink-200/80 font-medium">
            Sesión activa:{' '}
            <span className="font-bold text-white underline decoration-pink-500/50">
              {currentUser.displayName}
            </span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-[11px] sm:text-xs text-pink-300/80 hover:text-white bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/20 px-2.5 py-1 rounded-full transition flex items-center gap-1 cursor-pointer active:scale-95"
          title="Cerrar sesión"
        >
          <span>🔒</span>
          <span>Salir</span>
        </button>
      </header>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
