# Third-party notices

VocalIQ uses open-source software. Below are the primary dependencies and their licenses. For a complete tree, run:

```bash
npm ls --all
npx license-checker --summary
```

## Client application (`package.json`)

| Package | License | Notes |
|---------|---------|-------|
| [Expo](https://expo.dev) (`expo`, `expo-router`, `expo-audio`, etc.) | MIT | Application framework |
| [React](https://react.dev) | MIT | UI library |
| [React Native](https://reactnative.dev) | MIT | Native rendering |
| [react-native-web](https://necolas.github.io/react-native-web/) | MIT | Web target |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | MIT | Charts & score ring |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | MIT | Animations |
| [@expo/vector-icons](https://icons.expo.fyi) | MIT / various icon fonts | Ionicons, etc. |
| [@expo-google-fonts/dm-sans](https://github.com/expo/google-fonts) | OFL-1.1 | DM Sans font |
| [@expo-google-fonts/space-grotesk](https://github.com/expo/google-fonts) | OFL-1.1 | Space Grotesk font |
| [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) | MIT | Local storage |
| [babel-preset-expo](https://github.com/expo/expo) | MIT | Babel preset |
| [TypeScript](https://www.typescriptlang.org/) | Apache-2.0 | Dev dependency |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | MIT OR Apache-2.0 | Cloudflare deploy (dev) |

## Optional API (`server/package.json`)

| Package | License |
|---------|---------|
| [Express](https://expressjs.com/) | MIT |
| [cors](https://github.com/expressjs/cors) | MIT |
| [tsx](https://github.com/privatenumber/tsx) | MIT |

## Fonts

DM Sans and Space Grotesk are loaded via `@expo-google-fonts/*` under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).

## Documentation images

Images in `docs/images/` are original project assets released under the same [MIT License](LICENSE) as VocalIQ unless otherwise noted.

## Attribution

When redistributing VocalIQ or derivatives:

1. Include the [LICENSE](LICENSE) file.
2. Retain this notices file or equivalent dependency attribution.
3. Do not imply endorsement by dependency authors.

For questions about licensing, open an issue or see [CONTRIBUTING.md](CONTRIBUTING.md).
