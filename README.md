# QAPI Live Console

Portfolio-ready dashboard for monitoring and executing REST, GraphQL, and WebSocket API calls.

## Quick start

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

This repo is configured for GitHub Pages via Actions.

1. Push to `main`.
2. In GitHub: Settings → Pages → Source = GitHub Actions.
3. Your site will be available at `https://murdadrum.github.io/QAPI/`.

Optional manual deploy (uses `gh-pages`):

```bash
npm run deploy
```

## Notes

- Auth tokens and API keys are stored in `localStorage` for demo convenience.
- Monitoring pings are sent every 10 seconds for enabled requests.
