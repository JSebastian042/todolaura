'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Heart, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Termino {
  id?: string;
  palabra: string;
  significado: string;
  categoria?: string;
}

export default function DiccionarioPage() {
  const [terminos, setTerminos] = useState<Termino[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [nuevoSignificado, setNuevoSignificado] = useState('');
  const [cargando, setCargando] = useState(true);

  // 1. Cargar las palabras guardadas desde Supabase al entrar a la página
  const cargarTerminos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al cargar palabras de Supabase:', error.message);
    } else if (data) {
      // Mapear los campos de la BD (word, meaning, category) a tu interfaz (palabra, significado, categoria)
      const terminosMapeados: Termino[] = data.map((item) => ({
        id: item.id,
        palabra: item.word,
        significado: item.meaning,
        categoria: item.category,
      }));
      setTerminos(terminosMapeados);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarTerminos();
  }, []);

  // 2. Filtrar términos con la barra de búsqueda
  const terminosFiltrados = terminos.filter(
    (item) =>
      item.palabra.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.significado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 3. Insertar la nueva palabra directamente en Supabase
  const agregarTermino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPalabra.trim() || !nuevoSignificado.trim()) return;

    const nuevaEntradaBD = {
      word: nuevaPalabra.trim(),
      meaning: nuevoSignificado.trim(),
      category: 'Personalizado',
    };

    const { data, error } = await supabase
      .from('dictionary')
      .insert([nuevaEntradaBD])
      .select();

    if (error) {
      console.error('Error al insertar en Supabase:', error.message);
    } else if (data) {
      const palabraCreada: Termino = {
        id: data[0].id,
        palabra: data[0].word,
        significado: data[0].meaning,
        categoria: data[0].category,
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

      <main className="max-w-4xl w-full z-10 flex flex-col items-center space-y-8 mt-6">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/40 border border-pink-500/30 text-pink-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-pink-950/20">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
          <span>Nuestro vocabulario secreto</span>
        </div>

        {/* Título Principal */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-pink-200 to-pink-400 bg-clip-text text-transparent">
            Diccionario Laura
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md">
            Las palabras que nos pertenecen y las emociones que significan.
          </p>
        </div>

        {/* Barra de Búsqueda y Botón */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar una palabra o significado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-pink-500/20 focus:border-pink-500/50 focus:outline-none text-sm placeholder:text-slate-500 backdrop-blur-md transition-all"
            />
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-medium text-sm transition-all shadow-lg shadow-pink-950/40 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Palabra</span>
          </button>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {cargando ? (
            <div className="col-span-full text-center py-12 text-slate-400 italic">
              Cargando diccionario...
            </div>
          ) : terminosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              No se encontraron palabras con esa búsqueda.
            </div>
          ) : (
            terminosFiltrados.map((item, index) => (
              <div
                key={item.id || index}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-pink-500/10 p-6 backdrop-blur-md hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-pink-950/50 border border-pink-500/20 text-pink-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors">
                        {item.palabra}
                      </h3>
                    </div>
                    {item.categoria && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.significado}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="pt-10 text-xs text-slate-600 flex items-center gap-1">
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
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" />
              Nueva Palabra
            </h2>
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

      <div className="mt-8 z-10">
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-amber-950/80 hover:bg-amber-900 text-amber-100 font-medium rounded-full text-base border border-amber-700/40 transition shadow-lg backdrop-blur-md hover:scale-105 active:scale-95 inline-block"
        >
          Volver al panel principal
        </Link>
      </div>
    </div>
  );
}