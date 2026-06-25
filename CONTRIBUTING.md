# Contributing to VocalIQ

Thank you for helping improve VocalIQ! This project is open source under the [MIT License](LICENSE).

## Ways to contribute

- **Bug reports** — use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- **Feature ideas** — use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- **Pull requests** — fixes, docs, tests, new tools, UI polish
- **Documentation** — README, architecture, images in `docs/images/`

## Development setup

```bash
git clone https://github.com/akhilvydyula/predict-voice-quality.git
cd predict-voice-quality
npm install
npm run web          # or npm start for Expo Go
```

Optional API:

```bash
npm install --prefix server
npm run api
```

## Before you open a PR

1. **Scope** — One logical change per PR (feature, fix, or docs).
2. **Build** — Run `npm run build:web` for UI/routing changes.
3. **Conventions** — Match existing TypeScript, Expo Router, and theme patterns in `src/theme/`.
4. **No secrets** — Never commit `.env`, API keys, or credentials.
5. **Docs** — Update README or `docs/` if behavior or setup changes.

## Code style

- TypeScript strict mode
- Functional React components + hooks
- Theme tokens from `src/theme/colors.ts` — avoid hardcoded colors
- Minimal comments; code should be self-explanatory
- Follow [Expo SDK 56 docs](https://docs.expo.dev/versions/v56.0.0/) for platform APIs

## Project areas

| Area | Path | Good first issues |
|------|------|-------------------|
| Audio / scoring | `src/audio/` | Pitch algorithm tuning, new metrics |
| Practice UI | `app/(tabs)/session.tsx` | UX, accessibility |
| Tools | `src/components/tools/` | New singer utilities |
| Analytics | `src/analytics/` | Charts, exports |
| Docs / images | `docs/` | Diagrams, tutorials |

## Commit messages

Use clear, imperative subjects:

```
fix: center score ring on wide web layout
feat: add JSON session export
docs: update Cloudflare deploy steps
```

## Code of conduct

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions?

Open a [GitHub Discussion](https://github.com/akhilvydyula/predict-voice-quality/discussions) or an issue with the `question` label.
