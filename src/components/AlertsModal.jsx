import { useState, useEffect } from 'react'
import {
  Bell, X, ChevronLeft, ChevronDown, Plus, Check, MoreVertical, Pencil, Trash2,
  Shield, TrendingUp, CalendarDays, PenLine, ArrowUp, Clock,
} from 'lucide-react'
import { loadAlerts, saveAlerts } from '../lib/alerts'

const METRICS = [
  { k: 'Topic volume', mv: 47, from: '1,240', to: '1,824', unit: 'mentions', spark: [3, 4, 4, 6, 7, 9, 12] },
  { k: 'Impressions', mv: 32, from: '890K', to: '1.17M', unit: 'impressions', spark: [5, 5, 6, 6, 7, 8, 9] },
  { k: 'Positive sentiment', mv: 18, from: '58%', to: '68%', unit: 'positive share', spark: [6, 6, 7, 6, 7, 7, 8] },
  { k: 'Negative sentiment', mv: 28, from: '210', to: '269', unit: 'negative mentions', spark: [4, 5, 5, 6, 6, 8, 9] },
  { k: 'Engagements', mv: 12, from: '5.1K', to: '5.7K', unit: 'engagements', spark: [5, 6, 5, 6, 6, 6, 7] },
  { k: 'Share of voice', mv: 8, from: '6.2%', to: '6.7%', unit: 'share of voice', spark: [4, 4, 5, 4, 5, 5, 5] },
]
const ALL_KEYS = METRICS.map(m => m.k)
const THRESHOLD = { low: 35, medium: 25, high: 10 }
const SENS = {
  low: { t: 'Only major spikes', word: 'highest-signal' },
  medium: { t: 'Balanced', word: 'balanced' },
  high: { t: 'Catch everything', word: 'broad' },
}
const DELIVERIES = ['Daily', 'Weekly']
const SEND_TIME = '9:00 AM'
const ME = 'sujith@gohighlevel.com'

const DRIVER = {
  badge: 'in',
  platform: 'LinkedIn',
  lift: 62,
  post: 'HighLevel just shipped the one feature we have all been waiting for — this changes how we run client reporting. 🚀',
  author: '@growthmarketer',
  engagement: '4.2K reactions · 312 reposts',
}

const RECIPE_ICON = { rep: Shield, mom: TrendingUp, pulse: CalendarDays, scratch: PenLine }
const RECIPE_TINT = {
  rep: 'bg-red-50 text-negative',
  mom: 'bg-hl-blue-light text-hl-blue',
  pulse: 'bg-green-50 text-positive',
  scratch: 'bg-neutral-100 text-neutral-600',
}
const RECIPES = {
  rep: { name: 'Reputation guard', icon: 'rep', metrics: ['Negative sentiment'], sens: 'high', delivery: 'Daily' },
  mom: { name: 'Momentum watch', icon: 'mom', metrics: ['Topic volume', 'Impressions'], sens: 'medium', delivery: 'Daily' },
  pulse: { name: 'Weekly pulse', icon: 'pulse', metrics: [...ALL_KEYS], sens: 'medium', delivery: 'Weekly' },
  scratch: { name: 'New alert', icon: 'scratch', metrics: [...ALL_KEYS], sens: 'medium', delivery: 'Daily' },
}
const TEMPLATES = [
  { id: 'default', nm: 'Social Listening default', brandClass: 'bg-hl-blue', accentText: 'text-hl-blue', logo: 'SL', brandName: 'Social Listening', isDefault: true, skin: 'product' },
  { id: 'news', nm: 'Brand — Newsletter', brandClass: 'bg-positive', accentText: 'text-positive', logo: 'BR', brandName: 'Your Brand', skin: 'newsletter', tagline: 'Your weekly social intelligence' },
  { id: 'min', nm: 'Brand — Minimal', brandClass: 'bg-neutral-900', accentText: 'text-neutral-900', logo: 'BR', brandName: 'Your Brand', skin: 'minimal' },
]

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function nextMonday() {
  const now = new Date()
  const add = (1 - now.getDay() + 7) % 7
  const next = new Date(now)
  next.setDate(now.getDate() + add)
  return `${WEEKDAY_NAMES[next.getDay()]}, ${MONTH_NAMES[next.getMonth()]} ${next.getDate()}`
}
function delShort(d) {
  return d === 'Weekly' ? `weekly summary at ${SEND_TIME}` : `daily digest at ${SEND_TIME}`
}
function alertSummary(a) {
  const ms = a.metrics.length === METRICS.length ? 'All metrics' : a.metrics.join(' & ')
  const who = a.recipients.length === 1 ? 'you' : `${a.recipients.length} people`
  return `${ms} · ${delShort(a.delivery)} → ${who}`
}
function recipeDraft(key) {
  const r = RECIPES[key]
  return { name: r.name, icon: r.icon, metrics: [...r.metrics], sens: r.sens, delivery: r.delivery, recipients: [ME], template: 'default' }
}
function alertToDraft(a) {
  return { name: a.name, icon: a.icon, metrics: [...a.metrics], sens: a.sens, delivery: a.delivery, recipients: [...a.recipients], template: a.template }
}

