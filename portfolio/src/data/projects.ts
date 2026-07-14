import { Database, Layers, Smartphone, type LucideIcon } from 'lucide-react'

export type ProjectVertical = 'enterprise' | 'genai' | 'local'

export type ProjectTabId = 'genai' | 'data' | 'local'

export type ProjectCard = {
  title: string
  blurb: string
  stack: string[]
  verticals: ProjectVertical[]
  metrics: {
    enterprise: string
    genai: string
    local: string
  }
  /** External URL (e.g. live product or marketing site). */
  href?: string
  linkLabel?: string
}

export const PROJECT_TABS: { id: ProjectTabId; label: string; icon: LucideIcon }[] = [
  { id: 'genai', label: 'Generative AI & LLMs', icon: Layers },
  { id: 'data', label: 'Data Engineering & Analytics', icon: Database },
  { id: 'local', label: 'Local-First Architecture', icon: Smartphone },
]

export const VERTICAL_LENSES: {
  id: ProjectVertical
  label: string
  domainLabel: string
}[] = [
  {
    id: 'enterprise',
    label: 'Enterprise Cyber/Data',
    domainLabel: 'TARGET VERTICAL: ENTERPRISE CYBER/DATA',
  },
  {
    id: 'genai',
    label: 'GenAI SaaS',
    domainLabel: 'TARGET VERTICAL: GENAI SAAS',
  },
  {
    id: 'local',
    label: 'Local-first Product',
    domainLabel: 'TARGET VERTICAL: LOCAL-FIRST PRODUCT',
  },
]

