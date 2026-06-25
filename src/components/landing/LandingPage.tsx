import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
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

import { landing as L } from '../../theme/landing';
import { layout } from '../../theme/layout';
import { radius, spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

const SHOWCASE = [
  {
    tag: 'Linked.',
    headline: 'Every note.',
    body: 'Tired of guessing if you’re in tune? Watch pitch, cents, and intonation flow in one continuous live pipeline.',
    icon: 'git-network-outline' as const,
    tint: L.primary,
  },
  {
    tag: 'Connected.',
    headline: 'Every session.',
    body: 'Losing track of progress? VocalIQ links practice, analytics, and coaching so every rep builds on the last.',
    icon: 'people-outline' as const,
    tint: '#06B6D4',
  },
  {
    tag: 'Launched.',
    headline: 'Every goal.',
    body: 'Ready to level up? Personalised practice plans and milestones guide you from warm-up to performance-ready.',
    icon: 'rocket-outline' as const,
    tint: L.accent,
  },
];

const PRODUCT_FEATURES = [
  { key: 'Practice', icon: 'mic-outline' as const },
  { key: 'Pitch', icon: 'pulse-outline' as const },
  { key: 'Metrics', icon: 'analytics-outline' as const },
  { key: 'Coach', icon: 'school-outline' as const },
  { key: 'Toolkit', icon: 'construct-outline' as const },
  { key: 'Charts', icon: 'bar-chart-outline' as const },
];

const PERSONAS = [
  {
    key: 'singer',
    label: 'Singer',
    title: 'You’re building your voice. Train with clarity.',
    body: 'Move beyond guesswork to real-time pitch feedback, session scores, and streaks that keep you showing up.',
    bullets: ['Live pitch & intonation', 'Session history & trends', 'Personal practice plans'],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    title: 'You guide others. Give them measurable progress.',
    body: 'Use objective metrics and session summaries to complement ear training and give students clear targets.',
    bullets: ['Skill breakdown charts', 'Exportable session data', 'Structured warm-up tools'],
  },
  {
    key: 'hobbyist',
    label: 'Hobbyist',
    title: 'You sing for joy. Make every session count.',
    body: 'Jump in from the browser, sing a few minutes, and see instant feedback — no studio or account required.',
    bullets: ['Free browser practice', 'On-device privacy', 'Tuner, metronome & scales'],
  },
];

export function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isTablet = width >= 640;
  const [persona, setPersona] = useState('singer');
  const activePersona = PERSONAS.find((p) => p.key === persona) ?? PERSONAS[0];

  const goTo = (path: string) => router.push(path as Href);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={[styles.nav, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.navInner}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <Ionicons name="mic" size={16} color="#FFF" />
              </View>
              <Text style={styles.logoText}>VocalIQ</Text>
            </View>
            <View style={styles.navActions}>
              <Pressable onPress={() => goTo('/dashboard')} style={styles.navLink}>
                <Text style={styles.navLinkText}>Sign in</Text>
              </Pressable>
              <Pressable
                onPress={() => goTo('/session')}
                style={({ pressed }) => [styles.navPrimary, pressed && styles.pressed]}
              >
                <Text style={styles.navPrimaryText}>Get started — it&apos;s free</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroInner}>
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleLg]}>
              Vocal training,{'\n'}visualized.
            </Text>
            <Text style={styles.heroSubtitle}>
              Set direction, track every note, reach your goals, measure growth — do it all with VocalIQ.
            </Text>
            <Pressable
              onPress={() => goTo('/session')}
              style={({ pressed }) => [styles.heroCta, pressed && styles.pressed]}
            >
              <Text style={styles.heroCtaText}>Get started. It&apos;s FREE.</Text>
            </Pressable>

            <View style={styles.heroMock}>
              <View style={styles.mockWindow}>
                <View style={styles.mockChrome}>
                  <View style={styles.mockDots}>
                    <View style={[styles.mockDot, { backgroundColor: '#FF5F57' }]} />
                    <View style={[styles.mockDot, { backgroundColor: '#FFBD2E' }]} />
                    <View style={[styles.mockDot, { backgroundColor: '#28CA41' }]} />
                  </View>
                  <Text style={styles.mockUrl}>vocaliq.app / practice</Text>
                </View>
                <View style={styles.mockBody}>
                  <View style={styles.mockSidebar}>
                    {['Dashboard', 'Practice', 'Analytics', 'Coach', 'Tools'].map((item, i) => (
                      <View key={item} style={[styles.mockNavItem, i === 1 && styles.mockNavActive]}>
                        <Text style={[styles.mockNavText, i === 1 && styles.mockNavTextActive]}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.mockMain}>
                    <Text style={styles.mockNote}>A4</Text>
                    <View style={styles.mockLane}>
                      <View style={styles.mockMarker} />
                    </View>
                    <View style={styles.mockScores}>
                      <View style={styles.mockRing}>
                        <Text style={styles.mockRingVal}>87</Text>
                      </View>
                      <View style={styles.mockBars}>
                        {['Pitch 92', 'Tone 84', 'Breath 79'].map((b) => (
                          <Text key={b} style={styles.mockBarLabel}>
                            {b}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionHeadTitle}>Experience vocals like never before</Text>
        </View>

        {SHOWCASE.map((item, index) => {
          const reversed = isWide && index % 2 === 1;
          return (
            <View
              key={item.tag}
              style={[styles.showcaseSection, index % 2 === 1 && styles.showcaseSectionAlt]}
            >
              <View
                style={[
                  styles.showcaseRow,
                  isWide && styles.showcaseRowWide,
                  reversed && styles.showcaseRowReverse,
                ]}
              >
                <View style={styles.showcaseCopy}>
                  <Text style={[styles.showcaseTag, { color: item.tint }]}>{item.tag}</Text>
                  <Text style={styles.showcaseHeadline}>{item.headline}</Text>
                  <Text style={styles.showcaseBody}>{item.body}</Text>
                </View>
                <View style={[styles.showcaseVisual, isWide && styles.showcaseVisualWide]}>
                  <View style={[styles.showcaseIconWrap, { backgroundColor: `${item.tint}14` }]}>
                    <Ionicons name={item.icon} size={48} color={item.tint} />
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.hubSection}>
          <Text style={styles.hubEyebrow}>All you need for vocal training</Text>
          <Text style={styles.hubTitle}>
            is in <Text style={styles.hubBrand}>VocalIQ</Text>
          </Text>
          <View style={[styles.hubPills, isTablet && styles.hubPillsWide]}>
            {PRODUCT_FEATURES.map((f) => (
              <View key={f.key} style={styles.hubPill}>
                <Ionicons name={f.icon} size={18} color={L.primary} />
                <Text style={styles.hubPillText}>{f.key}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.hubDetail, isWide && styles.hubDetailWide]}>
            <View style={styles.hubDetailCopy}>
              <Text style={styles.hubDetailTitle}>
                Extract and visualize every step from warm-up to performance.
              </Text>
              <Text style={styles.hubDetailBody}>
                Workflow, live metrics, analytics charts, coaching plans, and singer tools — unified in one
                platform built for serious practice.
              </Text>
              <Pressable onPress={() => goTo('/dashboard')} style={styles.hubLink}>
                <Text style={styles.hubLinkText}>Explore all features →</Text>
              </Pressable>
            </View>
            <View style={styles.hubDetailCard}>
              {['Live pitch pipeline', 'Session analytics', 'Singer toolkit', 'AI coach plans'].map(
                (label) => (
                  <View key={label} style={styles.hubFeatureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={L.success} />
                    <Text style={styles.hubFeatureText}>{label}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        <View style={styles.personaSection}>
          <Text style={styles.personaHead}>Together, every step of the way</Text>
          <Text style={styles.personaSub}>
            VocalIQ suits singers at every level, amplifying what makes your voice unique.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.personaTabs}
          >
            {PERSONAS.map((p) => (
              <Pressable
                key={p.key}
                onPress={() => setPersona(p.key)}
                style={[styles.personaTab, persona === p.key && styles.personaTabActive]}
              >
                <Text style={[styles.personaTabText, persona === p.key && styles.personaTabTextActive]}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={[styles.personaCard, isWide && styles.personaCardWide]}>
            <View style={styles.personaCardCopy}>
              <Text style={styles.personaCardTitle}>{activePersona.title}</Text>
              <Text style={styles.personaCardBody}>{activePersona.body}</Text>
              {activePersona.bullets.map((b) => (
                <View key={b} style={styles.personaBullet}>
                  <Ionicons name="checkmark" size={16} color={L.primary} />
                  <Text style={styles.personaBulletText}>{b}</Text>
                </View>
              ))}
              <Pressable onPress={() => goTo('/session')} style={styles.personaCta}>
                <Text style={styles.personaCtaText}>Start free session</Text>
              </Pressable>
            </View>
            <View style={styles.personaVisual}>
              <Ionicons name="mic-circle" size={120} color={L.primarySoft} />
            </View>
          </View>
        </View>

        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Built for privacy and performance</Text>
          <View style={[styles.trustGrid, isTablet && styles.trustGridWide]}>
            {[
              { icon: 'phone-portrait-outline' as const, label: 'Web & mobile' },
              { icon: 'lock-closed-outline' as const, label: 'On-device audio' },
              { icon: 'flash-outline' as const, label: 'Real-time feedback' },
              { icon: 'infinite-outline' as const, label: 'Unlimited sessions' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Ionicons name={t.icon} size={22} color={L.textMuted} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.finalSection}>
          <Text style={styles.finalTitle}>Navigate vocal success with VocalIQ, today.</Text>
          <Text style={styles.finalSub}>Free to use in your browser. No account required.</Text>
          <Pressable
            onPress={() => goTo('/session')}
            style={({ pressed }) => [styles.finalCta, pressed && styles.pressed]}
          >
            <Text style={styles.finalCtaText}>Get started. It&apos;s FREE.</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>VocalIQ</Text>
          <View style={styles.footerLinks}>
            <Pressable onPress={() => goTo('/session')}>
              <Text style={styles.footerLink}>Practice</Text>
            </Pressable>
            <Pressable onPress={() => goTo('/dashboard')}>
              <Text style={styles.footerLink}>Dashboard</Text>
            </Pressable>
            <Pressable onPress={() => goTo('/tools')}>
              <Text style={styles.footerLink}>Toolkit</Text>
            </Pressable>
          </View>
          <Text style={styles.footerCopy}>
            © {new Date().getFullYear()} VocalIQ · On-device vocal analytics
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const webShadow = Platform.OS === 'web' ? ({ boxShadow: L.shadow } as object) : {};
const webShadowLg = Platform.OS === 'web' ? ({ boxShadow: L.shadowLg } as object) : {};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: L.bg },
  pressed: { opacity: 0.88 },

  nav: {
    backgroundColor: L.bg,
    borderBottomWidth: 1,
    borderBottomColor: L.border,
  },
  navInner: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: L.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontFamily: fonts.display, fontSize: 18, fontWeight: '700', color: L.text },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  navLink: { paddingVertical: spacing.sm, paddingHorizontal: spacing.sm },
  navLinkText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: L.textSecondary },
  navPrimary: {
    backgroundColor: L.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  navPrimaryText: { fontFamily: fonts.bodyBold, fontSize: 13, color: '#FFF' },

  heroSection: { backgroundColor: L.bg, paddingVertical: spacing.section },
  heroInner: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    color: L.text,
    textAlign: 'center',
    letterSpacing: -1,
  },
  heroTitleLg: { fontSize: 56, lineHeight: 64 },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 28,
    color: L.textSecondary,
    textAlign: 'center',
    maxWidth: 560,
  },
  heroCta: {
    backgroundColor: L.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  heroCtaText: { fontFamily: fonts.bodyBold, fontSize: 16, color: '#FFF' },

  heroMock: { width: '100%', marginTop: spacing.xxxl, alignItems: 'center' },
  mockWindow: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: L.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: L.border,
    overflow: 'hidden',
    ...webShadowLg,
  },
  mockChrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: L.bgMuted,
    borderBottomWidth: 1,
    borderBottomColor: L.border,
  },
  mockDots: { flexDirection: 'row', gap: 6 },
  mockDot: { width: 10, height: 10, borderRadius: 5 },
  mockUrl: { fontFamily: fonts.body, fontSize: 12, color: L.textMuted },
  mockBody: { flexDirection: 'row', minHeight: 220 },
  mockSidebar: {
    width: 120,
    backgroundColor: L.bgAlt,
    padding: spacing.md,
    gap: spacing.xs,
    borderRightWidth: 1,
    borderRightColor: L.border,
  },
  mockNavItem: { paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
  mockNavActive: { backgroundColor: L.primarySoft },
  mockNavText: { fontFamily: fonts.body, fontSize: 11, color: L.textMuted },
  mockNavTextActive: { fontFamily: fonts.bodyBold, color: L.primary },
  mockMain: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: L.bgAlt,
  },
  mockNote: { fontFamily: fonts.display, fontSize: 36, color: L.text },
  mockLane: {
    width: '90%',
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: L.bgMuted,
    borderWidth: 1,
    borderColor: L.border,
    justifyContent: 'center',
  },
  mockMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00C853',
    alignSelf: 'center',
  },
  mockScores: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  mockRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: L.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockRingVal: { fontFamily: fonts.display, fontSize: 18, color: L.text },
  mockBars: { gap: 4 },
  mockBarLabel: { fontFamily: fonts.body, fontSize: 11, color: L.textMuted },

  sectionHead: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    backgroundColor: L.bgAlt,
  },
  sectionHeadTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 36,
    color: L.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  showcaseSection: {
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.xl,
    backgroundColor: L.bg,
  },
  showcaseSectionAlt: { backgroundColor: L.bgAlt },
  showcaseRow: { width: '100%', maxWidth: layout.maxLandingWidth, alignSelf: 'center', gap: spacing.xxxl },
  showcaseRowWide: { flexDirection: 'row', alignItems: 'center' },
  showcaseRowReverse: { flexDirection: 'row-reverse' },
  showcaseCopy: { flex: 1, gap: spacing.md },
  showcaseTag: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, fontWeight: '700' },
  showcaseHeadline: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: L.text,
    letterSpacing: -0.5,
  },
  showcaseBody: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: L.textSecondary,
    maxWidth: 440,
  },
  showcaseVisual: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
  showcaseVisualWide: { flex: 1 },
  showcaseIconWrap: {
    width: 160,
    height: 160,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...webShadow,
  },

  hubSection: {
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.xl,
    backgroundColor: L.bg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  hubEyebrow: { fontFamily: fonts.body, fontSize: 18, color: L.textSecondary, textAlign: 'center' },
  hubTitle: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 44,
    color: L.text,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  hubBrand: { color: L.primary },
  hubPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  hubPillsWide: { maxWidth: 640 },
  hubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: L.border,
    backgroundColor: L.bgAlt,
  },
  hubPillText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: L.text },
  hubDetail: { width: '100%', maxWidth: layout.maxLandingWidth, gap: spacing.xxl, marginTop: spacing.xxxl },
  hubDetailWide: { flexDirection: 'row', alignItems: 'flex-start' },
  hubDetailCopy: { flex: 1, gap: spacing.md },
  hubDetailTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 22,
    lineHeight: 30,
    color: L.text,
  },
  hubDetailBody: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: L.textSecondary },
  hubLink: { marginTop: spacing.sm },
  hubLinkText: { fontFamily: fonts.bodyBold, fontSize: 15, color: L.primary },
  hubDetailCard: {
    flex: 1,
    backgroundColor: L.bgAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: L.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...webShadow,
  },
  hubFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hubFeatureText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: L.text },

  personaSection: {
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.xl,
    backgroundColor: L.bgAlt,
    alignItems: 'center',
  },
  personaHead: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: L.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  personaSub: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: L.textSecondary,
    textAlign: 'center',
    maxWidth: 520,
    marginBottom: spacing.xl,
  },
  personaTabs: { gap: spacing.sm, paddingBottom: spacing.lg },
  personaTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: L.border,
    backgroundColor: L.bg,
  },
  personaTabActive: { borderColor: L.primary, backgroundColor: L.primarySoft },
  personaTabText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: L.textSecondary },
  personaTabTextActive: { fontFamily: fonts.bodyBold, color: L.primary },
  personaCard: {
    width: '100%',
    maxWidth: layout.maxLandingWidth,
    backgroundColor: L.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: L.border,
    padding: spacing.xxl,
    gap: spacing.xl,
    ...webShadow,
  },
  personaCardWide: { flexDirection: 'row', alignItems: 'center' },
  personaCardCopy: { flex: 1, gap: spacing.md },
  personaCardTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    lineHeight: 32,
    color: L.text,
  },
  personaCardBody: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, color: L.textSecondary },
  personaBullet: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  personaBulletText: { fontFamily: fonts.body, fontSize: 14, color: L.text },
  personaCta: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: L.primary,
    borderRadius: radius.pill,
  },
  personaCtaText: { fontFamily: fonts.bodyBold, fontSize: 14, color: '#FFF' },
  personaVisual: { alignItems: 'center', justifyContent: 'center' },

  trustSection: {
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.xl,
    backgroundColor: L.bg,
    alignItems: 'center',
    gap: spacing.xl,
  },
  trustTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: L.textSecondary,
    textAlign: 'center',
  },
  trustGrid: { gap: spacing.lg, width: '100%', maxWidth: 480 },
  trustGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 720,
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 160 },
  trustLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: L.textSecondary },

  finalSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxxl,
    paddingVertical: spacing.section,
    paddingHorizontal: spacing.xxl,
    backgroundColor: L.primarySoft,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: layout.maxLandingWidth,
    alignSelf: 'center',
    width: '100%',
  },
  finalTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 36,
    color: L.text,
    textAlign: 'center',
  },
  finalSub: { fontFamily: fonts.body, fontSize: 15, color: L.textSecondary, textAlign: 'center' },
  finalCta: {
    backgroundColor: L.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  finalCtaText: { fontFamily: fonts.bodyBold, fontSize: 16, color: '#FFF' },

  footer: {
    borderTopWidth: 1,
    borderTopColor: L.border,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: L.bg,
  },
  footerLogo: { fontFamily: fonts.display, fontSize: 18, color: L.text },
  footerLinks: { flexDirection: 'row', gap: spacing.xl },
  footerLink: { fontFamily: fonts.bodyMedium, fontSize: 14, color: L.textSecondary },
  footerCopy: { fontFamily: fonts.body, fontSize: 12, color: L.textMuted, textAlign: 'center' },
});
