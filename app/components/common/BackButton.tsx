import React from 'react';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

export default function BackButton({
  href = '/dashboard',
  text = 'Volver al panel principal',
  className = '',
}: BackButtonProps) {
  return (
    <div className={`relative z-10 w-full max-w-md mx-auto mt-6 mb-2 ${className}`}>
      <Link
        href={href}
        className="w-full py-3 sm:py-3.5 bg-slate-950/50 hover:bg-slate-950/80 text-pink-200/80 hover:text-white font-semibold rounded-2xl text-xs sm:text-sm border border-pink-500/20 hover:border-pink-500/40 transition-all backdrop-blur-md flex items-center justify-center gap-2 shadow-lg active:scale-95"
      >
        <span>&larr;</span>
        <span>{text}</span>
      </Link>
    </div>
  );
}
