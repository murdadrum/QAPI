# CI Observability: Realtime Visualization for GitHub Actions and Docker

This repo now includes a telemetry exporter workflow at:

- `.github/workflows/ci-observability-export.yml`
- `workers/ci-observability-ingest/worker.js`

It emits normalized events for:

- `workflow_run` (requested, in_progress, completed)
- `workflow_job` (queued, in_progress, completed)
- `registry_package` (published, updated; useful for Docker/OCI package publishing in GHCR)

## Recommended Stack

Use two dashboard layers:

1. `Grafana` for realtime operations and node graphs.
2. `Looker Studio + BigQuery` for executive and trend reporting.

Why this split:

- Grafana has a native Node Graph panel suitable for workflow/job dependency visualization.
- Looker Studio is strong for business-friendly charting over warehouse data.
- BigQuery provides low-friction ingestion and SQL modeling for both.

## Quick Start

1. Deploy the Cloudflare ingest Worker:
   - `cd workers/ci-observability-ingest`
   - Generate token: `openssl rand -hex 32`
   - `wrangler secret put INGEST_TOKEN --env ""`
   - Optional: `wrangler secret put DOWNSTREAM_INGEST_TOKEN --env ""` (for downstream bridge auth)
   - `wrangler deploy`
2. Optional R2 persistence profile (after enabling R2 in Cloudflare dashboard):
   - `wrangler r2 bucket create qapi-ci-events` (once)
   - `wrangler deploy --env r2`
3. Add these GitHub repository secrets:
   - `CI_OBSERVABILITY_INGEST_URL`
   - `CI_OBSERVABILITY_INGEST_TOKEN` (required when `INGEST_TOKEN` is set)
4. Point `CI_OBSERVABILITY_INGEST_URL` to:
   - `https://<your-worker-subdomain>.workers.dev/api/ci-events`
5. Set `CI_OBSERVABILITY_INGEST_TOKEN` to match Worker secret `INGEST_TOKEN`.
6. Enable the workflow:
   - `.github/workflows/ci-observability-export.yml`
7. Configure your warehouse ingest path:
   - Option A: Set Worker var `DOWNSTREAM_INGEST_URL` to your BigQuery bridge endpoint.
   - Option B: Batch-load NDJSON from R2 into BigQuery (hourly or daily).
8. Create analytics tables/views using `docs/sql/ci_observability_bigquery.sql`.
9. Connect:
   - Looker Studio to BigQuery views
   - Grafana to BigQuery or Prometheus-compatible layer for low-latency panels

## End-to-End Verification

1. Test ingest endpoint manually:

```bash
curl -i -X POST "https://<your-worker-subdomain>.workers.dev/api/ci-events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INGEST_TOKEN>" \
  -d '{
    "event_id":"manual-test-1",
    "event_name":"workflow_run",
    "repository":"murdadrum/QAPI"
  }'
```

2. Expected response:
   - HTTP `202`
   - JSON `{"ok":true,...}`
3. Trigger GitHub exporter:
   - GitHub Actions -> `CI Observability Export` -> `Run workflow`
4. Confirm worker receives events:
   - `wrangler tail` in `workers/ci-observability-ingest`

## Ingest Worker Contract

Endpoint:

- `POST /api/ci-events`

Auth:

- `Authorization: Bearer <INGEST_TOKEN>`

Minimum payload fields:

- `event_id` (string)
- `event_name` (string)
- `repository` (string)

Healthcheck:

- `GET /healthz`

## Suggested Dashboards

- Pipeline Health (line + bar)
  - Pass rate by workflow/day
  - P95 duration by workflow
  - Failure count by branch
- Realtime Operations (status tiles + timeseries)
  - Running jobs now
  - Queue-to-start latency
  - Median job duration by runner label
- Node Plot (workflow topology)
  - Nodes: workflows/jobs
  - Edges: trigger or stage relationship
  - Weight: failures or runtime
- Docker/Registry (table + trends)
  - Image/package publish frequency
  - Publish failures or long publish duration

## Looker vs Grafana Decision

- Choose `Looker Studio first` if stakeholder reporting is primary and you are already in GCP.
- Choose `Grafana first` if on-call operations and live pipeline triage are primary.
- Use both when you need both executive reporting and operator-grade live views.

## Notes on "Realtime"

- GitHub webhook-like events from Actions are near realtime (seconds to low minutes).
- Looker Studio refresh is not sub-second; it is best for near-realtime and historical trends.
- Grafana is better for fast refresh operations views.

## Vendor References

- GitHub Actions webhook events: https://docs.github.com/en/webhooks/webhook-events-and-payloads
- GitHub Actions API overview: https://docs.github.com/en/rest/actions
- Grafana Node Graph panel: https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/node-graph/
- Looker Studio BigQuery connector: https://support.google.com/looker-studio/answer/6370296
- Looker Studio data freshness / extracts: https://support.google.com/looker-studio/answer/7251119
- Cloudflare Workers + R2: https://developers.cloudflare.com/r2/examples/demo-worker/
