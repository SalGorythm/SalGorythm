Picture a service sitting between agents on thousands of endpoints and a PostgreSQL-backed ingestion pipeline. Requests are bursty—patch Tuesday, audit season, a full inventory refresh at 4pm. FastAPI is not a fashion choice there. It gives you async I/O for auth, validation, and queue handoff while CPU-heavy parsing and ML inference ran elsewhere. The hard part is never "can FastAPI handle concurrency?" It is whether you respect the event loop, size your pools correctly, and tell callers the truth when you are full.

## Why async endpoints are not async inference

FastAPI's `async def` routes are excellent for I/O-bound work: JWT validation, Redis lookups, streaming a response from a worker. They are the wrong place to run a 400ms ONNX pass or a PDF table extractor on the main thread. Blocking the event loop turns your "concurrent" API into a single-lane road.

The pattern we settled on:

```python
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException, status
import asyncio

app = FastAPI()
executor = ThreadPoolExecutor(max_workers=8)

@app.on_event("startup")
async def warm_models():
    # Load once, share across workers
    app.state.model = load_inference_bundle()

@app.post("/v1/classify")
async def classify(payload: ClassifyRequest):
    loop = asyncio.get_running_loop()
    try:
        result = await asyncio.wait_for(
            loop.run_in_executor(
                executor,
                run_inference,
                app.state.model,
                payload.dict(),
            ),
            timeout=30.0,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="inference_timeout")
    return result
```

Key details: model loaded at startup (not per request), executor bounded, explicit timeout. For jobs longer than a few seconds—full endpoint scans, bulk ETL—push work to a Redis-backed queue and return a job ID. Clients poll `/v1/jobs/{id}` or subscribe over WebSocket. That separation keeps p95 latency honest for the fast path while still supporting heavy workloads.

## Back-pressure beats silent degradation

Under load, the worst failure mode is accepting every request and letting queue depth grow until PostgreSQL connection pools exhaust and everything times out together. Operators see a flat 504 wall with no lever to pull.

We tracked in-flight inference count and queue depth. When depth crossed a threshold—tuned per environment—we returned `503 Service Unavailable` with a `Retry-After` header:

```python
MAX_INFLIGHT = 64

@app.middleware("http")
async def backpressure(request: Request, call_next):
    if request.url.path.startswith("/v1/"):
        inflight = await redis.incr("inflight:classify")
        if inflight > MAX_INFLIGHT:
            await redis.decr("inflight:classify")
            return JSONResponse(
                status_code=503,
                content={"error": "overloaded", "retry_after_sec": 5},
                headers={"Retry-After": "5"},
            )
        try:
            return await call_next(request)
        finally:
            await redis.decr("inflight:classify")
    return await call_next(request)
```

Field agents retry with jitter. Load balancers stop hammering a dying pod. Explicit rejection is easier to alert on than "everything is slow."

## Connection pools are application-scoped singletons

Creating a new SQLAlchemy engine or Redis client per request is a classic way to melt a server at scale. Initialize pools once at startup and inject them via FastAPI dependencies:

```python
@app.on_event("startup")
async def init_pools():
    app.state.db = await create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)
    app.state.redis = redis.from_url(REDIS_URL, max_connections=50)

async def get_db(request: Request):
    async with request.app.state.db.connect() as conn:
        yield conn
```

Pool sizing came from load tests, not defaults. PostgreSQL `max_connections` had to account for every replica, every migration job, and every ad-hoc analyst script—not just the API tier.

## Health checks that mean something

A `/health` that always returns 200 is useless during an incident. Ours verified:

- PostgreSQL connectivity with a lightweight query
- Redis ping
- Model warm status (weights loaded, not just process up)
- Optional: queue consumer lag below a ceiling

Use `/health/ready` for Kubernetes traffic routing and `/health/live` for restarts. Sooner or later someone asks what "healthy" means; a documented checklist saves repeated explanation cycles.

## Observability at the boundary

Every request should carry a correlation ID from the caller through ingestion. Log:

- Queue wait time vs inference time (separates capacity from model slowness)
- Parse failure rate by OS and agent version
- 503 rate and Retry-After effectiveness

That split matters when reviewers ask whether slowdowns are model quality issues or infrastructure saturation. The metrics answer before you have to.

## What I would do differently

Earlier investment in structured job results (schema-versioned payloads) would have reduced ETL drift pain when connector types multiplied. I would also standardize on OpenTelemetry from day one—correlation IDs in logs were good; distributed traces across agent → API → worker → DB would have been better.


> **Takeaway:** FastAPI gives you a clean async shell for ML APIs. Production concurrency lives in the boundaries: thread pools for CPU work, queues for long jobs, back-pressure when you are full, singleton pools, and health checks that reflect reality. At scale, those boundaries matter more than framework choice.
