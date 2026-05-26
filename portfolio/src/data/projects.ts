import { Database, Layers, Smartphone, type LucideIcon } from 'lucide-react'

export type ProjectTabId = 'genai' | 'data' | 'local'

export type ProjectCard = {
  title: string
  blurb: string
  stack: string[]
}

export const PROJECT_TABS: { id: ProjectTabId; label: string; icon: LucideIcon }[] = [
  { id: 'genai', label: 'Generative AI & LLMs', icon: Layers },
  { id: 'data', label: 'Data Engineering & Analytics', icon: Database },
  { id: 'local', label: 'Local-First Architecture', icon: Smartphone },
]

export const PROJECTS_BY_TAB: Record<ProjectTabId, ProjectCard[]> = {
  genai: [
    {
      title: 'IBM · Super Agents & multi-agent flows',
      blurb:
        'LLM-enabled super agents coordinating multiple single-purpose agents into dynamic flows for end-to-end problem solving — aligned with enterprise WatsonX.ai patterns and multi-model deployments (Granite, Llama, and related stacks).',
      stack: ['Multi-agent', 'WatsonX.ai', 'Granite / Llama', 'Orchestration'],
    },
    {
      title: 'EY Quasar · NL-to-SQL & visualization',
      blurb:
        'Intelligent query engine using Ollama and Mistral (7B) to translate natural language into optimized SQL, with automated charts (bar, line, donut), titles, and summaries for non-technical users.',
      stack: ['Python', 'PostgreSQL', 'Mistral', 'Ollama', 'Visualization'],
    },
    {
      title: 'EY Qbot · Document intelligence',
      blurb:
        'Advanced LLM wrapper processing and storing documents in ChromaDB; natural-language Q&A with page-level references, traceable chunks, and synthesized answers that collapsed hours of manual retrieval.',
      stack: ['ChromaDB', 'PostgreSQL', 'Mistral', 'Ollama', 'RAG'],
    },
    {
      title: 'EY · LLM chatbot wrappers (client automation)',
      blurb:
        'Built and deployed two production chatbot wrappers on large language models to accelerate client automation and knowledge workflows with secure integration patterns.',
      stack: ['LLM APIs', 'Python', 'FastAPI', 'Automation'],
    },
  ],
  data: [
    {
      title: 'EY Atom Bot & Atom Bot Server',
      blurb:
        'Executable automation bot deployed across 25,000+ machines with optimized API handling and robust ETL; paired server processing thousands of concurrent bot requests with resilient PostgreSQL-backed pipelines.',
      stack: ['Python', 'PostgreSQL', 'ETL', 'Docker / Podman', 'Azure', 'React'],
    },
    {
      title: 'EY Atom ETL Engine',
      blurb:
        'Automated ingestion from 15+ connectors into PostgreSQL with complex transforms, idempotent loads, and automated data quality checks for high-volume operational telemetry.',
      stack: ['FastAPI', 'PostgreSQL', 'ETL', 'Docker', 'React'],
    },
    {
      title: 'EY Quark · Cybersecurity data plane',
      blurb:
        'Microservices platform for agentless discovery (system inventory, metering, services, processes, keywords), rollout, patch, and configuration — Flask/FastAPI services with Ansible-driven automation and compliance analytics.',
      stack: ['Django', 'FastAPI', 'Ansible', 'Docker', 'Microservices'],
    },
    {
      title: 'TELUS International · Data pipelines & BI',
      blurb:
        'Python services with automated ETL into BigQuery, Airflow-orchestrated workflows, and enterprise BI APIs for uptime, capacity, and line-of-business reporting at scale.',
      stack: ['Airflow', 'BigQuery', 'Python', 'ETL', 'Django REST'],
    },
  ],
  local: [
    {
      title: 'Field-scale automation footprint',
      blurb:
        'Atom-class agents running at the edge across tens of thousands of endpoints — emphasizing minimal uplink, resilient local collection, and controlled sync back to central analytics.',
      stack: ['Edge agents', 'Local buffers', 'Secure uplink', 'Telemetry'],
    },
    {
      title: 'High-throughput web & integration clients',
      blurb:
        'React and service-backed clients for operational consoles and integration hubs — tuned for fast feedback loops, defensive API usage, and operator-grade reliability.',
      stack: ['React', 'REST', 'PostgreSQL', 'Azure VMs'],
    },
    {
      title: 'Local-first product philosophy',
      blurb:
        'Architecting systems where sensitive slices stay on-device or inside trust boundaries until explicitly shared — pairing strong cryptography patterns with pragmatic developer ergonomics.',
      stack: ['Privacy', 'Encryption', 'UX', 'Governance'],
    },
  ],
}
