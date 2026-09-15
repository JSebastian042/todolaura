'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, USERS, UserProfile } from '@/app/types/auth';
import { Recuerdo, CategoriaRecuerdo } from '@/app/types/content';
import { categoriasAlbum, recuerdosIniciales } from '@/app/data/memories';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';
import AuthorBadge from '@/app/components/common/AuthorBadge';

export default function AlbumPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS.laura);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos');
  const [recuerdoSeleccionado, setRecuerdoSeleccionado] = useState<Recuerdo | null>(null);
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>(recuerdosIniciales);
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState<boolean>(false);

  // Campos de formulario para nuevo recuerdo
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState<CategoriaRecuerdo>('Momentos');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaNotaAmor, setNuevaNotaAmor] = useState('');
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState('');
  const [nuevosEmojis, setNuevosEmojis] = useState('📸✨');

  useEffect(() => {
    const user = getActiveUser();
    setCurrentUser(user);

    const cargarRecuerdos = async () => {
      try {
        const { data, error } = await supabase
          .from('album')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapeados: Recuerdo[] = data.map((item) => ({
            id: item.id,
            titulo: item.titulo,
            fecha: item.fecha,
            categoria: item.categoria,
            descripcion: item.descripcion,
            notaAmor: item.nota_amor,
            imagenUrl: item.imagen_url,
            emojis: item.emojis || '📸✨',
            author: item.author || 'Sebastián',
          }));
          setRecuerdos([...mapeados, ...recuerdosIniciales]);
        } else {
          const local = localStorage.getItem('todolaura_album_recuerdos');
          if (local) {
            setRecuerdos([...JSON.parse(local), ...recuerdosIniciales]);
          }
        }
      } catch (err) {
        console.error('Error cargando recuerdos:', err);
      }
    };

    cargarRecuerdos();
  }, []);

  // Bloqueo especial para Laura (opción sorpresa)
  if (currentUser.id === 'laura') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#120309] via-[#1f0510] to-[#0a0104] flex flex-col items-center justify-center p-4 sm:p-8 select-none text-center relative overflow-hidden">
        <AmbientBackground />
        <div className="relative max-w-md w-full bg-[#1e0a14]/90 border border-pink-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col items-center">
          <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🔒🌷</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">¡Rinconcito Secreto!</h1>
          <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed mb-6">
            Hola mi reina, esta es la opción secreta que preparé para nosotros. ¡No podrás verla hasta que nos veamos por primera vez! ♥
          </p>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-pink-900/40"
          >
            Volver al panel principal ✨
          </Link>
        </div>
      </main>
    );
  }

  const handleGuardarRecuerdo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevaDescripcion.trim()) return;

    const nuevoRecuerdo: Recuerdo = {
      id: String(Date.now()),
      titulo: nuevoTitulo.trim(),
      fecha: nuevaFecha.trim() || 'Fecha especial',
      categoria: nuevaCategoria,
      descripcion: nuevaDescripcion.trim(),
      notaAmor: nuevaNotaAmor.trim() || undefined,
      imagenUrl: nuevaImagenUrl.trim() || undefined,
      emojis: nuevosEmojis.trim() || '📸✨',
      author: currentUser.displayName,
    };

    try {
      await supabase.from('album').insert([{
        titulo: nuevoRecuerdo.titulo,
        fecha: nuevoRecuerdo.fecha,
        categoria: nuevoRecuerdo.categoria,
        descripcion: nuevoRecuerdo.descripcion,
        nota_amor: nuevoRecuerdo.notaAmor,
        imagen_url: nuevoRecuerdo.imagenUrl,
        emojis: nuevoRecuerdo.emojis,
        author: nuevoRecuerdo.author,
      }]);
    } catch (err) {
      console.warn('Fallback a almacenamiento local:', err);
    }

    const prev = JSON.parse(localStorage.getItem('todolaura_album_recuerdos') || '[]');
    localStorage.setItem('todolaura_album_recuerdos', JSON.stringify([nuevoRecuerdo, ...prev]));

    setRecuerdos((prevList) => [nuevoRecuerdo, ...prevList]);
    setNuevoTitulo('');
    setNuevaFecha('');
    setNuevaDescripcion('');
    setNuevaNotaAmor('');
    setNuevaImagenUrl('');
    setNuevosEmojis('📸✨');
    setModalNuevoAbierto(false);
  };

  const recuerdosFiltrados = categoriaActiva === 'Todos'
    ? recuerdos
    : recuerdos.filter((r) => r.categoria === categoriaActiva);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#120309] via-[#2d0a1b] to-[#120309] text-white p-3 sm:p-6 md:p-8 overflow-hidden font-sans flex flex-col justify-between">
      <AmbientBackground withTulips />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 border-b border-pink-900/50 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200 bg-clip-text text-transparent">
              Álbum de Recuerdos 📸✨
            </h1>
            <p className="text-xs text-pink-300/70 mt-0.5">
              Gestión de fotos y momentos especiales
            </p>
          </div>

          <button
            onClick={() => setModalNuevoAbierto(true)}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-pink-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>Agregar Recuerdo</span>
          </button>
        </header>

        {/* Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {categoriasAlbum.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`py-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap cursor-pointer ${
                categoriaActiva === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50'
                  : 'bg-[#220716]/60 text-pink-300/80 hover:bg-[#220716] border border-pink-500/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Polaroid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          {recuerdosFiltrados.map((recuerdo) => (
            <div
              key={recuerdo.id}
              onClick={() => setRecuerdoSeleccionado(recuerdo)}
              className="group cursor-pointer bg-[#1c0612]/80 backdrop-blur-md border border-pink-500/20 hover:border-pink-400/60 rounded-3xl p-4 shadow-xl hover:shadow-pink-900/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#2e0b1f] to-[#1a0410] rounded-2xl border border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
                {recuerdo.imagenUrl ? (
                  <img
                    src={recuerdo.imagenUrl}
                    alt={recuerdo.titulo}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl mb-2 block">{recuerdo.emojis}</span>
                    <span className="text-[11px] text-pink-300/60 font-mono">[Momento Especial]</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 bg-[#120309]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-pink-300 border border-pink-500/20">
                  {recuerdo.fecha}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm sm:text-base text-pink-100 group-hover:text-pink-300 transition-colors line-clamp-1">
                    {recuerdo.titulo}
                  </h3>
                  <span className="text-[10px] bg-pink-900/40 border border-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full shrink-0 ml-1">
                    {recuerdo.categoria}
                  </span>
                </div>
                <p className="text-xs text-pink-200/70 line-clamp-2 mt-1.5 leading-relaxed">
                  {recuerdo.descripcion}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-pink-500/15 flex items-center justify-between text-[11px]">
                <AuthorBadge author={recuerdo.author} prefix="Recuerdo de" />
                {recuerdo.notaAmor && (
                  <span className="truncate text-rose-300/80 italic max-w-[140px]">
                    "{recuerdo.notaAmor}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Modal detalle recuerdo */}
      {recuerdoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#2a0818] to-[#120309] border border-pink-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-white">
            <button
              onClick={() => setRecuerdoSeleccionado(null)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white bg-pink-950/60 p-2 rounded-full border border-pink-500/20 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <span className="text-5xl block mb-2">{recuerdoSeleccionado.emojis}</span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-mono text-pink-400 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-500/30">
                  {recuerdoSeleccionado.fecha}
                </span>
                <AuthorBadge author={recuerdoSeleccionado.author} prefix="Por" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 text-pink-100">
                {recuerdoSeleccionado.titulo}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed mb-6 bg-[#1a0511]/80 p-4 rounded-2xl border border-pink-500/20">
              {recuerdoSeleccionado.descripcion}
            </p>

            {recuerdoSeleccionado.notaAmor && (
              <div className="p-3 bg-pink-950/40 border border-pink-500/30 rounded-2xl text-center text-xs text-rose-300 font-medium italic">
                "{recuerdoSeleccionado.notaAmor}"
              </div>
            )}

            <button
              onClick={() => setRecuerdoSeleccionado(null)}
              className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-pink-900/50 cursor-pointer"
            >
              Cerrar recuerdo ✨
            </button>
          </div>
        </div>
      )}

      {/* Modal nuevo recuerdo */}
      {modalNuevoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gradient-to-br from-[#220716] to-[#120309] border border-pink-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative text-white my-8">
            <button
              onClick={() => setModalNuevoAbierto(false)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white bg-pink-950/60 p-2 rounded-full border border-pink-500/20 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Nuevo Recuerdo ✨</h2>
            <p className="text-xs text-pink-200/60 mb-4">
              Agregando como: <span className="text-white font-semibold underline">{currentUser.displayName}</span>
            </p>

            <form onSubmit={handleGuardarRecuerdo} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">Título del recuerdo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nuestra tarde de café"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Fecha</label>
                  <input
                    type="text"
                    placeholder="Ej: 14 de Febrero, 2024"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Categoría</label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value as CategoriaRecuerdo)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                  >
                    <option value="Momentos">Momentos</option>
                    <option value="Citas">Citas</option>
                    <option value="Viajes">Viajes</option>
                    <option value="Especiales">Especiales</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Emojis</label>
                  <input
                    type="text"
                    placeholder="Ej: ☕🌹"
                    value={nuevosEmojis}
                    onChange={(e) => setNuevosEmojis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">URL de Imagen (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={nuevaImagenUrl}
                    onChange={(e) => setNuevaImagenUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">Historia o Descripción</label>
                <textarea
                  required
                  rows={3}
                  placeholder="¿Qué ocurrió en este momento tan bonito?"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">Nota de Amor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Tu sonrisa iluminó todo..."
                  value={nuevaNotaAmor}
                  onChange={(e) => setNuevaNotaAmor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-pink-500/20 focus:border-pink-500 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-pink-950/50 cursor-pointer"
              >
                Guardar Recuerdo en el Álbum ✨
              </button>
            </form>
          </div>
        </div>
      )}

      <BackButton />
    </div>
  );
}