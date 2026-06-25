// 8px baseline grid
export const spacing = {
  xs: 4,    // 0.5 × 8
  sm: 8,    // 1 × 8
  md: 12,   // 1.5 × 8
  lg: 16,   // 2 × 8
  xl: 20,   // 2.5 × 8
  xxl: 24,  // 3 × 8
  xxxl: 32, // 4 × 8
  section: 40, // 5 × 8
  screen: 20,  // container horizontal padding
  tabBar: 62,  // tab bar total height (49px + safe area buffer)
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;
