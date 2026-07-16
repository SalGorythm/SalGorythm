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
}[] = [
  {
    id: 'enterprise',
    label: 'Enterprise Cyber/Data',
  },
  {
    id: 'genai',
    label: 'GenAI SaaS',
  },
  {
    id: 'local',
    label: 'Local-first Product',
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
        enterprise: 'Shipped with governance and audit trails',
        genai: 'Multi-agent flows in production',
        local: 'Eval agents with ground-truth checks',
      },
    },
    {
      title: 'IBM · Evaluation Agents',
      blurb:
        'Dynamic scoring against user-defined criteria (accuracy, consistency, coherence) using Llama and Claude families with configured ground-truth references.',
      stack: ['Llama', 'Claude', 'Eval pipelines', 'Quality gates'],
      verticals: ['genai'],
      metrics: {
        enterprise: 'Automated quality scoring at scale',
        genai: 'Llama + Claude eval against user criteria',
        local: 'Ground-truth referenced scoring',
      },
    },
    {
      title: 'EY Quasar · NL-to-SQL & visualization',
      blurb:
        'Ollama + Mistral 7B translating natural language into optimized SQL with auto charts and summaries for non-technical users.',
      stack: ['Python', 'PostgreSQL', 'Mistral', 'Ollama', 'Visualization'],
      verticals: ['genai', 'enterprise'],
      metrics: {
        enterprise: '30% faster reports for operators',
        genai: 'NL to SQL with auto charts',
        local: 'On-prem Ollama inference',
      },
    },
    {
      title: 'EY Qbot · Document intelligence',
      blurb:
        'ChromaDB-backed document Q&A with page-level references — collapsed hours of manual retrieval into seconds.',
      stack: ['ChromaDB', 'PostgreSQL', 'Mistral', 'Ollama', 'RAG'],
      verticals: ['genai', 'enterprise'],
      metrics: {
        enterprise: '1,000s of docs · 95% source attribution',
        genai: '70% faster document queries',
        local: 'ChromaDB with page-level refs',
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
        enterprise: '25,000+ machines · ~40% less manual work',
        genai: 'High-throughput bot API design',
        local: 'Edge agents, controlled uplink',
      },
    },
    {
      title: 'EY Atom ETL Engine',
      blurb:
        '15+ connector ingestion into PostgreSQL with idempotent loads and automated quality checks at 99.9% accuracy.',
      stack: ['FastAPI', 'PostgreSQL', 'ETL', 'Docker', 'React'],
      verticals: ['enterprise'],
      metrics: {
        enterprise: 'Millions of records/day · 99.9% accuracy',
        genai: '95% automated quality-issue detection',
        local: '70% faster processing vs prior pipeline',
      },
    },
    {
      title: 'EY Quark · Cybersecurity data plane',
      blurb:
        'Agentless discovery, rollout, patch, and configuration microservices — Flask/FastAPI with Ansible-driven compliance automation.',
      stack: ['Django', 'FastAPI', 'Ansible', 'Docker', 'Microservices'],
      verticals: ['enterprise'],
      metrics: {
        enterprise: '+20% uptime from auto-remediation',
        genai: 'Fleet-scale discovery and metering',
        local: 'Agentless inventory (no endpoint agent)',
      },
    },
    {
      title: 'TELUS · Relevant Resume Finder',
      blurb:
        'NLP engine ranking 20,000+ resumes (PPT/DOCX/PDF) against job descriptions by relevance score.',
      stack: ['Python', 'NLP', 'BigQuery', 'Airflow', 'ETL'],
      verticals: ['enterprise', 'genai'],
      metrics: {
        enterprise: '20,000+ resumes · 90% match accuracy',
        genai: 'NLP ranking at document scale',
        local: 'PDF, DOCX, PPT ingestion',
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
        enterprise: 'App Store · privacy-first shipping',
        genai: 'Calm daily-use UX',
        local: 'On-device core, no habit tracking',
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
        enterprise: 'No server file retention',
        genai: 'In-browser PDF raster pipeline',
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
        enterprise: '25,000+ machine deployment',
        genai: 'Telemetry for downstream analytics',
        local: 'Edge buffers before sync',
      },
    },
    {
      title: 'Sandbox · Live code proof',
      blurb:
        'Eight arcade games and three canvas labs — runnable demos proving frontend performance and interactive ML toys.',
      stack: ['React', 'Canvas', 'WebGL-adjacent', 'Lazy routes'],
      verticals: ['local', 'genai'],
      metrics: {
        enterprise: 'Layout stress-test at 60fps target',
        genai: 'Neural tuning + themed interactives',
        local: '100% client-side',
      },
      href: '/sandbox',
      linkLabel: 'Enter sandbox',
    },
  ],
}
