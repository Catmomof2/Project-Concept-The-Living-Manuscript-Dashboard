import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'living-manuscript-v1'

// Starter data — Mandy's real manuscripts as of 2026-11-06.
// Everything here is editable in the app, and saved in the browser only.
const SEED = [
  {
    id: 'letters-house-kept',
    title: 'The Letters the House Kept',
    kind: 'Gothic novella',
    status: 'Drafting',
    current: 2070,
    goal: 25000,
    unit: 'words',
    deadline: '2026-11-30',
    notes: 'Writing.com November Marathon. Ch. 1–2 done — Wren, aunt Miriam, Moth the grey cat, letters “For Thomas”.',
  },
  {
    id: 'pji-prize',
    title: 'Poetic Justice Institute Prize Manuscript',
    kind: 'Poetry manuscript',
    status: 'Drafting',
    current: 504,
    goal: 1250,
    unit: 'lines',
    deadline: '2026-11-15',
    notes: 'Anchored by “The Things the Fire Couldn’t Steal” (208 lines). Needs 50 pages minimum — about 20–22 pages so far.',
  },
  {
    id: 'what-the-fire-left',
    title: 'What the Fire Left',
    kind: 'Memoir',
    status: 'Publishing',
    current: 114,
    goal: 114,
    unit: 'pages',
    deadline: '',
    notes: 'Paperback 114pp, hardcover 99pp. Fixed cover + interior waiting on re-upload to KDP.',
  },
  {
    id: 'warden-clockwork',
    title: 'The Warden of the Clockwork',
    kind: 'Gothic mystery',
    status: 'Beta reading',
    current: 6896,
    goal: 6896,
    unit: 'words',
    deadline: '',
    notes: 'About 6,896 words, 11 chapters in 3 parts. With beta reader “Writing on the Side”.',
  },
  {
    id: 'ashes-ink',
    title: 'Ashes & Ink',
    kind: 'Chapbook',
    status: 'Done',
    current: 18,
    goal: 18,
    unit: 'pieces',
    deadline: '',
    notes: 'Bound Oct 22 — 18 pieces: 11 poems, 7 letters.',
  },
  {
    id: 'times-tears',
    title: "Time's Tears",
    kind: 'Gothic fantasy novel',
    status: 'Launch prep',
    current: null,
    goal: null,
    unit: 'words',
    deadline: '',
    notes: 'Book 1 of 4. Invented-choices approval sheet delivered Oct 14 — decisions still open.',
  },
  {
    id: 'authors-fee',
    title: "The Author's Fee",
    kind: 'Sequel novella',
    status: 'Planning',
    current: null,
    goal: null,
    unit: 'words',
    deadline: '',
    notes: "Time's Tears Book 2. Parked while the marathon novella runs.",
  },
]

const STATUS_STYLES = {
  Drafting: 'bg-amber-100 text-amber-900',
  'Beta reading': 'bg-sky-100 text-sky-900',
  Publishing: 'bg-violet-100 text-violet-900',
  'Launch prep': 'bg-rose-100 text-rose-900',
  Done: 'bg-emerald-100 text-emerald-900',
  Planning: 'bg-stone-200 text-stone-700',
}

