import { Bot, Send, User } from 'lucide-react'
import { useCallback, useId, useRef, useState, type FormEvent } from 'react'

type Role = 'user' | 'assistant'

type Msg = { id: string; role: Role; text: string }

const SUGGESTED: { q: string; match: string[] }[] = [
  {
    q: 'What is your tech stack?',
    match: ['tech stack', 'stack', 'technologies'],
  },
  {
    q: 'Are you open to consulting?',
    match: ['consulting', 'contract', 'freelance', 'availability'],
  },
  {
    q: 'Tell me about your local-first apps?',
    match: ['local-first', 'local first', 'offline', 'device-only', 'on-device'],
  },
  {
    q: 'How do you approach LLM production?',
    match: ['llm', 'production', 'genai', 'models', 'rag'],
  },
  {
    q: 'What is your experience with cloud data platforms?',
    match: ['cloud', 'data platform', 'aws', 'azure', 'gcp', 'pipeline'],
  },
]

const DEFAULT_REPLY =
  "Thanks for the question. In live interviews I unpack specifics under NDA, but broadly: I align architecture to risk, ship measurable increments, and leave teams with runbooks—not just slides. Try one of the suggested prompts for a sharper signal."

function matchReply(input: string): string {
  const t = input.trim().toLowerCase()
  if (!t) return 'Enter a message or pick a suggested prompt below.'

  for (const row of SUGGESTED) {
    if (row.match.some((m) => t.includes(m))) {
      if (row.q.startsWith('What is your tech stack')) {
        return (
          'Core stack spans **Python** (analytics + services), **FastAPI** for APIs, **Go** where throughput matters, and **TypeScript/React** for product surfaces. ' +
          'Cloud-wise I work across **AWS, Azure, and GCP** with a bias toward observable, cost-aware data platforms. ' +
          'On AI: **LLM orchestration**, eval harnesses, RAG, and enterprise guardrails (including WatsonX-class and Granite/Llama-style mixes).'
        ).replace(/\*\*/g, '')
      }
      if (row.q.startsWith('Are you open to consulting')) {
        return (
          'Yes — selective consulting and advisory engagements that have a clear decision horizon and technical sponsor. ' +
          'I am strongest where data science meets platform architecture: GenAI rollout, secure analytics, and cloud-native pipelines.'
        )
      }
      if (row.q.startsWith('Tell me about your local-first')) {
        return (
          'Local-first work prioritizes **latency, privacy, and resilience**: encrypted on-device storage, background sync, and minimal server round-trips. ' +
          'I have shipped patterns for high-performance web (workers + IndexedDB) and mobile shells with offline operator workflows.'
        ).replace(/\*\*/g, '')
      }
      if (row.q.startsWith('How do you approach LLM')) {
        return (
          'Production LLMs need routing, evals, and rollback: baseline prompts, structured outputs, retrieval where it actually helps, ' +
          'and continuous regression tests on answer quality. I treat models like services — versioned, observed, and owned by a cross-functional pod.'
        )
      }
      if (row.q.startsWith('What is your experience with cloud')) {
        return (
          'I design **cloud-native** data paths: idempotent ingestion, schema contracts, orchestration, and semantic layers for analytics consumers. ' +
          'Security and FinOps are first-class — least privilege, partitioned accounts, and cost telemetry baked into the pipeline, not bolted on later.'
        ).replace(/\*\*/g, '')
      }
    }
  }
  return DEFAULT_REPLY
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return `m-${idCounter}`
}

export function AIChatSim() {
  const formId = useId()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: nextId(),
      role: 'assistant',
      text: 'Recruiter AI (simulated) — online. Ask about stack, consulting, local-first systems, or cloud data. No data leaves your browser.',
    },
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  const pushExchange = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Msg = { id: nextId(), role: 'user', text: trimmed }
    const reply: Msg = { id: nextId(), role: 'assistant', text: matchReply(trimmed) }
    setMessages((prev) => [...prev, userMsg, reply])
    setInput('')
    queueMicrotask(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    pushExchange(input)
  }

  return (
    <section
      id="recruiter"
      aria-labelledby="recruiter-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400/80">
            Client-side only · no API keys
          </p>
          <h2
            id="recruiter-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Recruiter <span className="text-cyan-300 text-glow-cyan">AI simulator</span>
          </h2>
          <p className="mt-3 text-slate-400">
            Instant, scripted responses for demo purposes. Replace with a real model when you wire
            your own backend.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-purple-500/25 bg-slate-950/55 shadow-[0_0_35px_rgba(168,85,247,0.08)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/50 px-4 py-2.5 font-mono text-[11px] text-slate-500">
            <span className="flex items-center gap-2 text-slate-300">
              <Bot className="h-4 w-4 text-purple-400" aria-hidden />
              recruiter-sim — tty1
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300/90">
              local
            </span>
          </div>

          <div className="max-h-[min(420px,55vh)] space-y-3 overflow-y-auto p-4 sm:p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    m.role === 'user'
                      ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300'
                      : 'border-purple-500/35 bg-purple-500/10 text-purple-300'
                  }`}
                >
                  {m.role === 'user' ? (
                    <User className="h-4 w-4" aria-hidden />
                  ) : (
                    <Bot className="h-4 w-4" aria-hidden />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-xl border px-3 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                    m.role === 'user'
                      ? 'border-cyan-500/25 bg-cyan-500/5 text-slate-100'
                      : 'border-slate-700/80 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-800/90 bg-slate-900/40 p-3 sm:p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Quick prompts
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED.map(({ q }) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => pushExchange(q)}
                  className="rounded-lg border border-slate-700/80 bg-slate-950/50 px-2.5 py-1.5 text-left font-mono text-[11px] text-cyan-200/90 transition hover:border-cyan-500/40 hover:shadow-[0_0_14px_rgba(34,211,238,0.1)]"
                >
                  {q}
                </button>
              ))}
            </div>

            <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor={`${formId}-input`} className="sr-only">
                Message to recruiter simulator
              </label>
              <input
                id={`${formId}-input`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="min-h-11 flex-1 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-100 outline-none ring-cyan-500/30 placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2"
                autoComplete="off"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-2.5 font-mono text-sm font-medium text-cyan-100 transition hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/25"
              >
                <Send className="h-4 w-4" aria-hidden />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
