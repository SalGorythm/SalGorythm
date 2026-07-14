import {
  Building2,
  Code2,
  Cpu,
  Layers,
  Server,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type ExperienceRole = {
  id: string
  org: string
  title: string
  period: string
  summary: string
  bullets: string[]
  tags: string[]
  icon: LucideIcon
  /** Optional brand treatment in the detail panel header. */
  wordmark?: 'ibm'
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    id: 'ibm',
    org: 'IBM',
    title: 'Senior Data Scientist · AI/ML Engineer',
    period: 'Feb 2025 — Present',
    wordmark: 'ibm',
    summary:
      'Global IBM Tech 2026 awardee leading GenAI and agentic architecture for enterprise systems — WatsonX.ai-class integrations, production LLM deployments (including Granite and Llama family models), and full-stack ML engineering with a local-first, privacy-conscious mindset.',
    bullets: [
      'Selected as a Global IBM Tech 2026 awardee; invited to collaborate with IBM’s senior technical community in San Diego on enterprise AI architecture.',
      'Architecting end-to-end agentic AI workflows using LangChain and AutoGen, reducing manual processing load for core business units.',
      'Leading high-performance backends with FastAPI and Django, integrating LLM-based solutions with enterprise-grade security and governance controls.',
      'Driving WatsonX.ai-aligned integrations and multi-model orchestration across Granite, Llama, and related enterprise model stacks.',
      'Designing and optimizing scalable data pipelines with Confluent and PostgreSQL, reducing query latency for real-time AI workloads.',
      'Built agent-based staffing tooling for IBM Consulting — significantly reducing manual estimation and staffing effort for the Solutioning team.',
      'Mentoring engineers and aligning technical strategy across high-stakes programs.',
    ],
    tags: [
      'IBM Tech 2026',
      'WatsonX.ai',
      'Granite / Llama',
      'Agentic AI',
      'FastAPI',
      'Confluent',
    ],
    icon: Cpu,
  },
  {
    id: 'ey',
    org: 'EY LLP',
    title: 'Senior Consultant',
    period: 'Nov 2021 — Feb 2025',
    summary:
      'Led delivery for SAM and cybersecurity solutions: secure APIs, large-scale automation, cloud deployments, and LLM-enabled products with quantified outcomes across ETL, monitoring, and client automation.',
    bullets: [
      'Led end-to-end development and deployment of SAM and cybersecurity solutions, architecting cross-functional projects from requirements through delivery.',
      'Built and deployed two LLM-powered chatbot wrappers supporting client automation initiatives.',
      'Developed BOT software for automated cross-platform data extraction, deployed across 25,000+ machines; cut manual data-handling time by 40%.',
      'Designed high-performance ETL pipelines processing millions of PostgreSQL records via FastAPI; boosted processing speed through Redis integration.',
      'Implemented RBAC and token-based authentication for secure API middleware access.',
      'Managed Docker-based deployments and supervised CI/CD pipelines on Azure VMs across dev, QA, and UAT environments.',
      'Promoted to Senior Consultant (Q4 2023); recognized with Collaborative Extraordinaire (Q2 2024) and I Am Exceptional (Q1 2023).',
    ],
    tags: ['Cybersecurity', 'Azure CI/CD', 'PostgreSQL', 'LLM products', 'Docker'],
    icon: Building2,
  },
  {
    id: 'telus',
    org: 'TELUS International',
    title: 'Software Engineer III',
    period: 'Dec 2018 — Nov 2021 · Noida Area, India',
    summary:
      'Python-first delivery across Flask and Django services, dozens of ETL flows into BigQuery with preprocessing, and Airflow automation — working with architects and analysts end-to-end while helping shape product roadmaps with senior leadership.',
    bullets: [
      'Engineered 5 high-impact Python applications using Flask and Django, automating data workflows to streamline operations.',
      'Built ETL pipelines with preprocessing for BigQuery and automated workflows via Airflow, improving pipeline efficiency.',
      'Developed NLP-based Relevant Resume Finder ranking 20,000+ resumes against job descriptions — 90% relevance accuracy.',
      'Partnered with architects and analysts on end-to-end delivery; established best practices for quality, cost-effective execution.',
      'Awarded Pat on the Back for outstanding performance (Q2 2019).',
    ],
    tags: [
      'Python',
      'Flask',
      'Django',
      'BigQuery',
      'Apache Airflow',
      'ETL',
      'PostgreSQL',
      'Elasticsearch',
    ],
    icon: Server,
  },
  {
    id: 'appweb',
    org: 'App & Web Solutions',
    title: 'Senior Software Engineer',
    period: 'Jan 2018 — Dec 2018 · Gurgaon, India',
    summary:
      'Owned delivery across Python and PHP APIs for web and mobile clients, operationalized internal workflows, and supported BI-style reporting surfaces — including a complete CNN-based image processing project.',
    bullets: [
      'Delivered 5+ projects and sub-modules, including a full CNN-based image processing application.',
      'Created many APIs in Python and PHP consumed by UI and mobile applications.',
      'Established technical procedures and integrated tools to automate and streamline internal workflows.',
      'Troubleshot, resolved, and documented customer-facing technical issues to improve satisfaction.',
      'Designed, developed, and supported schema objects, graphs, reports, and dashboards on application UIs.',
      'Partnered with BA/BI teams and end users on requirements and reporting specs; provided hands-on technical assistance.',
      'Maintained documentation across the lifecycle and performed unit testing alongside delivery.',
    ],
    tags: ['Python', 'PHP', 'Flask', 'PostgreSQL', 'Elasticsearch', 'ETL'],
    icon: Code2,
  },
  {
    id: 'roundone',
    org: 'Round One (Info Edge / Naukri)',
    title: 'Senior Software Engineer',
    period: 'May 2017 — Jan 2018 · New Delhi Area, India',
    summary:
      'Promoted to Senior Software Engineer within two months; led CRM and platform modules that materially improved productivity, built crawlers and preprocessing pipelines, and led a pod of 5–7 engineers with architecture and product alignment.',
    bullets: [
      'Designed and led two major projects plus multiple sub-modules (including CRM panels), contributing to ~85% gains in productivity and reporting efficiency.',
      'Promoted from Software Engineer to Senior Software Engineer within two months for strong execution.',
      'Built applications, CRMs, and APIs in Python and PHP with scalability and maintainability in mind.',
      'Implemented crawlers to ingest job listings with multi-level preprocessing for the platform.',
      'Planned and optimized models, interfaces, and workflows for extensibility while monitoring application impact.',
      'Aligned implementation with product management and architecture on requirements and technical design.',
      'Led a team of 5–7 engineers while owning individual delivery; facilitated technical discussions and design reviews.',
    ],
    tags: ['Python', 'PHP', 'Elasticsearch', 'Team lead', 'Crawlers', 'CRM'],
    icon: Users,
  },
  {
    id: 'piana',
    org: 'Piana IT Solutions',
    title: 'Software Engineer',
    period: 'Jan 2016 — May 2017 · New Delhi, India',
    summary:
      'Full-stack contributor across 4+ projects and POCs, working directly with CEOs and stakeholders to translate needs into specifications, APIs, and integrated sub-modules with disciplined SDLC execution.',
    bullets: [
      'Developed full-stack solutions for 4+ projects, sub-modules, and POCs alongside CEOs and stakeholders.',
      'Authored high-quality code with testing, debugging, and performance tuning.',
      'Followed the software development lifecycle end-to-end, including integration and performance reviews.',
      'Continuously upskilled on languages, frameworks, and tools to improve delivery.',
      'Collaborated across teams to evaluate solutions and optimize project performance.',
      'Built multiple APIs and integrated sub-modules within larger programs.',
    ],
    tags: ['Python', 'Full-stack', 'APIs', 'SDLC', 'Technical architecture'],
    icon: Layers,
  },
]
