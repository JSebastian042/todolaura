export type UserRole = 'laura' | 'sebastian';

export interface UserProfile {
  id: UserRole;
  name: string;
  displayName: string;
  badgeEmoji: string;
  greeting: string;
  tagClass: string;
}

export const USERS: Record<UserRole, UserProfile> = {
  laura: {
    id: 'laura',
    name: 'Laura',
    displayName: 'Laura',
    badgeEmoji: '🌷',
    greeting: 'Bienvenida Laura, quiero que sepas que te amo',
    tagClass: 'bg-pink-950/70 border-pink-500/40 text-pink-300',
  },
  sebastian: {
    id: 'sebastian',
    name: 'Sebastián',
    displayName: 'Sebastián',
    badgeEmoji: '✨',
    greeting: 'Bienvenido Sebas',
    tagClass: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
  },
};

export const LAURA_PIN = '1904';
export const SEBASTIAN_PIN = '0602';

export function getActiveUser(): UserProfile {
  if (typeof window === 'undefined') return USERS.laura;
  const stored = sessionStorage.getItem('todolaura_user') as UserRole;
  return stored && USERS[stored] ? USERS[stored] : USERS.laura;
}
