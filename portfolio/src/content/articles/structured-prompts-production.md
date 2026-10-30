Prompts that work in a notebook rarely survive the first week of production. A clever system message that impresses in a demo will silently drop citation fields under real traffic, or hallucinate risk levels when inputs are slightly longer than the few-shot examples. The fix was not better prose—it was treating prompts like API contracts. Schema-first design, bounded few-shot sets, and regression checks before any prompt change touches a production deployment.

## Start with output shape, not clever wording

The first artifact in a prompt design session should be the output schema, not the system message. If downstream code expects JSON, define every required field, allowed enum values, and nullability before you write a single instruction sentence. Wire FastAPI response models to the same Pydantic shapes the LLM is asked to produce. When parse rates drop, you know immediately which field broke—not which paragraph of the prompt was "off."

```json
{
  "summary": "string",
  "risk_level": "low|medium|high",
  "confidence": "number",
  "citations": [
    {"source_id": "string", "page": "integer", "quote_span": "string"}
  ],
  "follow_up_questions": ["string"]
}
```

Put this schema in the prompt explicitly, not as an afterthought. Most instruction-tuned models respond well when you state: "Return only valid JSON matching this schema. No markdown fences. Missing required fields are failures."

### Validate at the boundary

Never trust the model to self-correct in a retry loop without a cap. Parse once; on failure, return a structured error to the caller or route to a fallback model. Log `json_parse_failures` as a first-class metric alongside latency. A prompt that parses 94% of the time is not "good enough" if the 6% includes high-value compliance queries.

## Few-shot boundaries that actually generalize

Few-shot examples feel like free accuracy. They are also the fastest way to overfit. Two strong demonstrations beat six mediocre ones, especially when those six span inconsistent formatting.

### Rules I follow in production

- **Structural fidelity**: Examples must match production input shape—same field names, similar length, same nesting. Sanitize PII, but do not simplify structure.
- **Diverse edge behavior**: One example for the happy path, one for ambiguity (e.g., missing page numbers in source material). Do not show the model how to invent data when sources are thin.
- **Negative space**: Include a brief "what not to do" in constraints, not in examples. Examples should model success; constraints should forbid failure modes.
- **Rotation policy**: When eval scores drift on a golden set, rotate examples before rewriting the system message. Often the model memorized phrasing, not logic.

Version few-shot packs separately from system prompts (`prompt-v2.3 + shots-v1.1`). That lets you A/B shot changes without touching core instructions—and roll back quickly when citation coverage regresses.

## Regression before rollout

A prompt change without regression testing is a deploy without tests. Store golden inputs and assert on **field presence, enum validity, and citation coverage**—not exact string match. LLM outputs vary; your contract should not.

```python
def assert_contract(output: dict, golden: GoldenCase) -> list[str]:
    errors = []
    for field in golden.required_fields:
        if field not in output or output[field] in (None, "", []):
            errors.append(f"missing:{field}")
    if golden.expects_citations and not output.get("citations"):
        errors.append("citations:empty")
    if output.get("risk_level") not in ("low", "medium", "high"):
        errors.append("risk_level:invalid")
    return errors
```

Run this suite in CI on every prompt PR. Block route promotion if parse rate falls below baseline minus two points, or if any P0 governance case fails (e.g., answer without citation on a factual audit question).

### What to log in staging

Capture prompt hash, model ID, token counts, parse success, and eval scores per case. When production incidents occur, you need to answer: did the prompt change, the model version, or the retrieval layer shift? Without hashes, you are guessing.

## Claude-specific tips that survive production

When Claude handles structured extraction, these patterns hold up:

1. **Order matters**: Role → task → constraints → output format. Burying "do not invent sources" at the end of a long bullet list reduces compliance.
2. **XML tags for sections**: Wrapping instructions in `<task>`, `<constraints>`, `<output_schema>` improved parse consistency versus unstructured walls of text.
3. **Explicit uncertainty**: Ask for `confidence` and `follow_up_questions` fields. Models that can say "I need more context" reduce silent hallucination.
4. **Pre-fill avoidance**: Do not show partial JSON in the prompt unless you want the model to continue a pattern that may be wrong.

```text
<role>You are a compliance summarizer for policy documents.</role>
<task>Summarize the excerpt and classify risk.</task>
<constraints>
- Use only provided sources.
- If evidence is insufficient, set risk_level to medium and list follow_up_questions.
- Do not invent page numbers.
</constraints>
<output_schema>{ ... }</output_schema>
```


> **Takeaway:** Production prompts are interfaces between probabilistic models and deterministic systems. Design them with the same discipline as a FastAPI schema: versioned, tested, observable, and owned. Your future self—and the eval agent you have not built yet—will thank you when a model upgrade does not take down Monday morning workflows.