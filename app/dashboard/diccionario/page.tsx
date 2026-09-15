'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Heart, Sparkles, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, USERS, UserProfile } from '@/app/types/auth';
import { DictionaryItem } from '@/app/types/content';
import BackButton from '@/app/components/common/BackButton';
import AuthorBadge from '@/app/components/common/AuthorBadge';

export default function DiccionarioPage() {
  const [terminos, setTerminos] = useState<DictionaryItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [nuevoSignificado, setNuevoSignificado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS.laura);

  // 1. Cargar las palabras guardadas desde Supabase al entrar
  const cargarTerminos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al cargar palabras de Supabase:', error.message);
      setErrorMsg('No se pudieron sincronizar las palabras con la base de datos.');
    } else if (data) {
      setErrorMsg(null);
      const terminosMapeados: DictionaryItem[] = data.map((item) => ({
        id: item.id,
        palabra: item.word,
        significado: item.meaning,
        categoria: item.category,
        author: item.author || (item.category === 'REACCIÓN' ? 'Sebastián' : 'Laura'),
      }));
      setTerminos(terminosMapeados);
    }
    setCargando(false);
  };

  useEffect(() => {
    setCurrentUser(getActiveUser());
    cargarTerminos();
  }, []);

  // 2. Filtrar términos
  const terminosFiltrados = terminos.filter(
    (item) =>
      item.palabra.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.significado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 3. Insertar la nueva palabra con fallback seguro
  const agregarTermino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPalabra.trim() || !nuevoSignificado.trim()) return;

    const nuevaEntradaBD: Record<string, any> = {
      word: nuevaPalabra.trim(),
      meaning: nuevoSignificado.trim(),
      category: 'Personalizado',
      author: currentUser.name,
    };

    let { data, error } = await supabase
      .from('dictionary')
      .insert([nuevaEntradaBD])
      .select();

    // Fallback si la columna author aún no se ha agregado en Supabase
    if (error && (error.code === '42703' || error.message?.includes('author'))) {
      delete nuevaEntradaBD.author;
      const retry = await supabase.from('dictionary').insert([nuevaEntradaBD]).select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('Error al insertar en Supabase:', error.message);
      setErrorMsg('No se pudo guardar la palabra en Supabase.');
    } else if (data) {
      setErrorMsg(null);
      const palabraCreada: DictionaryItem = {
        id: data[0].id,
        palabra: data[0].word,
        significado: data[0].meaning,
        categoria: data[0].category,
        author: currentUser.name,
      };

      setTerminos((prev) => [...prev, palabraCreada]);
      setNuevaPalabra('');
      setNuevoSignificado('');
      setModalAbierto(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0714] text-slate-100 p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Resplandor de fondo estilo Todolaura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/20 to-purple-800/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-4xl w-full z-10 flex flex-col items-center space-y-8 mt-4">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/40 border border-pink-500/30 text-pink-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-pink-950/20">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
          <span>Nuestro vocabulario secreto</span>
        </div>

        {/* Título Principal */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-pink-200 to-pink-400 bg-clip-text text-transparent">
            Diccionario Laura
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            Las palabras que nos pertenecen y las emociones que significan.
          </p>
        </div>

        {/* Banner de error */}
        {errorMsg && (
          <div className="w-full max-w-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Barra de Búsqueda y Botón */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar una palabra o significado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-pink-500/20 focus:border-pink-500/50 focus:outline-none text-xs sm:text-sm placeholder:text-slate-500 backdrop-blur-md transition-all"
            />
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-medium text-xs sm:text-sm transition-all shadow-lg shadow-pink-950/40 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Palabra</span>
          </button>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {cargando ? (
            <div className="col-span-full text-center py-12 text-slate-400 italic text-sm">
              Cargando diccionario...
            </div>
          ) : terminosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 text-sm">
              No se encontraron palabras con esa búsqueda.
            </div>
          ) : (
            terminosFiltrados.map((item, index) => (
              <div
                key={item.id || index}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-pink-500/10 p-5 sm:p-6 backdrop-blur-md hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-pink-950/50 border border-pink-500/20 text-pink-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-pink-300 transition-colors">
                        {item.palabra}
                      </h3>
                    </div>
                    {item.categoria && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {item.significado}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-pink-500/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Agregado por:</span>
                  <AuthorBadge author={item.author} prefix="Por" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="pt-6 text-xs text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-500/50" />
          <span>HECHO CON AMOR</span>
          <Sparkles className="w-3 h-3 text-pink-500/50" />
        </footer>
      </main>

      {/* Modal para agregar nueva palabra */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#130b1e] border border-pink-500/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-400" />
                Nueva Palabra
              </h2>
              <p className="text-xs text-pink-200/60 mt-1">
                Añadiendo como: <span className="text-white font-semibold underline">{currentUser.displayName} {currentUser.badgeEmoji}</span>
              </p>
            </div>
            <form onSubmit={agregarTermino} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Palabra o Frase</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cucharita"
                  value={nuevaPalabra}
                  onChange={(e) => setNuevaPalabra(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-pink-500/20 focus:border-pink-500 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Significado Especial</label>
                <textarea
                  required
                  rows={3}
                  placeholder="¿Qué significa entre ustedes dos?"
                  value={nuevoSignificado}
                  onChange={(e) => setNuevoSignificado(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-pink-500/20 focus:border-pink-500 text-sm text-white focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-medium text-sm text-white shadow-lg shadow-pink-950/50 hover:brightness-110 transition-all cursor-pointer"
              >
                Guardar Palabra
              </button>
            </form>
          </div>
        </div>
      )}

      <BackButton />
    </div>
  );
}