const FILTERS = ['All', 'Drafting', 'Beta reading', 'Publishing', 'Launch prep', 'Done', 'Planning']

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(`${dateStr}T00:00:00`)
  return Math.round((d - today) / 86400000)
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : SEED
  } catch {
    return SEED
  }
}

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}-log`) || '[]')
  } catch {
    return []
  }
}

export default function App() {
  const [manuscripts, setManuscripts] = useState(load)
  const [log, setLog] = useState(loadLog)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', kind: '', status: 'Drafting', goal: '', unit: 'words', deadline: '', notes: '',
  })
  const [amounts, setAmounts] = useState({})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manuscripts))
  }, [manuscripts])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-log`, JSON.stringify(log))
  }, [log])

  const todayStr = new Date().toISOString().slice(0, 10)
  const wordsToday = log
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0)

  const totalWords = manuscripts
    .filter((m) => m.unit === 'words' && m.current)
    .reduce((sum, m) => sum + m.current, 0)

  const inProgress = manuscripts.filter((m) => m.status !== 'Done').length

  const nextDeadline = useMemo(() => {
    const upcoming = manuscripts
      .filter((m) => m.deadline)
      .map((m) => ({ ...m, days: daysUntil(m.deadline) }))
      .filter((m) => m.days !== null && m.days >= 0)
      .sort((a, b) => a.days - b.days)
    return upcoming[0] || null
  }, [manuscripts])

  const visible = manuscripts.filter((m) => {
    if (filter !== 'All' && m.status !== filter) return false
    if (query && !`${m.title} ${m.kind} ${m.notes}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  function addWords(id, unit) {
    const amount = parseInt(amounts[id] || '', 10)
    if (!amount || amount <= 0) return
    setManuscripts((list) =>
      list.map((m) =>
        m.id === id ? { ...m, current: (m.current || 0) + amount } : m,
      ),
    )
    if (unit === 'words') {
      setLog((old) => [...old, { date: todayStr, manuscriptId: id, amount }])
    }
    setAmounts((old) => ({ ...old, [id]: '' }))
  }

  function addManuscript(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const goal = form.goal ? parseInt(form.goal, 10) : null
    setManuscripts((list) => [
      ...list,
      {
        id: `m-${Date.now()}`,
        title: form.title.trim(),
        kind: form.kind.trim() || 'Manuscript',
        status: form.status,
        current: 0,
        goal,
        unit: form.unit,
        deadline: form.deadline,
        notes: form.notes.trim(),
      },
    ])
    setForm({ title: '', kind: '', status: 'Drafting', goal: '', unit: 'words', deadline: '', notes: '' })
    setShowForm(false)
  }

  function removeManuscript(id) {
    if (!globalThis.confirm('Remove this manuscript from the dashboard?')) return
    setManuscripts((list) => list.filter((m) => m.id !== id))
  }

  function resetStarter() {
    if (!globalThis.confirm('Reset the dashboard to the starter manuscripts? Your edits will be replaced.')) return
    setManuscripts(SEED)
    setLog([])
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Catmomof2 · Living Manuscript
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
            The Living Manuscript Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Every manuscript in one place — what&rsquo;s drafting, what&rsquo;s
            waiting, and what&rsquo;s due next. Log words as you write; it all
            saves in your browser.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">Words today</p>
            <p className="mt-1 font-serif text-3xl font-bold">{wordsToday.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">Total words tracked</p>
            <p className="mt-1 font-serif text-3xl font-bold">{totalWords.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">In progress</p>
            <p className="mt-1 font-serif text-3xl font-bold">{inProgress} / {manuscripts.length}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-stone-500">Next deadline</p>
            {nextDeadline ? (
              <>
                <p className="mt-1 font-serif text-xl font-bold leading-tight">{nextDeadline.title}</p>
                <p className="text-sm text-stone-600">
                  {nextDeadline.deadline} · {nextDeadline.days === 0 ? 'due today' : `${nextDeadline.days} days left`}
                </p>
              </>
            ) : (
              <p className="mt-1 font-serif text-xl font-bold">Nothing dated</p>
            )}
          </div>
        </section>

        {/* Controls */}
        <section className="mt-6 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manuscripts…"
            className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            {showForm ? 'Close form' : '+ Add manuscript'}
          </button>
          <button
            type="button"
            onClick={resetStarter}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
          >
            Reset starter data
          </button>
        </section>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                filter === f ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={addManuscript} className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="font-serif text-lg font-bold">Add a manuscript</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Title
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
              </label>
              <label className="text-sm">
                Kind
                <input value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} placeholder="e.g. Gothic novella" className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
              </label>
              <label className="text-sm">
                Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2">
                  {FILTERS.slice(1).map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="text-sm">
                Unit
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2">
                  <option value="words">words</option>
                  <option value="lines">lines</option>
                  <option value="pages">pages</option>
                  <option value="pieces">pieces</option>
                </select>
              </label>
              <label className="text-sm">
                Goal (optional)
                <input type="number" min="0" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
              </label>
              <label className="text-sm">
                Deadline (optional)
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                Notes
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
              </label>
            </div>
            <button type="submit" className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700">
              Add to dashboard
            </button>
          </form>
        )}

        {/* Cards */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {visible.map((m) => {
            const pct = m.goal && m.current != null ? Math.min(100, Math.round((m.current / m.goal) * 100)) : null
            const days = daysUntil(m.deadline)
            return (
              <article key={m.id} className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold leading-snug">{m.title}</h2>
                    <p className="mt-0.5 text-sm text-stone-500">{m.kind}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[m.status] || 'bg-stone-200 text-stone-700'}`}>
                    {m.status}
                  </span>
                </div>

                {pct !== null ? (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{(m.current || 0).toLocaleString()} / {m.goal.toLocaleString()} {m.unit}</span>
                      <span className="text-stone-500">{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full rounded-full bg-stone-900" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">No count goal set yet.</p>
                )}

                {m.deadline && (
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">Due {m.deadline}</span>
                    <span className="text-stone-500">
                      {' '}· {days === 0 ? 'due today' : days > 0 ? `${days} days left` : `${Math.abs(days)} days overdue`}
                    </span>
                  </p>
                )}

                {m.notes && <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.notes}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
                  <input
                    type="number"
                    min="1"
                    placeholder={`Add ${m.unit}`}
                    value={amounts[m.id] || ''}
                    onChange={(e) => setAmounts({ ...amounts, [m.id]: e.target.value })}
                    className="w-32 rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => addWords(m.id, m.unit)}
                    className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-stone-700"
                  >
                    Log it
                  </button>
                  <button
                    type="button"
                    onClick={() => removeManuscript(m.id)}
                    className="ml-auto text-sm text-stone-400 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            )
          })}
        </section>

        {visible.length === 0 && (
          <p className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white p-6 text-center text-stone-500">
            Nothing matches that filter. Try another status, or add a manuscript.
          </p>
        )}

        <footer className="mt-8 border-t border-stone-200 pt-4 text-center text-xs text-stone-400">
          Living Manuscript · Vite + React + Tailwind CSS · Data saves in this browser only.
        </footer>
      </main>
    </div>
  )
}
