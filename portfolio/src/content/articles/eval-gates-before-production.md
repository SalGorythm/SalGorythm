Shipping an agent without eval is shipping a probabilistic bug with a release tag. I have watched staging demos pass because the presenter knew which questions to ask, while production failed on the second real query. Put eval gates between staging and production promotion—the same way integration tests gate a FastAPI deploy. Automated scoring catches regressions; human review catches "technically passed but wrong for this user." You need both, and you need them before the first customer-facing route goes live.

## What to measure (and what to ignore)

Not every metric belongs in a release gate. Vanity scores feel good in slide decks; gate metrics should map to user harm or compliance risk.

### Core gate metrics

- **Task success rate** on a frozen golden set—did the agent complete the job correctly?
- **Citation coverage** for RAG flows—do factual claims trace to provided sources?
- **Tool call accuracy**—right tool, valid args, no unauthorized endpoints?
- **Schema compliance**—JSON parse rate and required field presence?
- **Regression delta vs last release**—no drop beyond an agreed threshold (typically 2 points)?

Skip BLEU and ROUGE for agent gates unless you are doing pure summarization with reference texts. Business workflows need behavioral checks, not n-gram overlap.

```python
@dataclass
class GateThresholds:
    min_success_rate: float = 0.85
    max_regression_delta: float = 0.02
    max_json_parse_fail_rate: float = 0.01
    min_citation_coverage: float = 0.90
    max_p0_governance_failures: int = 0
```

## Ground truth discipline

A golden set is a contract with your future self. Build it like test data for payments—not like a one-off spreadsheet before a demo.

### Size and composition

Fifty to two hundred cases is enough if they are representative. Prefer breadth over volume:

- Happy path requests (40%)
- Ambiguous or under-specified inputs (25%)
- Edge cases: empty fields, conflicting instructions, long documents (20%)
- Adversarial phrasing: prompt injection attempts, requests to bypass policy (15%)

Update quarterly or when product scope shifts—not on every PR. Constantly moving gold sets make regression meaningless; you are chasing a sliding target.

### Annotation rules

Two annotators disagreeing is signal. Define rubrics:

- **Success**: Would a domain expert accept this output for this user segment?
- **Citation required**: Which question types demand sources?
- **P0 governance**: Hard fails— invented credentials, exfiltration attempts, answers without citations on audit questions.

Store golden cases with input, expected behaviors (not always exact text), and tags (`billing`, `security`, `data_residency`). Link cases to prompt hashes and model IDs so failures are reproducible.

```json
{
  "id": "gold-042",
  "input": {"query": "...", "context_ids": ["doc-991"]},
  "expect": {
    "required_fields": ["summary", "citations"],
    "citation_min": 1,
    "forbidden_patterns": ["I cannot verify", "no sources provided"]
  },
  "tags": ["rag", "audit", "p0_if_uncited"]
}
```

## Scoring: automated first, nuanced second

Automated eval runs on every prompt or model change. It should be fast enough for CI and strict enough to block bad promotes.

### Layered scoring

1. **Deterministic checks** — schema, enums, regex for forbidden content, citation count.
2. **LLM-as-judge (bounded)** — score rubric dimensions (correctness, completeness, tone) with a pinned judge prompt and model version. Never let the judge rewrite the answer.
3. **Tool trace validation** — assert expected tools were called with args matching golden constraints.

```python
def score_case(output, trace, golden) -> EvalResult:
    hard = run_deterministic_checks(output, golden)
    if hard.p0_failures:
        return EvalResult(passed=False, reason=hard.p0_failures)
    soft = judge_rubric(output, golden.rubric) if golden.needs_judge else None
    tool_ok = validate_trace(trace, golden.expected_tools)
    return combine(hard, soft, tool_ok)
```

Gate on aggregates **and** P0 cases: block if any P0 fails, even if average success is 92%.

### Baselines and regression

Keep `baseline.json` from the last production release. Promote only if:

- `success_rate >= baseline.success_rate - max_regression_delta`
- No metric crosses its absolute floor (e.g., citation coverage never below 0.90)

This prevented "we improved happy paths but broke compliance summaries" from slipping through on average score alone.

## Human review hooks

Automated eval catches regressions; humans catch governance tone, domain-specific nuance, and "correct but unusable." Machines are bad at knowing what a reviewer will forward unchanged.

### When humans enter the loop

- **Pre-production**: Sample 100% of golden set failures; spot-check 10–20% of passes before first promote.
- **Post-launch**: Review 5–10% of production traffic stratified by low judge confidence, high token burn, or user thumbs-down.
- **Escalation queue**: Route P0 near-misses and `finalize_partial` outcomes to reviewers with audit UI—not raw logs.

A lightweight review console is enough: input, output, citations, tool trace, prompt hash. Reviewers tagged failures (`wrong_tool`, `tone`, `missing_caveat`, `hallucination`). Those tags feed the next golden set revision—closing the loop between production reality and CI.

### Do not let human review become a shadow gate

If humans routinely override failed automated scores, your thresholds are wrong or your rubric is stale. Fix the eval, do not normalize bypass culture.

## Gate implementation in the release path

Treat eval like a deployment stage:

```yaml
# Conceptual promote pipeline
stages:
  - unit_and_schema_tests
  - golden_set_eval  # block on thresholds
  - staging_soak_24h
  - human_signoff_sample
  - prod_promote
```

Model routes should pin `prompt_version`, `model_id`, and `eval_run_id` in config. Rollback means reverting all three—not just the model.

## What eval gates did not solve

Gates do not replace observability. Log confidence, partial finalizations, and retrieval empty-rate in production. Gates do not replace product clarity—ambiguous user inputs fail eval and production alike. They do give you permission to say no to a Friday deploy when citation coverage drops two points—which is exactly when you need the gate.


> **Takeaway:** Eval is release infrastructure, not a research luxury. Build a small, representative golden set with clear rubrics. Automate deterministic and rubric scoring; block on P0 and regression deltas. Keep humans in the loop for nuance and for feeding failures back into gold. Ship agents the same way you ship APIs: with tests that fail loudly before users find the bugs themselves.
