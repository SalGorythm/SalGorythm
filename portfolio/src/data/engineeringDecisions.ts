export type EngineeringDecision = {
  id: string
  title: string
  context: string
  constraint: string
  options: string[]
  decision: string
  tradeOff: string
  outcome: string
}

export const ENGINEERING_DECISIONS: EngineeringDecision[] = [
  {
    id: 'quark-microservices',
    title: 'Quark delivery: modular services vs monolith sprint',
    context:
      'EY Quark needed agentless discovery, rollout, and compliance analytics on a fixed client milestone — three modules, one quarter.',
    constraint: 'Ship incremental value without blocking the flagship cybersecurity program.',
    options: [
      'Single Django monolith for speed of initial scaffolding',
      'Flask/FastAPI microservices per domain (discovery, rollout, analytics)',
      'Outsource discovery to a third-party agent',
    ],
    decision:
      'Split discovery, rollout, and analytics into Flask/FastAPI services with shared PostgreSQL contracts and Ansible for remediation.',
    tradeOff:
      'More integration overhead upfront, but teams could deploy and roll back independently during UAT.',
    outcome:
      '20% uptime improvement through automated misconfiguration remediation; three modules delivered without halting the parent program.',
  },
  {
    id: 'ibm-agent-orchestration',
    title: 'IBM agent stack: framework vs custom orchestration',
    context:
      'Super-agent flows needed multi-model support (Granite, Llama, Claude) with evaluation gates before production.',
    constraint: 'Governance reviewers required traceable tool calls and criteria-based scoring.',
    options: [
      'Custom orchestration layer on raw model APIs',
      'LangChain + AutoGen with evaluation agents',
      'Single-model wrapper to minimize moving parts',
    ],
    decision:
      'LangChain and AutoGen for orchestration, plus a dedicated evaluation agent with ground-truth references.',
    tradeOff:
      'Framework learning curve and dependency surface, exchanged for faster iteration on agent graphs.',
    outcome:
      'End-to-end agentic workflows in production with automated quality checks — aligned with WatsonX.ai enterprise patterns.',
  },
  {
    id: 'easysalah-local-first',
    title: 'EasySalah: local-first rhythm vs cloud analytics',
    context:
      'Prayer-time utility for a global Muslim audience — sensitive daily routine data, App Store privacy expectations.',
    constraint: 'No cloud tracking of prayer habits; still ship Pro features and a marketing site.',
    options: [
      'Full cloud sync for cross-device continuity',
      'Local-first on-device storage with optional export',
      'Hybrid with mandatory account creation',
    ],
    decision:
      'Local-first core (times, Qibla, Hijri) with on-device reminders; web marketing site separate from personal data.',
    tradeOff:
      'Harder cross-device sync story, but stronger privacy posture and simpler compliance narrative.',
    outcome:
      'Shipped iOS product and public marketing site with zero-upload browser tools echoing the same philosophy on this portfolio.',
  },
  {
    id: 'atom-etl-redis',
    title: 'Atom ETL: batch throughput vs operator latency',
    context:
      'Atom Bot Server ingesting from 15+ connectors while bots on 25,000+ endpoints flooded concurrent API calls.',
    constraint: 'Millions of PostgreSQL records daily with 99.9% accuracy targets and Redis already in the stack.',
    options: [
      'Pure batch ETL overnight windows only',
      'Redis caching hot transformation paths + idempotent loads',
      'Move everything to a streaming bus immediately',
    ],
    decision:
      'Idempotent PostgreSQL loads with Redis-backed hot paths; streaming reserved for the highest-volume connectors.',
    tradeOff:
      'Dual code paths to maintain, but operators saw faster feedback without rewriting the entire ingestion plane.',
    outcome:
      '70% processing time reduction, 95% automated quality-issue detection, 40% less manual data handling across systems.',
  },
]
