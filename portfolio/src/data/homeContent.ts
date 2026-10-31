/**
 * Homepage content (theme-agnostic). Used by the space homepage in `components/space/`.
 * The `color` fields are only read by the older cargo theme in `components/home/`.
 *
 * Employer work follows the same rule as `experience.ts`: public-level descriptions only
 * (employer, the kind of system, the stack). Keep internal project names, client names and
 * internal metrics out of this file.
 */

export type CargoColor = 'orange' | 'yellow' | 'cobalt' | 'teal' | 'red' | 'white'

/** The lifecycle shown on the "How I work" route, in order. */
export const ROUTE_STAGES: { name: string; detail: string; color: CargoColor }[] = [
  { name: 'Design', detail: 'Flows, UI, product shape', color: 'white' },
  { name: 'Plan', detail: 'Scope, architecture, estimates', color: 'yellow' },
  { name: 'Backend', detail: 'APIs, services, auth', color: 'cobalt' },
  { name: 'Frontend', detail: 'Web apps and dashboards', color: 'red' },
  { name: 'Data', detail: 'Databases and pipelines', color: 'teal' },
  { name: 'AI', detail: 'LLMs, RAG, agents, evals', color: 'orange' },
  { name: 'DevOps', detail: 'Containers, CI/CD, cloud', color: 'orange' },
  { name: 'Mobile', detail: 'iOS and Android apps', color: 'yellow' },
  { name: 'Growth', detail: 'SEO, GEO, store listings', color: 'teal' },
]

/** Containers stacked on the hero ship. Row 1 is the top tier. */
export const DECK_CONTAINERS: { label: string; code: string; color: CargoColor; row: 1 | 2 | 3; col: number }[] = [
  { label: 'Plan', code: 'SAKU 020102', color: 'yellow', row: 1, col: 1 },
  { label: 'Mobile', code: 'SAKU 080108', color: 'cobalt', row: 1, col: 3 },
  { label: 'SEO & GEO', code: 'SAKU 090109', color: 'teal', row: 1, col: 5 },
  { label: 'Design', code: 'SAKU 010101', color: 'white', row: 2, col: 1 },
  { label: 'Frontend', code: 'SAKU 040104', color: 'red', row: 2, col: 3 },
  { label: 'AI & agents', code: 'SAKU 060106', color: 'orange', row: 2, col: 5 },
  { label: 'Backend', code: 'SAKU 030103', color: 'cobalt', row: 3, col: 1 },
  { label: 'Data', code: 'SAKU 050105', color: 'teal', row: 3, col: 3 },
  { label: 'DevOps', code: 'SAKU 070107', color: 'orange', row: 3, col: 5 },
]

export type ShippedSystem = {
  title: string
  detail: string
  consignee: string
  period: string
  stack: string[]
}

/** Work shipped for employers — public-level only (see file header). */
export const SHIPPED_SYSTEMS: ShippedSystem[] = [
  {
    title: 'Agentic AI workflows',
    detail: 'Multi-agent workflows that take manual, multi-step business processes and run them end to end.',
    consignee: 'IBM',
    period: '2025–',
    stack: ['LangChain', 'AutoGen', 'watsonx.ai'],
  },
  {
    title: 'Agent evaluation system',
    detail: 'LLM judges that score other agents’ answers for accuracy, consistency and coherence against configured ground truth.',
    consignee: 'IBM',
    period: '2025–',
    stack: ['Llama', 'Claude', 'Evals'],
  },
  {
    title: 'Agent-based estimation tool',
    detail: 'Turned a consulting team’s manual estimation and staffing process into agent-generated staffing plans.',
    consignee: 'IBM Consulting',
    period: '2025–',
    stack: ['Agents', 'FastAPI', 'Python'],
  },
  {
    title: 'Real-time data paths for AI',
    detail: 'Streaming pipelines and governed Python services that feed LLM workloads in real time.',
    consignee: 'IBM',
    period: '2025–',
    stack: ['Kafka', 'Confluent', 'PostgreSQL'],
  },
  {
    title: 'LLM-powered chatbot tools',
    detail: 'Early generative AI assistants built and deployed for internal and client automation.',
    consignee: 'EY',
    period: '2021–25',
    stack: ['LLMs', 'Python', 'FastAPI'],
  },
  {
    title: 'Enterprise fleet data collection',
    detail: 'Cross-platform collection software and the backend behind it, rolled out across large enterprise fleets.',
    consignee: 'EY',
    period: '2021–25',
    stack: ['Python', 'PostgreSQL', 'Azure', 'Docker'],
  },
  {
    title: 'ETL pipelines and secure APIs',
    detail: 'High-volume ETL with role-based access and token authentication, deployed through CI/CD across dev, QA and UAT.',
    consignee: 'EY',
    period: '2021–25',
    stack: ['FastAPI', 'Redis', 'Azure CI/CD'],
  },
  {
    title: 'Résumé ranking with NLP',
    detail: 'Ranks résumés in PDF, DOCX and PPT against a job description.',
    consignee: 'TELUS International',
    period: '2018–21',
    stack: ['NLP', 'Python'],
  },
]

