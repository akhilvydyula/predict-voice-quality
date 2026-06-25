export type ThemeColors = {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  surfaceGlass: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryBright: string;
  primaryMuted: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  textOnPrimary: string;
  chartLine: string;
  chartGrid: string;
  tabBar: string;
  glowPrimary: string;
  glowAccent: string;
  shadow: string;
  shadowLg: string;
};

export type ThemeGradients = {
  screen: readonly [string, string, string];
  hero: readonly [string, string, string];
  cta: readonly [string, string];
  live: readonly [string, string, string];
  cardShine: readonly [string, string];
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  backgroundElevated: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#F7F8FA',
  surfaceHover: '#F0F2F5',
  surfaceGlass: 'rgba(255, 255, 255, 0.96)',
  border: '#E5E6EB',
  borderStrong: '#D0D3D9',
  primary: '#0066FF',
  primaryBright: '#3385FF',
  primaryMuted: '#B3D4FF',
  primarySoft: '#E8F3FF',
  accent: '#FF6B35',
  accentSoft: '#FFF0EB',
  success: '#00C853',
  successSoft: '#E8F8EE',
  warning: '#F59E0B',
  warningSoft: '#FFF8EB',
  danger: '#EF4444',
  dangerSoft: '#FEECEC',
  text: '#1F2329',
  textSecondary: '#646A73',
  textMuted: '#8F959E',
  textDim: '#BBBFC4',
  textOnPrimary: '#FFFFFF',
  chartLine: '#0066FF',
  chartGrid: 'rgba(31, 35, 41, 0.08)',
  tabBar: 'rgba(255, 255, 255, 0.97)',
  glowPrimary: 'rgba(0, 102, 255, 0.08)',
  glowAccent: 'rgba(255, 107, 53, 0.08)',
  shadow: '0 8px 32px rgba(31, 35, 41, 0.08)',
  shadowLg: '0 24px 64px rgba(31, 35, 41, 0.12)',
};

export const darkColors: ThemeColors = {
  background: '#0F1117',
  backgroundElevated: '#161B26',
  surface: '#1A2030',
  surfaceElevated: '#1F2738',
  surfaceHover: '#252E42',
  surfaceGlass: 'rgba(26, 32, 48, 0.96)',
  border: '#2A3347',
  borderStrong: '#36415A',
  primary: '#4D9AFF',
  primaryBright: '#6BB0FF',
  primaryMuted: '#1E3A66',
  primarySoft: '#152A4A',
  accent: '#FF8A5C',
  accentSoft: '#3A2218',
  success: '#34D399',
  successSoft: '#123528',
  warning: '#FBBF24',
  warningSoft: '#3A2E12',
  danger: '#F87171',
  dangerSoft: '#3A1818',
  text: '#F3F4F6',
  textSecondary: '#B8BEC8',
  textMuted: '#8B93A1',
  textDim: '#5E6675',
  textOnPrimary: '#FFFFFF',
  chartLine: '#4D9AFF',
  chartGrid: 'rgba(255, 255, 255, 0.06)',
  tabBar: 'rgba(15, 17, 23, 0.97)',
  glowPrimary: 'rgba(77, 154, 255, 0.12)',
  glowAccent: 'rgba(255, 138, 92, 0.10)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
  shadowLg: '0 24px 64px rgba(0, 0, 0, 0.45)',
};

export const lightGradients: ThemeGradients = {
  screen: ['#FFFFFF', '#F7F8FA', '#FFFFFF'],
  hero: ['#E8F3FF', '#F7F8FA', '#FFFFFF'],
  cta: ['#0066FF', '#0052CC'],
  live: ['rgba(0, 200, 83, 0.10)', 'rgba(0, 102, 255, 0.05)', 'transparent'],
  cardShine: ['rgba(0, 102, 255, 0.03)', 'transparent'],
};

export const darkGradients: ThemeGradients = {
  screen: ['#0F1117', '#161B26', '#0F1117'],
  hero: ['#152A4A', '#161B26', '#0F1117'],
  cta: ['#4D9AFF', '#2563EB'],
  live: ['rgba(52, 211, 153, 0.12)', 'rgba(77, 154, 255, 0.08)', 'transparent'],
  cardShine: ['rgba(77, 154, 255, 0.06)', 'transparent'],
};

export type ThemeMode = 'light' | 'dark';

export function getPalette(mode: ThemeMode) {
  return mode === 'dark'
    ? { colors: darkColors, gradients: darkGradients }
    : { colors: lightColors, gradients: lightGradients };
}

export function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}
