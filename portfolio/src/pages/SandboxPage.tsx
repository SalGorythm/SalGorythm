import { Activity, Cpu, FlaskConical, Gamepad2, KeyRound, LayoutGrid, ShieldHalf, Zap } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatBadge } from '../components/StatBadge'
import { STAT_KEYS, type StatKey } from '../constants/statsKeys'
import { useStats } from '../context/useStats'
import { trackOncePerSession } from '../lib/statsApi'
import { BoidsFlockSim } from '../sandbox/canvas/BoidsFlockSim'
import { FourierWaveCanvas } from '../sandbox/canvas/FourierWaveCanvas'
import { GeneticEvolutionSim } from '../sandbox/canvas/GeneticEvolutionSim'
import { CipherRush } from '../sandbox/games/CipherRush'
import { CyberTicTacToe } from '../sandbox/games/CyberTicTacToe'
import { GitMergePuzzle } from '../sandbox/games/GitMergePuzzle'
import { NeuralTuningSim } from '../sandbox/games/NeuralTuningSim'
import { NeonSimon } from '../sandbox/games/NeonSimon'
import { NeonSnake } from '../sandbox/games/NeonSnake'
import { PromptJailbreak } from '../sandbox/games/PromptJailbreak'
import { ReflexGate } from '../sandbox/games/ReflexGate'

type DashboardTab = 'arcade' | 'labs'

type GameId =
  | 'neural'
  | 'jailbreak'
  | 'gitmerge'
  | 'ttt'
  | 'simon'
  | 'reflex'
  | 'cipher'
  | 'snake'

type LabId = 'boids' | 'rockets' | 'fourier'

const GAMES: { id: GameId; title: string; blurb: string; icon: typeof Cpu; statKey: StatKey }[] = [
  {
    id: 'neural',
    title: 'Neural Tuning Sim',
    blurb: 'Train a micro-MLP on a spiral toy dataset with live decision regions.',
    icon: Cpu,
    statKey: STAT_KEYS.GAME_NEURAL,
  },
  {
    id: 'jailbreak',
    title: 'Prompt Injection Lab',
    blurb: 'Scripted guardian vs. your red-team prompts — no external LLM calls.',
    icon: ShieldHalf,
    statKey: STAT_KEYS.GAME_JAILBREAK,
  },
  {
    id: 'gitmerge',
    title: 'Git-Merge 2048',
    blurb: 'Slide commits toward MAIN while dodging CONFLICT blockers.',
    icon: Gamepad2,
    statKey: STAT_KEYS.GAME_GITMERGE,
  },
  {
    id: 'ttt',
    title: 'Cyber Tic-Tac-Toe',
    blurb: 'Classic grid with neon chrome and unbeatable minimax AI.',
    icon: Gamepad2,
    statKey: STAT_KEYS.GAME_TTT,
  },
  {
    id: 'simon',
    title: 'Neon Simon',
    blurb: 'Pattern memory on four glowing pads — each round adds a new pulse.',
    icon: LayoutGrid,
    statKey: STAT_KEYS.GAME_SIMON,
  },
  {
    id: 'reflex',
    title: 'Reflex Gate',
    blurb: 'Measure reaction time; early clicks register as faults.',
    icon: Zap,
    statKey: STAT_KEYS.GAME_REFLEX,
  },
  {
    id: 'cipher',
    title: 'Cipher Rush',
    blurb: 'Decode ROT-K ciphertext against four plaintext candidates.',
    icon: KeyRound,
    statKey: STAT_KEYS.GAME_CIPHER,
  },
  {
    id: 'snake',
    title: 'Neon Snake',
    blurb: 'Toroidal snake — wrap the grid, eat glitches, avoid self-intersection.',
    icon: Activity,
    statKey: STAT_KEYS.GAME_SNAKE,
  },
]

const LABS: { id: LabId; title: string; blurb: string; icon: typeof FlaskConical; statKey: StatKey }[] = [
  {
    id: 'boids',
    title: 'Boids Flock',
    blurb: '150+ agents, Reynolds rules, predators & attractors on click.',
    icon: FlaskConical,
    statKey: STAT_KEYS.LAB_BOIDS,
  },
  {
    id: 'rockets',
    title: 'GA Rockets',
    blurb: 'Genetic algorithm micro-rockets clearing a barrier to a target pad.',
    icon: Zap,
    statKey: STAT_KEYS.LAB_ROCKETS,
  },
  {
    id: 'fourier',
    title: 'Fourier Matrix',
    blurb: 'Mouse-warped harmonics — quantum, synapse, and gravity visual modes.',
    icon: Cpu,
    statKey: STAT_KEYS.LAB_FOURIER,
  },
]

