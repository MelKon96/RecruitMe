import type { DevLevel } from './devLevels';

export const LEVEL_COLORS: Record<DevLevel, string> = {
  Junior: 'bg-green-100 text-green-800 border-green-200',
  Middle: 'bg-blue-100 text-blue-800 border-blue-200',
  Senior: 'bg-purple-100 text-purple-800 border-purple-200',
  Lead: 'bg-amber-100 text-amber-800 border-amber-200',
};
