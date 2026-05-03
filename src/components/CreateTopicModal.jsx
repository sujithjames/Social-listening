import { useState, useEffect } from 'react'
import { X, Check, Globe, Newspaper, Send, Music, Sparkles, Hash } from 'lucide-react'

const SOURCES = [
  { id: 'facebook',  name: 'Facebook',    desc: 'Posts, visitor posts and comments', color: '#1877F2', bg: '#EBF5FF', letter: 'f' },
  { id: 'twitter',   name: 'X (Twitter)', desc: 'Posts, replies, and reposts',        color: '#0F172A', bg: '#F1F5F9', letter: 'X' },
  { id: 'instagram', name: 'Instagram',   desc: 'Posts and reels',                    color: '#E1306C', bg: '#FFF0F5', letter: 'IG' },
  { id: 'youtube',   name: 'YouTube',     desc: 'Videos only',                        color: '#FF0000', bg: '#FFF1F1', letter: 'YT' },
  { id: 'tiktok',    name: 'TikTok',      desc: 'Videos and comments',               color: '#010101', bg: '#F8F8F8', icon: Music },
  { id: 'linkedin',  name: 'LinkedIn',    desc: 'Posts, articles and comments',       color: '#0A66C2', bg: '#EBF4FF', letter: 'in' },
  { id: 'reddit',    name: 'Reddit',      desc: 'Posts and comments',                color: '#FF4500', bg: '#FFF2EE', letter: 'R' },
  { id: 'web',       name: 'Web',         desc: 'Blogs, articles and comments',       color: '#155EEF', bg: '#EEF4FF', icon: Globe },
  { id: 'telegram',  name: 'Telegram',    desc: 'Posts and channels',                color: '#0088CC', bg: '#EBF7FF', icon: Send },
  { id: 'news',      name: 'News',        desc: 'News articles and press releases',   color: '#16A34A', bg: '#EDFCF2', icon: Newspaper },
]

const NOISE_FILTERS = ['Sweepstakes', 'Sales listings', 'Coupons', 'Cryptocurrency']

const SETUP_MESSAGES = [
  'Scanning platforms for mentions...',
  'Building your keyword index...',
  'Calibrating sentiment engine...',
  'Connecting data sources...',
  'Finalizing your topic...',
]


const CIRCLE_SOURCE_IDS = ['facebook', 'twitter', 'instagram', 'youtube', 'reddit', 'linkedin']

