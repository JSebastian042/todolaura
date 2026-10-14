'use client';

import Link from 'next/link';

export default function CartaPage() {
  return (
    <main className="min-h-screen w-full bg-neutral-900 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 relative overflow-x-hidden select-none py-8 sm:py-10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 sm:w-80 h-48 sm:h-80 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-2xl w-full bg-[#fbf5e6] text-amber-950 p-6 sm:p-14 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_15px_rgba(217,119,6,0.15)] border-2 border-[#e6d5b8] my-4 sm:my-6 transition-all">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-900 text-amber-100 flex items-center justify-center shadow-md border border-rose-700/50 text-lg sm:text-xl font-serif">
            💌
          </div>
        </div>

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-amber-800/20 text-2xl sm:text-3xl font-serif select-none pointer-events-none">
          ❧
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-amber-800/20 text-2xl sm:text-3xl font-serif select-none pointer-events-none scale-x-[-1]">
          ❧
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-wide text-amber-900 mb-2">
            Una carta para ti
          </h1>
          <div className="w-16 sm:w-24 h-0.5 bg-amber-800/30 mx-auto rounded-full" />
        </div>

        <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg font-serif leading-relaxed text-amber-950/90 text-left sm:text-justify px-1 sm:px-4">
          <p className="font-semibold text-base sm:text-xl">
            Querida Laurita,
          </p>

          <p>
            Hoy es el sexto despliegue de TodoLaura, si... ya van 6 actualizaciones de la pagina que te hice a ti; Ya está el album de recuerdos habilitado para colocar todo lo que hicimos este fin de semana.
          </p>

          <p>
            Estoy con el corazón muy agradecido por haber tomado la decisión de ir a Cali, fue el mejor fin de semana de toda mi vida y es algo que nunca olvidaré, fue algo tan fuerte que nunca había llorado por alguien tantas veces. Fue algo mágico desde que me embarqué a esa gran aventura
          </p>

          <p>
            Ayer estaba nublado por la tristeza de dejar la ciudad donde está mi mujer, siento que se me quedó algo y es mi corazón, mi corazón se quedó contigo... Guardalo muy bien que en diciembre me lo tendrás que devolver por esa semanita o por el tiempo que estemos juntos.
          </p>

          <p>
            Posdata: Lo mismo, si quieres alguna otra cosita me avisas que yo con mucho gusto lo hago Laurita, todo lo que sea por ti mi reina preciosa, mi razón, la persona que quiero así, la mujer con la que quiero estar el resto de mi vida, la mujer que amo, que me desespera cada vez que no está, la mujer de mis ojos, mi todo y por sobre todas las cosas El amor de mi vida y la mujer con la que quiero estar el resto de mi vida
          </p>

          <p>
            Posdata2: Gracias por dejarme ser tu primer beso.
          </p>

          <p className="pt-4 font-semibold text-right text-amber-900">
            Con todo mi cariño,
            <br />
            <span className="italic font-normal text-amber-800/80">Sebastián</span>
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-amber-900/10 text-center text-amber-800/40 text-xs sm:text-sm font-serif">
          ✦ ✧ ✦
        </div>
      </div>

      <div className="mt-2 mb-6 z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 sm:px-8 sm:py-3 bg-amber-950/80 hover:bg-amber-900 text-amber-100 font-medium rounded-full text-xs sm:text-sm border border-amber-700/40 transition shadow-lg backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>&larr;</span>
          <span>Volver al panel principal</span>
        </Link>
      </div>
    </main>
  );
}