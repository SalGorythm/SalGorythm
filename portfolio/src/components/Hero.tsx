import { ArrowDownRight, Cpu, Shield, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 pb-20 pt-28 sm:pt-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-slate-900/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/90 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Online · Secure channel
            </p>

            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
              >
                <span className="text-glow-cyan bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Senior Data Scientist
                </span>
                <br />
                <span className="text-slate-200">& Consultant</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Eight-plus years shipping enterprise analytics, cybersecurity-informed
                data platforms, and production LLM systems — from EY-grade consulting
                to cloud-native pipelines and multi-model orchestration.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/15"
              >
                View signal
                <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-500/40 hover:text-purple-200"
              >
                Open channel
              </a>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: 'GenAI & LLMs', value: 'Prod deploys' },
                { icon: Cpu, label: 'Data platforms', value: 'Cloud-native' },
                { icon: Shield, label: 'Security lens', value: 'Enterprise' },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-800/90 bg-slate-900/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition hover:border-cyan-500/25 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                >
                  <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-500/80">
                    <Icon className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 blur-2xl"
              aria-hidden
            />
            <article className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-900/40 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-md">
              <header className="mb-4 flex items-center justify-between border-b border-slate-700/80 pb-3 font-mono text-[11px] text-slate-500">
                <span className="flex items-center gap-2 text-cyan-400/90">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  session.log
                </span>
                <span className="text-purple-400/80">v2.6.0</span>
              </header>
              <pre className="font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
                <code>
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-cyan-300">operator</span>
                  {' = '}
                  <span className="text-amber-200/90">{`{`}</span>
                  {'\n'}
                  <span className="text-slate-500">  </span>
                  <span className="text-cyan-200">role</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-emerald-300/90">&apos;Senior DS / Consultant&apos;</span>
                  <span className="text-slate-600">,</span>
                  {'\n'}
                  <span className="text-slate-500">  </span>
                  <span className="text-cyan-200">experienceYears</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-amber-200">8</span>
                  <span className="text-slate-600">,</span>
                  {'\n'}
                  <span className="text-slate-500">  </span>
                  <span className="text-cyan-200">domains</span>
                  <span className="text-slate-500">: [</span>
                  <span className="text-emerald-300/90">&apos;LLM arch&apos;</span>
                  <span className="text-slate-600">, </span>
                  <span className="text-emerald-300/90">&apos;cyber data&apos;</span>
                  <span className="text-slate-600">, </span>
                  <span className="text-emerald-300/90">&apos;local-first&apos;</span>
                  <span className="text-slate-500">]</span>
                  {'\n'}
                  <span className="text-amber-200/90">{`}`}</span>
                  <span className="text-slate-600">;</span>
                </code>
              </pre>
              <p className="mt-4 border-t border-slate-700/60 pt-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Integrity checksum: OK · Zero-trust posture
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