/** The four tech-stack containers. */
export const STACK_CONTAINERS: { title: string; code: string; size: string; color: CargoColor; items: string[] }[] = [
  {
    title: 'AI & agents',
    code: 'SAKU 100201',
    size: '40′',
    color: 'orange',
    items: [
      'Llama, Claude, Granite, Mistral',
      'LangChain, AutoGen, watsonx.ai',
      'RAG and vector databases',
      'Multi-agent systems',
      'LLM evaluation and governance',
      'Prompt and context engineering',
    ],
  },
  {
    title: 'Backend & data',
    code: 'SAKU 100202',
    size: '40′',
    color: 'cobalt',
    items: ['Python, SQL', 'FastAPI, Django, Flask', 'PostgreSQL, Elasticsearch, Redis', 'Kafka, Confluent, PySpark', 'Airflow, Celery, ETL'],
  },
  {
    title: 'Product & apps',
    code: 'SAKU 100203',
    size: '20′',
    color: 'teal',
    items: ['Product and UI design', 'React, TypeScript', 'iOS apps', 'App Store and Play Store releases'],
  },
  {
    title: 'Ship & grow',
    code: 'SAKU 100204',
    size: '20′',
    color: 'red',
    items: ['Docker, Podman, Kubernetes', 'CI/CD, MLOps', 'AWS, Azure, GCP', 'SEO and GEO'],
  },
]

export const SERVICES: {
  berth: string
  verb: string
  title: string
  body: string
  points: string[]
  cta: string
  subject: string
  color: CargoColor
}[] = [
  {
    berth: 'Berth 01',
    verb: 'Build',
    title: 'End-to-end product',
    body: 'From a rough idea to a product people can use, including the app store listing and search visibility.',
    points: ['MVPs and internal tools', 'Web and mobile apps', 'AI features and agents'],
    cta: 'Email about a build',
    subject: 'Product build',
    color: 'orange',
  },
  {
    berth: 'Berth 02',
    verb: 'Advise',
    title: 'AI consulting',
    body: 'For teams adding LLMs or agents who need them to hold up in production.',
    points: ['Agent and RAG architecture', 'Evaluation and monitoring setup', 'GenAI roadmaps and reviews'],
    cta: 'Email about consulting',
    subject: 'AI consulting',
    color: 'cobalt',
  },
  {
    berth: 'Berth 03',
    verb: 'Prepare',
    title: 'Mock interviews',
    body: 'Realistic data science, ML and AI engineering interview rounds, with written feedback afterwards.',
    points: ['ML and GenAI system design', 'Coding and SQL rounds', 'CV and project review'],
    cta: 'Email to book a session',
    subject: 'Mock interview',
    color: 'teal',
  },
]

export const RECOGNITION: { year: string; label: string; color: CargoColor }[] = [
  { year: '2026', label: 'Global IBM Tech awardee', color: 'red' },
  { year: '2023–24', label: 'EY performance awards', color: 'yellow' },
  { year: '2019', label: 'TELUS International · Pat on the Back', color: 'teal' },
]

export const mailto = (email: string, subject: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`
