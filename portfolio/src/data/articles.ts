import type { WritingTag } from '../constants/sections'

export type ArticleMeta = {
  slug: string
  title: string
  date: string
  tags: WritingTag[]
  excerpt: string
  /** Social/OG blurb (~150–200 chars). Used for LinkedIn/X share text and link previews. */
  shareBlurb: string
  readTime: number
  featured?: boolean
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'cursor-ship-production-code',
    title: 'How I actually use Cursor to ship production code',
    date: '2026-07-25',
    tags: ['cursor', 'deployment'],
    excerpt:
      'Rules files, scoped prompts, and verify-before-merge — the real loop I use to ship with Cursor without trusting the demo.',
    shareBlurb:
      'My real Cursor shipping loop: short rules files, narrow prompts, and verify-before-merge. How I keep production diffs reviewable—not demo-speed chaos.',
    readTime: 7,
    featured: true,
  },
  {
    slug: 'structured-prompts-production',
    title: 'Structured prompts that survive production',
    date: '2026-01-12',
    tags: ['prompting', 'claude'],
    excerpt: 'Schema-first prompts, few-shot boundaries, and regression checks before prompts hit production routes.',
    shareBlurb:
      'Prompts that wow in a demo often die in week one of production. Schema-first design, bounded few-shots, and regression gates before anything hits a production route.',
    readTime: 8,
    featured: true,
  },
  {
    slug: 'agent-orchestration-langchain-autogen',
    title: 'LangChain vs AutoGen: how I split orchestration',
    date: '2026-01-28',
    tags: ['agents', 'python'],
    excerpt: 'When to use graph-style LangChain flows vs AutoGen group chat for enterprise agent delivery.',
    shareBlurb:
      'LangChain graphs vs AutoGen group chat—how I split orchestration so agents stay debuggable, governable, and shippable under review.',
    readTime: 9,
    featured: true,
  },
  {
    slug: 'agent-loops-plan-act-observe',
    title: 'Agent loops: plan, act, observe — without runaway cost',
    date: '2026-02-05',
    tags: ['agents', 'loops'],
    excerpt: 'Iteration caps, token budgets, and stop conditions that keep agent loops production-safe.',
    shareBlurb:
      'Plan → act → observe is easy to demo and expensive to run wild. Iteration caps, token budgets, and stop conditions that keep agent loops production-safe.',
    readTime: 7,
    featured: true,
  },
  {
    slug: 'eval-gates-before-production',
    title: 'Eval gates before you ship an agent',
    date: '2026-02-14',
    tags: ['agents', 'deployment'],
    excerpt: 'Ground-truth sets, scoring thresholds, and human review hooks before agent releases.',
    shareBlurb:
      'Don’t ship an agent blind. Ground-truth sets, scoring thresholds, and human review hooks—the eval layer that blocks bad releases before they reach production.',
    readTime: 8,
  },
  {
    slug: 'fastapi-concurrent-ml-apis',
    title: 'FastAPI patterns for concurrent ML APIs',
    date: '2026-02-20',
    tags: ['python', 'deployment'],
    excerpt: 'Async endpoints, worker pools, and back-pressure on inference routes at scale.',
    shareBlurb:
      'Async endpoints, worker pools, and back-pressure on inference routes—FastAPI patterns that hold up under concurrent ML traffic without silent overload.',
    readTime: 7,
  },
  {
    slug: 'streaming-pipelines-kafka-ai',
    title: 'Kafka + PostgreSQL for real-time AI features',
    date: '2026-02-27',
    tags: ['python', 'deployment'],
    excerpt: 'Confluent pipelines feeding feature stores and agent context windows with low latency.',
    shareBlurb:
      'Kafka + Postgres for real-time AI features: Confluent pipelines feeding feature stores and agent context windows without turning every read into a batch job.',
    readTime: 8,
  },
  {
    slug: 'cursor-workflow-senior-engineer',
    title: 'How I use Cursor without letting it drive architecture',
    date: '2026-03-12',
    tags: ['cursor'],
    excerpt: 'Scoped edits, test-first loops, and keeping system design in human hands.',
    shareBlurb:
      'Cursor is fast at code—and that’s why architecture stays human. Scoped edits, test-first loops, and review bars that stop the tool from owning design.',
    readTime: 6,
  },
  {
    slug: 'rag-citations-that-hold-up',
    title: 'RAG with page-level citations that survive audit',
    date: '2026-03-18',
    tags: ['prompting', 'python'],
    excerpt: 'Chunk boundaries, source metadata, and citation formatting for regulated readers.',
    shareBlurb:
      'RAG that survives audit: page-level citations, honest chunk boundaries, and source metadata that regulated readers can check and verify under a review.',
    readTime: 8,
  },
  {
    slug: 'ml-system-design-interview-ds',
    title: 'ML system design for senior DS interviews',
    date: '2026-03-22',
    tags: ['interview-prep'],
    excerpt: 'A checklist for data flow, eval, deployment, and failure modes — from 9 years of interviews.',
    shareBlurb:
      'Senior DS system design without the fluff: data flow, evals, deployment, and failure modes—a practical checklist from nine years on both sides of the table.',
    readTime: 10,
  },
  {
    slug: 'local-first-apps-vs-cloud-agents',
    title: 'Local-first apps vs cloud agents: when privacy wins',
    date: '2026-04-10',
    tags: ['agents', 'deployment'],
    excerpt: 'My weekend apps vs enterprise AI agents — different trust boundaries, same engineering bar.',
    shareBlurb:
      'Local-first apps vs cloud agents: when privacy wins. On-device weekend apps vs enterprise agent workflows—different trust boundaries, same engineering bar.',
    readTime: 7,
  },
]

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug)

export function getArticleMeta(slug: string) {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getFeaturedArticles(limit = 3) {
  return ARTICLES.filter((a) => a.featured).slice(0, limit)
}

export function getArticlesByTag(tag: WritingTag | 'all') {
  if (tag === 'all') return ARTICLES
  return ARTICLES.filter((a) => a.tags.includes(tag))
}
