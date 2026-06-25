# Open source inventory — VocalIQ

This document lists everything included in the [VocalIQ](https://github.com/akhilvydyula/predict-voice-quality) open-source repository: source modules, assets, documentation, dependencies, and deployment artifacts.

**License:** [MIT](../LICENSE)  
**Live demo:** https://predict-voice-quality.pages.dev  
**Primary language:** TypeScript (Expo SDK 56, React Native)

---

## 1. Application overview

| Item | Description |
|------|-------------|
| **Product name** | VocalIQ |
| **Package name** | `predict-voice-quality` |
| **Purpose** | Real-time vocal training: pitch, tone, breath, coaching, analytics |
| **Platforms** | Web (primary), iOS & Android via Expo |
| **Privacy model** | Audio analyzed on-device; optional API sync |

---

## 2. Source code inventory

### Client app (`app/`)

| Path | Purpose |
|------|---------|
| `app/index.tsx` | Marketing landing page |
| `app/_layout.tsx` | Root stack, fonts, splash |
| `app/(tabs)/_layout.tsx` | Tab navigator (Home, Practice, Progress, Coach, Tools) |
| `app/(tabs)/dashboard.tsx` | Home dashboard, KPIs, quick actions |
| `app/(tabs)/session.tsx` | Live practice studio |
| `app/(tabs)/analytics.tsx` | Progress charts and session history |
| `app/(tabs)/coach.tsx` | Coaching plans and milestones |
| `app/(tabs)/tools.tsx` | Tuner, metronome, scales, breath coach |
| `app/(tabs)/architect.tsx` | Developer / debug tools (hidden tab) |

### Shared client code (`src/`)

| Path | Purpose |
|------|---------|
| `src/audio/yinPitch.ts` | YIN pitch detection |
| `src/audio/voiceQuality.ts` | Scoring: pitch, stability, breath, tone, vibrato, dynamics |
| `src/audio/musicTheory.ts` | Note labels, cents, pitch accuracy helpers |
| `src/audio/advancedAnalytics.ts` | Extended session analytics |
| `src/audio/scales.ts` | Scale patterns for practice tools |
| `src/audio/webMicrophoneStream.ts` | Web microphone capture |
| `src/hooks/useVoiceAnalysis.ts` | Live session orchestration |
| `src/hooks/useMetronome.ts` | Metronome timing |
| `src/hooks/useBreathCoach.ts` | Breath exercise pacing |
| `src/agent/vocalCoachAgent.ts` | Rule-based coaching agent |
| `src/agent/singerProfile.ts` | Singer profile aggregation |
| `src/analytics/sessionAnalytics.ts` | Dashboard metrics and trends |
| `src/context/VoiceAnalysisContext.tsx` | Global voice session state |
| `src/context/DevModeContext.tsx` | Dev mode unlock |
| `src/storage/sessionStore.ts` | Local session persistence |
| `src/storage/kvStorage*.ts` | Cross-platform key-value storage |
| `src/api/*` | Optional backend sync client |
| `src/theme/*` | Design tokens (light Meegle-style) |
| `src/components/**` | UI, charts, tools, landing page |

### Optional API (`server/`)

| Path | Purpose |
|------|---------|
| `server/src/index.ts` | Express REST API |
| `server/src/store.ts` | In-memory profile/session store |
| `server/src/profileLogic.ts` | Profile merge logic |
| `server/src/types.ts` | API types |

### Build & deploy

| Path | Purpose |
|------|---------|
| `scripts/prepare-cloudflare-dist.mjs` | Cloudflare Pages asset path fix |
| `wrangler.toml` | Wrangler / Pages config |
| `public/_redirects`, `public/_headers` | SPA routing & headers |
| `.github/workflows/deploy-cloudflare.yml` | CI deploy to Cloudflare Pages |

---

## 3. Documentation inventory

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | Project overview, quick start, screenshots |
| [LICENSE](../LICENSE) | MIT license |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | How to contribute |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community standards |
| [SECURITY.md](../SECURITY.md) | Vulnerability reporting |
| [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | Dependency licenses |
| [docs/ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |
| [docs/images/README.md](./images/README.md) | Image & media catalog |

---

## 4. Image & media inventory

All marketing and documentation visuals live in [`docs/images/`](./images/).

| File | Use |
|------|-----|
| `hero-banner.png` | README hero / social preview |
| `dashboard-screen.png` | Dashboard feature preview |
| `practice-screen.png` | Live practice feature preview |
| `architecture.svg` | System architecture diagram |
| `app-icon.png` | App icon (copy of `assets/icon.png`) |

### App store / build assets (`assets/`)

| File | Use |
|------|-----|
| `icon.png` | Expo app icon |
| `splash-icon.png` | Splash screen |
| `favicon.png` | Web favicon |
| `android-icon-foreground.png` | Android adaptive icon |
| `android-icon-background.png` | Android adaptive background |
| `android-icon-monochrome.png` | Android monochrome icon |

---

## 5. Runtime dependencies (summary)

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for the full list.

| Category | Key packages |
|----------|----------------|
| Framework | `expo` ~56, `expo-router`, `react-native` |
| UI | `@expo/vector-icons`, `react-native-svg`, `expo-linear-gradient` |
| Audio | `expo-audio` |
| Fonts | `@expo-google-fonts/dm-sans`, `@expo-google-fonts/space-grotesk` |
| Animation | `react-native-reanimated` |
| Deploy | `wrangler` (dev) |

Server optional deps: `express`, `cors`.

---

## 6. Environment & secrets

| Variable | Where | Required |
|----------|-------|----------|
| `EXPO_PUBLIC_API_URL` | Client | No — local-first works without API |
| `PORT` | Server | No (default 3001) |
| `API_KEY` | Server | No — optional auth |
| `CLOUDFLARE_API_TOKEN` | CI only | For deploy workflow |
| `CLOUDFLARE_ACCOUNT_ID` | CI only | For deploy workflow |

Never commit `.env`, API keys, or credentials.

---

## 7. What is **not** included

- Pre-recorded audio samples or copyrighted sheet music
- Cloud-hosted user database (API uses in-memory store by default)
- Proprietary ML models — scoring is deterministic signal processing
- App Store / Play Store listing assets beyond `assets/`

---

## 8. Trademarks

**VocalIQ** is the product name used in this repository. Third-party names (Expo, Cloudflare, etc.) belong to their respective owners.

---

## 9. How to cite this project

```bibtex
@software{vocaliq2026,
  author = {Vydyula, Akhil},
  title = {VocalIQ: Open-source real-time vocal training},
  year = {2026},
  url = {https://github.com/akhilvydyula/predict-voice-quality}
}
```

Or in plain text:

> VocalIQ — open-source vocal training app. https://github.com/akhilvydyula/predict-voice-quality
