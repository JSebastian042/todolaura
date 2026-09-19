export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

export type NotebookId = 'laura' | 'sebastian';

export type EntryType = 'text' | 'photo' | 'audio';

export interface NotebookEntry {
  id: string;
  notebookId: NotebookId;
  dayOfWeek: DayOfWeek;
  weekStartDate: string; // Formato YYYY-MM-DD (fecha del lunes)
  type: EntryType;
  content: string; // Texto, o dataURL de imagen/audio
  mediaMeta?: {
    duration?: number; // Duración en segundos si es audio
    caption?: string;
    fileName?: string;
  };
  author: string; // 'Laura' | 'Sebastián'
  createdAt: string;
}

export interface DayInfo {
  id: DayOfWeek;
  label: string;
  short: string;
  emoji: string;
}

export const DAYS_OF_WEEK: DayInfo[] = [
  { id: 'lunes', label: 'Lunes', short: 'Lun', emoji: '☕' },
  { id: 'martes', label: 'Martes', short: 'Mar', emoji: '✨' },
  { id: 'miercoles', label: 'Miércoles', short: 'Mié', emoji: '🌸' },
  { id: 'jueves', label: 'Jueves', short: 'Jue', emoji: '⭐' },
  { id: 'viernes', label: 'Viernes', short: 'Vie', emoji: '🎉' },
  { id: 'sabado', label: 'Sábado', short: 'Sáb', emoji: '🎈' },
];

export interface NotebookTheme {
  id: NotebookId;
  ownerName: string;
  title: string;
  subtitle: string;
  coverEmoji: string;
  stickers: string[];
  coverGradient: string;
  coverBorder: string;
  spineColor: string;
  ringColor: string;
  paperBg: string;
  paperLineColor: string;
  accentColor: string;
  tabActiveColor: string;
  tabInactiveColor: string;
  bubbleColor: string;
}

export const NOTEBOOK_THEMES: Record<NotebookId, NotebookTheme> = {
  laura: {
    id: 'laura',
    ownerName: 'Laura',
    title: 'Cuaderno de Laura',
    subtitle: '¿Qué hiciste hoy?',
    coverEmoji: '🌷',
    stickers: ['🌷', '💖', '🧸', '🎀', '🌸', '✨'],
    coverGradient: 'from-pink-900/90 via-rose-900/80 to-pink-950/90',
    coverBorder: 'border-pink-500/40 hover:border-pink-400/80 hover:shadow-[0_0_35px_rgba(244,114,182,0.35)]',
    spineColor: 'bg-rose-950 border-r border-pink-500/30',
    ringColor: 'from-pink-300 to-rose-400',
    paperBg: 'bg-[#180b15]/95',
    paperLineColor: 'border-pink-500/10',
    accentColor: 'text-pink-300',
    tabActiveColor: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-950/50',
    tabInactiveColor: 'bg-pink-950/40 text-pink-300/70 hover:bg-pink-950/70 hover:text-pink-200 border-pink-500/20',
    bubbleColor: 'bg-pink-950/40 border-pink-500/20',
  },
  sebastian: {
    id: 'sebastian',
    ownerName: 'Sebastián',
    title: 'Cuaderno de Sebastián',
    subtitle: '¿Qué hiciste hoy?',
    coverEmoji: '⚽',
    stickers: ['⚽', '🏆', '🔥', '⚡', '🎮', '✨'],
    coverGradient: 'from-slate-900 via-indigo-950/90 to-slate-950',
    coverBorder: 'border-indigo-500/40 hover:border-sky-400/80 hover:shadow-[0_0_35px_rgba(99,102,241,0.35)]',
    spineColor: 'bg-slate-950 border-r border-indigo-500/30',
    ringColor: 'from-slate-300 to-indigo-400',
    paperBg: 'bg-[#0b0f19]/95',
    paperLineColor: 'border-indigo-500/10',
    accentColor: 'text-indigo-300',
    tabActiveColor: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-950/50',
    tabInactiveColor: 'bg-indigo-950/40 text-indigo-300/70 hover:bg-indigo-950/70 hover:text-indigo-200 border-indigo-500/20',
    bubbleColor: 'bg-indigo-950/40 border-indigo-500/20',
  },
};
