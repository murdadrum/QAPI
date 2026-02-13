-- BigQuery starter model for CI observability.
-- Source table assumption: ci.events_raw
-- One JSON payload per row in column `payload` (JSON type), ingestion timestamp in `ingested_at`.

-- 1) Flatten workflow run level events.
create or replace view ci.v_workflow_runs as
select
  json_value(payload, '$.repository') as repository,
  json_value(payload, '$.workflow.name') as workflow_name,
  cast(json_value(payload, '$.run.id') as int64) as run_id,
  cast(json_value(payload, '$.run.run_number') as int64) as run_number,
  json_value(payload, '$.run.status') as run_status,
  json_value(payload, '$.run.conclusion') as run_conclusion,
  json_value(payload, '$.run.branch') as branch,
  json_value(payload, '$.run.sha') as sha,
  timestamp(json_value(payload, '$.run.started_at')) as started_at,
  timestamp(json_value(payload, '$.run.completed_at')) as completed_at,
  timestamp_diff(
    timestamp(json_value(payload, '$.run.completed_at')),
    timestamp(json_value(payload, '$.run.started_at')),
    second
  ) as duration_seconds,
  json_value(payload, '$.run.html_url') as run_url
from ci.events_raw
where json_value(payload, '$.event_name') = 'workflow_run'
  and json_value(payload, '$.run.id') is not null;

-- 2) Flatten job level events.
create or replace view ci.v_workflow_jobs as
select
  json_value(payload, '$.repository') as repository,
  json_value(payload, '$.workflow.name') as workflow_name,
  cast(json_value(payload, '$.run.id') as int64) as run_id,
  cast(json_value(payload, '$.job.id') as int64) as job_id,
  json_value(payload, '$.job.name') as job_name,
  json_value(payload, '$.job.status') as job_status,
  json_value(payload, '$.job.conclusion') as job_conclusion,
  json_value(payload, '$.job.runner_name') as runner_name,
  json_value(payload, '$.run.sha') as sha,
  timestamp(json_value(payload, '$.job.started_at')) as started_at,
  timestamp(json_value(payload, '$.job.completed_at')) as completed_at,
  timestamp_diff(
    timestamp(json_value(payload, '$.job.completed_at')),
    timestamp(json_value(payload, '$.job.started_at')),
    second
  ) as duration_seconds
from ci.events_raw
where json_value(payload, '$.event_name') = 'workflow_job'
  and json_value(payload, '$.job.id') is not null;

-- 3) Pass-rate and latency aggregate.
create or replace view ci.v_workflow_health_daily as
select
  repository,
  workflow_name,
  date(started_at) as run_date,
  count(*) as runs,
  countif(run_conclusion = 'success') as runs_success,
  safe_divide(countif(run_conclusion = 'success'), count(*)) as pass_rate,
  approx_quantiles(duration_seconds, 100)[offset(95)] as p95_duration_seconds
from ci.v_workflow_runs
where started_at is not null
group by repository, workflow_name, run_date;

-- 4) Node graph edges for workflow -> job.
create or replace view ci.v_workflow_node_edges as
select
  concat('workflow:', workflow_name) as source,
  concat('job:', job_name) as target,
  count(*) as weight,
  countif(job_conclusion = 'failure') as failures,
  avg(duration_seconds) as avg_duration_seconds
from ci.v_workflow_jobs
where workflow_name is not null
  and job_name is not null
group by source, target;
