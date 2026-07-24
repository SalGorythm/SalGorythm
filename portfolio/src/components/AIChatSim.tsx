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
  'Good question. Details often sit under NDA in client work — try one of the suggested prompts for a straight answer on stack, availability, or how I ship LLMs.'

function matchReply(input: string): string {
  const t = input.trim().toLowerCase()
  if (!t) return 'Type a question or pick a prompt below.'

  for (const row of SUGGESTED) {
    if (row.match.some((m) => t.includes(m))) {
      if (row.q.startsWith('What is your tech stack')) {
        return (
          'Python and FastAPI for services, PostgreSQL and Confluent for data, TypeScript/React for product UI. ' +
          'On AI: LangChain, AutoGen, RAG, eval harnesses, and WatsonX / Granite / Llama in enterprise settings.'
        )
      }
      if (row.q.startsWith('Are you open to consulting')) {
        return (
          'Selective consulting where there is a clear sponsor and decision timeline. ' +
          'Strongest fit: GenAI rollout, secure analytics, and cloud data pipelines.'
        )
      }
      if (row.q.startsWith('Tell me about your local-first')) {
        return (
          'EasySalah keeps prayer data on-device. This portfolio\'s PDF and image tools never upload files. ' +
          'I prefer that pattern when the data is personal or sensitive.'
        )
      }
      if (row.q.startsWith('How do you approach LLM')) {
        return (
          'Versioned prompts, structured outputs, retrieval only when it helps, and regression tests on answer quality. ' +
          'Models get treated like any other service: logged, owned, and rollback-ready.'
        )
      }
      if (row.q.startsWith('What is your experience with cloud')) {
        return (
          'Idempotent ingestion, schema contracts, orchestration (Airflow and similar), and analytics layers on top. ' +
          'I have shipped on AWS, Azure, and GCP — usually with least-privilege access and cost visibility built in.'
        )
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
      text: 'Scripted FAQ — runs in your browser, no API keys. Ask about stack, consulting, local-first work, or LLM delivery.',
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
      <div className="page-container">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-purple-400/80">Runs locally</p>
          <h2
            id="recruiter-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Ask about my work
          </h2>
          <p className="mt-3 text-slate-300">
            Keyword-matched answers for common questions. Swap in a real backend when you want live
            model calls.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-purple-500/25 bg-slate-950/55 shadow-[0_0_35px_rgba(168,85,247,0.08)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-400">
            <span className="flex items-center gap-2 text-slate-300">
              <Bot className="h-4 w-4 text-purple-400" aria-hidden />
              FAQ chat
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300/90">
              offline
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
            <p className="mb-2 text-xs font-medium text-slate-500">Suggested questions</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED.map(({ q }) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => pushExchange(q)}
                  className="rounded-lg border border-slate-700/80 bg-slate-950/50 px-2.5 py-1.5 text-left text-xs text-cyan-200/90 transition hover:border-cyan-500/40"
                >
                  {q}
                </button>
              ))}
            </div>

            <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor={`${formId}-input`} className="sr-only">
                Your question
              </label>
              <input
                id={`${formId}-input`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="min-h-11 flex-1 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/30 placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2"
                autoComplete="off"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/25"
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
