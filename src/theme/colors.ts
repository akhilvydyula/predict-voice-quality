/** Light design system (Meegle-inspired). */
export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundElevated: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#F7F8FA',
  surfaceHover: '#F0F2F5',
  surfaceGlass: 'rgba(255, 255, 255, 0.96)',

  // Borders
  border: '#E5E6EB',
  borderStrong: '#D0D3D9',

  // Primary blue
  primary: '#0066FF',
  primaryBright: '#3385FF',
  primaryMuted: '#B3D4FF',
  primarySoft: '#E8F3FF',

  // Accent warm
  accent: '#FF6B35',
  accentSoft: '#FFF0EB',

  // Semantic
  success: '#00C853',
  successSoft: '#E8F8EE',
  warning: '#F59E0B',
  warningSoft: '#FFF8EB',
  danger: '#EF4444',
  dangerSoft: '#FEECEC',

  // Text
  text: '#1F2329',
  textSecondary: '#646A73',
  textMuted: '#8F959E',
  textDim: '#BBBFC4',
  textOnPrimary: '#FFFFFF',

  // Charts
  chartLine: '#0066FF',
  chartGrid: 'rgba(31, 35, 41, 0.08)',

  // Chrome
  tabBar: 'rgba(255, 255, 255, 0.97)',
  glowPrimary: 'rgba(0, 102, 255, 0.08)',
  glowAccent: 'rgba(255, 107, 53, 0.08)',

  // Shadows (web)
  shadow: '0 8px 32px rgba(31, 35, 41, 0.08)',
  shadowLg: '0 24px 64px rgba(31, 35, 41, 0.12)',
} as const;

export const gradients = {
  screen: ['#FFFFFF', '#F7F8FA', '#FFFFFF'] as const,
  hero: ['#E8F3FF', '#F7F8FA', '#FFFFFF'] as const,
  cta: ['#0066FF', '#0052CC'] as const,
  live: ['rgba(0, 200, 83, 0.10)', 'rgba(0, 102, 255, 0.05)', 'transparent'] as const,
  cardShine: ['rgba(0, 102, 255, 0.03)', 'transparent'] as const,
};
