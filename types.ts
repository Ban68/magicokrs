export interface KeyResult {
  id: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string; // e.g., '%', '$', 'items'
}

export interface Objective {
  id: string;
  title: string;
  ownerId: string; // Can be a user ID or team ID
  ownerType: 'User' | 'Team';
  type: 'Company' | 'Team' | 'Individual';
  level: 'Committed' | 'Aspirational';
  parentId: string | null;
  keyResults: KeyResult[];
  cycle: string; // e.g., "Q3 2024"
  reflection?: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
}

export type AppScreen = 'dashboard' | 'company' | 'my-okrs' | 'retrospective' | 'settings';