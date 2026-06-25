import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Panel } from './Panel';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  glow?: boolean;
  padding?: number;
  title?: string;
  subtitle?: string;
};

/** Enterprise panel wrapper — keeps legacy GlassCard API for existing screens. */
export function GlassCard({
  children,
  style,
  contentStyle,
  glow = false,
  padding = spacing.lg,
  title,
  subtitle,
}: GlassCardProps) {
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      padding={padding}
      contentStyle={contentStyle}
      variant={glow ? 'elevated' : 'default'}
      style={StyleSheet.flatten([glow && styles.highlight, style])}
    >
      {children}
    </Panel>
  );
}

const styles = StyleSheet.create({
  highlight: {
    borderColor: colors.borderStrong,
  },
});
