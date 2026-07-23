The plan-act-observe loop is the most seductive pattern in agent design. It feels like how senior engineers work: think, do, check, repeat. It is also the fastest way to burn a month's token budget in an afternoon if you treat "iterate until done" as a product requirement. At IBM, a WatsonX staffing assistant once looped seventeen times on a single ambiguous brief because nothing in the stack told it to stop. The model kept rewriting its plan instead of executing the next step. That incident is why iteration caps, token budgets, and explicit stop conditions are first-class config in every agent I ship—at IBM, at EY, and in side projects.

## The loop I actually run in production

Research papers describe open-ended reasoning. Production needs a tight loop with a contract at each phase.

1. **Plan** — One LLM call produces structured steps (max five). Steps are IDs, not essays.
2. **Act** — Execute exactly one step: a tool call, a retrieval, or a sub-agent invocation.
3. **Observe** — Summarize the result in 200–400 tokens. Decide: continue, replan once, or finalize.

Never let the model rewrite the entire plan every iteration. That doubles cost and increases drift—the model optimizes for narrative coherence, not task completion.

```python
@dataclass
class LoopConfig:
    max_iterations: int = 5
    max_tool_calls: int = 8
    max_replans: int = 1
    token_budget: int = 24_000
    wall_clock_seconds: float = 45.0
    min_tokens_to_continue: int = 2_000
```

### Plan output schema

Force structure so the runner—not the model—controls flow.

```json
{
  "goal": "string",
  "steps": [
    {"id": "s1", "action": "retrieve|tool|answer", "description": "string"}
  ],
  "stop_if": ["condition strings the runner evaluates"]
}
```

The runner picks `steps[0]` after each successful observe. The model does not "decide what to do next" in free text unless you enjoy debugging non-deterministic logs.

## Hard stops: the brakes nobody regrets

Soft guidance ("please be concise") fails under pressure. Hard stops do not.

| Guardrail | Typical value | Why |
|-----------|---------------|-----|
| Max iterations | 5 | Covers most multi-tool tasks; forces decomposition upfront |
| Max tool calls | 8 | Prevents tool spam even if iterations are low |
| Token budget per request | team-specific | Finance owns the number; engineering enforces it |
| Wall clock timeout | 45s | UX and upstream gateway limits |
| Max replans | 1 | One recovery attempt; then partial finalize or human |

```python
def should_stop(ctx: LoopContext, cfg: LoopConfig) -> bool:
    if ctx.iteration >= cfg.max_iterations:
        return True
    if ctx.tool_calls >= cfg.max_tool_calls:
        return True
    if ctx.tokens_used >= cfg.token_budget:
        return True
    if ctx.elapsed_seconds >= cfg.wall_clock_seconds:
        return True
    if ctx.budget.remaining_tokens < cfg.min_tokens_to_continue:
        return True
    return False

async def run_loop(state: AgentState, cfg: LoopConfig) -> AgentState:
    while not should_stop(ctx, cfg):
        step = pop_next_step(state)
        if step is None:
            break
        result = await execute_step(step)
        state = observe(state, result, max_tokens=400)
        ctx.iteration += 1
    return finalize_partial_or_complete(state)
```

When a stop triggers, **finalize_partial** is not failure—it is honest product behavior. Return what you have, cite what you retrieved, list what remains. Consulting users prefer partial answers with clear gaps over a timeout and an empty 502.

## Token budgets: allocate like memory

Treat context window like RAM. Raw tool dumps belong in logs and object storage, not in the next plan call.

### Observation compression

After each act phase, summarize:

- What succeeded or failed (one sentence)
- Key fields extracted (structured)
- Whether the step satisfied its acceptance check

Do not pass full JSON responses from enterprise APIs into the plan prompt. At EY, we stored full payloads in S3 with a pointer; the observe summary carried only decision-relevant fields.

```python
def observe(tool_result: dict, max_tokens: int = 350) -> str:
    summary = compress_with_model(tool_result, max_tokens=max_tokens)
    return summary  # fed to next iteration, not raw result
```

### Budget accounting across WatsonX routes

When routing Claude for planning and Granite for observation summaries, account tokens **per request**, not per model. A cheap observe model still adds up across five iterations. Export `tokens_used` and `remaining_budget` on every span so cost dashboards match agent behavior.

## Stop conditions beyond counters

Iteration and token caps catch runaway loops. Semantic stop conditions catch "done enough."

### Runner-evaluated stops

- **Goal satisfied**: Required fields populated and validation node passes.
- **Diminishing returns**: Last two observations identical or no new facts retrieved.
- **Policy block**: Tool denied, data classification too high—escalate, do not retry blindly.
- **User scope lock**: User provided a fixed deliverable list; stop when all items checked.

```python
if state.validation.passed and state.draft.complete:
    return finalize_complete(state)

if observations_similar(state.last_two_obs):
    return finalize_partial(state, reason="no_new_information")
```

### Replan once, not forever

Allow a single replan when observe detects a failed assumption ("retrieval returned zero chunks"). Increment `replans_used`; on second failure, stop. Models love to replan—it feels productive. Your invoice disagrees.

## What we learned after the seventeen-loop incident

We added a dashboard: p50/p95 iterations, token burn per successful task, and "finalize_partial rate." Spikes in partial finalization often meant bad retrieval or vague user input—not broken models. That shifted work from prompt tweaking to upstream UX and chunk quality.


> **Takeaway:** Plan-act-observe works in production when the **runner** owns control flow and the **model** owns bounded reasoning inside each phase. Cap iterations, cap tools, cap tokens, cap time, compress observations, and finalize honestly when brakes engage. The loop is powerful; the brakes are what make it deployable on WatsonX Monday morning without finance calling Tuesday.
