Most Cursor demos stop at “look what it generated.” Production work starts after that: will you merge it, and can you defend the diff on Monday? This is the workflow I actually use to ship—rules files, scoped prompts, and verify-before-merge—on production services and the local-first apps I build on weekends. The tool is fast. The process is what keeps the repo honest.

## The loop in one sentence

**Describe the change once in rules and tickets → prompt for a narrow slice → run the same checks you’d run on a human PR → merge only what you verified.**

If any step is fuzzy, I stop and tighten scope. Speed without a gate is just faster regret.

## Rules files: context you refuse to retype

I keep project rules short and enforceable—constraints the agent should never violate, not a style essay. On a model-routing service that might look like:

```text
# .cursor/rules/model-routes.mdc
- Do not invent model IDs; use constants in src/models/registry.py
- Structured LLM responses must validate with Pydantic before return
- Log prompt_hash, model_id, and parse_ok on every inference path
- Never open a new DB pool inside a request handler
- Prefer editing existing modules over adding parallel helpers
```

On this portfolio (Vite + React), the useful rules are different: no analytics SDKs in local-first tools, keep browser-only processing for PDF/image utilities, match existing section and tag conventions. Same idea—encode the invariants once so every session starts aligned.

### What goes in rules vs. the prompt

| Put in rules | Put in the prompt |
| --- | --- |
| Always-on repo invariants | This ticket’s acceptance criteria |
| Forbidden patterns | Exact files/folders to touch |
| “How we log / validate here” | What *not* to refactor |

Rules are the house style. Prompts are the work order.

## Scoped prompts that produce reviewable diffs

I never ask Cursor to “ship the feature.” I ask for one mergeable slice with hard edges:

```text
@src/api/classify.py @tests/test_classify.py
Add Redis back-pressure on /v1/classify when queue depth > 200.
Match the pattern in src/api/middleware/redis_limit.py.
Do not change response schemas or auth.
Add pytest cases for: under limit, over limit (429), Redis timeout fallback.
Stop after tests pass locally; do not open a PR.
```

Three things make this work:

1. **File anchors** — `@` the files that define the pattern and the tests.
2. **Explicit non-goals** — schemas and auth stay frozen unless the ticket says otherwise.
3. **Done means verified** — “tests pass” beats “code looks right.”

The expensive Cursor sessions are the vague ones: “make the gateway more resilient.” That produces wide diffs—timeouts, pool sizes, retry counts—each “reasonable,” none reviewable as a unit. Narrow prompts cut review time more than they cut generation time.

## Verify before merge (non-negotiable)

Generation is cheap. Verification is the job. My checklist before any Cursor-touched commit:

1. **Read the full diff** — accept/reject hunks; partial acceptance is normal.
2. **Run the local gate** — tests, typecheck, lint for the touched package.
3. **Trace the happy path and one failure** — for APIs, hit the endpoint; for UI, click the path.
4. **Ask “what did it invent?”** — new deps, new abstractions, renamed public symbols without a migration note.

A rule of thumb I reuse from the architecture post: if I cannot review the diff in about ten minutes, the prompt was too wide. Split and rerun.

```bash
# Minimum local gate before I even draft a commit message
pytest tests/test_classify.py -q
ruff check src/api/classify.py
mypy src/api/classify.py
git diff --stat   # if this is scary, scope was wrong
```

For agent routes, the gate includes eval stubs or golden cases when the change touches prompts or routing. Cursor does not own that evidence—I attach it in the PR.

## A real shipping day (compressed)

How a typical production slice actually moves:

1. **Morning** — ticket acceptance criteria + one paragraph design note (problem, non-goals, rollback).
2. **Session** — update or confirm rules if the pattern is new; then one scoped Cursor prompt for implementation + tests.
3. **Local** — run the gate; fix or reject anything that smells like drive-by cleanup.
4. **PR** — small diff, linked design note, screenshots or curl output when behavior is user-visible.
5. **Review** — treat it like a junior engineer’s PR: naming, error boundaries, no silent swallows.

I do not “trust the agent” at step 5. I trust the process that assumes the agent is optimistic and incomplete.

## What I optimize for (and what I ignore)

**Optimize for:** reviewable diffs, stable contracts, repeatable local gates, rules that prevent the same mistake twice.

**Ignore:** flashy multi-file refactors from a single vague prompt, auto-generated architecture diagrams nobody asked for, and merging because CI is green when you never opened the diff.

Cursor is excellent at boilerplate, adapters, test expansion, and applying a pattern that already exists in the repo. It is a poor substitute for deciding whether Redis belongs on the hot path, or whether a prompt change needs an eval gate before promotion.

## Copy-paste starter kit

Steal this trio when you adopt the workflow on a new repo:

**1. Tiny rules file** — five bullets max for the first week; grow only when something breaks twice.

**2. Prompt template**

```text
@[files that show the pattern]
Goal: …
Constraints: do not change …
Tests: add/extend …
Definition of done: local tests + I will read every changed line
```

**3. Pre-merge habit** — `diff → tests → one manual path → commit`. No skip.

That is the whole craft. Not vibes. Not autopilot. A short loop you can defend in a standup.


> **Takeaway:** Shipping with Cursor is a verification problem dressed up as a typing problem. Put invariants in rules, keep prompts narrow, and refuse to merge anything you have not read and run. Do that consistently and the tool makes you faster on production code—FastAPI services, model routes under governance, or a calm local-first side project—without turning your git history into a demo reel.
