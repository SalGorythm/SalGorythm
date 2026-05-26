import { Activity, Cpu, Gamepad2, KeyRound, LayoutGrid, ShieldHalf, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CipherRush } from '../sandbox/games/CipherRush'
import { CyberTicTacToe } from '../sandbox/games/CyberTicTacToe'
import { GitMergePuzzle } from '../sandbox/games/GitMergePuzzle'
import { NeuralTuningSim } from '../sandbox/games/NeuralTuningSim'
import { NeonSimon } from '../sandbox/games/NeonSimon'
import { NeonSnake } from '../sandbox/games/NeonSnake'
import { PromptJailbreak } from '../sandbox/games/PromptJailbreak'
import { ReflexGate } from '../sandbox/games/ReflexGate'

type GameId =
  | 'neural'
  | 'jailbreak'
  | 'gitmerge'
  | 'ttt'
  | 'simon'
  | 'reflex'
  | 'cipher'
  | 'snake'

const GAMES: { id: GameId; title: string; blurb: string; icon: typeof Cpu }[] = [
  {
    id: 'neural',
    title: 'Neural Tuning Sim',
    blurb: 'Train a micro-MLP on a spiral toy dataset with live decision regions.',
    icon: Cpu,
  },
  {
    id: 'jailbreak',
    title: 'Prompt Injection Lab',
    blurb: 'Scripted guardian vs. your red-team prompts — no external LLM calls.',
    icon: ShieldHalf,
  },
  {
    id: 'gitmerge',
    title: 'Git-Merge 2048',
    blurb: 'Slide commits toward MAIN while dodging CONFLICT blockers.',
    icon: Gamepad2,
  },
  {
    id: 'ttt',
    title: 'Cyber Tic-Tac-Toe',
    blurb: 'Classic grid with neon chrome and unbeatable minimax AI.',
    icon: Gamepad2,
  },
  {
    id: 'simon',
    title: 'Neon Simon',
    blurb: 'Pattern memory on four glowing pads — each round adds a new pulse.',
    icon: LayoutGrid,
  },
  {
    id: 'reflex',
    title: 'Reflex Gate',
    blurb: 'Measure reaction time; early clicks register as faults.',
    icon: Zap,
  },
  {
    id: 'cipher',
    title: 'Cipher Rush',
    blurb: 'Decode ROT-K ciphertext against four plaintext candidates.',
    icon: KeyRound,
  },
  {
    id: 'snake',
    title: 'Neon Snake',
    blurb: 'Toroidal snake — wrap the grid, eat glitches, avoid self-intersection.',
    icon: Activity,
  },
]

export function SandboxPage() {
  const [game, setGame] = useState<GameId>('neural')

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-cyan-500/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400/90">
              Local-first · client only
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Sandbox <span className="text-cyan-300 text-glow-cyan">Arcade</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Mini-games run entirely in the browser — no telemetry, no backend. Same cyber-noir
              shell as the portfolio route.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            ← Portfolio
          </Link>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-slate-950/60 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-md">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
          >
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
          </div>

          <div className="relative grid gap-3 border-b border-slate-800/90 p-3 sm:grid-cols-2 lg:grid-cols-4">
            {GAMES.map(({ id, title, blurb, icon: Icon }) => {
              const active = game === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGame(id)}
                  className={`rounded-xl border px-2.5 py-2.5 text-left transition sm:px-3 sm:py-3 ${
                    active
                      ? 'border-cyan-500/45 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-purple-500/30'
                  }`}
                >
                  <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Insert coin
                  </p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-100">{title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-400">{blurb}</p>
                </button>
              )
            })}
          </div>

          <div className="relative p-4 sm:p-6">
            {game === 'neural' && <NeuralTuningSim />}
            {game === 'jailbreak' && <PromptJailbreak />}
            {game === 'gitmerge' && <GitMergePuzzle />}
            {game === 'ttt' && <CyberTicTacToe />}
            {game === 'simon' && <NeonSimon />}
            {game === 'reflex' && <ReflexGate />}
            {game === 'cipher' && <CipherRush />}
            {game === 'snake' && <NeonSnake />}
          </div>
        </div>
      </div>
    </div>
  )
}
