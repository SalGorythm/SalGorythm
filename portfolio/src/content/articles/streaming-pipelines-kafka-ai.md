Real-time AI features fail quietly when the data path is batch-only. A RAG agent answering from yesterday's index is fine for internal docs; it is not fine when the question is "what changed on this endpoint in the last hour?" At IBM and in EY delivery work, the pattern that held up was Kafka (often Confluent-managed) feeding PostgreSQL feature tables and agent context windows—with explicit contracts on freshness, idempotency, and schema evolution.

## The shape of the pipeline

Think in three layers:

1. **Ingress**: agents, APIs, or ETL jobs emit domain events (inventory delta, alert fired, connector sync complete).
2. **Stream processing**: consumers enrich, dedupe, and aggregate into feature-ready records.
3. **Serving**: PostgreSQL (or a dedicated feature store) exposes low-latency reads for APIs and agent tools.

A simplified event for endpoint telemetry:

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "endpoint.inventory_delta",
  "machine_id": "WIN-ACME-0042",
  "occurred_at": "2026-02-27T14:32:01Z",
  "payload": {
    "software_added": [{"name": "CrowdStrike", "version": "7.2"}],
    "software_removed": []
  },
  "schema_version": 3
}
```

`event_id` plus `machine_id` gave us idempotency keys. `schema_version` saved us when connector payloads evolved—consumers could branch or reject unknown versions instead of corrupting downstream tables.

## Kafka topics and consumer design

We partitioned by `machine_id` (or tenant ID in multi-client setups) so related events stayed ordered per entity. Global ordering is rarely worth the cost; per-entity ordering usually is.

Consumer groups scaled horizontally, but partition count set the ceiling. Rule of thumb: start with partitions ≈ expected peak consumer count, revisit after load tests.

```python
from confluent_kafka import Consumer, Producer
import json

conf = {
    "bootstrap.servers": KAFKA_BROKERS,
    "group.id": "feature-store-writer",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
}

consumer = Consumer(conf)
consumer.subscribe(["endpoint.events.v1"])

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue
    event = json.loads(msg.value())
    if already_processed(event["event_id"]):
        consumer.commit(msg)
        continue
    upsert_feature_row(event)
    mark_processed(event["event_id"])
    consumer.commit(msg)
```

Manual commit after successful PostgreSQL write prevented the classic "lost update on crash" failure. A small dedupe table (or Redis with TTL for hot paths) tracked processed `event_id`s.

## PostgreSQL as the serving layer

Kafka is not your query engine. We materialized rolling windows and latest-state tables in PostgreSQL:

- `endpoint_software_latest` — one row per machine, updated on each delta
- `endpoint_alerts_24h` — time-bucketed counts for anomaly features
- `agent_context_snapshots` — pre-built JSON blobs for RAG tools, refreshed on meaningful change

Indexes matched read patterns: `(tenant_id, machine_id)` for point lookups, `(occurred_at DESC)` for time-range scans. Connection pooling on the API side—never per-request engines—kept read latency stable under agent burst traffic.

## Feeding agent context windows

Agents do not need every event. They need the right slice, fresh enough to be trustworthy. We built a `ContextAssembler` that:

1. Subscribed to change notifications (via NOTIFY/LISTEN or a lightweight poll on `updated_at`)
2. Pulled the latest feature row plus last N events for the entity
3. Trimmed to token budget with deterministic ordering (newest structural changes first, then alerts)

```python
def build_agent_context(machine_id: str, max_tokens: int = 4000) -> str:
    latest = db.fetch_latest_inventory(machine_id)
    recent = db.fetch_events(machine_id, since=hours_ago(24), limit=50)
    blocks = [format_inventory(latest), format_event_summary(recent)]
    return trim_to_token_budget("\n\n".join(blocks), max_tokens)
```

Freshness SLA was explicit: "context reflects state within 60 seconds of event ingestion" for operational tools. Anything looser got labeled in the UI so humans did not treat stale context as ground truth.

## Schema evolution without pipeline fires

Fifteen connector types at EY meant schema drift was normal, not exceptional. Practices that worked:

- **Versioned payloads** in every message (`schema_version`)
- **Compat checks** in CI: old consumers must ignore unknown fields; new consumers must handle N-1 versions during rollout
- **Dead-letter topic** for poison messages—never block the partition on a single bad row

Confluent Schema Registry was worth it when multiple teams produced events. For smaller footprints, disciplined JSON contracts plus contract tests in the repo were enough.

## Operational metrics

Alert on:

- Consumer lag (seconds behind head)
- Dedupe table growth (signals stuck consumers)
- PostgreSQL replication lag if reads hit replicas
- Context assembly p95 latency (agent UX lives here)

During IBM WatsonX-adjacent work, governance reviewers cared about lineage: which event produced which feature row cited in an agent answer. Correlation IDs from Kafka through DB to agent logs closed that loop.


> **Takeaway:** Kafka plus PostgreSQL is a practical backbone for real-time AI features—not because it is fashionable, but because it separates write-heavy ingestion from read-heavy serving while keeping per-entity ordering and idempotency explicit. Stream the deltas; materialize the features; assemble agent context with a freshness contract you can defend in audit.
