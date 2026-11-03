'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';

const REGLAS_RELACION = [
  {
    numero: 1,
    texto: 'No nos podemos ir a dormir disgustados (tristes, enojados, raros). Se tiene que conversar.',
    detalle: 'El amor y la paz antes que el orgullo, siempre.',
  },
  {
    numero: 2,
    texto: 'No importa lo mínimo que parezca, hay que decirlo todo.',
    detalle: 'La transparencia total construye nuestra confianza.',
  },
  {
    numero: 3,
    texto: 'No sacar en cara lo que ya se habló.',
    detalle: 'Lo perdonado y sanado queda en el pasado.',
  },
  {
    numero: 4,
    texto: 'No minimizar lo de cada uno.',
    detalle: 'Lo que siente el otro siempre es importante y válido.',
  },
  {
    numero: 5,
    texto: 'No suponer nada.',
    detalle: 'Preguntar y comunicarse con cariño antes de imaginar.',
  },
  {
    numero: 6,
    texto: 'Si hay algún inconveniente, hablar lo más rápido posible.',
    detalle: 'No dejar que el silencio cree distancia.',
  },
  {
    numero: 7,
    texto: 'No tener vínculos con el pasado.',
    detalle: 'Nuestro presente y futuro nos pertenecen solo a nosotros.',
  },
  {
    numero: 8,
    texto: 'No dialogar los problemas con terceros.',
    detalle: 'Nuestros asuntos de pareja se cuidan y resuelven entre nosotros.',
  },
  {
    numero: 9,
    texto: 'No ocultar cosas, cualquier situación es mejor comentarla.',
    detalle: 'La sinceridad nos protege de cualquier tormenta.',
  },
  {
    numero: 10,
    texto: 'No justificar al otro si hizo algo incorrecto.',
    detalle: 'El verdadero amor cuida y enseña con respeto y madurez.',
  },
];

export default function ReglasPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#120509] via-[#1d0912] to-[#0e0307] text-amber-50 p-4 sm:p-8 relative overflow-x-hidden select-none py-8 sm:py-12 flex flex-col justify-between items-center">
      <AmbientBackground withTulips />

      {/* Luces cálidas ambientales */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center">
        {/* Enlace flotante de regreso */}
        <div className="w-full flex items-center justify-between mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-amber-200 text-xs border border-amber-900/40 backdrop-blur-md transition-all cursor-pointer hover:border-amber-500/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al panel</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-serif backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Pacto Inmutable</span>
          </div>
        </div>

        {/* CONTENEDOR ESTILO PERGAMINO VINTAGE */}
        <div className="relative w-full bg-[#fbf5e6] text-amber-950 p-6 sm:p-12 md:p-14 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_20px_rgba(217,119,6,0.15)] border-2 border-[#e6d5b8] my-4 transition-all">
          
          {/* Adornos esquineros vintage */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-amber-900/25 text-2xl sm:text-3xl font-serif select-none pointer-events-none">
            ❧
          </div>
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 text-amber-900/25 text-2xl sm:text-3xl font-serif select-none pointer-events-none scale-x-[-1]">
            ❧
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-amber-900/25 text-2xl sm:text-3xl font-serif select-none pointer-events-none scale-y-[-1]">
            ❧
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 text-amber-900/25 text-2xl sm:text-3xl font-serif select-none pointer-events-none scale-[-1]">
            ❧
          </div>

          {/* Sello de Cera Superior */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-800 via-red-900 to-[#4d0716] text-amber-100 flex items-center justify-center shadow-xl border-2 border-amber-400/50 text-2xl font-serif">
              📜
            </div>
          </div>

          {/* Encabezado del Manifiesto */}
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <span className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em] text-amber-900/60 font-semibold block">
              Pacto de Amor, Madurez y Confianza
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-wide text-amber-950">
              Nuestras Reglas de Oro
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-amber-900/75 max-w-md mx-auto pt-1">
              Los diez acuerdos sagrados que cuidarán siempre nuestro vínculo, nuestra paz y nuestra historia juntos.
            </p>
            <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent mx-auto rounded-full mt-4" />
          </div>

          {/* LISTA DE LAS 10 REGLAS */}
          <div className="space-y-4 sm:space-y-5">
            {REGLAS_RELACION.map((regla) => (
              <div
                key={regla.numero}
                className="group relative flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-amber-900/[0.04] border border-amber-900/10 hover:bg-amber-900/[0.08] hover:border-amber-800/30 transition-all duration-300"
              >
                {/* Insignia con el número */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-900 via-red-900 to-amber-950 text-amber-100 font-serif font-bold text-xs sm:text-sm flex items-center justify-center shadow-md border border-amber-400/40 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  {regla.numero}
                </div>

                {/* Texto de la regla y detalle */}
                <div className="space-y-1 flex-1">
                  <p className="text-sm sm:text-base font-serif font-semibold text-amber-950 leading-snug">
                    {regla.texto}
                  </p>
                  <p className="text-[11px] sm:text-xs font-serif italic text-amber-900/60 leading-normal">
                    {regla.detalle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SECCIÓN DE FIRMAS AL PIE */}
          <div className="mt-10 sm:mt-12 pt-8 border-t-2 border-amber-900/15">
            <div className="text-center mb-6">
              <span className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] text-amber-900/60 font-semibold block">
                Acordado y sellado desde el corazón
              </span>
              <div className="mt-2 text-amber-800/40 text-xs font-serif select-none">
                ✦ ✧ ✦
              </div>
            </div>

            {/* Tarjetas de Firma Solemne */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              {/* Firma de Laura */}
              <div className="text-center p-4 rounded-2xl bg-amber-950/[0.03] border border-amber-900/10 space-y-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-700 to-rose-900 text-amber-100 flex items-center justify-center mx-auto text-base shadow-sm border border-amber-400/40">
                  🌷
                </div>
                <div>
                  <p className="font-serif font-bold text-base sm:text-lg text-amber-950">
                    Laura
                  </p>
                  <p className="text-[11px] font-serif italic text-amber-900/65">
                    Firmado con amor verdadero
                  </p>
                </div>
                <div className="w-16 h-px bg-amber-900/20 mx-auto pt-1" />
              </div>

              {/* Firma de Sebastián */}
              <div className="text-center p-4 rounded-2xl bg-amber-950/[0.03] border border-amber-900/10 space-y-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-800 to-rose-950 text-amber-100 flex items-center justify-center mx-auto text-base shadow-sm border border-amber-400/40">
                  ✨
                </div>
                <div>
                  <p className="font-serif font-bold text-base sm:text-lg text-amber-950">
                    Sebastián
                  </p>
                  <p className="text-[11px] font-serif italic text-amber-900/65">
                    Firmado con devoción infinita
                  </p>
                </div>
                <div className="w-16 h-px bg-amber-900/20 mx-auto pt-1" />
              </div>
            </div>

            <p className="text-center text-[11px] font-serif text-amber-900/50 mt-8 italic">
              «Que el respeto, la verdad y el cariño mutuo sean siempre nuestra brújula»
            </p>
          </div>
        </div>
      </div>

      <BackButton />
    </main>
  );
}
