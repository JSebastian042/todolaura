'use client';

import Link from 'next/link';

export default function CartaPage() {
  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Luces de fondo suaves para dar ambiente */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Contenedor del Pergamino */}
      <div className="relative max-w-2xl w-full bg-[#fbf5e6] text-amber-950 p-8 sm:p-14 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_15px_rgba(217,119,6,0.15)] border-2 border-[#e6d5b8] my-8 transition-all duration-300">
        
        {/* Adorno superior / Sello visual */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-900 text-amber-100 flex items-center justify-center shadow-md border border-rose-700/50 text-xl font-serif">
            💌
          </div>
        </div>

        {/* Detalle decorativo de esquina superior izquierda */}
        <div className="absolute top-4 left-4 text-amber-800/20 text-3xl font-serif select-none pointer-events-none">
          ❧
        </div>
        {/* Detalle decorativo de esquina superior derecha */}
        <div className="absolute top-4 right-4 text-amber-800/20 text-3xl font-serif select-none pointer-events-none scale-x-[-1]">
          ❧
        </div>

        {/* Encabezado de la Carta */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide text-amber-900 mb-2">
            Una carta para ti
          </h1>
          <div className="w-24 h-0.5 bg-amber-800/30 mx-auto rounded-full" />
        </div>

        {/* Cuerpo del Texto (Formato Pergamino) */}
        <div className="space-y-6 text-base sm:text-lg font-serif leading-relaxed text-amber-950/90 text-justify px-2 sm:px-4">
          <p>
            Querida Laurita
          </p>

          <p>
          Hoy es el segundo despliegue de TodoLaura, he hecho muchas modificaciones y ahora ya puedes guardar recordatorios y palabras nuevas en el diccionario
          </p>

          <p>
          Mi reina, esta página es para poder transmitir todo el amor que siento por ti en un campo que conozco bien como lo es el desarrollo web. Quiero que siempre te sientas amada con estos pequeños detalles
          </p>

          <p>
          Eres mi razón y la persona por la que sonrio todas las mañanas y por la que me siento mal en las noches por dejarla sola. Estoy muy emcionado por lo que pasará después con nosotros, pero me alegra que podamos ser lo suficientemente maduros de saber que es lo que queremos (Que es estar juntos, obviamente muejeje)
          </p>

          <p>
           Posdata: Lo mismo que te dije la vez pasada, si quieres alguna otra cosita me avisas que yo con mucho gusto lo hago Laurita, todo lo que sea por ti mi reina preciosa, mi razón, la persona que quiero así y la mujer con la que quiero estar el resto de mi vida
          </p>

          <p className="pt-4 font-semibold text-right text-amber-900">
            Con todo mi cariño,
            <br />
            <span className="italic font-normal text-amber-800/80">Sebastián</span>
          </p>
        </div>

        {/* Detalle decorativo inferior */}
        <div className="mt-10 pt-6 border-t border-amber-900/10 text-center text-amber-800/40 text-sm font-serif">
          ✦ ✧ ✦
        </div>
      </div>

      {/* Botón para volver al Dashboard */}
      <Link
        href="/dashboard"
        className="px-8 py-3 bg-amber-950/80 hover:bg-amber-900 text-amber-100 font-medium rounded-full text-base border border-amber-700/40 transition shadow-lg backdrop-blur-md hover:scale-105 active:scale-95"
      >
        Volver al panel principal
      </Link>
    </main>
  );
}