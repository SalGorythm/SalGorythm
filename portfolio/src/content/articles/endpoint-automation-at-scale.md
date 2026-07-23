Atom Bot taught me that "scale" in enterprise endpoint automation rarely means a bigger server. It means 25,000 heterogeneous machines across Windows, macOS, and Linux; concurrent uploads fighting for the same database rows; field agents on three versions because IT rolls out on geological time; and security reviewers who ask excellent, uncomfortable questions about every byte you collect. This article captures what broke first, what held up, and the patterns I would reuse on the next cross-OS agent program.

## What "25k endpoints" actually implies

Headline numbers hide distribution. A few thousand endpoints may be virtual desktops that reboot nightly; another cohort runs legacy OS builds with broken certificate stores; a subset never checks in because they sit on air-gapped subnets. Your architecture must assume partial connectivity, duplicate reports, and schema drift from fifteen connector types ingesting vendor-specific JSON.

Design for **idempotency** and **explicit versioning** from day one—not as retrofit after the first duplicate-key outage.

## What broke first

**Concurrent write contention on PostgreSQL.** Early ingestion used naive upserts keyed only by machine hostname. During business hours, thousands of agents reported simultaneously; hot rows on shared inventory tables created lock waits that cascaded into API timeouts. Agents retried; retries amplified load.

**Agent version skew in the field.** Silent auto-update is a fantasy in many enterprises. We ran three agent builds concurrently for months. Payload schemas diverged; server-side parsers assumed the latest shape; parse failures clustered on older builds we thought were extinct.

**ETL schema drift from connectors.** Each connector (EDR, MDM, asset registry) evolved independently. Optional fields became required in vendor APIs; nested objects gained new keys. Batch jobs succeeded while silently dropping fields because pydantic models used overly strict schemas—or the opposite, overly permissive models that hid corruption until dashboards looked wrong.

## What worked

**Idempotent ingestion keys.** Composite keys combined machine id, report type, and ingestion window start (rounded to the minute). Upserts became safe under retry storms.

```python
def ingestion_key(payload: AgentReport) -> str:
    window = payload.collected_at.replace(second=0, microsecond=0)
    return f"{payload.machine_id}:{payload.report_type}:{window.isoformat()}"
```

**Redis for hot deduplication paths.** Before hitting PostgreSQL, a short-TTL Redis SETNX gate dropped duplicate bursts from the same agent within a 30-second window. This was not the source of truth—just shock absorption.

**Explicit connector version in every payload.** Every POST included `agent_version`, `connector_id`, and `connector_schema_version`. Server routes selected parsers by version tuple, not by "latest." Deprecated parsers stayed deployed until telemetry showed zero traffic for 30 days.

```json
{
  "agent_version": "2.14.0",
  "connector_id": "crowdstrike_assets",
  "connector_schema_version": 3,
  "machine_id": "...",
  "collected_at": "2026-04-02T14:00:00Z",
  "data": { }
}
```

**Back-pressure on the API.** Rate limits per tenant and adaptive 429 responses with `Retry-After` headers prevented heroic agents from DDoS-ing their own backend. Client SDKs honored jittered exponential backoff—non-negotiable in the agent installer.

## Concurrent API design lessons

FastAPI async endpoints help, but CPU-bound parsing still belongs in worker pools. We separated **accept** (validate signature, enqueue) from **process** (normalize, enrich, persist). Accept path stayed under 50ms P95; processing lag became a queue metric you could alert on instead of a user-facing timeout.

Use bulk insert paths for high-volume telemetry (heartbeat rows), and transactional upserts for inventory state. Mixing both in one table without partition strategy is a regret I carry.

## ETL accuracy under scrutiny

Security and compliance teams do not care that your pipeline is "mostly accurate." They care about data minimization, retention, lineage, and provable transformation logic.

Document before review—not after:

- Which fields are collected and why each is necessary.
- On-device filtering vs server-side storage (collect less, aggregate early when possible).
- Retention windows and deletion mechanics (not just policy PDFs).
- How corrections propagate when a machine is re-imaged or hostname changes.

We reduced manual data handling roughly 40% in the program, but that number only landed with auditors because we could show **before/after workflows** and **error rates by OS version**, not because we claimed AI magic.

## Metrics that mattered

Vanity metrics ("messages processed") did not keep us honest. These did:

- **Parse failure rate by OS and agent version** — early warning for skew.
- **P95 upload latency and queue age** — user trust in the agent.
- **Duplicate suppression rate** — sanity check on idempotency design.
- **Manual reconciliation tickets per week** — ultimate ground truth for ETL quality.

Dashboards per tenant prevented one noisy customer from masking systemic regression.

## Security review prep as engineering work

Treat review as a milestone with acceptance criteria. Provide sequence diagrams for agent registration, cert pinning, update channels, and incident response (how to revoke a compromised agent build). Reviewers reward clarity; they punish surprises discovered in pen test week.


> **Takeaway:** Endpoint automation is distributed systems work with an installer. Respect concurrency, schema evolution, and audit from day one. Version everything, idempotent everything, and measure the failures that field reality guarantees you will see.
