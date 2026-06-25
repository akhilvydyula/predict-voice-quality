import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../ui/PrimaryButton';
import { colors, gradients } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const FEATURES = [
  {
    icon: 'pulse-outline' as const,
    title: 'Live pitch analysis',
    description: 'See your note, cents, and intonation in real time as you sing.',
    color: colors.primary,
  },
  {
    icon: 'sparkles-outline' as const,
    title: 'AI vocal coach',
    description: 'Get session summaries, practice plans, and milestones tailored to you.',
    color: colors.accent,
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Private by design',
    description: 'Audio is processed on your device. Your voice never leaves your session.',
    color: colors.success,
  },
  {
    icon: 'bar-chart-outline' as const,
    title: 'Progress tracking',
    description: 'Trend charts, skill breakdowns, and streaks to keep you motivated.',
    color: '#06B6D4',
  },
];

const STEPS = [
  { step: '01', title: 'Open Practice', text: 'Allow mic access and tap Start recording.' },
  { step: '02', title: 'Sing & learn', text: 'Watch live pitch, scores, and coach tips update instantly.' },
  { step: '03', title: 'Review & grow', text: 'Check analytics and follow your personalised plan.' },
];

export function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const goTo = (path: string) => router.push(path as Href);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...gradients.hero]} style={StyleSheet.absoluteFill} />

      {/* Ambient glow orbs */}
      <View style={[styles.glowOrb, styles.glowOrbPrimary]} pointerEvents="none" />
      <View style={[styles.glowOrb, styles.glowOrbAccent]} pointerEvents="none" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.md }]}
      >
        {/* Nav */}
        <View style={styles.nav}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Ionicons name="mic" size={18} color={colors.text} />
            </View>
            <Text style={styles.logoText}>VocalIQ</Text>
          </View>
          <Pressable
            onPress={() => goTo('/dashboard')}
            style={({ pressed }) => [styles.navCta, pressed && styles.pressed]}
          >
            <Text style={styles.navCtaText}>Open app</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={styles.heroCopy}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Real-time vocal intelligence</Text>
            </View>
            <Text style={[styles.headline, isWide && styles.headlineWide]}>
              Sing smarter.{'\n'}Improve faster.
            </Text>
            <Text style={styles.subheadline}>
              VocalIQ analyses pitch, tone, and technique live — then turns every session into
              actionable coaching. No studio required.
            </Text>
            <View style={[styles.heroActions, isWide && styles.heroActionsWide]}>
              <PrimaryButton
                label="Start practicing"
                subtitle="Free · works in your browser"
                onPress={() => goTo('/session')}
                style={styles.heroPrimary}
              />
              <PrimaryButton
                label="View dashboard"
                variant="secondary"
                onPress={() => goTo('/dashboard')}
                style={styles.heroSecondary}
              />
            </View>
            <View style={styles.trustRow}>
              {['On-device processing', 'No account required', 'Works on web & mobile'].map(
                (item) => (
                  <View key={item} style={styles.trustItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={styles.trustText}>{item}</Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Product preview card */}
          <View style={styles.previewWrap}>
            <LinearGradient
              colors={['rgba(0,102,255,0.2)', 'rgba(255,107,53,0.08)', 'transparent']}
              style={styles.previewGlow}
            />
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewEyebrow}>Live session</Text>
                <View style={styles.previewLive}>
                  <View style={styles.previewLiveDot} />
                  <Text style={styles.previewLiveText}>Ready</Text>
                </View>
              </View>
              <Text style={styles.previewNote}>A4</Text>
              <View style={styles.previewLane}>
                <View style={styles.previewLaneGreen} />
                <View style={styles.previewMarker} />
              </View>
              <Text style={styles.previewStatus}>In tune · +2¢</Text>
              <View style={styles.previewScoreRow}>
                <View style={styles.previewScoreRing}>
                  <Text style={styles.previewScoreValue}>87</Text>
                  <Text style={styles.previewScoreLabel}>Overall</Text>
                </View>
                <View style={styles.previewMetrics}>
                  {[
                    { label: 'Pitch', value: 92 },
                    { label: 'Tone', value: 84 },
                    { label: 'Breath', value: 79 },
                  ].map((m) => (
                    <View key={m.label} style={styles.previewMetric}>
                      <Text style={styles.previewMetricValue}>{m.value}</Text>
                      <Text style={styles.previewMetricLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Why VocalIQ</Text>
          <Text style={styles.sectionTitle}>Everything you need to train seriously</Text>
          <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
            {FEATURES.map((f) => (
              <View key={f.title} style={[styles.featureCard, isWide && styles.featureCardWide]}>
                <View style={[styles.featureIcon, { backgroundColor: `${f.color}18` }]}>
                  <Ionicons name={f.icon} size={22} color={f.color} />
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>How it works</Text>
          <Text style={styles.sectionTitle}>Three steps to better vocals</Text>
          <View style={styles.steps}>
            {STEPS.map((s) => (
              <View key={s.step} style={styles.stepCard}>
                <Text style={styles.stepNum}>{s.step}</Text>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Final CTA */}
        <LinearGradient colors={[...gradients.cta]} style={styles.finalCta}>
          <Text style={styles.finalTitle}>Ready for your first session?</Text>
          <Text style={styles.finalSubtitle}>
            Jump into Practice and hear the difference in under a minute.
          </Text>
          <PrimaryButton
            label="Launch VocalIQ"
            onPress={() => goTo('/session')}
            style={styles.finalButton}
          />
        </LinearGradient>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.footerBrand}>VocalIQ</Text>
          <Text style={styles.footerCopy}>On-device vocal analytics & coaching</Text>
          <Pressable onPress={() => goTo('/dashboard')}>
            <Text style={styles.footerLink}>Go to app →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: spacing.section,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  glowOrbPrimary: {
    width: 320,
    height: 320,
    top: -80,
    right: -60,
    backgroundColor: colors.glowPrimary,
  },
  glowOrbAccent: {
    width: 240,
    height: 240,
    top: 280,
    left: -80,
    backgroundColor: colors.glowAccent,
  },
  nav: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBright,
  },
  logoText: {
    ...typography.h3,
    fontFamily: typography.hero.fontFamily,
    fontSize: 20,
  },
  navCta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceElevated,
  },
  navCtaText: {
    ...typography.bodyBold,
    fontSize: 14,
    color: colors.primaryBright,
  },
  pressed: {
    opacity: 0.85,
  },
  hero: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    paddingHorizontal: spacing.xl,
    gap: spacing.xxxl,
    marginBottom: spacing.section,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxxl,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryBright,
    letterSpacing: 0.5,
  },
  headline: {
    ...typography.hero,
    fontSize: 36,
    lineHeight: 42,
  },
  headlineWide: {
    fontSize: 44,
    lineHeight: 50,
  },
  subheadline: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 480,
  },
  heroActions: {
    gap: spacing.md,
  },
  heroActionsWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroPrimary: {
    minWidth: 220,
    ...(Platform.OS === 'web' ? { maxWidth: 280 } : {}),
  },
  heroSecondary: {
    minWidth: 180,
    ...(Platform.OS === 'web' ? { maxWidth: 220 } : {}),
  },
  trustRow: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trustText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    maxWidth: 380,
    alignSelf: 'center',
  },
  previewGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    opacity: 0.6,
  },
  previewCard: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    gap: spacing.md,
    ...Platform.select({
      web: { boxShadow: '0 24px 48px rgba(0,0,0,0.35)' } as object,
      default: {},
    }),
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewEyebrow: {
    ...typography.caption,
    color: colors.accent,
  },
  previewLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
  },
  previewLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  previewLiveText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.success,
  },
  previewNote: {
    ...typography.metric,
    fontSize: 48,
    textAlign: 'center',
  },
  previewLane: {
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewLaneGreen: {
    position: 'absolute',
    left: '38%',
    width: '24%',
    height: '100%',
    backgroundColor: colors.successSoft,
  },
  previewMarker: {
    position: 'absolute',
    left: '51%',
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  previewStatus: {
    ...typography.bodyMedium,
    textAlign: 'center',
    color: colors.success,
  },
  previewScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  previewScoreRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  previewScoreValue: {
    fontFamily: typography.metric.fontFamily,
    fontSize: 28,
    color: colors.text,
    lineHeight: 32,
  },
  previewScoreLabel: {
    ...typography.caption,
    fontSize: 9,
  },
  previewMetrics: {
    flex: 1,
    gap: spacing.sm,
  },
  previewMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  previewMetricValue: {
    ...typography.bodyBold,
    color: colors.primaryBright,
  },
  previewMetricLabel: {
    ...typography.bodySmall,
  },
  section: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.section,
    gap: spacing.lg,
  },
  sectionEyebrow: {
    ...typography.overline,
    color: colors.accent,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  featureGrid: {
    gap: spacing.md,
  },
  featureGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  featureCardWide: {
    width: '48%',
    flexGrow: 1,
    minWidth: 260,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 17,
  },
  featureDesc: {
    ...typography.body,
    lineHeight: 22,
  },
  steps: {
    gap: spacing.md,
  },
  stepCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  stepNum: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 12,
  },
  stepTitle: {
    ...typography.h3,
    fontSize: 17,
  },
  stepText: {
    ...typography.body,
  },
  finalCta: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    marginHorizontal: spacing.xl,
    borderRadius: radius.lg,
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  finalTitle: {
    ...typography.h1,
    textAlign: 'center',
    color: colors.text,
  },
  finalSubtitle: {
    ...typography.body,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    maxWidth: 400,
  },
  finalButton: {
    marginTop: spacing.sm,
    minWidth: 220,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.lg,
  },
  footerBrand: {
    ...typography.h3,
    fontFamily: typography.hero.fontFamily,
  },
  footerCopy: {
    ...typography.bodySmall,
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.primaryBright,
    marginTop: spacing.sm,
  },
});
