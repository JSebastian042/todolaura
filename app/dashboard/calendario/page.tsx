'use client';

import React, { useState, useEffect } from 'react';
import { Reminder } from '@/app/types/calendar';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, USERS, UserProfile } from '@/app/types/auth';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';
import AuthorBadge from '@/app/components/common/AuthorBadge';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarDashboard() {
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  const [year, setYear] = useState<number>(() => new Date().getFullYear());

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminderInput, setReminderInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS.laura);

  const fetchReminders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reminders').select('*');
    if (error) {
      console.error('Error cargando datos de Supabase:', error.message);
      setErrorMsg('No se pudieron cargar los recordatorios desde Supabase.');
    } else if (data) {
      setErrorMsg(null);
      setReminders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentUser(getActiveUser());
    fetchReminders();
  }, []);

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(year, currentMonth, 1).getDay();

  const handleOpenModal = (day: number) => {
    const formattedDate = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderInput.trim() || !selectedDate) return;

    const newReminder: Record<string, any> = {
      date: selectedDate,
      text: reminderInput.trim(),
      author: currentUser.name,
    };

    let { data, error } = await supabase
      .from('reminders')
      .insert([newReminder])
      .select();

    // Fallback si la columna author aún no se ha agregado en Supabase
    if (error && (error.code === '42703' || error.message?.includes('author'))) {
      delete newReminder.author;
      const retry = await supabase.from('reminders').insert([newReminder]).select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('Error insertando en Supabase:', error.message);
      setErrorMsg('No se pudo guardar el recordatorio en Supabase.');
    } else if (data) {
      setErrorMsg(null);
      const createdReminder: Reminder = {
        ...data[0],
        author: currentUser.name,
      };
      setReminders((prev) => [...prev, createdReminder]);
      setReminderInput('');
    }
  };

  const handleDeleteReminder = async (id?: string) => {
    if (!id) return;
    const { error } = await supabase.from('reminders').delete().eq('id', id);

    if (error) {
      console.error('Error eliminando de Supabase:', error.message);
      setErrorMsg('No se pudo eliminar el recordatorio en Supabase.');
    } else {
      setErrorMsg(null);
      setReminders((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const dayReminders = reminders.filter((r) => r.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0512] via-[#1a081f] to-[#310a21] text-white p-3 sm:p-8 font-sans flex flex-col items-center justify-between relative overflow-hidden">
      <AmbientBackground />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="w-full text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs sm:text-sm mb-3">
            <span>💖</span>
            <span>Calendario {year}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-pink-400 to-purple-300">
            Recordatorios
          </h1>
        </div>

        {/* Banner de error */}
        {errorMsg && (
          <div className="w-full bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs px-4 py-2.5 rounded-xl text-center backdrop-blur-md mb-4">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Selector de Mes */}
        <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            &larr; Anterior
          </button>
          <h2 className="text-base sm:text-2xl font-bold text-pink-200">
            {MONTHS[currentMonth]} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            Siguiente &rarr;
          </button>
        </div>

        {/* Grid del Calendario */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-6 shadow-2xl">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-[10px] sm:text-sm font-semibold text-pink-300/70 uppercase tracking-wider py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} className="h-14 sm:h-24 rounded-lg sm:rounded-xl bg-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNum = index + 1;
              const dateStr = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const count = reminders.filter((r) => r.date === dateStr).length;

              return (
                <button
                  key={dayNum}
                  onClick={() => handleOpenModal(dayNum)}
                  className="h-14 sm:h-24 rounded-lg sm:rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 transition-all duration-200 p-1.5 sm:p-2 flex flex-col justify-between items-start text-left relative group overflow-hidden cursor-pointer"
                >
                  <span className="text-xs sm:text-base font-semibold group-hover:text-pink-300">
                    {dayNum}
                  </span>

                  {count > 0 && (
                    <div className="w-full">
                      <span className="inline-block px-1.5 py-0.5 text-[9px] sm:text-xs rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 truncate max-w-full">
                        {count} {count === 1 ? 'nota' : 'notas'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BackButton />

      {/* Modal para Recordatorios */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#180a1f] border border-white/10 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-pink-200">
                  Recordatorios
                </h3>
                <p className="text-xs text-white/50">{selectedDate}</p>
              </div>
              <div className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-pink-300">
                Por: <span className="text-white font-semibold">{currentUser.displayName} {currentUser.badgeEmoji}</span>
              </div>
            </div>

            {/* Lista de recordatorios del día */}
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-1">
              {loading ? (
                <p className="text-xs sm:text-sm text-white/40 italic">Cargando recordatorios...</p>
              ) : dayReminders.length === 0 ? (
                <p className="text-xs sm:text-sm text-white/40 italic">No hay recordatorios para este día.</p>
              ) : (
                dayReminders.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs sm:text-sm"
                  >
                    <div className="flex flex-col flex-1 pr-2">
                      <span className="text-white/90 break-all">{item.text}</span>
                      <div className="mt-1">
                        <AuthorBadge author={item.author} prefix="Por" />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReminder(item.id)}
                      className="text-pink-400 hover:text-pink-300 text-xs ml-2 shrink-0 p-1 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Formulario */}
            <form onSubmit={handleAddReminder} className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe un recordatorio..."
                value={reminderInput}
                onChange={(e) => setReminderInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-lg shadow-pink-500/20 shrink-0 cursor-pointer"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}