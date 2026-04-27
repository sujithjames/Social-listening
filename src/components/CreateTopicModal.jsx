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

const BOKEH = [
  { color: '#1877F2', size: 32, left: '4%',  top: '30%', blur: 0 },
  { color: '#E1306C', size: 20, left: '10%', top: '65%', blur: 2 },
  { color: '#FF0000', size: 28, left: '18%', top: '20%', blur: 0 },
  { color: '#0F172A', size: 22, left: '26%', top: '60%', blur: 0 },
  { color: '#FF4500', size: 18, left: '34%', top: '35%', blur: 3 },
  { color: '#0A66C2', size: 26, left: '43%', top: '55%', blur: 0 },
  { color: '#0088CC', size: 20, left: '52%', top: '25%', blur: 0 },
  { color: '#16A34A', size: 18, left: '60%', top: '65%', blur: 2 },
  { color: '#010101', size: 24, left: '68%', top: '28%', blur: 0 },
  { color: '#155EEF', size: 20, left: '76%', top: '60%', blur: 0 },
  { color: '#6938EF', size: 30, left: '84%', top: '25%', blur: 1 },
  { color: '#E1306C', size: 16, left: '91%', top: '62%', blur: 3 },
]

const CIRCLE_SOURCE_IDS = ['facebook', 'twitter', 'instagram', 'youtube', 'reddit', 'linkedin']

export default function CreateTopicModal({ onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
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
            {/* ── Bokeh hero band ── */}
            <div
              className="relative h-14 overflow-hidden shrink-0"
              style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #F3ECFF 40%, #FFF0F9 70%, #FFF8EC 100%)' }}
            >
              {BOKEH.map((dot, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: dot.left, top: dot.top,
                    width: dot.size, height: dot.size,
                    backgroundColor: dot.color,
                    opacity: 0.68,
                    transform: 'translateY(-50%)',
                    filter: dot.blur ? `blur(${dot.blur}px)` : undefined,
                  }}
                />
              ))}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.25) 100%)' }} />
            </div>

            {/* ── Title + progress ── */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-[18px] font-semibold text-gray-900">Create a Listening Topic</h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">Track any brand, keyword, or topic across the social web.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0 ml-4 mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-start mt-4 gap-0">
                {/* Step 1 */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 transition-all ${
                      step >= 1 ? 'bg-hl-blue text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}>
                      {step > 1 ? <Check size={12} strokeWidth={3} /> : '1'}
                    </div>
                    <div className={`flex-1 h-0.5 mx-3 rounded transition-colors duration-300 ${step > 1 ? 'bg-hl-blue' : 'bg-gray-200'}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">Sources</p>
                    <p className="text-[11px] text-gray-500">Choose title and platforms</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 transition-all ${
                      step >= 2 ? 'bg-hl-blue text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}>
                      2
                    </div>
                  </div>
                  <div>
                    <p className={`text-[13px] font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Keywords & filters</p>
                    <p className={`text-[11px] ${step >= 2 ? 'text-gray-500' : 'text-gray-300'}`}>Add keywords and refine results</p>
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
                  <label className="text-[14px] font-medium text-gray-700">Select Sources</label>
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
                {/* Outer ping */}
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: '#EEF4FF', opacity: 0.4, animationDuration: '2.2s' }}
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
                        backgroundColor: lit ? source.bg : '#F2F4F7',
                        transform: `scale(${lit ? 1 : 0.72})`,
                        opacity: lit ? 1 : 0.3,
                        boxShadow: lit ? `0 0 0 3px ${source.color}20` : 'none',
                      }}
                    >
                      {Icon
                        ? <Icon size={15} style={{ color: lit ? source.color : '#98A2B3' }} />
                        : <span className="text-[12px] font-bold" style={{ color: lit ? source.color : '#98A2B3' }}>{source.letter}</span>
                      }
                    </div>
                  )
                })}

                {/* Dashed orbit ring */}
                <div
                  className="absolute rounded-full border-2 border-dashed animate-spin"
                  style={{ inset: 22, borderColor: '#C7D7FD', animationDuration: '10s' }}
                />

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
                {step === 1 ? 'Next' : 'Create Topic'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
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
        style={{ backgroundColor: source.bg }}
      >
        {Icon
          ? <Icon size={16} style={{ color: source.color }} />
          : <span className="text-[14px] font-bold leading-none" style={{ color: source.color }}>{source.letter}</span>
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
