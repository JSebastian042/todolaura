import React from 'react';

interface AuthorBadgeProps {
  author?: string;
  className?: string;
  prefix?: string;
}

export default function AuthorBadge({
  author = 'Laura',
  className = '',
  prefix = 'Por',
}: AuthorBadgeProps) {
  const isSebas = author?.toLowerCase().includes('seb') || author === 'Sebastián';
  const name = isSebas ? 'Sebas' : 'Laura';
  const emoji = isSebas ? '✨' : '🌷';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        isSebas
          ? 'bg-purple-950/70 border-purple-500/40 text-purple-300'
          : 'bg-pink-950/70 border-pink-500/40 text-pink-300'
      } ${className}`}
    >
      <span>{emoji}</span>
      <span>{prefix} {name}</span>
    </span>
  );
}
