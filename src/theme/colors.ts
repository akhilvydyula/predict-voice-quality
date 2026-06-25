// Dark-mode design system
export const colors = {
  // Backgrounds
  background: '#0F1419',
  backgroundElevated: '#161B22',
  surface: '#1A1E27',
  surfaceElevated: '#252B36',
  surfaceHover: '#2D3441',
  surfaceGlass: 'rgba(26, 30, 39, 0.96)',

  // Borders
  border: 'rgba(224, 230, 237, 0.10)',
  borderStrong: 'rgba(224, 230, 237, 0.20)',

  // Primary blue
  primary: '#0066FF',
  primaryBright: '#3385FF',
  primaryMuted: '#003380',
  primarySoft: 'rgba(0, 102, 255, 0.12)',

  // Accent warm
  accent: '#FF6B35',
  accentSoft: 'rgba(255, 107, 53, 0.12)',

  // Semantic
  success: '#00C853',
  successSoft: 'rgba(0, 200, 83, 0.12)',
  warning: '#FFA500',
  warningSoft: 'rgba(255, 165, 0, 0.12)',
  danger: '#FF4444',
  dangerSoft: 'rgba(255, 68, 68, 0.12)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textDim: '#4B5563',

  // Charts
  chartLine: '#3385FF',
  chartGrid: 'rgba(224, 230, 237, 0.08)',

  // Chrome
  tabBar: 'rgba(15, 20, 25, 0.97)',
  glowPrimary: 'rgba(0, 102, 255, 0.18)',
  glowAccent: 'rgba(255, 107, 53, 0.12)',
} as const;

export const gradients = {
  screen: ['#0F1419', '#0F1419', '#0F1419'] as const,
  hero: ['#252B36', '#1A1E27', '#0F1419'] as const,
  cta: ['#0066FF', '#0052CC'] as const,
  live: ['rgba(0, 200, 83, 0.14)', 'rgba(0, 102, 255, 0.06)', 'transparent'] as const,
  cardShine: ['rgba(255,255,255,0.04)', 'transparent'] as const,
};
