# Voice Quality — Mobile App

Real-time singing analysis for **iOS** and **Android**. Measures pitch accuracy, stability, breath control, and tone clarity while you sing.

## What it does

- **Live pitch meter** — shows current note, Hz, and sharp/flat in cents
- **Overall voice score** — weighted blend of four singing dimensions
- **Coaching tips** — suggests what to improve based on your weakest metric
- **On-device processing** — microphone audio is analyzed on your phone (not sent to a server)

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your **iPhone or Android phone**
- A computer on the same Wi‑Fi network (for development)

> **Note:** Live microphone streaming uses native `expo-audio` APIs. It works on a physical phone via Expo Go; it does **not** work in the web preview.

## Run on your phone

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm start
   ```

3. Scan the QR code with **Expo Go** (Android) or the **Camera** app (iOS).

4. Open **Start Live Session**, allow microphone access, and sing.

## Project structure

```
app/
  index.tsx      # Home — what we measure
  session.tsx    # Live singing session
src/
  audio/         # Pitch detection (YIN) + scoring
  hooks/         # useVoiceAnalysis
  components/    # Pitch meter, metrics, score ring
```

## Voice quality dimensions

| Metric | What we measure |
|--------|-----------------|
| Pitch | How close notes are to correct pitch (cents) |
| Stability | Steadiness when holding notes |
| Breath | Even volume / support through phrases |
| Tone | Signal clarity (harmonic confidence) |

## Next steps (roadmap)

- Song mode — compare against a reference melody
- Vibrato and dynamics analysis
- Session history and progress charts
- Standalone builds via EAS (`eas build`)

## Build for production

```bash
npx eas build --platform android
npx eas build --platform ios
```

You’ll need an [Expo account](https://expo.dev/signup) and EAS CLI for store-ready builds.
