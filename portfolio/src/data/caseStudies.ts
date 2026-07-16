export type ArchitectureNode = {
  label: string
  role: string
}

export type CaseStudy = {
  id: string
  domain: string
  title: string
  constraintHook: string
  architecture: ArchitectureNode[]
  impactMetrics: string[]
  verifyHref?: string
  verifyLabel?: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'ibm-super-agents',
    domain: 'Enterprise GenAI',
    title: 'IBM Super Agents & WatsonX orchestration',
    constraintHook:
      'Governance, multi-model routing (Granite, Llama, Claude), and audit trails — without blocking delivery teams.',
    architecture: [
      { label: 'Orchestrator', role: 'LangChain / AutoGen routing' },
      { label: 'Tool agents', role: 'Scoped single-purpose workers' },
      { label: 'Eval layer', role: 'Scoring against ground truth' },
      { label: 'Data plane', role: 'Confluent + PostgreSQL' },
      { label: 'Governance', role: 'RBAC and WatsonX.ai integration' },
    ],
    impactMetrics: [
      'Less manual processing for core business units',
      'Multi-model orchestration shipped to production',
      'IBM Tech 2026 global awardee',
    ],
    verifyHref: '/sandbox',
    verifyLabel: 'Try the demo',
  },
  {
    id: 'ey-atom',
    domain: 'Cybersecurity data',
    title: 'EY Atom Bot & Atom Bot Server',
    constraintHook:
      '25,000+ machines, thousands of concurrent bot requests, and ETL accuracy under security review.',
    architecture: [
      { label: 'Edge agent', role: 'Cross-OS data extraction' },
      { label: 'API gateway', role: 'Concurrent request handling' },
      { label: 'ETL engine', role: '15+ connectors into PostgreSQL' },
      { label: 'Cache layer', role: 'Redis for hot paths' },
      { label: 'Ops console', role: 'React on Azure CI/CD' },
    ],
    impactMetrics: [
      '~40% less manual data handling across 25k endpoints',
      'Millions of records through FastAPI ETL',
      'Full unit-test coverage on the server',
    ],
    verifyHref: 'https://github.com/SalGorythm',
    verifyLabel: 'See on GitHub',
  },
  {
    id: 'ey-quark-quasar',
    domain: 'Cyber · analytics',
    title: 'EY Quark & Quasar intelligence stack',
    constraintHook:
      'Agentless discovery, compliance automation, and NL-to-SQL for operators who do not write SQL.',
    architecture: [
      { label: 'Discovery', role: 'Inventory and metering services' },
      { label: 'Compliance', role: 'Ansible patch and config automation' },
      { label: 'NL engine', role: 'Ollama + Mistral 7B to SQL' },
      { label: 'Vector store', role: 'ChromaDB Q&A with page refs' },
      { label: 'Visualization', role: 'Auto charts and summaries' },
    ],
    impactMetrics: [
      '+20% uptime from misconfiguration remediation',
      '30% faster reports for non-technical users',
      '70% faster document queries (Qbot)',
    ],
    verifyHref: 'https://easy-salah.vercel.app/',
    verifyLabel: 'EasySalah site',
  },
]