export default function CreateTopicModal({ onClose, onCreated, defaultTitle = '' }) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState(defaultTitle)
  const [selectedSources, setSelectedSources] = useState(['facebook'])
  const [keywords, setKeywords] = useState('')
  const [ignoreWords, setIgnoreWords] = useState('')
  const [noiseFilters, setNoiseFilters] = useState([])
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (step !== 3) return
    let tick = 0
    const timer = setInterval(() => {
      tick++
      setProgress(tick * 20)
      setMsgIndex(Math.min(tick - 1, SETUP_MESSAGES.length - 1))
      if (tick >= 5) {
        clearInterval(timer)
        setTimeout(() => onCreated({ title, sources: selectedSources, keywords }), 500)
      }
    }, 500)
    return () => clearInterval(timer)
  }, [step])

  function toggleSource(id) {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function toggleNoise(f) {
    setNoiseFilters(prev =>
      prev.includes(f) ? prev.filter(n => n !== f) : [...prev, f]
    )
  }

  const step1Valid = title.trim().length > 0 && selectedSources.length > 0
  const step2Valid = keywords.trim().length > 0
  const circleSources = SOURCES.filter(s => CIRCLE_SOURCE_IDS.includes(s.id))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(52,64,84,0.65)', backdropFilter: 'blur(8px)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.12),0px_8px_8px_-4px_rgba(16,24,40,0.06)]">

        {step < 3 && (
          <>
            {/* ── Title + progress ── */}
            <div className="px-7 pt-6 pb-5 border-b border-gray-100 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 leading-tight">Create a listening topic</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Define what conversations you'd like to monitor across the web.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0 ml-4"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center mt-5 gap-4">
                {/* Step 1 */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold shrink-0 transition-all ${
                    step >= 1 ? 'bg-hl-blue text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900 leading-tight">Name & sources</p>
                    <p className="text-[13px] text-gray-500 leading-tight mt-1">Choose a title and platforms to track</p>
                  </div>
                </div>

                {/* Connector */}
                <div className={`w-16 h-0.5 rounded transition-colors duration-300 shrink-0 ${step > 1 ? 'bg-hl-blue' : 'bg-gray-200'}`} />

                {/* Step 2 */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold shrink-0 transition-all ${
                    step >= 2 ? 'bg-hl-blue text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    2
                  </div>
                  <div>
                    <p className={`text-[15px] font-semibold leading-tight ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Keywords & filters</p>
                    <p className={`text-[13px] leading-tight mt-1 ${step >= 2 ? 'text-gray-500' : 'text-gray-400'}`}>Set keywords and refine your results</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="px-6 py-5 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Brand Mentions - Acme"
                  className="w-full h-9 px-3 rounded-md border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
                  style={{ '--tw-ring-color': 'rgba(21,94,239,0.2)' }}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-medium text-gray-700">Select sources</label>
                  <span className="text-[12px] text-gray-400">{selectedSources.length} selected</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {SOURCES.map(source => (
                    <SourceCard
                      key={source.id}
                      source={source}
                      selected={selectedSources.includes(source.id)}
                      onToggle={() => toggleSource(source.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Topic preview pill */}
              <div className="flex items-center gap-3 px-3 py-2.5 bg-hl-blue-light rounded-xl border border-[#C7D7FD]">
                <div className="w-7 h-7 rounded-lg bg-hl-blue flex items-center justify-center shrink-0">
                  <Hash size={13} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#004EEB] truncate">{title}</p>
                  <p className="text-[11px] text-gray-500">{selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedSources.slice(0, 4).map(id => {
                    const s = SOURCES.find(src => src.id === id)
                    if (!s) return null
                    const Icon = s.icon
                    return (
                      <div key={id} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                        {Icon ? <Icon size={10} style={{ color: s.color }} /> : <span className="text-[8px] font-bold" style={{ color: s.color }}>{s.letter}</span>}
                      </div>
                    )
                  })}
                  {selectedSources.length > 4 && (
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-gray-500">+{selectedSources.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-gray-700">Keywords to track</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="Brand name, product, hashtag..."
                  className="w-full h-9 px-3 rounded-md border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-gray-700">Keywords to ignore</label>
                <input
                  type="text"
                  value={ignoreWords}
                  onChange={e => setIgnoreWords(e.target.value)}
                  placeholder="Exclude these terms from results..."
                  className="w-full h-9 px-3 rounded-md border border-gray-300 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[14px] font-medium text-gray-700">
                    Reduce noise <span className="text-gray-400 font-normal">(optional)</span>
                  </p>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Automatically exclude common spam categories from your results.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {NOISE_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleNoise(f)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all duration-150 ${
                        noiseFilters.includes(f)
                          ? 'bg-hl-blue-light border-hl-blue text-[#004EEB]'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {noiseFilters.includes(f) && <Check size={11} strokeWidth={3} className="shrink-0" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — animated setup */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-14 px-6 gap-8 min-h-[440px]">
              {/* Orbital visualization */}
              <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                {/* Dashed orbit ring — behind everything */}
                <div
                  className="absolute rounded-full border-2 border-dashed animate-spin"
                  style={{ inset: 22, borderColor: '#C7D7FD', animationDuration: '10s' }}
                />

                {/* Platform icons orbiting */}
                {circleSources.map((source, i) => {
                  const angle = ((i / circleSources.length) * 360 - 90) * (Math.PI / 180)
                  const r = 78
                  const cx = Math.round(Math.cos(angle) * r)
                  const cy = Math.round(Math.sin(angle) * r)
                  const Icon = source.icon
                  const lit = progress >= ((i + 1) / circleSources.length) * 100 - 4

                  return (
                    <div
                      key={source.id}
                      className="absolute flex items-center justify-center rounded-full transition-all duration-500"
                      style={{
                        width: 36, height: 36,
                        left: `calc(50% + ${cx}px - 18px)`,
                        top: `calc(50% + ${cy}px - 18px)`,
                        backgroundColor: source.color,
                        transform: `scale(${lit ? 1 : 0.75})`,
                        opacity: lit ? 1 : 0.35,
                        boxShadow: lit ? `0 0 0 3px ${source.color}35, 0 2px 8px ${source.color}40` : 'none',
                      }}
                    >
                      {Icon
                        ? <Icon size={15} style={{ color: 'white' }} />
                        : <BrandGlyph id={source.id} size={15} color="white" />
                      }
                    </div>
                  )
                })}

                {/* Inner spinner arc */}
                <div
                  className="absolute rounded-full animate-spin"
                  style={{
                    inset: 44,
                    border: '3px solid #EEF4FF',
                    borderTopColor: '#155EEF',
                    animationDuration: '0.85s',
                  }}
                />

                {/* Center card */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(21,94,239,0.18)]">
                  <Sparkles size={24} className="text-hl-blue" />
                </div>
              </div>

              {/* Copy */}
              <div className="text-center flex flex-col gap-2">
                <p className="text-[20px] font-semibold text-gray-900">Setting up "{title}"</p>
                <p className="text-[14px] text-gray-500 transition-all duration-300" style={{ minHeight: 20 }}>
                  {SETUP_MESSAGES[msgIndex]}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col items-center gap-1.5 w-72">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hl-blue rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[12px] text-gray-400">{progress}% complete</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer (steps 1 & 2 only) ── */}
        {step < 3 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between shrink-0">
            <button
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="h-9 px-4 rounded-md border border-gray-300 bg-white text-[14px] font-semibold text-gray-700 hover:bg-gray-50 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={onClose}
                  className="h-9 px-4 rounded-md border border-gray-300 bg-white text-[14px] font-semibold text-gray-700 hover:bg-gray-50 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => step === 1 ? setStep(2) : setStep(3)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="h-9 px-5 rounded-md bg-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
              >
                {step === 1 ? 'Next' : 'Create topic'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BrandGlyph({ id, size = 15, color = 'currentColor' }) {
  const common = { width: size, height: size, fill: color, 'aria-hidden': true }
  switch (id) {
    case 'facebook':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4v7h3.1z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.5.6c-1 .3-1.7 1.1-2 2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1 1.8 2 2 2 .5 9.5.5 9.5.5s7.5 0 9.5-.5c1-.3 1.7-1.1 2-2 .5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.6V8.4l6.4 3.6-6.4 3.6z" />
        </svg>
      )
    case 'reddit':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M22 11.8c0-1.1-.9-2-2-2-.5 0-1 .2-1.4.6-1.4-.9-3.2-1.5-5.2-1.6l1-4.2 3 .7c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6-.6 0-1.2.4-1.4.9L14.2 4c-.1 0-.2 0-.3.1-.1.1-.1.2-.1.3l-1.1 4.6c-2.1 0-4 .6-5.4 1.6-.4-.4-.9-.6-1.5-.6-1.1 0-2 .9-2 2 0 .8.5 1.5 1.1 1.8 0 .2-.1.4-.1.6 0 2.9 3.4 5.3 7.5 5.3s7.5-2.4 7.5-5.3c0-.2 0-.4-.1-.6.7-.3 1.2-1 1.2-1.8zM7 13.4c0-.7.6-1.3 1.3-1.3.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3-.7 0-1.3-.6-1.3-1.3zm8 3.7c-1 1-2.6 1-3 1s-2 0-3-1c-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .6.6 2 .9 2.6.9.6 0 2-.2 2.6-.9.1-.1.3-.1.4 0 .1.1.1.3 0 .4zm-.3-2.4c-.7 0-1.3-.6-1.3-1.3 0-.7.6-1.3 1.3-1.3.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      )
    default:
      return null
  }
}

function SourceCard({ source, selected, onToggle }) {
  const Icon = source.icon
  return (
    <button
      onClick={onToggle}
      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-150 text-left w-full ${
        selected
          ? 'border-hl-blue bg-hl-blue-light/50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: source.color }}
      >
        {Icon
          ? <Icon size={16} style={{ color: 'white' }} />
          : <BrandGlyph id={source.id} size={16} color="white" />
        }
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13px] font-semibold text-gray-700 leading-tight">{source.name}</p>
        <p className="text-[12px] text-gray-400 leading-snug mt-0.5">{source.desc}</p>
      </div>
      <div className={`shrink-0 mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        selected ? 'bg-hl-blue border-hl-blue' : 'bg-white border-gray-300'
      }`}>
        {selected && <Check size={10} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  )
}
