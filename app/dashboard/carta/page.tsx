'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Sparkles,
  Plus,
  X,
  Mail,
  Send,
  Calendar,
  Trash2,
  Feather,
  BookOpen,
  Check,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, UserProfile } from '@/app/types/auth';
import { LoveLetter } from '@/app/types/content';
import { INITIAL_LETTERS } from '@/app/data/letters';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';
import AuthorBadge from '@/app/components/common/AuthorBadge';

export default function CartaPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getActiveUser());
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'to-laura' | 'to-sebas'>('all');

  // Formulario de nueva carta
  const [newTitle, setNewTitle] = useState('');
  const [newRecipient, setNewRecipient] = useState<'Laura' | 'Sebastián'>(() => {
    const user = getActiveUser();
    return user.displayName.toLowerCase().includes('seb') ? 'Laura' : 'Sebastián';
  });
  const [newDate, setNewDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  });
  const [newContent, setNewContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const active = getActiveUser();
    setCurrentUser(active);
    setNewRecipient(active.displayName.toLowerCase().includes('seb') ? 'Laura' : 'Sebastián');
    cargarCartas();
  }, []);

  // 1. Cargar cartas desde Supabase con respaldo en localStorage e iniciales
  const cargarCartas = async () => {
    setLoading(true);
    let cartasCargadas: LoveLetter[] = [];

    try {
      const { data, error } = await supabase
        .from('love_letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        cartasCargadas = data.map((item) => ({
          id: item.id,
          sender: item.sender,
          recipient: item.recipient,
          title: item.title,
          date: item.date,
          content: item.content,
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Error conectando con Supabase love_letters:', err);
    }

    // Merge con localStorage
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('todolaura_love_letters');
        if (local) {
          const parsed: LoveLetter[] = JSON.parse(local);
          const idsExistentes = new Set(cartasCargadas.map((c) => c.id));
          parsed.forEach((p) => {
            if (!idsExistentes.has(p.id)) {
              cartasCargadas.push(p);
              idsExistentes.add(p.id);
            }
          });
        }
      } catch (e) {}
    }

    // Merge con cartas base iniciales (como la del 6to y 7mo despliegue)
    const idsExistentes = new Set(cartasCargadas.map((c) => c.id));
    INITIAL_LETTERS.forEach((base) => {
      if (!idsExistentes.has(base.id)) {
        cartasCargadas.push(base);
        idsExistentes.add(base.id);
      }
    });

    // Normalizar cartas y garantizar que el séptimo despliegue sea de Sebastián para Laura
    cartasCargadas = cartasCargadas.map((c) => {
      if (
        c.id === 'carta_1792963768976' ||
        c.id === 'carta-septimo-despliegue' ||
        c.title.toLowerCase().includes('septimo despliegue') ||
        c.title.toLowerCase().includes('séptimo despliegue')
      ) {
        return {
          ...c,
          sender: 'Sebastián',
          recipient: 'Laura',
        };
      }
      return c;
    });

    // Evitar duplicados por título
    const seenTitles = new Set<string>();
    const uniqueCartas: LoveLetter[] = [];
    for (const c of cartasCargadas) {
      const normalizedTitle = c.title.toLowerCase().trim();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueCartas.push(c);
      }
    }

    // Actualizar localStorage si tenía recipient erróneo
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('todolaura_love_letters');
        if (local) {
          const parsed: LoveLetter[] = JSON.parse(local);
          const updated = parsed.map((c) => {
            if (
              c.id === 'carta_1792963768976' ||
              c.id === 'carta-septimo-despliegue' ||
              c.title.toLowerCase().includes('septimo despliegue') ||
              c.title.toLowerCase().includes('séptimo despliegue')
            ) {
              return { ...c, sender: 'Sebastián', recipient: 'Laura' };
            }
            return c;
          });
          localStorage.setItem('todolaura_love_letters', JSON.stringify(updated));
        }
      } catch (e) {}
    }

    setLetters(uniqueCartas);
    setLoading(false);
  };

  // 2. Guardar nueva carta
  const handleGuardarCarta = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSaving(true);
    const active = getActiveUser();
    const tempId = `carta_${Date.now()}`;

    const nuevaCarta: LoveLetter = {
      id: tempId,
      sender: active.displayName,
      recipient: newRecipient,
      title: newTitle.trim(),
      date: newDate.trim() || 'Fecha especial',
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
    };

    // Actualizar UI inmediatamente
    setLetters((prev) => [nuevaCarta, ...prev]);

    // Guardar en localStorage de respaldo
    if (typeof window !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('todolaura_love_letters') || '[]');
        localStorage.setItem('todolaura_love_letters', JSON.stringify([nuevaCarta, ...local]));
      } catch (e) {}
    }

    // Guardar en Supabase
    try {
      const { data, error } = await supabase
        .from('love_letters')
        .insert([
          {
            sender: nuevaCarta.sender,
            recipient: nuevaCarta.recipient,
            title: nuevaCarta.title,
            date: nuevaCarta.date,
            content: nuevaCarta.content,
          },
        ])
        .select();

      if (!error && data && data[0]) {
        const realId = data[0].id;
        setLetters((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: realId } : c))
        );
      }
    } catch (err) {
      console.warn('Aviso guardando carta en Supabase:', err);
    }

    // Limpiar formulario y abrir de inmediato la carta guardada
    setNewTitle('');
    setNewContent('');
    setIsSaving(false);
    setIsComposerOpen(false);
    setSelectedLetter(nuevaCarta);
  };

  // 3. Eliminar carta
  const handleDeleteLetter = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('¿Seguro que deseas eliminar esta carta de nuestro buzón?')) return;

    setLetters((prev) => prev.filter((c) => c.id !== id));
    if (selectedLetter && selectedLetter.id === id) {
      setSelectedLetter(null);
    }

    // Actualizar localStorage
    if (typeof window !== 'undefined') {
      try {
        const local: LoveLetter[] = JSON.parse(localStorage.getItem('todolaura_love_letters') || '[]');
        localStorage.setItem('todolaura_love_letters', JSON.stringify(local.filter((c) => c.id !== id)));
      } catch (e) {}
    }

    try {
      await supabase.from('love_letters').delete().eq('id', id);
    } catch (err) {
      console.warn('Error eliminando carta de Supabase:', err);
    }
  };

  // 4. Filtrado de cartas
  const filteredLetters = useMemo(() => {
    if (filter === 'to-laura') {
      return letters.filter((l) => l.recipient.toLowerCase().includes('laura'));
    }
    if (filter === 'to-sebas') {
      return letters.filter((l) => l.recipient.toLowerCase().includes('seb'));
    }
    return letters;
  }, [letters, filter]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#120509] via-[#1d0912] to-[#0e0307] text-amber-50 p-4 sm:p-8 relative overflow-x-hidden select-none py-8 sm:py-10 flex flex-col justify-between">
      <AmbientBackground withTulips />

      {/* Luces cálidas ambientales */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 sm:w-96 h-48 sm:h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Cabecera Principal */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-rose-900/30 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-2 backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Buzón Romántico de TodoLaura</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 bg-clip-text text-transparent">
              Cartas de Amor 💌
            </h1>
            <p className="text-xs sm:text-sm text-rose-200/70 mt-1 font-serif italic">
              Palabras que viajan desde el corazón y quedan guardadas para siempre.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <AuthorBadge author={currentUser.displayName} prefix="Soy" />
            <button
              onClick={() => setIsComposerOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-700 via-red-800 to-rose-900 hover:from-rose-600 hover:to-red-700 text-amber-100 font-serif font-semibold rounded-2xl text-xs sm:text-sm shadow-xl shadow-rose-950/60 border border-amber-400/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 hover:border-amber-300/60"
            >
              <Feather className="w-4 h-4 text-amber-300" />
              <span>Escribir Carta ✍️</span>
            </button>
          </div>
        </header>

        {/* Filtros de Cartas */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-serif font-medium transition cursor-pointer border ${
              filter === 'all'
                ? 'bg-rose-900/80 text-amber-200 border-amber-500/50 shadow-md scale-105'
                : 'bg-black/30 text-rose-200/60 border-rose-900/40 hover:text-rose-100'
            }`}
          >
            Todas las Cartas ({letters.length})
          </button>
          <button
            onClick={() => setFilter('to-laura')}
            className={`px-4 py-1.5 rounded-full text-xs font-serif font-medium transition cursor-pointer border ${
              filter === 'to-laura'
                ? 'bg-rose-900/80 text-amber-200 border-amber-500/50 shadow-md scale-105'
                : 'bg-black/30 text-rose-200/60 border-rose-900/40 hover:text-rose-100'
            }`}
          >
            Para Laura 🌷
          </button>
          <button
            onClick={() => setFilter('to-sebas')}
            className={`px-4 py-1.5 rounded-full text-xs font-serif font-medium transition cursor-pointer border ${
              filter === 'to-sebas'
                ? 'bg-rose-900/80 text-amber-200 border-amber-500/50 shadow-md scale-105'
                : 'bg-black/30 text-rose-200/60 border-rose-900/40 hover:text-rose-100'
            }`}
          >
            Para Sebas ✨
          </button>
        </div>

        {/* PARRILLA DE SOBRES CON SELLO DE CERA */}
        {loading ? (
          <div className="py-24 text-center text-amber-200/70 font-serif text-sm animate-pulse">
            Abriendo nuestro escritorio de cartas de amor... 💌✨
          </div>
        ) : filteredLetters.length === 0 ? (
          <div className="py-20 text-center bg-black/40 border border-rose-900/30 rounded-3xl p-8 backdrop-blur-md max-w-lg mx-auto">
            <span className="text-5xl block mb-3 animate-bounce">✉️🌷</span>
            <h3 className="text-lg font-serif font-bold text-amber-200 mb-1">
              No hay cartas en esta sección
            </h3>
            <p className="text-xs text-rose-200/70 mb-4 font-serif">
              Sorprende a tu persona favorita escribiéndole una carta hoy mismo.
            </p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-amber-100 font-serif rounded-xl text-xs font-semibold cursor-pointer transition shadow-md border border-amber-400/30"
            >
              Escribir primera carta ✨
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {filteredLetters.map((letter) => {
              const isFromSebas = (letter.sender || '').toLowerCase().includes('seb');
              const waxStampEmoji = isFromSebas ? '✨' : '🌷';
              const recipientName = letter.recipient || (isFromSebas ? 'Laura' : 'Sebastián');

              return (
                <div
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className="group relative cursor-pointer"
                >
                  {/* Sobre Estilo Vintage con Sombra 3D */}
                  <div className="relative bg-gradient-to-br from-[#ebdcc3] via-[#dfccb0] to-[#cca780] text-amber-950 rounded-2xl p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.2)] border-2 border-[#b89f7d] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_22px_45px_rgba(0,0,0,0.6),0_0_20px_rgba(217,119,6,0.2)] overflow-hidden">
                    {/* Solapa decorativa superior */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[60px] sm:border-l-[80px] border-l-transparent border-r-[60px] sm:border-r-[80px] border-r-transparent border-t-[40px] sm:border-t-[50px] border-t-[#d8be9c] drop-shadow-sm pointer-events-none" />

                    {/* Adornos esquineros */}
                    <div className="absolute top-2 left-2 text-amber-900/25 text-xl font-serif pointer-events-none select-none">
                      ❧
                    </div>
                    <div className="absolute top-2 right-2 text-amber-900/25 text-xl font-serif pointer-events-none select-none scale-x-[-1]">
                      ❧
                    </div>

                    {/* Sello de Cera Central / Superior */}
                    <div className="flex justify-center mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-800 via-red-900 to-[#4d0716] text-amber-200 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <span className="text-xl select-none">{waxStampEmoji}</span>
                      </div>
                    </div>

                    {/* Destinatario y Título */}
                    <div className="text-center space-y-2 relative z-10">
                      <p className="text-[11px] font-serif uppercase tracking-widest text-amber-900/60 font-semibold">
                        Para mi {recipientName}
                      </p>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-amber-950 leading-snug line-clamp-2 min-h-[2.8rem] flex items-center justify-center">
                        {letter.title}
                      </h3>

                      <div className="w-12 h-0.5 bg-amber-900/20 mx-auto rounded-full" />

                      <p className="text-xs text-amber-900/70 font-serif italic pt-1">
                        {letter.date}
                      </p>
                    </div>

                    {/* Footer del Sobre */}
                    <div className="mt-5 pt-3 border-t border-amber-900/15 flex items-center justify-between text-xs font-serif text-amber-900/70 relative z-10">
                      <span className="text-[11px]">
                        De: <strong className="text-amber-950">{letter.sender}</strong>
                      </span>
                      <span className="text-[11px] font-semibold text-rose-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Abrir carta 💌 &rarr;
                      </span>
                    </div>

                    {/* Botón discreto para borrar si no es una carta de despliegue oficial */}
                    {letter.id !== 'carta-sexto-despliegue' &&
                      letter.id !== 'carta-septimo-despliegue' &&
                      !letter.title.toLowerCase().includes('despliegue') && (
                      <button
                        onClick={(e) => handleDeleteLetter(letter.id, e)}
                        className="absolute bottom-2 right-2 p-1.5 text-amber-900/30 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Eliminar carta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VISOR DE CARTA EN PAPEL PERGAMINO ANIMADO */}
      {selectedLetter && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#fbf5e6] text-amber-950 p-6 sm:p-12 md:p-14 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_20px_rgba(217,119,6,0.15)] border-2 border-[#e6d5b8] my-auto transition-all max-h-[92vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 transition cursor-pointer"
              title="Guardar carta en el sobre"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sello de Cera Superior */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-800 via-red-900 to-[#4d0716] text-amber-100 flex items-center justify-center shadow-lg border border-amber-400/50 text-xl font-serif">
                {(selectedLetter.sender || '').toLowerCase().includes('seb') ? '✨' : '🌷'}
              </div>
            </div>

            {/* Adornos esquineros */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-amber-800/20 text-2xl sm:text-3xl font-serif select-none pointer-events-none">
              ❧
            </div>
            <div className="absolute top-3 right-12 sm:top-5 sm:right-14 text-amber-800/20 text-2xl sm:text-3xl font-serif select-none pointer-events-none scale-x-[-1]">
              ❧
            </div>

            {/* Encabezado de la Carta */}
            <div className="text-center mb-6 sm:mb-8">
              <span className="text-[11px] sm:text-xs font-serif uppercase tracking-widest text-amber-800/60 font-semibold block mb-1">
                {selectedLetter.date}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-amber-950 mb-2">
                {selectedLetter.title}
              </h2>
              <p className="text-xs text-amber-800/70 font-serif italic">
                De <span className="font-semibold text-amber-950">{selectedLetter.sender}</span> para <span className="font-semibold text-amber-950">{selectedLetter.recipient}</span>
              </p>
              <div className="w-20 sm:w-28 h-0.5 bg-amber-800/30 mx-auto rounded-full mt-3" />
            </div>

            {/* Contenido de la Carta */}
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-[17px] font-serif leading-relaxed text-amber-950/90 text-left sm:text-justify px-1 sm:px-3 whitespace-pre-wrap">
              {selectedLetter.content}
            </div>

            {/* Firma al pie de la carta */}
            <div className="pt-6 sm:pt-8 mt-6 border-t border-amber-900/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-serif">
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-5 py-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a la colección de cartas</span>
              </button>

              <div className="text-right">
                <span className="text-amber-900/70 italic">Con todo mi amor,</span>
                <p className="font-bold text-base text-amber-950">{selectedLetter.sender}</p>
              </div>
            </div>

            <div className="mt-6 text-center text-amber-800/40 text-xs font-serif">
              ✦ ✧ ✦
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMPOSITOR DE NUEVA CARTA */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-gradient-to-br from-[#240813] via-[#1a050d] to-[#120208] border border-rose-500/30 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl relative text-amber-50 my-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            {/* Cerrar */}
            <button
              onClick={() => setIsComposerOpen(false)}
              className="absolute top-4 right-4 text-rose-300 hover:text-white bg-rose-950/60 p-2 rounded-full border border-rose-500/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera del Compositor */}
            <div className="mb-5 border-b border-rose-900/30 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-xs font-serif mb-2">
                <Feather className="w-3.5 h-3.5" />
                <span>Nueva Carta de Amor</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-amber-100">
                Escribir una Carta
              </h2>
              <p className="text-xs text-rose-200/70 mt-0.5 font-serif">
                Remitente: <span className="font-bold text-white underline">{currentUser.displayName} {currentUser.badgeEmoji}</span>
              </p>
            </div>

            <form onSubmit={handleGuardarCarta} className="space-y-4 text-xs sm:text-sm font-serif">
              {/* Destinatario y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    ¿Para quién es la carta?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRecipient('Laura')}
                      className={`py-2 px-3 rounded-xl border text-xs font-serif transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        newRecipient === 'Laura'
                          ? 'bg-rose-800 text-white border-rose-400 shadow-md font-bold'
                          : 'bg-black/40 text-rose-300/60 border-rose-900/30'
                      }`}
                    >
                      <span>🌷 Laura</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRecipient('Sebastián')}
                      className={`py-2 px-3 rounded-xl border text-xs font-serif transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        newRecipient === 'Sebastián'
                          ? 'bg-rose-800 text-white border-rose-400 shadow-md font-bold'
                          : 'bg-black/40 text-rose-300/60 border-rose-900/30'
                      }`}
                    >
                      <span>✨ Sebas</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    Fecha u Ocasión
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 25 de Octubre, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/20 focus:border-rose-400 text-white text-xs focus:outline-none font-serif"
                  />
                </div>
              </div>

              {/* Título de la Carta */}
              <div>
                <label className="block text-xs font-medium text-rose-200/80 mb-1">
                  Título de la carta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pensándote en esta noche estrellada..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-rose-500/20 focus:border-rose-400 text-white text-xs sm:text-sm focus:outline-none font-serif"
                />
              </div>

              {/* Contenido / Párrafos */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-rose-200/80">
                    Cuerpo de la carta
                  </label>
                  <span className="text-[10px] text-rose-300/50">
                    Soporta párrafos y saltos de línea (Enter)
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  placeholder={`Querida Laurita,\n\nEscribe aquí tus sentimientos, tus recuerdos, todo lo que quieras decirle...\n\nCon todo mi amor,\n${currentUser.displayName}`}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleGuardarCarta();
                    }
                  }}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#fbf5e6]/5 border border-rose-500/30 focus:border-rose-400 text-amber-100 placeholder:text-rose-300/30 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed font-serif"
                />
              </div>

              {/* Botón de Guardar y Sellar */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-rose-700 via-red-800 to-rose-900 hover:brightness-110 font-serif font-bold text-amber-100 text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/70 border border-amber-400/40 transition cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>Sellar y Guardar Carta en el Buzón 💌</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante inferior para volver al panel */}
      <div className="mt-8 flex justify-center z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-black/40 hover:bg-black/60 text-amber-200 font-serif rounded-full text-xs sm:text-sm border border-rose-900/40 transition shadow-lg backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>&larr;</span>
          <span>Volver al panel principal</span>
        </Link>
      </div>
    </main>
  );
}
