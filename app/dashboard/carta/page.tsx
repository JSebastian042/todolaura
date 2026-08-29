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
            He creado esta página, se llama TodoLaura (To-Do porque "ayuda" en algunas cosas y Laura pues porque es para ti jaja) Es el regalo de mes que no te pude dar
          </p>

          <p>
            Mi reina estos detalles los hago con el corazón, eres la mujer que atrapó mi corazón y lo tendrá por siempre, no tengo palabras para describir lo que siento cuando hablo contigo. Quiero que siempre seas tú y nadie más mi amada
          </p>

          <p>
            Cuando nos veamos en persona y sepamos, tan solo con los ojos, que es lo que queremos podremos llegar a hacer cosas grandes, juntos. Cómo te lo he estado repitiendo, tú mi ponquecito ya no estarás nunca más solita, aquí estoy yo para ser tu compañero y poder llegar a ser más que un amigo (todo a su tiempo)
          </p>

          <p>
           Posdata: Esta página la puedo poner 360°, por si depronto te gustaría alguna otra funcionalidad o quisieras cambiar algo la página está en mi completo dominio (o sea tu dominio) y trataré que se pueda ver cada vez que quieras
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