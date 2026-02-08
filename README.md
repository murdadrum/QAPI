# QAPI Live Console

Portfolio-ready dashboard for monitoring and executing REST, GraphQL, and WebSocket API calls.

## Quick start

```bash
npm install
npm run dev
```

## Playwright + Pytest (local E2E)

The QA workflows run Playwright via pytest. To run the same suites locally:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
python -m playwright install --with-deps
```

Run the full suite against the live dev site:

```bash
BASE_URL=https://murdadrum.github.io/QAPI/ pytest -q
```

Run a specific suite (examples):

```bash
BASE_URL=https://murdadrum.github.io/QAPI/ pytest -q -k test_modals_suite
BASE_URL=https://murdadrum.github.io/QAPI/ pytest -q -k test_form_submit_suite
```

Traces are saved to `traces/` on failure; you can open them with:

```bash
python -m playwright show-trace traces/<trace-name>.zip
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
