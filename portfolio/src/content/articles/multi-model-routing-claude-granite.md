Enterprise AI rarely runs on a single model. At IBM, WatsonX routes often included Granite for governed in-tenant workloads, Llama variants for cost-sensitive batch jobs, and Claude (via approved channels) for reasoning-heavy drafting where citation discipline mattered. The orchestrator's job is not to pick the "best" model globally—it is to pick the right model per task, with fallback chains, cost caps, and audit trails that survive security review.

## Task-based routing, not model favoritism

We classified incoming work by **capability profile**, not by user preference:

| Task type | Primary | Fallback | Why |
|-----------|---------|----------|-----|
| Structured extraction (JSON schema) | Granite | Llama 3 | Schema adherence, data residency |
| Long-form policy drafting | Claude | Granite | Reasoning + nuance; fallback if quota hit |
| Code generation / refactor | Claude | Granite Code | Tool-use quality; governed fallback |
| High-volume classification | Llama (small) | — | Cost and latency |

Routing happened before the first token:

```python
from enum import Enum
from dataclasses import dataclass

class TaskKind(Enum):
    EXTRACTION = "extraction"
    DRAFTING = "drafting"
    CODE = "code"
    CLASSIFY = "classify"

@dataclass
class RouteDecision:
    provider: str
    model: str
    fallback: list[tuple[str, str]]
    max_tokens: int
    reason: str

def route(task: TaskKind, tenant_policy: TenantPolicy) -> RouteDecision:
    if task == TaskKind.EXTRACTION:
        if tenant_policy.require_in_tenant:
            return RouteDecision("watsonx", "granite-13b-chat", [], 2048, "residency")
        return RouteDecision("watsonx", "granite-13b-chat",
                             [("watsonx", "llama-3-8b")], 2048, "schema_default")
    if task == TaskKind.DRAFTING:
        if tenant_policy.claude_allowed:
            return RouteDecision("anthropic", "claude-sonnet-4-20250514",
                                 [("watsonx", "granite-13b-chat")], 4096, "drafting")
        return RouteDecision("watsonx", "granite-13b-chat", [], 4096, "drafting_governed")
    # ...
```

`tenant_policy` came from RBAC—consulting clients differed on what could leave the VPC. Hard-coding routes without policy hooks is how you fail audit.

## Fallback chains that fail gracefully

Fallback is not "try random model until something works." Each step needs a **trigger** and a **degraded behavior**:

1. **Primary timeout** (e.g., 25s) → next model in chain
2. **Rate limit / 429** → backoff, then fallback
3. **Schema validation failure** on structured output → retry once on same model with repair prompt; then fallback
4. **Cost cap exceeded** → downgrade to cheaper tier or queue for batch

```python
async def invoke_with_fallback(decision: RouteDecision, messages: list) -> ModelResponse:
    chain = [(decision.provider, decision.model)] + decision.fallback
    last_error = None
    for provider, model in chain:
        try:
            resp = await llm_client.complete(provider, model, messages,
                                             max_tokens=decision.max_tokens)
            if decision.requires_json:
                parsed = validate_schema(resp.content)
                if parsed is None:
                    raise SchemaValidationError()
            log_routing_event(provider, model, success=True)
            return resp
        except (TimeoutError, RateLimitError, SchemaValidationError) as e:
            last_error = e
            log_routing_event(provider, model, success=False, error=type(e).__name__)
            continue
    raise AllProvidersFailed(last_error)
```

Every hop logged with correlation ID. EY stakeholders asked "which model produced this answer?" during incident reviews. Without logs, you guess.

## Cost caps and token budgets

Multi-model orchestration without budgets becomes a line item surprise. We enforced:

- **Per-request token ceiling** — hard stop before call if prompt + max_completion exceeds budget
- **Per-tenant daily spend** — Redis counter with alert at 80%, block at 100% for non-critical routes
- **Model-specific pricing tables** — updated monthly; routing could prefer Llama for classify when Claude margin was thin

```python
def enforce_budget(tenant_id: str, estimated_tokens: int) -> None:
    key = f"spend:{tenant_id}:{date.today().isoformat()}"
    projected = redis.incrby(key, estimated_tokens)
    if projected == estimated_tokens:
        redis.expire(key, 86400)
    cap = get_tenant_cap(tenant_id)
    if projected > cap:
        raise BudgetExceededError(tenant_id, projected, cap)
```

Classification and extraction ran on cheaper models by default. Drafting escalated only when the workflow node required it—not when a developer hard-coded Sonnet everywhere.

## Prompt and schema portability

Different models interpret the same prompt differently. We maintained **provider adapters** that translated a canonical prompt + JSON schema into provider-specific request shapes—WatsonX message format vs Anthropic system blocks vs OpenAI-compatible endpoints for Llama.

The canonical layer lived in repo with version tags. Changing Granite from 13B to a newer instruct variant was a config swap, not a rewrite of every agent node.

## Eval gates per route

Routing logic is code; it drifts. We ran eval suites per `(task, primary_model)` pair:

- Extraction: JSON schema pass rate on held-out docs
- Drafting: rubric scores for tone, citation presence, hallucination flags
- Classify: macro-F1 on labeled set

Regression on Granite did not block Claude routes and vice versa. CI failed when a routing change sent extraction traffic to a model that lost 5+ points on schema adherence.

## Human-facing transparency

For consulting deliverables, we surfaced model lineage in metadata: `"model": "granite-13b-chat", "route_reason": "residency"`. Internal users saw it in debug panels; external users saw it only when contract required. Transparency defaults differ by client—build the hook anyway.


> **Takeaway:** Routing Claude, Granite, and Llama in one orchestrator is a policy and operations problem dressed as an architecture diagram. Task-based routes, explicit fallback triggers, cost caps, provider adapters, and per-route eval gates let you optimize for quality, residency, and spend without pretending one model wins every workload.