export const PROJECTS_BY_TAB: Record<ProjectTabId, ProjectCard[]> = {
  genai: [
    {
      title: 'IBM · Super Agents & multi-agent flows',
      blurb:
        'LLM-enabled super agents coordinating single-purpose agents into dynamic flows — WatsonX.ai patterns with Granite, Llama, and Claude evaluation gates.',
      stack: ['Multi-agent', 'WatsonX.ai', 'Granite / Llama', 'LangChain'],
      verticals: ['genai', 'enterprise'],
      metrics: {
        enterprise: 'Governed multi-model orchestration in production',
        genai: 'End-to-end agentic flows reducing manual processing',
        local: 'Evaluation agents with ground-truth references',
      },
    },
    {
      title: 'IBM · Evaluation Agents',
      blurb:
        'Dynamic scoring against user-defined criteria (accuracy, consistency, coherence) using Llama and Claude families with configured ground-truth references.',
      stack: ['Llama', 'Claude', 'Eval pipelines', 'Quality gates'],
      verticals: ['genai'],
      metrics: {
        enterprise: 'Automated criteria-driven quality checks',
        genai: 'Multi-agent output validation at scale',
        local: 'Ground-truth referenced scoring loops',
      },
    },
    {
      title: 'EY Quasar · NL-to-SQL & visualization',
      blurb:
        'Ollama + Mistral 7B translating natural language into optimized SQL with auto charts and summaries for non-technical users.',
      stack: ['Python', 'PostgreSQL', 'Mistral', 'Ollama', 'Visualization'],
      verticals: ['genai', 'enterprise'],
      metrics: {
        enterprise: '30% faster report generation for operators',
        genai: 'NL → SQL with automated chart synthesis',
        local: 'On-prem Ollama inference path',
      },
    },
    {
      title: 'EY Qbot · Document intelligence',
      blurb:
        'ChromaDB-backed document Q&A with page-level references — collapsed hours of manual retrieval into seconds.',
      stack: ['ChromaDB', 'PostgreSQL', 'Mistral', 'Ollama', 'RAG'],
      verticals: ['genai', 'enterprise'],
      metrics: {
        enterprise: '1,000s of docs indexed · 95% source attribution',
        genai: '70% cut in document query time',
        local: 'Vector store with traceable chunks',
      },
    },
  ],
  data: [
    {
      title: 'EY Atom Bot & Atom Bot Server',
      blurb:
        'Automation bot across 25,000+ machines with a backend handling thousands of concurrent requests, robust ETL, and full unit-test coverage.',
      stack: ['Python', 'PostgreSQL', 'ETL', 'Docker / Podman', 'Azure', 'React'],
      verticals: ['enterprise'],
      metrics: {
        enterprise: '25,000+ endpoints · 40% manual time reduction',
        genai: 'High-throughput API design for bot fleets',
        local: 'Edge agents with controlled secure uplink',
      },
    },
    {
      title: 'EY Atom ETL Engine',
      blurb:
        '15+ connector ingestion into PostgreSQL with idempotent loads and automated quality checks at 99.9% accuracy.',
      stack: ['FastAPI', 'PostgreSQL', 'ETL', 'Docker', 'React'],
      verticals: ['enterprise'],
      metrics: {
        enterprise: 'Millions of records daily · 70% faster processing',
        genai: '95% automated quality-issue detection',
        local: 'Idempotent loads with connector fan-in',
      },
    },
    {
      title: 'EY Quark · Cybersecurity data plane',
      blurb:
        'Agentless discovery, rollout, patch, and configuration microservices — Flask/FastAPI with Ansible-driven compliance automation.',
      stack: ['Django', 'FastAPI', 'Ansible', 'Docker', 'Microservices'],
      verticals: ['enterprise'],
      metrics: {
        enterprise: '20% uptime lift via misconfiguration remediation',
        genai: 'Discovery + metering at fleet scale',
        local: 'Agentless inventory without endpoint agents',
      },
    },
    {
      title: 'TELUS · Relevant Resume Finder',
      blurb:
        'NLP engine ranking 20,000+ resumes (PPT/DOCX/PDF) against job descriptions by relevance score.',
      stack: ['Python', 'NLP', 'BigQuery', 'Airflow', 'ETL'],
      verticals: ['enterprise', 'genai'],
      metrics: {
        enterprise: '90% relevance accuracy · 85% screening time saved',
        genai: 'NLP matching at 20,000+ document scale',
        local: 'Multi-format document ingestion pipeline',
      },
    },
  ],
  local: [
    {
      title: 'EasySalah',
      blurb:
        'Local-first Islamic utility — prayer times, Qibla, Hijri dates, Zakat, reminders. Privacy-first; optional Pro without cloud tracking.',
      stack: ['Next.js site', 'iOS', 'Local-first', 'Zakat · Qibla · Hijri'],
      verticals: ['local'],
      metrics: {
        enterprise: 'App Store shipping with governance-friendly privacy',
        genai: 'Calm UX for daily ritual workflows',
        local: 'On-device core · zero cloud habit tracking',
      },
      href: 'https://easy-salah.vercel.app/',
      linkLabel: 'Visit easy-salah.vercel.app',
    },
    {
      title: 'Portfolio · Browser tools',
      blurb:
        'PDF unlock and B&W converter — zero-upload client-side pipelines proving local-first engineering on this site.',
      stack: ['pdf-lib', 'pdf.js', 'Canvas', 'Vite'],
      verticals: ['local', 'genai'],
      metrics: {
        enterprise: 'No server file retention — audit-friendly',
        genai: 'In-browser ML-adjacent raster pipelines',
        local: 'Files never leave the browser',
      },
      href: '/tools',
      linkLabel: 'Open tools',
    },
    {
      title: 'Field-scale automation footprint',
      blurb:
        'Atom-class agents at the edge across tens of thousands of endpoints — minimal uplink, resilient local collection.',
      stack: ['Edge agents', 'Local buffers', 'Secure uplink', 'Telemetry'],
      verticals: ['enterprise', 'local'],
      metrics: {
        enterprise: '25,000+ machine deployment footprint',
        genai: 'Resilient telemetry for downstream AI',
        local: 'Edge buffers before controlled sync',
      },
    },
    {
      title: 'Sandbox · Live code proof',
      blurb:
        'Eight arcade games and three canvas labs — runnable demos proving frontend performance and interactive ML toys.',
      stack: ['React', 'Canvas', 'WebGL-adjacent', 'Lazy routes'],
      verticals: ['local', 'genai'],
      metrics: {
        enterprise: 'Performance stress-test for layout stability',
        genai: 'Neural tuning + agentic-themed interactives',
        local: '100% client-side — no backend required',
      },
      href: '/sandbox',
      linkLabel: 'Enter sandbox',
    },
  ],
}
