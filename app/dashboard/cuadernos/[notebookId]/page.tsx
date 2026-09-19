'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Image as ImageIcon,
  Mic,
  Calendar,
  Trash2,
  X,
  Maximize2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, UserProfile } from '@/app/types/auth';
import {
  NotebookEntry,
  NotebookId,
  DayOfWeek,
  DAYS_OF_WEEK,
  NOTEBOOK_THEMES,
  EntryType
} from '@/app/types/notebook';
import {
  getMondayOfWeek,
  shiftWeek,
  formatWeekRangeDisplay,
  getDayDateDisplay,
  isCurrentWeek
} from '@/app/lib/dateUtils';
import AuthorBadge from '@/app/components/common/AuthorBadge';
import AudioPlayer from '@/app/components/notebook/AudioPlayer';
import AudioRecorder from '@/app/components/notebook/AudioRecorder';
import ImageUploader from '@/app/components/notebook/ImageUploader';
import AmbientBackground from '@/app/components/common/AmbientBackground';

export default function NotebookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.notebookId as string) || 'laura';
  const notebookId: NotebookId = rawId === 'sebastian' ? 'sebastian' : 'laura';
  const theme = NOTEBOOK_THEMES[notebookId];

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getActiveUser());
  const [currentMonday, setCurrentMonday] = useState<string>(() => getMondayOfWeek(new Date()));

  // Día activo inicial según el día actual si es lunes a sábado
  const initialDayOfWeek = useMemo<DayOfWeek>(() => {
    const day = new Date().getDay(); // 0 Dom, 1 Lun, ..., 6 Sáb
    const map: Record<number, DayOfWeek> = {
      1: 'lunes',
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado',
    };
    return map[day] || 'lunes';
  }, []);

  const [activeDay, setActiveDay] = useState<DayOfWeek>(initialDayOfWeek);
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Modales multimedia
  const [showRecorder, setShowRecorder] = useState<boolean>(false);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, []);

  // Cargar notas de la semana activa
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('notebook_id', notebookId)
        .eq('week_start_date', currentMonday)
        .order('created_at', { ascending: true });

      if (!error && data) {
        const mapped: NotebookEntry[] = data.map((item) => ({
          id: item.id,
          notebookId: item.notebook_id as NotebookId,
          dayOfWeek: item.day_of_week as DayOfWeek,
          weekStartDate: item.week_start_date,
          type: item.type as EntryType,
          content: item.content,
          mediaMeta: item.media_meta || {},
          author: item.author || 'Laura',
          createdAt: item.created_at,
        }));
        setEntries(mapped);
      } else {
        // Fallback a localStorage si la tabla aún no se ha creado o no hay conexión
        const localKey = `todolaura_nb_${notebookId}_${currentMonday}`;
        const cached = localStorage.getItem(localKey);
        if (cached) {
          setEntries(JSON.parse(cached));
        } else {
          setEntries([]);
        }
      }
    } catch (err) {
      console.warn('Error al consultar Supabase:', err);
      const localKey = `todolaura_nb_${notebookId}_${currentMonday}`;
      const cached = localStorage.getItem(localKey);
      if (cached) setEntries(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [notebookId, currentMonday]);

  // Guardar una entrada (texto, foto o audio)
  const handleAddEntry = async (
    type: EntryType,
    content: string,
    mediaMeta?: { duration?: number; caption?: string }
  ) => {
    const active = getActiveUser();
    const tempId = `local_${Date.now()}`;

    const newEntryPayload = {
      notebook_id: notebookId,
      day_of_week: activeDay,
      week_start_date: currentMonday,
      type,
      content,
      media_meta: mediaMeta || {},
      author: active.displayName,
    };

    let confirmedId = tempId;
    let createdAt = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('notebook_entries')
        .insert([newEntryPayload])
        .select();

      if (!error && data && data[0]) {
        confirmedId = data[0].id;
        createdAt = data[0].created_at;
      } else if (error) {
        console.warn('Advertencia al insertar en notebook_entries:', error.message);
      }
    } catch (err) {
      console.warn('Fallback a almacenamiento local:', err);
    }

    const createdEntry: NotebookEntry = {
      id: confirmedId,
      notebookId,
      dayOfWeek: activeDay,
      weekStartDate: currentMonday,
      type,
      content,
      mediaMeta,
      author: active.displayName,
      createdAt,
    };

    setEntries((prev) => {
      const updated = [...prev, createdEntry];
      const localKey = `todolaura_nb_${notebookId}_${currentMonday}`;
      try {
        localStorage.setItem(localKey, JSON.stringify(updated));
      } catch (e) {
        // En caso de cuota excedida en localStorage por fotos grandes
      }
      return updated;
    });

    // Resetear estados
    setTextInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setShowRecorder(false);
    setShowUploader(false);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 42), 160)}px`;
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim()) return;
    handleAddEntry('text', textInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    if (e.key === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        // En PC o teclado físico, Ctrl+Enter o Shift+Enter inserta un salto de línea/párrafo
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const newValue = value.substring(0, start) + '\n' + value.substring(end);

        setTextInput(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          adjustTextareaHeight();
        }, 0);
      } else if (!isTouchDevice) {
        // En computador (desktop), Enter simple envía la nota directamente
        e.preventDefault();
        handleSendText();
      }
      // En celular táctil, Enter simple hace el salto de línea por defecto
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await supabase.from('notebook_entries').delete().eq('id', id);
    } catch (e) {
      console.warn('Error eliminando de Supabase:', e);
    }

    setEntries((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const localKey = `todolaura_nb_${notebookId}_${currentMonday}`;
      localStorage.setItem(localKey, JSON.stringify(filtered));
      return filtered;
    });
  };

  // Filtrar las entradas del día activo
  const dayEntries = entries.filter((e) => e.dayOfWeek === activeDay);

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0714] text-white flex flex-col items-center p-3 sm:p-6 font-sans relative overflow-x-hidden">
      <AmbientBackground withTulips={notebookId === 'laura'} />

      {/* Barra de navegación superior */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-4 z-20">
        <Link
          href="/dashboard/cuadernos"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-pink-200 backdrop-blur-md transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a cuadernos</span>
        </Link>

        {/* Insignia de usuario */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/70 hidden sm:inline">Escribiendo como:</span>
          <AuthorBadge author={currentUser.displayName} prefix="Soy" />
        </div>
      </header>

      {/* Selector de Semana */}
      <div className="w-full max-w-4xl z-20 mb-4 bg-black/40 border border-white/10 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md flex items-center justify-between shadow-lg">
        <button
          onClick={() => setCurrentMonday((prev) => shiftWeek(prev, -1))}
          className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition cursor-pointer"
          title="Semana anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center">
          <span className="text-xs sm:text-sm font-bold text-pink-100 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            {formatWeekRangeDisplay(currentMonday)}
          </span>
          {!isCurrentWeek(currentMonday) && (
            <button
              onClick={() => setCurrentMonday(getMondayOfWeek(new Date()))}
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition cursor-pointer"
            >
              Ir a semana actual
            </button>
          )}
        </div>

        <button
          onClick={() => setCurrentMonday((prev) => shiftWeek(prev, 1))}
          className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition cursor-pointer"
          title="Semana siguiente"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* CUADERNO PRINCIPAL */}
      <main className="w-full max-w-4xl flex-1 flex flex-col relative z-10 pb-28">
        {/* Portada / Cabecera del Cuaderno */}
        <div className={`w-full rounded-t-3xl border-t-2 border-x-2 p-4 sm:p-6 shadow-2xl relative overflow-hidden bg-gradient-to-r ${theme.coverGradient} ${theme.coverBorder}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{theme.coverEmoji}</span>
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {theme.title}
                </h1>
                <p className="text-xs text-white/75">{theme.subtitle}</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xl">
              {theme.stickers.map((s, idx) => (
                <span key={idx} className="hover:scale-125 transition-transform select-none cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ESPIRAL / ANILLADO DE LA LIBRETA */}
        <div className="w-full bg-[#110714] border-x-2 border-white/10 py-2 sm:py-3 flex items-center justify-around px-4 shadow-inner relative z-20">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-2.5 sm:w-3.5 h-6 sm:h-8 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 shadow-md border border-slate-700/60" />
            </div>
          ))}
        </div>

        {/* PESTAÑAS DE DÍAS (LUNES A VIERNES) */}
        <div className="w-full bg-[#160b1e] border-x-2 border-white/10 px-2 sm:px-4 pt-2 overflow-x-auto no-scrollbar flex items-center gap-1 sm:gap-2 border-b border-white/10">
          {DAYS_OF_WEEK.map((d, index) => {
            const isActive = activeDay === d.id;
            const count = entries.filter((e) => e.dayOfWeek === d.id).length;
            const dateStr = getDayDateDisplay(currentMonday, index);

            return (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                className={`flex-1 min-w-[72px] sm:min-w-[110px] py-2 sm:py-2.5 px-2 rounded-t-xl text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 border-t border-x ${
                  isActive
                    ? `${theme.tabActiveColor} border-white/30 font-bold -mb-[1px] relative z-10 shadow-lg scale-105`
                    : `${theme.tabInactiveColor} font-medium opacity-80 hover:opacity-100`
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm">{d.emoji}</span>
                  <span className="text-xs sm:text-sm">{d.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] opacity-75">
                  <span>{dateStr}</span>
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* HOJA DE APUNTES DEL DÍA ACTIVO */}
        <div className={`w-full flex-1 rounded-b-3xl border-b-2 border-x-2 border-white/10 p-4 sm:p-8 relative shadow-2xl min-h-[450px] ${theme.paperBg}`}>
          {/* Rayado sutil de la libreta */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5 rounded-b-3xl"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '100% 28px',
            }}
          />

          {/* Encabezado del Día */}
          <div className="flex items-center justify-between border-b pb-3 mb-6 border-white/10 relative z-10">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-pink-400/80 font-mono">
                Página del día
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-white capitalize flex items-center gap-2">
                <span>{DAYS_OF_WEEK.find((d) => d.id === activeDay)?.emoji}</span>
                <span>{activeDay}</span>
                <span className="text-xs sm:text-sm text-white/50 font-normal">
                  ({getDayDateDisplay(currentMonday, DAYS_OF_WEEK.findIndex((d) => d.id === activeDay))})
                </span>
              </h2>
            </div>

            <div className="text-xs text-white/50">
              {dayEntries.length} {dayEntries.length === 1 ? 'entrada' : 'entradas'}
            </div>
          </div>

          {/* LISTA DE ENTRADAS DEL DÍA */}
          {loading ? (
            <div className="py-20 text-center text-xs text-white/50 italic animate-pulse">
              Abriendo página de apuntes... 📖
            </div>
          ) : dayEntries.length === 0 ? (
            <div className="py-20 sm:py-28 text-center flex flex-col items-center justify-center space-y-4 relative z-10">
              <div className="text-4xl sm:text-5xl animate-bounce">
                {notebookId === 'sebastian' ? '⚽✍️' : '🌷✍️'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                ¿Qué hiciste hoy?
              </h3>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {dayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative rounded-2xl bg-black/40 border border-white/10 p-3.5 sm:p-5 backdrop-blur-md hover:border-white/20 transition-all shadow-md flex flex-col justify-between"
                >
                  {/* Encabezado de la entrada: autor y hora */}
                  <div className="flex items-center justify-between mb-2">
                    <AuthorBadge author={entry.author} prefix="Por" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/50 font-mono">
                        {formatTimestamp(entry.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="Eliminar nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contenido según el tipo */}
                  {entry.type === 'text' && (
                    <p className="text-xs sm:text-sm text-pink-100/90 whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  )}

                  {entry.type === 'photo' && (
                    <div className="flex flex-col gap-2 mt-1">
                      <div
                        className="relative max-w-sm rounded-xl overflow-hidden bg-black/50 border border-white/15 cursor-pointer group/img"
                        onClick={() => setFullscreenImage(entry.content)}
                      >
                        <img
                          src={entry.content}
                          alt="Foto del cuaderno"
                          className="w-full max-h-72 object-cover rounded-lg group-hover/img:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      {entry.mediaMeta?.caption && (
                        <p className="text-xs text-pink-200/80 italic">
                          "{entry.mediaMeta.caption}"
                        </p>
                      )}
                    </div>
                  )}

                  {entry.type === 'audio' && (
                    <div className="mt-1">
                      <AudioPlayer
                        src={entry.content}
                        duration={entry.mediaMeta?.duration}
                        accentColor={entry.author.toLowerCase().includes('seb') ? 'indigo' : 'pink'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* BARRA INFERIOR FIJA PARA CREAR NOTAS / FOTOS / AUDIOS */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-3">
          {/* Submenú de Grabadora de Audio si está abierta */}
          {showRecorder && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
              <AudioRecorder
                onSave={(audioUrl, duration) => handleAddEntry('audio', audioUrl, { duration })}
                onCancel={() => setShowRecorder(false)}
                accentColor={notebookId === 'sebastian' ? 'indigo' : 'pink'}
              />
            </div>
          )}

          {/* Submenú de Subida de Fotos si está abierta */}
          {showUploader && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
              <ImageUploader
                onSave={(imgUrl, caption) => handleAddEntry('photo', imgUrl, { caption })}
                onCancel={() => setShowUploader(false)}
                accentColor={notebookId === 'sebastian' ? 'indigo' : 'pink'}
              />
            </div>
          )}

          {/* Barra principal de entrada de texto y botones rápidos */}
          {!showRecorder && !showUploader && (
            <form onSubmit={handleSendText} className="flex items-end gap-2 w-full">
              {/* Botón de Foto */}
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-pink-600/30 text-pink-300 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer shrink-0"
                title="Subir foto"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Botón de Micrófono */}
              <button
                type="button"
                onClick={() => setShowRecorder(true)}
                className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer shrink-0"
                title="Grabar audio"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Área de texto auto-expandible */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={textInput}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="¿Qué hiciste hoy? Escribe aquí... (Ctrl+Enter para salto)"
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-white/10 border border-white/15 focus:border-pink-500/70 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none transition-all resize-none max-h-36 overflow-y-auto leading-relaxed"
                style={{ minHeight: '42px' }}
              />

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={!textInput.trim()}
                className={`p-2.5 sm:p-3 rounded-2xl font-semibold text-white transition active:scale-95 cursor-pointer shrink-0 shadow-lg ${
                  textInput.trim()
                    ? notebookId === 'sebastian'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 shadow-indigo-950/50'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 shadow-pink-950/50'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                title="Enviar nota (Enter)"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          )}
        </div>
      </footer>

      {/* Modal de foto en pantalla completa */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Foto ampliada"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
