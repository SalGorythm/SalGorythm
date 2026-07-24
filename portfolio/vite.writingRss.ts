import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { buildWritingRssXml } from './src/lib/writingRss'

const rootDir = dirname(fileURLToPath(import.meta.url))

function writeWritingRss(outDir: string) {
  writeFileSync(resolve(outDir, 'writing.rss'), buildWritingRssXml(), 'utf8')
}

export function writingRssPlugin(): Plugin {
  return {
    name: 'writing-rss',
    buildStart() {
      writeWritingRss(resolve(rootDir, 'public'))
    },
    closeBundle() {
      writeWritingRss(resolve(rootDir, 'dist'))
    },
  }
}