function Sparkline({ data, className, w = 50, h = 16 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function AgencyLogo({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="12" y1="12" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="12" y1="12" x2="18.4" y2="17.2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="4" r="2.1" fill="currentColor" />
      <circle cx="18.4" cy="17.2" r="1.9" fill="currentColor" />
    </svg>
  )
}

export default function AlertsModal({ open, onClose, topicName, isSaved, onSaveTopic, onAlertsChange }) {
  const [alerts, setAlerts] = useState(() => loadAlerts(topicName))
  const [view, setView] = useState(isSaved ? 'manage' : 'gate')
  const [menuId, setMenuId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showTpl, setShowTpl] = useState(false)
  const [recipientInput, setRecipientInput] = useState('')
  const [metricsOpen, setMetricsOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (menuId == null) return
    function onDown(e) { if (!e.target.closest('[data-alert-menu]')) setMenuId(null) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuId])

  useEffect(() => {
    if (!metricsOpen) return
    function onDown(e) { if (!e.target.closest('[data-metrics-dd]')) setMetricsOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [metricsOpen])

  useEffect(() => {
    if (!showTpl) return
    function onDown(e) { if (!e.target.closest('[data-tpl-dd]')) setShowTpl(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showTpl])

  if (!open) return null

  function commit(next) {
    setAlerts(next)
    saveAlerts(topicName, next)
    onAlertsChange?.(next.length)
  }

  function startCreate(key) {
    setDraft(recipeDraft(key))
    setEditingId(null)
    setShowTpl(false)
    setRecipientInput('')
    setMetricsOpen(false)
    setView('create')
  }

  function startEdit(a) {
    setDraft(alertToDraft(a))
    setEditingId(a.id)
    setMenuId(null)
    setShowTpl(false)
    setRecipientInput('')
    setMetricsOpen(false)
    setView('create')
  }

  function backToManage() {
    setDraft(null)
    setEditingId(null)
    setMetricsOpen(false)
    setView('manage')
  }

  function saveDraft() {
    if (!draft || draft.recipients.length === 0 || draft.metrics.length === 0) return
    if (editingId) {
      commit(alerts.map(a => (a.id === editingId ? { ...a, ...draft, id: a.id, paused: a.paused } : a)))
    } else {
      commit([...alerts, { ...draft, id: Date.now(), paused: false }])
    }
    backToManage()
  }

  function gateSave() {
    onSaveTopic?.()
    startCreate('scratch')
  }

  const isWide = view === 'create'

  // ── Gate ──
  if (view === 'gate') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-[430px] max-w-full overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <div className="w-11 h-11 rounded-xl bg-hl-blue-light text-hl-blue flex items-center justify-center mb-4">
              <Bell size={22} />
            </div>
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-1.5">Save this search to set up an alert</h3>
            <p className="text-[13px] text-neutral-600 mb-4">Alerts can only be created for saved topics. Want to save this search as a topic first?</p>
            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Topic name</label>
            <input
              className="w-full h-10 border border-neutral-300 rounded-lg px-3 text-[14px] text-neutral-900 focus:outline-2 focus:outline-hl-blue focus:border-hl-blue"
              defaultValue={topicName}
            />
          </div>
          <div className="px-6 py-3.5 bg-gray-50 border-t border-neutral-200 flex justify-end gap-2.5">
            <button onClick={onClose} className="h-10 px-4 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-[14px] font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={gateSave} className="h-10 px-4 rounded-lg bg-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue-dark transition-colors">Save &amp; continue</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col max-h-[88vh] overflow-hidden transition-[max-width] ${isWide ? 'max-w-[940px]' : 'max-w-[560px]'}`}
        onClick={e => e.stopPropagation()}
      >
        {view === 'manage' ? ManageView() : CreateView()}
      </div>
    </div>
  )

  // ── Manage ──
  function ManageView() {
    const n = alerts.length
    const free = 3 - n
    return (
      <>
        <div className="px-5 py-4 border-b border-neutral-200 flex items-start gap-3">
          <div className="w-[34px] h-[34px] rounded-lg bg-hl-blue-light text-hl-blue flex items-center justify-center shrink-0"><Bell size={18} /></div>
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-neutral-900 leading-tight">Alerts</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">for "{topicName}"</p>
          </div>
          {n > 0 && <span className="text-[12px] font-semibold text-neutral-500 tabular-nums mt-1 shrink-0">{n} <span className="text-neutral-300">/</span> 3</span>}
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg text-neutral-500 hover:bg-neutral-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="p-5 overflow-y-auto">
          {n === 0 ? (
            <div className="text-center px-3 pt-6 pb-5">
              <div className="w-[54px] h-[54px] rounded-2xl bg-hl-blue-light text-hl-blue flex items-center justify-center mx-auto mb-4"><Bell size={26} strokeWidth={1.7} /></div>
              <h4 className="text-[16px] font-semibold text-neutral-900 mb-1.5">Get notified when things move</h4>
              <p className="text-[13px] text-neutral-500 max-w-[32ch] mx-auto mb-[18px]">Set up to 3 alerts for this topic.</p>
              <button onClick={() => startCreate('scratch')} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue-dark transition-colors mx-auto">
                <Plus size={15} /> New alert
              </button>
              <div className="text-[12px] text-neutral-500 mt-4">
                or start from a recipe
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {['rep', 'mom', 'pulse'].map(k => (
                    <button key={k} onClick={() => startCreate(k)} className="text-[12px] font-semibold text-neutral-700 border border-neutral-200 rounded-full px-3 py-1.5 hover:border-hl-blue-border hover:text-hl-blue hover:bg-hl-blue-light transition-colors">
                      {RECIPES[k].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2.5">
                {alerts.map(a => <AlertRow key={a.id} a={a} />)}
              </div>

              {free > 0 ? (
                <button onClick={() => startCreate('scratch')} className="mt-3.5 w-full border border-dashed border-neutral-300 rounded-xl py-3 text-[14px] font-semibold text-hl-blue flex items-center justify-center gap-2 hover:border-hl-blue-border hover:bg-hl-blue-light transition-colors">
                  <Plus size={17} /> New alert
                </button>
              ) : (
                <>
                  <button disabled className="mt-3.5 w-full border border-dashed border-neutral-200 rounded-xl py-3 text-[14px] font-semibold text-neutral-400 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Plus size={17} /> New alert
                  </button>
                  <p className="mt-2.5 text-[12px] text-neutral-500 text-center">3 of 3 used — delete one to add another.</p>
                </>
              )}
            </>
          )}
        </div>
      </>
    )
  }

  function AlertRow({ a }) {
    const Icon = RECIPE_ICON[a.icon] || PenLine
    return (
      <div className={`relative border border-neutral-200 rounded-xl px-3.5 py-3 flex items-center gap-3 ${a.paused ? 'bg-gray-50' : ''}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${RECIPE_TINT[a.icon] || RECIPE_TINT.scratch}`}><Icon size={17} /></div>
        <div className="flex-1 min-w-0">
          <div className={`text-[14px] font-semibold flex items-center gap-2 ${a.paused ? 'text-neutral-500' : 'text-neutral-900'}`}>
            {a.name}
            {a.paused && <span className="text-[11px] font-semibold text-warning bg-orange-50 px-1.5 py-0.5 rounded-full">Paused</span>}
          </div>
          <div className="text-[12px] text-neutral-500 mt-0.5 truncate">{alertSummary(a)}</div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { commit(alerts.map(x => x.id === a.id ? { ...x, paused: !x.paused } : x)) }}
            className={`w-[34px] h-[19px] rounded-full relative transition-colors ${a.paused ? 'bg-neutral-300' : 'bg-hl-blue'}`}
            aria-label={a.paused ? 'Resume alert' : 'Pause alert'}
          >
            <span className={`absolute top-0.5 w-[15px] h-[15px] rounded-full bg-white transition-transform ${a.paused ? 'left-0.5' : 'left-0.5 translate-x-[15px]'}`} />
          </button>
          <button data-alert-menu onClick={() => setMenuId(menuId === a.id ? null : a.id)} className="w-7 h-7 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 flex items-center justify-center"><MoreVertical size={16} /></button>
          {menuId === a.id && (
            <div data-alert-menu className="absolute top-11 right-3 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-10 min-w-[138px]">
              <button onClick={() => startEdit(a)} className="w-full text-left text-[13px] text-neutral-700 px-2.5 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2.5"><Pencil size={15} /> Edit</button>
              <button onClick={() => commit(alerts.filter(x => x.id !== a.id))} className="w-full text-left text-[13px] text-negative px-2.5 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2.5"><Trash2 size={15} /> Delete</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Create (split) ──
  function CreateView() {
    const d = draft
    const allMetrics = d.metrics.length === METRICS.length
    const canSave = d.recipients.length > 0 && d.metrics.length > 0
    const cur = TEMPLATES.find(t => t.id === d.template) || TEMPLATES[0]

    function toggleMetric(k) {
      setDraft(prev => ({ ...prev, metrics: prev.metrics.includes(k) ? prev.metrics.filter(x => x !== k) : [...prev.metrics, k] }))
    }
    function addRecipient() {
      const v = recipientInput.trim()
      if (v && !d.recipients.includes(v)) setDraft(prev => ({ ...prev, recipients: [...prev.recipients, v] }))
      setRecipientInput('')
    }

    return (
      <>
        <div className="px-5 py-4 border-b border-neutral-200 flex items-start gap-3">
          <button onClick={backToManage} className="w-[34px] h-[34px] rounded-lg border border-neutral-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center shrink-0"><ChevronLeft size={16} /></button>
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-neutral-900 leading-tight">{editingId ? 'Edit alert' : 'New alert'}</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">Notify me when "{topicName}" moves</p>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg text-neutral-500 hover:bg-neutral-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0 overflow-hidden">
          {/* Left: form */}
          <div className="p-5 overflow-y-auto">
            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-neutral-700 mb-2">Alert name</label>
              <input
                value={d.name}
                onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-[42px] border border-neutral-300 rounded-lg px-3 text-[14px] text-neutral-900 focus:outline-2 focus:outline-hl-blue focus:border-hl-blue"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-neutral-700 mb-2">What to watch</label>
              <div className="relative" data-metrics-dd>
                <button
                  type="button"
                  onClick={() => setMetricsOpen(o => !o)}
                  className={`w-full flex items-center justify-between border rounded-lg px-3.5 py-2.5 transition-colors ${metricsOpen ? 'border-hl-blue' : 'border-neutral-300 hover:bg-gray-50'}`}
                >
                  <span className="text-[14px] font-medium text-neutral-900">
                    {allMetrics ? 'All metrics' : d.metrics.length === 0 ? 'Select metrics' : `${d.metrics.length} metric${d.metrics.length === 1 ? '' : 's'} selected`}
                  </span>
                  <ChevronDown size={16} className={`text-neutral-400 transition-transform ${metricsOpen ? 'rotate-180' : ''}`} />
                </button>
                {metricsOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5">
                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Metrics</span>
                      <button onClick={() => setDraft(prev => ({ ...prev, metrics: allMetrics ? [] : [...ALL_KEYS] }))} className="text-[12px] font-semibold text-hl-blue">{allMetrics ? 'Clear all' : 'Select all'}</button>
                    </div>
                    {METRICS.map(m => {
                      const on = d.metrics.includes(m.k)
                      return (
                        <button key={m.k} onClick={() => toggleMetric(m.k)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                          <span className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 ${on ? 'bg-hl-blue border-hl-blue text-white' : 'border-neutral-300'}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                          <span className="flex-1 text-[14px] font-medium text-neutral-700">{m.k}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-neutral-700 mb-3.5">How sensitive?</label>
              {(() => {
                const order = ['low', 'medium', 'high']
                const idx = order.indexOf(d.sens)
                const pct = idx === 0 ? 0 : idx === 1 ? 50 : 100
                return (
                  <>
                    <div className="relative h-[18px] mx-[9px]">
                      <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1.5 rounded-full bg-neutral-200" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full bg-hl-blue transition-all duration-150" style={{ width: `${pct}%` }} />
                      {order.map((s, i) => {
                        const left = i === 0 ? '0%' : i === 1 ? '50%' : '100%'
                        return (
                          <span key={s} className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all duration-150 pointer-events-none ${i === idx ? 'w-[18px] h-[18px] bg-hl-blue ring-4 ring-hl-blue-light' : i < idx ? 'w-3 h-3 bg-hl-blue' : 'w-3 h-3 bg-white border-2 border-neutral-300'}`} style={{ left }} />
                        )
                      })}
                      <input
                        type="range" min="0" max="2" step="1" value={idx}
                        onChange={e => setDraft(prev => ({ ...prev, sens: order[Number(e.target.value)] }))}
                        aria-label="Alert sensitivity"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between mt-2.5 mx-[2px]">
                      {order.map(s => (
                        <button key={s} onClick={() => setDraft(prev => ({ ...prev, sens: s }))} className={`text-[11px] transition-colors ${d.sens === s ? 'font-semibold text-hl-blue' : 'font-medium text-neutral-500 hover:text-neutral-700'}`}>{SENS[s].t}</button>
                      ))}
                    </div>
                    <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-gray-50 border border-neutral-200 px-3.5 py-2.5">
                      <span className="text-[13px] font-semibold text-neutral-900">Triggers at ±{THRESHOLD[d.sens]}% moves</span>
                      {d.sens === 'medium' && <span className="ml-auto text-[11px] font-semibold text-hl-blue bg-hl-blue-light px-2 py-0.5 rounded-full shrink-0">Recommended</span>}
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-neutral-700 mb-2">How often?</label>
              <div className="flex gap-1.5">
                {DELIVERIES.map(x => (
                  <button key={x} onClick={() => setDraft(prev => ({ ...prev, delivery: x }))} className={`flex-1 py-2.5 rounded-lg border text-[13px] font-semibold transition-colors ${d.delivery === x ? 'border-hl-blue bg-hl-blue-light text-hl-blue-dark' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-gray-50'}`}>{x}</button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[12px] text-neutral-500">
                <Clock size={13} className="text-neutral-400 shrink-0" />
                {d.delivery === 'Weekly' ? `Sends Mondays at ${SEND_TIME} · next on ${nextMonday()}` : `Sends every morning at ${SEND_TIME}`}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-neutral-700 mb-2">Send to</label>
              <div className="flex gap-2">
                <input
                  value={recipientInput}
                  onChange={e => setRecipientInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRecipient() } }}
                  placeholder="name@company.com"
                  className="flex-1 h-[42px] border border-neutral-300 rounded-lg px-3 text-[14px] text-neutral-900 focus:outline-2 focus:outline-hl-blue focus:border-hl-blue"
                />
                <button onClick={addRecipient} className="h-[42px] px-4 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-[14px] font-semibold hover:bg-gray-50 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {d.recipients.map(e => (
                  <span key={e} className="text-[12px] font-medium text-neutral-700 bg-neutral-100 rounded-full px-2.5 py-1.5 inline-flex items-center gap-1.5">
                    {e}
                    <button onClick={() => setDraft(prev => ({ ...prev, recipients: prev.recipients.filter(r => r !== e) }))} className="text-neutral-400 hover:text-negative flex items-center"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-neutral-700 mb-2">Notification email</label>
              <div className="relative" data-tpl-dd>
                <button type="button" onClick={() => setShowTpl(o => !o)} className={`w-full flex items-center gap-2.5 border rounded-lg px-3.5 py-2.5 transition-colors ${showTpl ? 'border-hl-blue' : 'border-neutral-300 hover:bg-gray-50'}`}>
                  <span className={`w-[26px] h-[26px] rounded-md flex items-center justify-center shrink-0 ${cur.brandClass}`}><AgencyLogo size={15} className="text-white" /></span>
                  <span className="flex-1 text-[14px] font-medium text-neutral-900 truncate text-left">{cur.nm}</span>
                  <ChevronDown size={16} className={`text-neutral-400 transition-transform shrink-0 ${showTpl ? 'rotate-180' : ''}`} />
                </button>
                {showTpl && (
                  <div className="absolute z-20 left-0 right-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5">
                    {TEMPLATES.map(t => {
                      const on = d.template === t.id
                      return (
                        <button key={t.id} onClick={() => { setDraft(prev => ({ ...prev, template: t.id })); setShowTpl(false) }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                          <span className={`w-[24px] h-[24px] rounded-md flex items-center justify-center shrink-0 ${t.brandClass}`}><AgencyLogo size={14} className="text-white" /></span>
                          <span className="flex-1 text-[14px] font-medium text-neutral-700 truncate">{t.nm}</span>
                          {t.isDefault && <span className="text-[10px] font-semibold text-hl-blue bg-hl-blue-light px-1.5 py-0.5 rounded shrink-0">Default</span>}
                          {on && <Check size={15} strokeWidth={2.5} className="text-hl-blue shrink-0" />}
                        </button>
                      )
                    })}
                    <div className="h-px bg-neutral-100 my-1.5 mx-1" />
                    <button onClick={() => { /* would open Email Builder */ }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-hl-blue-light text-left transition-colors text-hl-blue">
                      <span className="w-[24px] h-[24px] rounded-md border border-dashed border-hl-blue-border flex items-center justify-center shrink-0"><Plus size={14} /></span>
                      <span className="flex-1 text-[14px] font-semibold">Create new</span>
                      <span className="text-[12px] text-neutral-500 shrink-0">Email Builder ↗</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: live preview (email reader surface) */}
          <div className="hidden md:flex md:flex-col min-h-0 bg-white border-t md:border-t-0 md:border-l border-neutral-200 overflow-hidden">
            <Preview d={d} cur={cur} topicName={topicName} />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-neutral-200 flex items-center justify-end gap-3">
          <span className="text-[12px] text-neutral-500 hidden sm:inline">{allMetrics ? 'All metrics' : `${d.metrics.length} metric${d.metrics.length === 1 ? '' : 's'}`}</span>
          <button onClick={saveDraft} disabled={!canSave} className="h-10 px-[18px] rounded-lg bg-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue-dark transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed">{editingId ? 'Save changes' : 'Create alert'}</button>
        </div>
      </>
    )
  }
}

function Preview({ d, cur, topicName }) {
  const thr = THRESHOLD[d.sens]
  const chosen = METRICS.filter(m => d.metrics.includes(m.k))
  const spikes = chosen.filter(m => m.mv >= thr)
  const sorted = [...chosen].sort((a, b) => b.mv - a.mv)
  const hero = sorted[0]
  const rest = sorted.slice(1)
  const heroSpike = hero && hero.mv >= thr
  const subject = `${spikes.length} spike${spikes.length === 1 ? '' : 's'} detected for "${topicName}"`
  return (
    <>
      <div className="px-5 pt-5 pb-3 shrink-0">
        <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-accent-green opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-accent-green" />
          </span>
          Email preview
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Gmail frame — constant across all templates */}
        <h4 className="text-[16px] font-semibold text-neutral-900 leading-snug mb-4 text-balance">{subject}</h4>
        <div className="flex items-start gap-3 mb-5 pb-5 border-b border-neutral-100">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cur.brandClass}`}><AgencyLogo size={22} className="text-white" /></span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-semibold text-neutral-900">{cur.brandName}</span>
              <span className="text-[12px] text-neutral-500">&lt;alerts@yourbrand.com&gt;</span>
            </div>
            <div className="text-[12px] text-neutral-500 flex items-center gap-0.5">to me <ChevronDown size={13} className="text-neutral-400" /></div>
          </div>
          <span className="text-[12px] text-neutral-500 shrink-0">9:41 AM</span>
        </div>

        {/* Email body masthead — skinned per template (Gmail frame above is untouched) */}
        {cur.skin === 'newsletter' && (
          <div className={`-mx-5 mb-5 px-5 py-5 text-center ${cur.brandClass}`}>
            <span className="inline-flex w-12 h-12 rounded-xl bg-white items-center justify-center mb-2"><AgencyLogo size={26} className={cur.accentText} /></span>
            <div className="text-[15px] font-bold text-white">{cur.brandName}</div>
            <div className="text-[12px] text-white/80 mt-0.5">{cur.tagline}</div>
          </div>
        )}

        {chosen.length === 0 ? (
          <div className="text-[13px] text-neutral-400 py-2">Select a metric to preview the alert.</div>
        ) : (
          <>
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-4">
              {spikes.length > 0 ? (
                <><span className="font-semibold text-neutral-800">{spikes.length} of {chosen.length}</span> watched metric{chosen.length === 1 ? '' : 's'} {spikes.length === 1 ? 'is' : 'are'} moving on <span className="font-semibold text-neutral-800">"{topicName}"</span> · {SENS[d.sens].word} sensitivity (±{thr}%).</>
              ) : (
                <>All <span className="font-semibold text-neutral-800">{chosen.length}</span> watched metric{chosen.length === 1 ? '' : 's'} holding steady on <span className="font-semibold text-neutral-800">"{topicName}"</span> · {SENS[d.sens].word} sensitivity (±{thr}%).</>
              )}
            </p>

            <div key={hero.k} className="sl-row-in rounded-xl border border-neutral-200 overflow-hidden mb-3">
              <div className={`px-4 pt-3 pb-3.5 ${heroSpike ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className={`text-[11px] font-bold uppercase tracking-wide mb-2 ${heroSpike ? 'text-negative' : 'text-positive'}`}>{heroSpike ? 'Biggest mover' : 'Holding steady'}</div>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-neutral-700 truncate">{hero.k}</div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-[26px] font-bold text-neutral-900 tabular-nums leading-none">{hero.to}</span>
                      <span className="text-[12px] text-neutral-500">{hero.unit}</span>
                    </div>
                    <div className={`flex items-center gap-1 mt-1.5 text-[12px] font-bold ${heroSpike ? 'text-negative' : 'text-positive'}`}>
                      <ArrowUp size={12} />{hero.mv}%
                      <span className="text-neutral-500 font-normal">from {hero.from} the previous 7 days</span>
                    </div>
                  </div>
                  <Sparkline data={hero.spark} w={84} h={40} className={`shrink-0 ${heroSpike ? 'text-negative/40' : 'text-positive/40'}`} />
                </div>
              </div>
              {heroSpike && (
                <div className="px-4 py-3 border-t border-neutral-100">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">What's driving it</div>
                  <div className="flex items-center gap-1.5 mb-2 text-[12px]">
                    <span className="w-[18px] h-[18px] rounded bg-hl-blue text-white text-[9px] font-bold flex items-center justify-center shrink-0">{DRIVER.badge}</span>
                    <span className="font-semibold text-neutral-800">{DRIVER.platform}</span>
                    <span className="text-neutral-500">drove +{DRIVER.lift}% of the lift</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-neutral-100 px-3 py-2.5">
                    <p className="text-[12px] text-neutral-700 leading-relaxed">"{DRIVER.post}"</p>
                    <div className="mt-1.5 text-[11px] text-neutral-500"><span className="font-semibold text-neutral-700">{DRIVER.author}</span> · {DRIVER.engagement}</div>
                  </div>
                </div>
              )}
            </div>

            {rest.length > 0 && (
              <div className="flex flex-col">
                {rest.map(m => {
                  const sp = m.mv >= thr
                  const c = sp ? 'text-negative' : 'text-positive'
                  return (
                    <div key={m.k} className="sl-row-in flex items-center gap-2.5 py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-[13px] text-neutral-700 flex-1 min-w-0 truncate">{m.k}</span>
                      <span className="text-[12px] text-neutral-500 tabular-nums whitespace-nowrap">{m.from} → {m.to}</span>
                      <Sparkline data={m.spark} w={38} h={14} className={`shrink-0 ${sp ? 'text-negative/40' : 'text-positive/40'}`} />
                      <span className={`text-[12px] font-bold tabular-nums w-[46px] text-right inline-flex items-center justify-end gap-0.5 ${c}`}><ArrowUp size={10} />{m.mv}%</span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
        {cur.skin === 'minimal' ? (
          <div className="mt-5 pt-4 border-t border-neutral-200">
            <span className={`text-[13px] font-semibold inline-flex items-center gap-1 ${cur.accentText}`}>View full report →</span>
          </div>
        ) : cur.skin === 'newsletter' ? (
          <div className={`mt-5 text-center py-3 rounded-lg text-[13px] font-bold tracking-wide uppercase text-white ${cur.brandClass}`}>View full report</div>
        ) : (
          <div className={`mt-4 text-center py-2.5 rounded-lg text-[13px] font-semibold text-white ${cur.brandClass}`}>View full report</div>
        )}

        {cur.skin === 'newsletter' ? (
          <div className="-mx-5 mt-5 px-5 py-4 bg-gray-50 border-t border-neutral-100 text-center">
            <div className="text-[12px] font-semibold text-neutral-600">{cur.brandName}</div>
            <p className="text-[11px] text-neutral-400 mt-1">You set up this alert in Social Listening · Unsubscribe</p>
          </div>
        ) : cur.skin === 'minimal' ? (
          <p className="text-[11px] text-neutral-400 mt-5 text-center">Alert by Social Listening · Unsubscribe</p>
        ) : (
          <p className="text-[11px] text-neutral-400 mt-4 leading-relaxed">You're receiving this because you set up an alert in Social Listening.</p>
        )}
      </div>
    </>
  )
}
