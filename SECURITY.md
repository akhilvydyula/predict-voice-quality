# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ Active development |
| Tagged releases | ✅ When published |

## Reporting a vulnerability

**Please do not open public GitHub issues for security vulnerabilities.**

Instead:

1. Use [GitHub Security Advisories](https://github.com/akhilvydyula/predict-voice-quality/security/advisories/new) (preferred), or
2. Open a private report via GitHub **Report repository** → **Report security vulnerability**

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment (data exposure, RCE, etc.)
- Affected paths (client, `server/`, CI, deploy)

We aim to acknowledge reports within **72 hours** and provide a fix or mitigation timeline when possible.

## Security model

### Client (VocalIQ app)

- **Microphone audio** is processed on-device by default.
- **Local storage** uses AsyncStorage / web storage for session history.
- No account system in the default configuration.

### Optional API (`server/`)

- In-memory store — not suitable for production multi-tenant use without hardening.
- Optional `API_KEY` header authentication via `API_KEY` env var.
- Bind to `0.0.0.0:$PORT` in production; use TLS via reverse proxy.

### CI / deploy

- Cloudflare deploy uses repository secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
- Do not commit tokens or `.env` files.

## Recommended practices for self-hosters

- Serve web app over **HTTPS** (required for microphone on most browsers).
- Set `API_KEY` if exposing the optional API publicly.
- Keep dependencies updated: `npm audit`, Dependabot.
- Review [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for license compliance.

## Disclosure policy

We follow coordinated disclosure: we will work with reporters on a fix before public announcement when feasible.
