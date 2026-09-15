import React from 'react';

interface AmbientBackgroundProps {
  withTulips?: boolean;
}

export default function AmbientBackground({ withTulips = false }: AmbientBackgroundProps) {
  return (
    <>
      {/* Esferas de luz ambiental con efecto Glassmorphism */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Ilustración de Tulipanes decorativos en esquinas inferiores */}
      {withTulips && (
        <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-between items-end px-4">
          <svg className="w-36 h-56 sm:w-56 sm:h-80 text-pink-500 fill-current" viewBox="0 0 100 150" aria-hidden="true">
            <path d="M50 150 Q50 100 30 80 Q10 100 10 130 C10 150 40 150 50 150 Z" opacity="0.4" />
            <path d="M50 150 Q50 90 70 70 Q90 90 90 120 C90 150 60 150 50 150 Z" opacity="0.4" />
            <path d="M50 150 Q50 80 50 40" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M50 40 C30 10 20 40 35 60 C45 70 50 40 50 40 Z" />
            <path d="M50 40 C70 10 80 40 65 60 C55 70 50 40 50 40 Z" />
            <path d="M40 35 C40 10 60 10 60 35 C50 45 40 35 40 35 Z" fill="#f472b6" />
          </svg>

          <svg className="w-48 h-72 sm:w-64 sm:h-96 text-rose-400 fill-current" viewBox="0 0 100 150" aria-hidden="true">
            <path d="M50 150 Q50 70 50 30" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M50 30 C25 0 15 35 30 55 C40 65 50 30 50 30 Z" />
            <path d="M50 30 C75 0 85 35 70 55 C60 65 50 30 50 30 Z" />
            <path d="M38 25 C38 0 62 0 62 25 C50 35 38 25 38 25 Z" fill="#fb7185" />
          </svg>
        </div>
      )}
    </>
  );
}
