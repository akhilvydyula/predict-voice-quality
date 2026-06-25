# Documentation images

Visual assets for README, GitHub social preview, and contributor docs.

| File | Dimensions | Description |
|------|------------|-------------|
| [hero-banner.png](./hero-banner.png) | 16:9 | Repository hero — VocalIQ branding, pitch lane, score ring |
| [dashboard-screen.png](./dashboard-screen.png) | wide | Dashboard UI preview — KPIs and quick actions |
| [practice-screen.png](./practice-screen.png) | mobile | Practice studio — pitch meter and score ring |
| [architecture.png](./architecture.png) | vector / PNG | Client · optional API · deploy diagram |
| [architecture.svg](./architecture.svg) | vector | Editable source (view locally; not shown on GitHub README) |
| [app-icon.png](./app-icon.png) | square | App icon used in docs |

## Usage in README

```markdown
![VocalIQ hero](./docs/images/hero-banner.png)
```

## Regenerating assets

- **Hero / screenshots:** Replace PNGs in this folder; keep filenames for stable README links.
- **Architecture:** Edit `architecture.svg` directly (no build step).
- **App icons:** Source of truth is `assets/` at repo root; copy `icon.png` here when updated.

## License

Documentation images in this folder are released under the same [MIT license](../../LICENSE) as the project unless noted otherwise.
