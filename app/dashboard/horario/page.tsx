'use client';

import React, { useState } from 'react';
import { diasSemana, horasTimeline, materias } from '@/app/data/schedule';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

export default function HorarioPage() {
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('Lunes');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#120309] via-[#2d0a1b] to-[#120309] text-white p-4 md:p-8 overflow-hidden font-sans flex flex-col justify-between">
      <AmbientBackground withTulips />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-row justify-between items-center mb-6 gap-2 border-b border-pink-900/50 pb-4">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-200 to-rose-300 bg-clip-text text-transparent">
            Horario de Clases 🌷
          </h1>
          <div className="flex items-center gap-1.5 bg-[#220716]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/20 shadow-sm text-xs sm:text-sm text-pink-200 font-medium">
            <span>Hola Laurita, este es tu horario</span>
            <span className="text-rose-400">♥</span>
          </div>
        </header>

        {/* --- VISTA MÓVIL (Pestañas por día) --- */}
        <div className="block md:hidden mb-6">
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {diasSemana.map((dia) => {
              const isActive = diaSeleccionado === dia;
              return (
                <button
                  key={dia}
                  onClick={() => setDiaSeleccionado(dia)}
                  className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50'
                      : 'bg-[#220716]/60 text-pink-300/80 hover:bg-[#220716] border border-pink-500/10'
                  }`}
                >
                  {dia.slice(0, 3)}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {materias.filter((m) => m.dia === diaSeleccionado).length === 0 ? (
              <div className="p-6 bg-[#220716]/70 backdrop-blur-md rounded-2xl text-center text-pink-200/70 text-sm font-medium border border-pink-500/20 shadow-lg">
                ¡Día libre! No tienes clases registradas mi reina preciosa ✨
              </div>
            ) : (
              materias
                .filter((m) => m.dia === diaSeleccionado)
                .map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#3b0d23] to-[#240715] text-white shadow-xl border border-pink-500/30 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm leading-tight pr-2 text-pink-100">{m.nombre}</h3>
                      <span className="text-base">{m.icono}</span>
                    </div>
                    <div className="text-xs text-pink-200/80 flex flex-wrap justify-between items-end border-t border-pink-500/20 pt-2 mt-1">
                      <div>
                        <p>Código: {m.codigo}</p>
                        <p>Grupo: {m.grupo}</p>
                      </div>
                      <span className="font-mono bg-pink-900/50 border border-pink-500/30 px-2 py-0.5 rounded text-[11px] font-semibold text-pink-200">
                        {`${m.horaInicio}:00 - ${m.horaInicio + m.duracionHoras}:00`}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* --- VISTA ESCRITORIO (Grid Semanal) --- */}
        <main className="hidden md:block bg-[#1a0511]/70 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-6 shadow-2xl mb-6">
          <div className="grid grid-cols-6 gap-2">
            {/* Columna Horas */}
            <div className="flex flex-col">
              <div className="h-12 flex items-center justify-center text-xs font-bold text-pink-300/60 uppercase tracking-wider">
                Hora
              </div>
              {horasTimeline.map((hora) => (
                <div key={hora} className="h-16 border-t border-pink-900/30 flex items-center justify-center text-xs font-semibold text-pink-200/50">
                  {`${hora}:00`}
                </div>
              ))}
            </div>

            {/* Columnas Días */}
            {diasSemana.map((dia) => (
              <div key={dia} className="flex flex-col relative">
                <div className="h-12 flex flex-col items-center justify-center bg-pink-950/40 rounded-xl border border-pink-500/20 mb-1">
                  <span className="font-bold text-sm text-pink-200">{dia}</span>
                </div>

                {horasTimeline.map((hora) => (
                  <div key={hora} className="h-16 border-t border-pink-900/20 w-full" />
                ))}

                {materias
                  .filter((materia) => materia.dia === dia)
                  .map((materia) => {
                    const topOffset = (materia.horaInicio - 9) * 64 + 52;
                    const height = materia.duracionHoras * 64 - 4;

                    return (
                      <div
                        key={materia.id}
                        style={{ top: `${topOffset}px`, height: `${height}px` }}
                        className="absolute left-0 right-0 mx-1 p-3 rounded-2xl bg-gradient-to-br from-[#3b0d23] to-[#240715] text-white border border-pink-500/30 hover:border-pink-400/60 shadow-lg hover:shadow-pink-900/20 transition-all duration-300 group hover:scale-[1.02] flex flex-col justify-between overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold leading-tight text-pink-100 group-hover:text-pink-300 transition-colors">
                            {materia.nombre}
                          </span>
                          <span className="text-xs">{materia.icono}</span>
                        </div>

                        <div className="text-[10px] text-pink-200/70 space-y-0.5">
                          <p>Código: {materia.codigo}</p>
                          <p>Grupo {materia.grupo}</p>
                          <p className="text-pink-300 font-mono font-medium mt-1">
                            {`${materia.horaInicio}:00 - ${materia.horaInicio + materia.duracionHoras}:00`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </main>
      </div>

      <BackButton />
    </div>
  );
}