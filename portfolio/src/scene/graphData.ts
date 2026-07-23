import type { SceneSectionId } from '../constants/sections'
import { ARTICLE_SLUGS } from '../data/articles'

export type GraphNode = {
  id: string
  label: string
  sectionId?: SceneSectionId
  articleSlug?: string
  routePath?: string
  position: [number, number, number]
  scale: number
  color: 'cyan' | 'purple' | 'emerald' | 'ice' | 'amber'
  cluster: 'core' | 'ibm' | 'ey' | 'demos' | 'apps' | 'general' | 'writing'
}

const CLUSTER_COLORS = {
  core: 'ice' as const,
  ibm: 'purple' as const,
  ey: 'cyan' as const,
  demos: 'emerald' as const,
  apps: 'purple' as const,
  general: 'cyan' as const,
  writing: 'amber' as const,
}

function satellite(
  id: string,
  label: string,
  position: [number, number, number],
  cluster: GraphNode['cluster'],
  opts?: { sectionId?: SceneSectionId; articleSlug?: string; routePath?: string; scale?: number },
): GraphNode {
  return {
    id,
    label,
    sectionId: opts?.sectionId,
    articleSlug: opts?.articleSlug,
    routePath: opts?.routePath,
    position,
    scale: opts?.scale ?? 0.35,
    color: CLUSTER_COLORS[cluster],
    cluster,
  }
}

/** Writing cluster nodes orbit a anchor point. */
function writingSatellites(): GraphNode[] {
  const anchor: [number, number, number] = [3.2, 0.4, 0.2]
  const radius = 1.1
  return ARTICLE_SLUGS.map((slug, i) => {
    const angle = (i / ARTICLE_SLUGS.length) * Math.PI * 2
    return satellite(
      `writing-${slug}`,
      slug.replace(/-/g, ' ').slice(0, 18),
      [anchor[0] + Math.cos(angle) * radius, anchor[1] + Math.sin(i * 0.7) * 0.4, anchor[2] + Math.sin(angle) * radius],
      'writing',
      { articleSlug: slug, scale: 0.18 },
    )
  })
}

const BASE_NODES: GraphNode[] = [
  {
    id: 'core',
    label: 'SalGorythm',
    sectionId: 'hero',
    position: [0, 0, 0],
    scale: 0.55,
    color: 'ice',
    cluster: 'core',
  },
  satellite('ibm-agents', 'IBM Agents', [-2.2, 0.8, -0.5], 'ibm', { sectionId: 'case-studies', scale: 0.42 }),
  satellite('ey-atom', 'EY Atom', [-1.8, -0.6, 1.2], 'ey', { sectionId: 'case-studies', scale: 0.4 }),
  satellite('ey-quark', 'EY Quark', [-2.5, -0.2, -1], 'ey', { sectionId: 'case-studies', scale: 0.36 }),
  satellite('live-demos', 'Live demos', [2.1, 0.5, 0.8], 'demos', { sectionId: 'live-demos', scale: 0.38 }),
  satellite('sandbox', 'Sandbox', [2.5, -0.3, -0.6], 'demos', { sectionId: 'live-demos', scale: 0.3 }),
  satellite('engineering', 'Trade-offs', [0.8, 1.6, -1.5], 'general', { sectionId: 'engineering-log', scale: 0.32 }),
  satellite('writing-hub', 'Writing', [3.2, 0.4, 0.2], 'writing', { routePath: '/writing', scale: 0.38 }),
  satellite('experience', 'Experience', [-1.2, -1.2, -1.8], 'general', { sectionId: 'experience', scale: 0.34 }),
  satellite('projects', 'Projects', [1.8, -1, 1.5], 'general', { sectionId: 'projects', scale: 0.36 }),
  satellite('skills', 'Stack', [0, -1.8, 1.2], 'general', { sectionId: 'skills', scale: 0.3 }),
  satellite('casette', 'Casette', [2.2, 1.2, -1.2], 'apps', { sectionId: 'my-apps', scale: 0.34 }),
  satellite('easysalah', 'EasySalah', [1.5, 1.8, 0.2], 'apps', { sectionId: 'my-apps', scale: 0.32 }),
  satellite('resume', 'Résumé', [0, -0.8, -2.2], 'general', { sectionId: 'resume', scale: 0.28 }),
  satellite('contact', 'Contact', [0.5, 0.3, 2.2], 'general', { sectionId: 'contact', scale: 0.3 }),
]

export const GRAPH_NODES: GraphNode[] = [...BASE_NODES, ...writingSatellites()]

export const GRAPH_EDGES: [string, string][] = [
  ...GRAPH_NODES.filter((n) => n.id !== 'core' && n.cluster !== 'writing').map((n) => ['core', n.id] as [string, string]),
  ...writingSatellites().map((n) => ['writing-hub', n.id] as [string, string]),
]

export const NODE_COLORS: Record<GraphNode['color'], string> = {
  cyan: '#22d3ee',
  purple: '#c084fc',
  emerald: '#34d399',
  ice: '#e2e8f0',
  amber: '#fbbf24',
}

export const CLUSTER_FOR_SECTION: Partial<Record<SceneSectionId, GraphNode['cluster']>> = {
  hero: 'core',
  credibility: 'core',
  'case-studies': 'ibm',
  'live-demos': 'demos',
  'engineering-log': 'general',
  about: 'core',
  experience: 'general',
  projects: 'general',
  skills: 'general',
  'my-apps': 'apps',
  objections: 'core',
  resume: 'general',
  contact: 'core',
}

export function getNodeById(id: string) {
  return GRAPH_NODES.find((n) => n.id === id)
}
