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
  ArrowLeft,
  BookOpen,
  Search,
  Plus,
  BookMarked,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, UserProfile } from '@/app/types/auth';
import {
  NotebookEntry,
  GlossaryEntry,
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

  // Pestaña activa: Lunes a Sábado, o 'glosario'
  const [activeTab, setActiveTab] = useState<DayOfWeek | 'glosario'>(initialDayOfWeek);
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Estado del Glosario de Clases
  const [glossaryEntries, setGlossaryEntries] = useState<GlossaryEntry[]>([]);
  const [glossaryLoading, setGlossaryLoading] = useState<boolean>(true);
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [showAddGlossaryModal, setShowAddGlossaryModal] = useState<boolean>(false);
  const [newTerm, setNewTerm] = useState<string>('');
  const [newDefinition, setNewDefinition] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('');
  const [isSavingGlossary, setIsSavingGlossary] = useState<boolean>(false);

  // Modales multimedia
  const [showRecorder, setShowRecorder] = useState<boolean>(false);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getActiveUser());
  }, []);

  // 1. Cargar notas de la semana activa
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

  // 2. Cargar términos del Glosario de Clases
  const fetchGlossary = async () => {
    setGlossaryLoading(true);
    let items: GlossaryEntry[] = [];
    let supabaseSuccess = false;

    try {
      const { data, error } = await supabase
        .from('notebook_glossary')
        .select('*')
        .eq('notebook_id', notebookId)
        .order('term', { ascending: true });

      if (!error && data) {
        supabaseSuccess = true;
        items = data.map((item) => ({
          id: item.id,
          notebookId: item.notebook_id as NotebookId,
          term: item.term,
          definition: item.definition,
          subject: item.subject,
          author: item.author || 'Laura',
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Error cargando glosario de Supabase:', err);
    }

    // Merge con localStorage para no perder palabras agregadas localmente
    if (typeof window !== 'undefined') {
      try {
        const localKey = `todolaura_glossary_${notebookId}`;
        const cached = localStorage.getItem(localKey);
        if (cached) {
          const localItems: GlossaryEntry[] = JSON.parse(cached);
          const ids = new Set(items.map((i) => i.id));
          const terms = new Set(items.map((i) => i.term.toLowerCase().trim()));

          localItems.forEach((loc) => {
            if (!ids.has(loc.id) && !terms.has(loc.term.toLowerCase().trim())) {
              items.push(loc);
              ids.add(loc.id);
              terms.add(loc.term.toLowerCase().trim());

              // Si Supabase ya está disponible, sincronizar los que estaban solo en local
              if (supabaseSuccess) {
                supabase
                  .from('notebook_glossary')
                  .insert([
                    {
                      notebook_id: loc.notebookId,
                      term: loc.term,
                      definition: loc.definition,
                      subject: loc.subject || null,
                      author: loc.author,
                    },
                  ])
                  .then(() => {}, () => {});
              }
            }
          });
        }
      } catch (e) {}
    }

    setGlossaryEntries(items);
    setGlossaryLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [notebookId, currentMonday]);

  useEffect(() => {
    fetchGlossary();
  }, [notebookId]);

  // 3. Guardar una entrada diaria (texto, foto o audio)
  const handleAddEntry = async (
    type: EntryType,
    content: string,
    mediaMeta?: { duration?: number; caption?: string }
  ) => {
    const active = getActiveUser();
    const tempId = `local_${Date.now()}`;
    const dayToSave = activeTab === 'glosario' ? initialDayOfWeek : activeTab;

    const newEntryPayload = {
      notebook_id: notebookId,
      day_of_week: dayToSave,
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
      dayOfWeek: dayToSave,
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
      } catch (e) {}
      return updated;
    });

    setTextInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '42px';
    }
    setShowRecorder(false);
    setShowUploader(false);
  };

  // 4. Guardar un nuevo término en el Glosario de Clases (A-Z)
  const handleAddGlossaryTerm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTerm.trim() || !newDefinition.trim()) return;

    setIsSavingGlossary(true);
    const active = getActiveUser();
    const tempId = `glosario_${Date.now()}`;

    const newGlossaryPayload = {
      notebook_id: notebookId,
      term: newTerm.trim(),
      definition: newDefinition.trim(),
      subject: newSubject.trim() || null,
      author: active.displayName,
    };

    let confirmedId = tempId;
    let createdAt = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('notebook_glossary')
        .insert([newGlossaryPayload])
        .select();

      if (!error && data && data[0]) {
        confirmedId = data[0].id;
        createdAt = data[0].created_at;
      }
    } catch (err) {
      console.warn('Aviso guardando en notebook_glossary:', err);
    }

    const createdItem: GlossaryEntry = {
      id: confirmedId,
      notebookId,
      term: newGlossaryPayload.term,
      definition: newGlossaryPayload.definition,
      subject: newGlossaryPayload.subject || undefined,
      author: active.displayName,
      createdAt,
    };

    setGlossaryEntries((prev) => {
      const updated = [...prev, createdItem];
      const localKey = `todolaura_glossary_${notebookId}`;
      try {
        localStorage.setItem(localKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setNewTerm('');
    setNewDefinition('');
    setNewSubject('');
    setIsSavingGlossary(false);
    setShowAddGlossaryModal(false);
  };

  // 5. Eliminar término del glosario
  const handleDeleteGlossaryTerm = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este concepto del glosario?')) return;

    setGlossaryEntries((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const localKey = `todolaura_glossary_${notebookId}`;
      localStorage.setItem(localKey, JSON.stringify(filtered));
      return filtered;
    });

    try {
      await supabase.from('notebook_glossary').delete().eq('id', id);
    } catch (e) {
      console.warn('Error eliminando de notebook_glossary:', e);
    }
  };

  // Ajuste automático de altura de textarea
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
        e.preventDefault();
        handleSendText();
      }
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

  // Entradas del día activo (si no está en glosario)
  const dayEntries = activeTab === 'glosario' ? [] : entries.filter((e) => e.dayOfWeek === activeTab);

  // Términos del glosario ordenados estrictamente de la A a la Z
  const sortedGlossary = useMemo(() => {
    const q = glossarySearch.toLowerCase().trim();
    const filtered = glossaryEntries.filter((item) => {
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.subject && item.subject.toLowerCase().includes(q))
      );
    });

    return filtered.sort((a, b) =>
      a.term.localeCompare(b.term, 'es', { sensitivity: 'base' })
    );
  }, [glossaryEntries, glossarySearch]);

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

      {/* Selector de Semana (visible cuando se ven las notas diarias) */}
      {activeTab !== 'glosario' && (
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
      )}

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

        {/* PESTAÑAS: DÍAS (LUNES A SÁBADO) + GLOSARIO DE CLASES */}
        <div className="w-full bg-[#160b1e] border-x-2 border-white/10 px-2 sm:px-4 pt-2 overflow-x-auto no-scrollbar flex items-center gap-1 sm:gap-2 border-b border-white/10">
          {DAYS_OF_WEEK.map((d, index) => {
            const isActive = activeTab === d.id;
            const count = entries.filter((e) => e.dayOfWeek === d.id).length;
            const dateStr = getDayDateDisplay(currentMonday, index);

            return (
              <button
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className={`flex-1 min-w-[65px] sm:min-w-[95px] py-2 sm:py-2.5 px-1.5 rounded-t-xl text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 border-t border-x ${
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

          {/* PESTAÑA FIJA: GLOSARIO DE CLASES A-Z */}
          <button
            onClick={() => setActiveTab('glosario')}
            className={`min-w-[95px] sm:min-w-[130px] py-2 sm:py-2.5 px-3 rounded-t-xl text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 border-t border-x shrink-0 ${
              activeTab === 'glosario'
                ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white border-amber-300 font-bold -mb-[1px] relative z-10 shadow-lg scale-105'
                : 'bg-amber-950/40 text-amber-200/80 hover:bg-amber-950/70 hover:text-amber-100 border-amber-500/20 font-medium'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm">📖</span>
              <span className="text-xs sm:text-sm">Glosario</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] opacity-80 font-mono">
              <span>Clases A-Z</span>
              {glossaryEntries.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400/30 text-amber-200 flex items-center justify-center text-[9px] font-bold">
                  {glossaryEntries.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL: VISTA DE DÍA O VISTA DE GLOSARIO */}
        <div className={`w-full flex-1 rounded-b-3xl border-b-2 border-x-2 border-white/10 p-4 sm:p-8 relative shadow-2xl min-h-[450px] ${theme.paperBg}`}>
          {/* Rayado sutil de la libreta */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5 rounded-b-3xl"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '100% 28px',
            }}
          />

          {activeTab === 'glosario' ? (
            /* ========================================== */
            /* VISTA DEL GLOSARIO DE CLASES (ORDEN A-Z)   */
            /* ========================================== */
            <div className="space-y-6 relative z-10">
              {/* Encabezado del Glosario */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs mb-1">
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>Vocabulario Académico en Orden Alfabético</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Glosario de Clases & Conceptos</span>
                    <span className="text-xs sm:text-sm font-normal text-amber-300/80 font-mono">
                      ({glossaryEntries.length} {glossaryEntries.length === 1 ? 'concepto' : 'conceptos'})
                    </span>
                  </h2>
                  <p className="text-xs text-white/60">
                    Palabras técnicas, definiciones y conceptos de las materias de {theme.ownerName}.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddGlossaryModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:brightness-110 font-bold text-xs sm:text-sm text-white rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Concepto ✍️</span>
                </button>
              </div>

              {/* Barra de Búsqueda de Términos */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                <input
                  type="text"
                  placeholder="Buscar concepto, definición o materia..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/40 border border-white/15 focus:border-amber-400 text-xs sm:text-sm placeholder:text-white/40 text-white focus:outline-none transition-all"
                />
                {glossarySearch && (
                  <button
                    onClick={() => setGlossarySearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Listado de Términos A-Z */}
              {glossaryLoading ? (
                <div className="py-20 text-center text-xs text-amber-200/60 italic animate-pulse">
                  Abriendo el glosario de clases... 📖
                </div>
              ) : sortedGlossary.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="text-4xl animate-bounce">📚✨</div>
                  <h3 className="text-lg font-bold text-white">
                    {glossarySearch
                      ? `No hay conceptos que coincidan con "${glossarySearch}"`
                      : 'Aún no hay términos registrados en este glosario'}
                  </h3>
                  <p className="text-xs text-white/60 max-w-sm">
                    {glossarySearch
                      ? 'Intenta buscando por otra palabra o limpia el buscador.'
                      : `Anota aquí cualquier palabra, definición o fórmula de tus clases de ${theme.ownerName}.`}
                  </p>
                  <button
                    onClick={() => setShowAddGlossaryModal(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Agregar primer concepto ✍️
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedGlossary.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl bg-black/45 border border-white/10 p-4 sm:p-5 backdrop-blur-md hover:border-amber-400/40 transition-all shadow-lg flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        {/* Cabecera del concepto: Materia y Letra */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center border border-amber-400/30">
                              {item.term[0]?.toUpperCase() || '•'}
                            </span>
                            {item.subject && (
                              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                                {item.subject}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteGlossaryTerm(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 p-1 transition cursor-pointer"
                            title="Eliminar concepto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Término */}
                        <h3 className="text-base sm:text-lg font-bold text-amber-100 tracking-wide group-hover:text-amber-200 transition-colors pt-1">
                          {item.term}
                        </h3>

                        {/* Definición */}
                        <p className="text-xs sm:text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                          {item.definition}
                        </p>
                      </div>

                      {/* Pie: Autor */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                        <AuthorBadge author={item.author} prefix="" className="text-[10px] py-0 px-2" />
                        <span className="font-mono text-[10px] opacity-70">
                          {new Date(item.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ========================================== */
            /* VISTA DEL DÍA ACTIVO (NOTAS SEMANALES)     */
            /* ========================================== */
            <div>
              {/* Encabezado del Día */}
              <div className="flex items-center justify-between border-b pb-3 mb-6 border-white/10 relative z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-pink-400/80 font-mono">
                    Página del día
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white capitalize flex items-center gap-2">
                    <span>{DAYS_OF_WEEK.find((d) => d.id === activeTab)?.emoji}</span>
                    <span>{activeTab}</span>
                    <span className="text-xs sm:text-sm text-white/50 font-normal">
                      ({getDayDateDisplay(currentMonday, DAYS_OF_WEEK.findIndex((d) => d.id === activeTab))})
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
                        <div className="flex items-center gap-2">
                          <AuthorBadge author={entry.author} prefix="" className="text-[10px] py-0 px-2" />
                          <span className="text-[10px] text-white/40 font-mono">
                            {formatTimestamp(entry.createdAt)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Eliminar apunte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Contenido según tipo */}
                      {entry.type === 'text' && (
                        <p className="text-xs sm:text-sm text-white/90 whitespace-pre-wrap leading-relaxed pl-1">
                          {entry.content}
                        </p>
                      )}

                      {entry.type === 'photo' && (
                        <div className="space-y-2 mt-1">
                          <div
                            onClick={() => setFullscreenImage(entry.content)}
                            className="relative rounded-xl overflow-hidden bg-black/60 border border-white/10 max-h-72 cursor-pointer group/img flex items-center justify-center"
                          >
                            <img
                              src={entry.content}
                              alt="Foto del apunte"
                              className="max-h-72 w-full object-cover sm:object-contain group-hover/img:scale-[1.02] transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                              <span className="p-2 rounded-full bg-black/70 text-white">
                                <Maximize2 className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                          {entry.mediaMeta?.caption && (
                            <p className="text-xs text-white/70 italic pl-1">
                              {entry.mediaMeta.caption}
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
          )}
        </div>
      </main>

      {/* BARRA INFERIOR FIJA */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-3">
          {activeTab === 'glosario' ? (
            /* Botón rápido cuando se está en el Glosario */
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-amber-200/70 hidden sm:inline font-mono">
                Glosario de Clases ordenado de la A a la Z
              </span>
              <button
                onClick={() => setShowAddGlossaryModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:brightness-110 font-bold text-xs sm:text-sm text-white rounded-2xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Término de Clase ✍️</span>
              </button>
            </div>
          ) : (
            /* Barra para notas del día (Texto / Foto / Audio) */
            <>
              {showRecorder && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <AudioRecorder
                    onSave={(audioUrl, duration) => handleAddEntry('audio', audioUrl, { duration })}
                    onCancel={() => setShowRecorder(false)}
                    accentColor={notebookId === 'sebastian' ? 'indigo' : 'pink'}
                  />
                </div>
              )}

              {showUploader && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <ImageUploader
                    onSave={(imgUrl, caption) => handleAddEntry('photo', imgUrl, { caption })}
                    onCancel={() => setShowUploader(false)}
                    accentColor={notebookId === 'sebastian' ? 'indigo' : 'pink'}
                  />
                </div>
              )}

              {!showRecorder && !showUploader && (
                <form onSubmit={handleSendText} className="flex items-end gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setShowUploader(true)}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-pink-600/30 text-pink-300 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer shrink-0"
                    title="Subir foto"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRecorder(true)}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-white/10 transition active:scale-95 cursor-pointer shrink-0"
                    title="Grabar audio"
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

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
            </>
          )}
        </div>
      </footer>

      {/* MODAL PARA AGREGAR CONCEPTO AL GLOSARIO DE CLASES */}
      {showAddGlossaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1e0719] via-[#150412] to-[#0d020c] border border-amber-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative text-white my-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowAddGlossaryModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 border-b border-white/10 pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs mb-1">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Glosario de Clases ({theme.ownerName})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Nuevo Concepto de Clase
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Se ordenará automáticamente de la A a la Z en el glosario.
              </p>
            </div>

            <form onSubmit={handleAddGlossaryTerm} className="space-y-4 text-xs sm:text-sm">
              {/* Término / Concepto */}
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Término o Concepto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fotosíntesis, Habeas Corpus, Algoritmo, Metáfora..."
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 focus:border-amber-400 text-white text-xs sm:text-sm focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Materia / Asignatura */}
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Materia o Asignatura <span className="text-white/40 font-normal">(Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Derecho, Biología, Matemáticas, Programación..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 focus:border-amber-400 text-white text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Definición */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-white/80">
                    Definición o Explicación
                  </label>
                  <span className="text-[10px] text-white/40">
                    Atajo: Ctrl+Enter para guardar
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe la explicación o resumen visto en clase..."
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleAddGlossaryTerm();
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 focus:border-amber-400 text-white text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Botón de Guardar */}
              <button
                type="submit"
                disabled={isSavingGlossary}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:brightness-110 font-bold text-white text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Guardar en Glosario A-Z ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

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
