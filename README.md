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

## Professional Contact Form (Cloudflare Worker + Resend)

GitHub Pages is static, so the contact form should call a serverless API instead of `mailto`.

This repo includes a Worker at `workers/contact-api/worker.js` with CORS, validation, spam honeypot, and Resend delivery.

### 1. Prerequisites

1. Create a [Resend](https://resend.com/) account and verify your sending domain.
2. Install Wrangler globally:

```bash
npm i -g wrangler
```

3. Login to Cloudflare:

```bash
wrangler login
```

### 2. Configure secrets and deploy

From `workers/contact-api`:

```bash
cd workers/contact-api
wrangler secret put RESEND_API_KEY
wrangler deploy
```

After deploy, copy your Worker URL (example: `https://contact-api.<subdomain>.workers.dev/api/contact`).

### 3. Wire the frontend endpoint

In `index.html` (and mirrored inline files), update the fallback endpoint in the contact script:

```js
const contactEndpoint =
  window.CONTACT_API_ENDPOINT ||
  "https://contact-api.remotelyamused.workers.dev/api/contact";
```

Replace that URL with your actual deployed Worker URL.

## Notes

- Auth tokens and API keys are stored in `localStorage` for demo convenience.
- Monitoring pings are sent every 10 seconds for enabled requests.
