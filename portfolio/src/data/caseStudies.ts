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
    domain: 'GENAI · ENTERPRISE',
    title: 'IBM Super Agents & WatsonX orchestration',
    constraintHook:
      'Enterprise governance, multi-model routing (Granite, Llama, Claude), and auditability — without slowing delivery teams.',
    architecture: [
      { label: 'Orchestrator', role: 'LangChain / AutoGen super-agent routing' },
      { label: 'Tool agents', role: 'Single-purpose workers with scoped permissions' },
      { label: 'Eval layer', role: 'Criteria-driven scoring vs ground truth' },
      { label: 'Data plane', role: 'Confluent + PostgreSQL for real-time AI workloads' },
      { label: 'Governance', role: 'RBAC, token middleware, WatsonX.ai alignment' },
    ],
    impactMetrics: [
      'Reduced manual processing for core business units',
      'Multi-model orchestration in production',
      'IBM Tech 2026 global awardee',
    ],
    verifyHref: '/sandbox',
    verifyLabel: 'Neural tuning live demo',
  },
  {
    id: 'ey-atom',
    domain: 'CYBER · DATA PLANE',
    title: 'EY Atom Bot & Atom Bot Server',
    constraintHook:
      '25,000+ machines, thousands of concurrent bot requests, and strict ETL accuracy under enterprise security review.',
    architecture: [
      { label: 'Edge agent', role: 'Cross-OS data extraction bot' },
      { label: 'API gateway', role: 'High-throughput request handling' },
      { label: 'ETL engine', role: '15+ connectors → PostgreSQL transforms' },
      { label: 'Cache layer', role: 'Redis-backed processing acceleration' },
      { label: 'Ops console', role: 'React + Azure CI/CD deployment surface' },
    ],
    impactMetrics: [
      '25,000+ machines deployed',
      '40% reduction in manual data-handling time',
      'Millions of records processed via FastAPI ETL',
    ],
    verifyHref: 'https://github.com/SalGorythm',
    verifyLabel: 'GitHub verification',
  },
  {
    id: 'ey-quark-quasar',
    domain: 'CYBER · NL ANALYTICS',
    title: 'EY Quark & Quasar intelligence stack',
    constraintHook:
      'Agentless discovery, compliance automation, and NL-to-SQL for non-technical operators — all under audit pressure.',
    architecture: [
      { label: 'Discovery', role: 'Agentless inventory & metering microservices' },
      { label: 'Compliance', role: 'Ansible-driven patch & config automation' },
      { label: 'NL engine', role: 'Ollama + Mistral 7B → optimized SQL' },
      { label: 'Vector store', role: 'ChromaDB document Q&A with page refs' },
      { label: 'Visualization', role: 'Auto charts + summaries for operators' },
    ],
    impactMetrics: [
      '20% uptime lift via misconfiguration remediation',
      '30% faster report generation for non-technical users',
      '70% cut in document query time (Qbot)',
    ],
    verifyHref: 'https://easy-salah.vercel.app/',
    verifyLabel: 'Public product demo',
  },
]
