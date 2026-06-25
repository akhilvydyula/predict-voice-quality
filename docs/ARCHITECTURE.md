# Architecture

VocalIQ is an Expo (React Native) app with optional Express API and static web deployment.

![System architecture](./images/architecture.png)

> GitHub does not render SVG in README files. Use `architecture.png` for docs, or view `architecture.svg` locally.

## Client layers

```
┌─────────────────────────────────────────────────────────┐
│  Routes (expo-router)                                   │
│  Landing · Tabs: Dashboard · Session · Analytics · …    │
├─────────────────────────────────────────────────────────┤
│  UI components (src/components)                         │
│  PitchMeter · ScoreRing · charts · tools · landing      │
├─────────────────────────────────────────────────────────┤
│  State (React Context)                                  │
│  VoiceAnalysisContext · DevModeContext                    │
├─────────────────────────────────────────────────────────┤
│  Audio pipeline (src/audio)                             │
│  Mic stream → YIN pitch → voiceQuality scoring          │
├─────────────────────────────────────────────────────────┤
│  Persistence (src/storage)                              │
│  AsyncStorage / web KV · session history                │
└─────────────────────────────────────────────────────────┘
```

## Live practice flow

1. User taps **Start** on the Practice screen.
2. `useVoiceAnalysis` opens the microphone (`expo-audio` on native, Web Audio on web).
3. Audio frames pass through **YIN pitch detection** (`yinPitch.ts`).
4. `voiceQuality.ts` computes pitch accuracy, stability, breath, tone, vibrato, dynamics.
5. UI updates in real time: `PitchMeter`, `MetricCard`, `ScoreRing`.
6. On stop, session summary + coaching insights are saved locally.
7. Optional: sync to `server/` via `src/api`.

## Voice metrics

| Metric | Signal basis |
|--------|----------------|
| Pitch accuracy | Cents deviation from nearest note |
| Stability | Variance while holding pitch |
| Breath control | RMS / volume consistency |
| Tone clarity | Harmonic confidence from YIN |
| Vibrato | Periodic pitch modulation |
| Dynamics | Volume range over session |

## Optional API

The `server/` package provides REST endpoints for profile and session backup. It is **not required** for core functionality — the web app runs fully client-side.

Endpoints:

- `GET /health`
- `GET/POST /profile`
- `GET/POST /sessions`

## Web deployment

1. `expo export --platform web` → `dist/`
2. `scripts/prepare-cloudflare-dist.mjs` rewrites asset paths (Cloudflare skips `node_modules` in URLs)
3. Deploy to Cloudflare Pages via Wrangler or GitHub Actions

## Design system

Light Meegle-inspired tokens in `src/theme/colors.ts` and `src/theme/landing.ts` (aliases). Typography: Space Grotesk + DM Sans.

See also: [OPEN_SOURCE_INVENTORY.md](./OPEN_SOURCE_INVENTORY.md)
