// Utilidades de fecha para el calendario y semanas del cuaderno

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Retorna la fecha en formato YYYY-MM-DD del lunes de la semana correspondiente a la fecha dada.
 */
export function getMondayOfWeek(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  // En JS: 0 es Domingo, 1 es Lunes, ..., 6 es Sábado
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return formatDateToISO(date);
}

export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Añade o resta semanas a partir de un string YYYY-MM-DD
 */
export function shiftWeek(mondayStr: string, weeksCount: number): string {
  const [year, month, day] = mondayStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + weeksCount * 7);
  return formatDateToISO(d);
}

/**
 * Retorna un string legible para el encabezado: "14 - 19 de Septiembre, 2026"
 */
export function formatWeekRangeDisplay(mondayStr: string): string {
  const [year, month, day] = mondayStr.split('-').map(Number);
  const monday = new Date(year, month - 1, day);
  
  const saturday = new Date(monday);
  saturday.setDate(saturday.getDate() + 5);

  const monDay = monday.getDate();
  const satDay = saturday.getDate();
  const monMonth = MONTH_NAMES[monday.getMonth()];
  const satMonth = MONTH_NAMES[saturday.getMonth()];
  const satYear = saturday.getFullYear();

  if (monMonth === satMonth) {
    return `Semana del ${monDay} al ${satDay} de ${satMonth}, ${satYear}`;
  }
  return `Semana del ${monDay} de ${monMonth} al ${satDay} de ${satMonth}, ${satYear}`;
}

/**
 * Obtiene la fecha exacta (día y mes corto) para un día específico de la semana (0 = Lunes, 4 = Viernes)
 */
export function getDayDateDisplay(mondayStr: string, dayIndex: number): string {
  const [year, month, day] = mondayStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + dayIndex);

  const dayNum = d.getDate();
  const monthShort = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return `${dayNum} ${monthShort}`;
}

export function isCurrentWeek(mondayStr: string): boolean {
  return mondayStr === getMondayOfWeek(new Date());
}
