/**
 * The launch-sequence lifecycle on the homepage: one entry per stage, launch pad to orbit.
 * `loop` is the three-step AI / me collaboration shown for the stage. AI tools are described
 * generically on purpose. Edit freely; the component reads everything from here.
 */
export type Actor = 'ai' | 'me'

export type LifecycleStage = {
  name: string
  what: string
  loop: [Actor, string][]
  ai: string[]
  me: string[]
  gate: string
}

export const LIFECYCLE: LifecycleStage[] = [
  {
    name: 'Design',
    what: 'Shape the product: who it is for, the flows they take, and how it should look and feel.',
    loop: [
      ['ai', 'AI drafts several directions'],
      ['me', 'I choose one and set the constraints'],
      ['ai', 'AI refines the chosen flow'],
    ],
    ai: ['Generates layout and flow options in minutes', 'Drafts copy, empty states and edge cases', 'Critiques contrast, accessibility and consistency'],
    me: ['Talks to users and decides the problem worth solving', 'Cuts scope to what matters for launch', 'Owns taste and makes the final call'],
    gate: 'Clickable flow signed off',
  },
  {
    name: 'Plan',
    what: 'Turn the design into an architecture, a task list and an estimate people can trust.',
    loop: [
      ['ai', 'AI proposes architectures and a task breakdown'],
      ['me', 'I weigh trade-offs and pick'],
      ['ai', 'AI turns it into tickets and risks'],
    ],
    ai: ['Drafts architecture options and a work breakdown', 'Lists risks, unknowns and edge cases early', 'Suggests effort ranges from similar work'],
    me: ['Chooses the architecture and the trade-offs', 'Sets milestones and what is out of scope', 'Sanity-checks every estimate against experience'],
    gate: 'Architecture and milestones agreed',
  },
  {
    name: 'Backend',
    what: 'Build the APIs, services, auth and business logic everything else depends on.',
    loop: [
      ['me', 'I define contracts and boundaries'],
      ['ai', 'AI pair-programs endpoints and tests'],
      ['me', 'I review every line before merge'],
    ],
    ai: ['Writes boilerplate, endpoints and fixtures', 'Generates unit and contract tests', 'Reviews diffs for bugs and security smells'],
    me: ['Designs data contracts and service boundaries', 'Decides on security, performance and failure handling', 'Reads and owns every change that merges'],
    gate: 'Contract tests green',
  },
  {
    name: 'Frontend',
    what: 'Build the interfaces people actually touch: web apps and dashboards.',
    loop: [
      ['ai', 'AI scaffolds components from the design'],
      ['me', 'I hold the UX quality bar'],
      ['ai', 'AI fills loading, empty and error states'],
    ],
    ai: ['Turns designs into component scaffolds', 'Writes every loading, empty and error state', 'Checks keyboard and screen-reader support'],
    me: ['Holds the bar on feel, speed and polish', 'Tests on real phones and slow networks', 'Decides what is good enough to ship'],
    gate: 'Core journeys work on phone and desktop',
  },
  {
    name: 'Data',
    what: 'Model the domain, build the pipelines, and get the data AI features depend on into shape.',
    loop: [
      ['me', 'I model the domain and its rules'],
      ['ai', 'AI drafts schemas, SQL and transforms'],
      ['me', 'I validate against real data'],
    ],
    ai: ['Drafts schemas, SQL and transformations', 'Profiles data and flags anomalies', 'Generates realistic synthetic test data'],
    me: ['Models the domain and what the data means', 'Decides retention, privacy and access', 'Defines what “clean” means and checks it'],
    gate: 'Data quality checks pass',
  },
  {
    name: 'AI',
    what: 'Add LLM features and agents: retrieval, tool use and multi-agent workflows, held to a measurable bar.',
    loop: [
      ['me', 'I decide where AI belongs and define “good”'],
      ['ai', 'Agents do the work; LLM judges score it'],
      ['me', 'I set guardrails, cost and latency budgets'],
    ],
    ai: ['Agents retrieve, reason and call tools', 'LLM judges grade outputs against ground truth', 'Generates hard eval cases and edge prompts'],
    me: ['Decides where AI helps and where it does not', 'Builds the eval set and the pass bar', 'Sets guardrails, cost and latency limits'],
    gate: 'Evals above the bar, guardrails tested',
  },
  {
    name: 'DevOps',
    what: 'Containers, CI/CD, infrastructure and monitoring, so shipping is boring and safe.',
    loop: [
      ['ai', 'AI drafts pipelines and infra config'],
      ['me', 'I approve every change to production'],
      ['ai', 'AI explains failures and suggests alerts'],
    ],
    ai: ['Writes Dockerfiles, pipelines and infra drafts', 'Explains failing builds and noisy logs', 'Suggests health checks and alerts'],
    me: ['Owns environments, secrets and access', 'Plans and rehearses the rollback', 'Sets the reliability targets that matter'],
    gate: 'Pipeline green, rollback rehearsed',
  },
  {
    name: 'Mobile',
    what: 'Native iOS and Android apps that feel at home on the device.',
    loop: [
      ['ai', 'AI helps with platform APIs and UI code'],
      ['me', 'I test on real devices'],
      ['ai', 'AI drafts review notes and test cases'],
    ],
    ai: ['Explains platform APIs and drafts UI code', 'Generates test cases for every screen', 'Drafts store review notes and release notes'],
    me: ['Makes it feel native, fast and private', 'Tests on real devices, not just simulators', 'Decides when it is ready for review'],
    gate: 'Test build passes on real devices',
  },
  {
    name: 'Growth',
    what: 'Get found: SEO, GEO (being cited by AI answers) and app store listings.',
    loop: [
      ['ai', 'AI drafts listings, metadata and variants'],
      ['me', 'I keep claims honest and on-brand'],
      ['ai', 'AI structures content to be cited'],
    ],
    ai: ['Drafts listing copy, keywords and metadata', 'Adds structured data so AI answers can cite it', 'Produces variants for testing'],
    me: ['Sets the positioning and keeps every claim true', 'Chooses what to measure', 'Edits for voice and clarity'],
    gate: 'Listing live, analytics reporting',
  },
  {
    name: 'Live',
    what: 'Launched, monitored, measured and handed over. Then the next iteration begins.',
    loop: [
      ['ai', 'AI summarises logs and feedback'],
      ['me', 'I read real usage and decide what is next'],
      ['ai', 'AI drafts docs and the handover'],
    ],
    ai: ['Summarises logs, errors and user feedback', 'Catches regressions with scheduled evals', 'Drafts documentation and incident notes'],
    me: ['Watches real usage, not vanity metrics', 'Decides the next iteration', 'Hands over cleanly to the team'],
    gate: 'In orbit. Mission complete.',
  },
]
