import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDevMode } from '../../src/context/DevModeContext';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { colors, gradients } from '../../src/theme/colors';
import { radius, spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

const FEATURES = [
  {
    icon: 'mic',
    title: 'Live practice',
    desc: 'Real-time pitch, vibrato, and dynamics while you sing',
  },
  {
    icon: 'tools',
    title: 'Singer toolkit',
    desc: 'Tuner, metronome, scales, breath coach, and range map',
  },
  {
    icon: 'analytics',
    title: 'Pro analytics',
    desc: 'Register, drift, fatigue, and phrase consistency',
  },
  {
    icon: 'school',
    title: 'AI vocal coach',
    desc: 'Adaptive plans, milestones, and session memory',
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { enabled: devMode, registerUnlockTap } = useDevMode();

  return (
    <Screen>
      <View style={styles.hero}>
        <LinearGradient colors={[...gradients.hero]} style={styles.heroGlow} />
        <Pressable onPress={registerUnlockTap}>
          <Text style={styles.eyebrow}>VOCAL STUDIO{devMode ? ' · DEV' : ''}</Text>
        </Pressable>
        <Text style={styles.title}>Train your{'\n'}voice like a pro</Text>
        <Text style={styles.subtitle}>
          World-class singing analysis with an agentic coach that learns how you sing and builds
          your practice plan — privately on your phone.
        </Text>
      </View>

      <GlassCard glow padding={spacing.xl}>
        <Text style={styles.cardLabel}>READY WHEN YOU ARE</Text>
        <Text style={styles.cardTitle}>Start a live session</Text>
        <Text style={styles.cardBody}>
          Tap Practice, allow the mic, and sing for 30 seconds. Your coach adapts in real time.
        </Text>
        <PrimaryButton
          label="Open Practice Studio"
          subtitle="Microphone · On-device only"
          onPress={() => router.push('/session')}
          style={styles.cta}
        />
        <PrimaryButton
          label="Open Singer Tools"
          variant="ghost"
          onPress={() => router.push('/tools')}
          style={styles.toolsCta}
        />
      </GlassCard>

      <SectionHeader title="What you get" subtitle="Built for serious singers" />
      <View style={styles.featureList}>
        {FEATURES.map((item, index) => (
          <GlassCard key={item.title} padding={spacing.lg}>
            <View style={styles.featureRow}>
              <View style={styles.featureBadge}>
                <Text style={styles.featureIndex}>{index + 1}</Text>
              </View>
              <View style={styles.featureCopy}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>

      <PrimaryButton
        label="Meet your vocal coach"
        variant="ghost"
        onPress={() => router.push('/coach')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.55,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.hero,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.primaryBright,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h1,
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  cardBody: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  cta: {
    marginTop: spacing.xs,
  },
  toolsCta: {
    marginTop: spacing.sm,
  },
  featureList: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  featureBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIndex: {
    ...typography.bodyBold,
    color: colors.accent,
    fontSize: 14,
  },
  featureCopy: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    ...typography.h3,
  },
  featureDesc: {
    ...typography.bodySmall,
  },
});
