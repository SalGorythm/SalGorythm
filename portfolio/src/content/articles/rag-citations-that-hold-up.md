Regulated readers do not want "the model said so." They want page-level citations that map to source documents—especially in cybersecurity and consulting contexts where an answer without a traceable source is worse than no answer at all. I have shipped RAG pipelines where audit teams rejected features not because retrieval was wrong, but because citations could not survive a second look. This article is what I wish someone had handed me before the first security review: chunk boundaries, metadata discipline, and output contracts that keep citations honest under pressure.

## Why page-level citations fail in production

Most RAG demos cite something. Few citations hold up when a reviewer opens the PDF, searches for the quoted phrase, and finds it on a different page—or not at all. The usual culprits are predictable: chunks split mid-paragraph without page metadata, overlapping windows that duplicate text but lose provenance, and models that paraphrase aggressively while still attaching a citation token as decoration.

The fix is not "tell the model to cite sources" in a system prompt footer. Citation quality is an engineering problem spanning ingestion, indexing, retrieval, and generation. Treat each layer as a contract with testable invariants.

## Chunking strategy that preserves provenance

Fixed-token chunking is convenient and often wrong for regulated corpora. Policy documents, audit reports, and vendor assessments have logical sections—headings, numbered clauses, appendices—that should stay intact when possible.

My default approach:

- Chunk by logical section first, then split only if a section exceeds your context budget.
- Attach metadata at ingest time: `doc_id`, `title`, `page_start`, `page_end`, `section_heading`, and `source_uri`.
- Overlap sparingly. If you overlap, copy metadata to every overlapping chunk; never inherit page numbers implicitly from neighbors.

```python
@dataclass
class Chunk:
    text: str
    doc_id: str
    page_start: int
    page_end: int
    section: str
    chunk_id: str  # stable hash of doc_id + page_start + section

def chunk_document(pages: list[tuple[int, str]], doc_id: str) -> list[Chunk]:
    # Split on headings; preserve page span per chunk
    ...
```

When a chunk spans pages 12–13, store both. Auditors care about ranges, not approximate locations.

## Index and retrieval hygiene

Embeddings alone will retrieve plausible-but-wrong passages. For factual Q&A in regulated settings, add hard filters before soft ranking:

- Restrict retrieval to documents the user is authorized to see (tenant, classification, effective date).
- Drop chunks below a similarity threshold rather than passing top-k blindly.
- Re-rank with a cross-encoder or lightweight reranker on the candidate set—typically 20 retrieve, 5 rerank, 3 to the LLM.

Log retrieval decisions: query id, chunk ids, scores, and filters applied. When audit asks "why did the system surface this clause?", you need an answer that does not start with "the model decided."

## Prompt contract: citations in the output schema

Require structured output where every factual claim maps to citation objects. Parse failures should block the response, not fall back to uncited prose.

```json
{
  "answer": "string",
  "citations": [
    {
      "chunk_id": "abc123",
      "doc_id": "policy-2024-q3",
      "page": 12,
      "quote_span": "exact substring from source when possible"
    }
  ],
  "uncited_claims": []
}
```

In the prompt, be explicit:

- Use only provided context for factual statements.
- If context is insufficient, say so and leave `citations` empty rather than inventing support.
- Prefer direct quotes for high-risk claims; paraphrase only when the source wording is ambiguous.

Post-generation validation is non-negotiable. Check that cited `chunk_id` values were actually in the retrieved set. Optionally verify that `quote_span` appears in the chunk text (fuzzy match for minor whitespace differences). Reject or regenerate when validation fails.

## Formatting citations for human readers

Engineering metadata and user-facing citations are different surfaces. Store chunk ids internally; render page references for humans:

> Per the Q3 access control policy, privileged accounts require MFA within 24 hours of provisioning (Policy 2024-Q3, p. 12).

Keep formatting consistent across products. Inconsistent citation styles erode trust faster than occasional retrieval misses.

## Eval that matches audit behavior

Golden sets for RAG should include citation checks, not just answer similarity:

- **Citation coverage**: fraction of factual sentences with at least one valid citation.
- **Citation precision**: cited chunk supports the claim (human or LLM-as-judge with rubric).
- **Page accuracy**: rendered page matches source PDF on spot checks.

Run these in CI when you change chunking, embedding models, or prompts. I have seen teams swap embedding models and silently degrade citation precision by ten points—answer BLEU looked fine.

## When to refuse to answer

A citation system that never refuses is a liability system. Train product behavior around abstention: if retrieval confidence is low or citations cannot be validated, return a bounded response ("insufficient source material") with suggested next steps (upload document, narrow query, contact owner). Regulated users prefer honest gaps over confident hallucinations with fake footnotes.


> **Takeaway:** RAG credibility is citation engineering. If audit cannot trace a sentence to a page, the feature is not production-ready—regardless of how polished the chat UI looks. Invest in metadata at ingest, validate at generation, and measure citation quality the same way you measure latency and cost.