export function SandboxPage() {
  const [dashboard, setDashboard] = useState<DashboardTab>('arcade')
  const [game, setGame] = useState<GameId>('neural')
  const [lab, setLab] = useState<LabId>('boids')
  const { increment } = useStats()

  const recordPlay = useCallback(
    (storageId: string, statKey: StatKey) => {
      trackOncePerSession(storageId, () => {
        void increment(statKey)
      })
    },
    [increment],
  )

  const selectGame = (id: GameId, statKey: StatKey) => {
    setGame(id)
    recordPlay(`sg-play-game-${id}`, statKey)
  }

  const selectLab = (id: LabId, statKey: StatKey) => {
    setLab(id)
    recordPlay(`sg-play-lab-${id}`, statKey)
  }

  useEffect(() => {
    recordPlay(`sg-play-game-neural`, STAT_KEYS.GAME_NEURAL)
  }, [recordPlay])

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="page-container">
        <header className="mb-10 flex flex-col gap-4 border-b border-cyan-500/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400/90">
              Weekend Hobbies · runs in your browser
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl">
              Sandbox <span className="text-cyan-300 text-glow-cyan">Arcade</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Mini-games and canvas simulations I build as a weekend hobby. Everything runs in your
              browser, with no telemetry and no backend.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            ← Portfolio
          </Link>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-800/90 bg-slate-900/40 p-2">
          <button
            type="button"
            onClick={() => {
              setDashboard('arcade')
              const entry = GAMES.find((g) => g.id === game)
              if (entry) recordPlay(`sg-play-game-${game}`, entry.statKey)
            }}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-mono text-xs uppercase tracking-wider transition sm:flex-none ${
              dashboard === 'arcade'
                ? 'border-cyan-500/45 bg-cyan-500/10 text-cyan-100'
                : 'border-transparent text-slate-400 hover:border-purple-500/25 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="h-4 w-4 shrink-0" aria-hidden />
            Classic arcade
          </button>
          <button
            type="button"
            onClick={() => {
              setDashboard('labs')
              const entry = LABS.find((l) => l.id === lab)
              if (entry) recordPlay(`sg-play-lab-${lab}`, entry.statKey)
            }}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-mono text-xs uppercase tracking-wider transition sm:flex-none ${
              dashboard === 'labs'
                ? 'border-purple-500/45 bg-purple-500/10 text-purple-100'
                : 'border-transparent text-slate-400 hover:border-cyan-500/25 hover:text-slate-200'
            }`}
          >
            <FlaskConical className="h-4 w-4 shrink-0" aria-hidden />
            Canvas labs
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-slate-950/60 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
          </div>

          {dashboard === 'arcade' ? (
            <>
              <div className="relative grid gap-3 border-b border-slate-800/90 p-3 sm:grid-cols-2 lg:grid-cols-4">
                {GAMES.map(({ id, title, blurb, icon: Icon, statKey }) => {
                  const active = game === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectGame(id, statKey)}
                      className={`rounded-xl border px-2.5 py-2.5 text-left transition sm:px-3 sm:py-3 ${
                        active
                          ? 'border-cyan-500/45 bg-cyan-500/10'
                          : 'border-slate-800/80 bg-slate-900/40 hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Icon className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden />
                        <StatBadge statKey={statKey} label="plays" />
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        Insert coin
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-100">{title}</p>
                      <p className="mt-1 text-[11px] leading-snug text-slate-300">{blurb}</p>
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
            </>
          ) : (
            <>
              <div className="relative grid gap-3 border-b border-slate-800/90 p-3 md:grid-cols-3">
                {LABS.map(({ id, title, blurb, icon: Icon, statKey }) => {
                  const active = lab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectLab(id, statKey)}
                      className={`rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? 'border-purple-500/45 bg-purple-500/10'
                          : 'border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Icon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden />
                        <StatBadge statKey={statKey} label="plays" />
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        Canvas module
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-100">{title}</p>
                      <p className="mt-1 text-[11px] leading-snug text-slate-300">{blurb}</p>
                    </button>
                  )
                })}
              </div>
              <div className="relative p-4 sm:p-6">
                {lab === 'boids' && <BoidsFlockSim />}
                {lab === 'rockets' && <GeneticEvolutionSim />}
                {lab === 'fourier' && <FourierWaveCanvas />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
