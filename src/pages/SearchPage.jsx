import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2 } from 'lucide-react'
import CreateTopicModal from '../components/CreateTopicModal'

const STORAGE_KEY = 'sl.topics.v1'
const TOTAL_SEARCHES = 0
const MAX_SEARCHES = 3

const SOURCE_LABELS = {
  facebook: 'Facebook', twitter: 'X', instagram: 'Instagram',
  youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn',
  reddit: 'Reddit', web: 'Web', telegram: 'Telegram', news: 'News',
}

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  twitter: '#0F172A',
  instagram: '#E1306C',
  youtube: '#FF0000',
  reddit: '#FF4500',
  tiktok: '#0F172A',
  linkedin: '#0077B5',
  web: '#475467',
  telegram: '#2AABEE',
  news: '#155EEF',
}

const SPARKLINE_PATHS = [
  "M0,28 C8,26 16,22 24,20 C32,18 40,24 48,22 C56,20 64,14 72,12 C80,10 88,16 96,14 C104,12 112,8 120,6",
  "M0,24 C8,28 16,20 24,22 C32,24 40,18 48,16 C56,14 64,18 72,14 C80,10 88,12 96,8 C104,6 112,10 120,6",
  "M0,26 C8,22 16,24 24,18 C32,12 40,16 48,14 C56,12 64,8 72,12 C80,16 88,10 96,8 C104,6 112,8 120,4",
  "M0,20 C8,24 16,18 24,22 C32,26 40,20 48,16 C56,12 64,14 72,10 C80,8 88,12 96,8 C104,6 112,8 120,4",
]

const TRENDING_DATA = [
  { id: 1, platform: 'Google', keywords: 120, trend: '#1 #barcelona', metric: '22K Searches', sparkline: SPARKLINE_PATHS[0] },
  { id: 2, platform: 'Pinterest', keywords: 84, trend: '#1 heated rivalry', metric: '1,687 Pins', sparkline: SPARKLINE_PATHS[1] },
  { id: 3, platform: 'X / Twitter', keywords: 67, trend: '#1 champions league', metric: '32K Posts', sparkline: SPARKLINE_PATHS[2] },
  { id: 4, platform: 'YouTube', keywords: 45, trend: '#1 match highlights', metric: '8.4M Views', sparkline: SPARKLINE_PATHS[3] },
]

function loadTopicsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveTopicsToStorage(topics) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
  } catch {
    console.error('Failed to save topics to localStorage')
  }
}

function PlatformIcon({ platform, size = 32 }) {
  const s = size
  switch (platform) {
    case 'Google':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#fff" />
          <path d="M27.2 16.27c0-.79-.07-1.55-.2-2.27H16v4.3h6.27a5.36 5.36 0 0 1-2.32 3.52v2.92h3.75c2.2-2.02 3.5-5 3.5-8.47Z" fill="#4285F4"/>
          <path d="M16 28c3.15 0 5.79-1.04 7.72-2.82l-3.75-2.92c-1.04.7-2.38 1.11-3.97 1.11-3.05 0-5.63-2.06-6.55-4.83H5.57v3.02A11.99 11.99 0 0 0 16 28Z" fill="#34A853"/>
          <path d="M9.45 18.54A7.23 7.23 0 0 1 9.07 16c0-.88.15-1.73.38-2.54V10.44H5.57A12 12 0 0 0 4 16c0 1.94.46 3.77 1.57 5.56l3.88-3.02Z" fill="#FBBC05"/>
          <path d="M16 8.64c1.72 0 3.26.59 4.48 1.75l3.35-3.35C21.79 5.14 19.15 4 16 4a12 12 0 0 0-10.43 6.44l3.88 3.02C10.37 10.7 12.95 8.64 16 8.64Z" fill="#EA4335"/>
        </svg>
      )
    case 'Pinterest':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#E60023"/>
          <path d="M16 5C10 5 5 10 5 16c0 4.67 2.89 8.67 7.01 10.3-.1-.87-.18-2.2.04-3.14.2-.84 1.34-5.67 1.34-5.67s-.34-.68-.34-1.69c0-1.58.92-2.77 2.06-2.77.97 0 1.44.73 1.44 1.6 0 .98-.62 2.44-.94 3.8-.27 1.14.56 2.06 1.67 2.06 2 0 3.55-2.11 3.55-5.15 0-2.69-1.94-4.58-4.7-4.58-3.2 0-5.08 2.4-5.08 4.88 0 .97.37 2 .84 2.57a.34.34 0 0 1 .08.33c-.09.36-.28 1.14-.32 1.3-.05.21-.17.26-.38.16-1.4-.65-2.27-2.7-2.27-4.35 0-3.54 2.57-6.8 7.4-6.8 3.89 0 6.91 2.77 6.91 6.47 0 3.86-2.43 6.97-5.81 6.97-1.13 0-2.2-.59-2.57-1.28l-.7 2.6c-.25.97-.93 2.18-1.39 2.92A11 11 0 0 0 16 27c6.08 0 11-4.92 11-11 0-6.08-4.92-11-11-11Z" fill="white"/>
        </svg>
      )
    case 'X / Twitter':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0F172A"/>
          <path d="M18.24 14.87 24.07 8h-1.38l-5.07 5.88L13.26 8H8.4l6.1 8.88L8.4 24h1.38l5.33-6.19L19.44 24H24.3l-6.06-9.13Zm-1.88 2.19-.62-.88-4.92-7.03h2.11l3.97 5.67.62.88 5.15 7.36h-2.11l-4.2-5.99Z" fill="white"/>
        </svg>
      )
    case 'YouTube':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF0000"/>
          <path d="M24.7 12.1a2.27 2.27 0 0 0-1.6-1.61C21.6 10.1 16 10.1 16 10.1s-5.6 0-7.1.4a2.27 2.27 0 0 0-1.6 1.6c-.4 1.5-.4 4.6-.4 4.6s0 3.1.4 4.6a2.27 2.27 0 0 0 1.6 1.6c1.5.4 7.1.4 7.1.4s5.6 0 7.1-.4a2.27 2.27 0 0 0 1.6-1.6c.4-1.5.4-4.6.4-4.6s0-3.1-.4-4.6Z" fill="white" fillOpacity="0.9"/>
          <path d="M14.2 18.8V13l4.7 2.9-4.7 2.9Z" fill="#FF0000"/>
        </svg>
      )
    default:
      return (
        <div style={{ width: s, height: s, borderRadius: '50%', background: '#155EEF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: s * 0.35, fontWeight: 700 }}>
          {platform[0]}
        </div>
      )
  }
}


function Sparkline({ path }) {
  const id = `grad-${Math.random().toString(36).slice(2)}`
  return (
    <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#155EEF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#155EEF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L120,32 L0,32 Z`}
        fill={`url(#${id})`}
      />
      <path
        d={path}
        stroke="#155EEF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('Topic')
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [topics, setTopics] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setTopics(loadTopicsFromStorage())
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate('/insights', { state: { query } })
  }

  function handleTopicCreated({ title, sources, keywords }) {
    setShowModal(false)
    const kwArray = typeof keywords === 'string'
      ? keywords.split(',').map(k => k.trim()).filter(Boolean)
      : (Array.isArray(keywords) ? keywords : [])
    const newTopic = {
      id: Date.now(),
      name: title,
      keywords: kwArray,
      mentions: 0,
      sentiment: 0,
      sources,
      updated: 'Just now',
    }
    const updatedTopics = [...topics, newTopic]
    setTopics(updatedTopics)
    saveTopicsToStorage(updatedTopics)
  }

  function handleDeleteTopic(id) {
    const updatedTopics = topics.filter(t => t.id !== id)
    setTopics(updatedTopics)
    saveTopicsToStorage(updatedTopics)
  }

  const totalMentions = topics.reduce((sum, t) => sum + t.mentions, 0)
  const avgSentiment = topics.length > 0
    ? Math.round(topics.reduce((sum, t) => sum + t.sentiment, 0) / topics.length)
    : 0

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="bg-white rounded-xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] flex flex-col flex-1 overflow-hidden">

        {/* ── Header: toggle tabs + stats ── */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {['Topic', 'Social trends'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-[14px] transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-white text-[#004EEB] font-semibold shadow-sm'
                    : 'text-gray-500 font-medium hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-[14px]">
              <span className="font-medium text-gray-900">
                Total searches:{' '}
                <span className="font-normal text-gray-500">{TOTAL_SEARCHES}/{MAX_SEARCHES}</span>
              </span>
              <div className="w-px h-4 bg-gray-200" />
              <span className="font-medium text-gray-900">
                Topics: <span className="font-normal text-gray-500">{topics.length}</span>
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="h-8 px-3 rounded border border-[#84ADFF] bg-white text-[13px] font-semibold text-[#004EEB] hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
            >
              Create Topic
            </button>
          </div>
        </div>

        {/* ── Search section ── */}
        <div className="px-5 pb-5 flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-gray-700">Explore</label>
          <form onSubmit={handleSearch} className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search any keywords, brand or hashtags"
                className="w-full pl-9 pr-4 h-9 rounded-md border border-gray-300 bg-white text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim()}
              className="h-9 px-5 rounded-lg bg-[#00359E] border border-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
            >
              Search
            </button>
          </form>
          <p className="text-[13px] text-gray-600">
            Search brands, keywords, or people to uncover real-time insights and trends.
          </p>
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'Topic' ? (
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            {topics.length === 0 ? (
              /* Blank state: illustration + trending cards */
              <div className="flex flex-col">
                {/* Hero empty state */}
                <div className="flex flex-col items-center gap-4 py-8">
                  <ListeningIllustration />
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <p className="text-[16px] font-semibold text-gray-900">Set up your first listening topic</p>
                    <p className="text-[14px] text-gray-500 max-w-xs leading-relaxed">
                      Add a topic to track keywords, brands, or trends and start gathering insights instantly.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 h-9 px-5 rounded-lg border border-[#84ADFF] bg-white text-[13px] font-semibold text-[#004EEB] hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    <Plus size={13} />
                    Create topic
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2" />

                {/* Trending section */}
                <div className="space-y-4 pt-4 pb-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">What's trending elsewhere</p>
                      <p className="text-[17px] font-semibold text-gray-900">A peek at what's trending right now</p>
                    </div>
                    <button className="text-[13px] font-semibold text-hl-blue hover:underline flex items-center gap-1">
                      See all trends →
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {TRENDING_DATA.map(trend => (
                      <div key={trend.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={trend.platform} size={26} />
                            <p className="text-[13px] font-semibold text-gray-900">{trend.platform}</p>
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium">{trend.keywords} keywords</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-gray-800">{trend.trend}</p>
                          <p className="text-[12px] text-gray-500">{trend.metric}</p>
                        </div>
                        <Sparkline path={trend.sparkline} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Topics state: cards + summary */
              <div className="space-y-5 pt-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Your listening topics</p>
                    <p className="text-[18px] font-semibold text-gray-900">
                      {topics.length} active {topics.length === 1 ? 'topic' : 'topics'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded border border-[#84ADFF] bg-white text-[13px] font-semibold text-[#004EEB] hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)] shrink-0"
                  >
                    <Plus size={13} />
                    Create topic
                  </button>
                </div>

                {/* Topic cards */}
                <div className="grid grid-cols-2 gap-3">
                  {topics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onDelete={() => handleDeleteTopic(topic.id)}
                    />
                  ))}
                </div>

                {/* Summary row */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Summary</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Total Mentions</p>
                      <p className="text-[20px] font-bold text-gray-900">{totalMentions.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Avg Sentiment</p>
                      <p className="text-[20px] font-bold text-positive">{avgSentiment}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Active Topics</p>
                      <p className="text-[20px] font-bold text-gray-900">{topics.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p className="text-[14px]">Social trends coming soon</p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateTopicModal
          onClose={() => setShowModal(false)}
          onCreated={handleTopicCreated}
        />
      )}
    </div>
  )
}

function TopicCard({ topic, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md hover:border-gray-300 transition-all relative group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-semibold text-gray-900 leading-snug">{topic.name}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Tracking keywords */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[12px] text-gray-400 font-medium">Tracking</span>
        {(Array.isArray(topic.keywords) && topic.keywords.length > 0 ? topic.keywords : [topic.name]).slice(0, 3).map((kw, i) => (
          <span key={i} className="text-[11px] font-medium text-hl-blue bg-hl-blue-light px-2 py-0.5 rounded-full">
            {kw}
          </span>
        ))}
      </div>

      {/* Source icons */}
      <div className="flex gap-1.5">
        {topic.sources.slice(0, 4).map(src => (
          <SourceIcon key={src} src={src} />
        ))}
        {topic.sources.length > 4 && (
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500">
            +{topic.sources.length - 4}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-0 pt-1 border-t border-gray-100 mt-auto">
        <div className="flex-1">
          <p className="text-[15px] font-bold text-gray-900">{topic.mentions.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Mentions</p>
        </div>
        <div className="w-px h-8 bg-gray-100 mx-3" />
        <div className="flex-1">
          <p className="text-[15px] font-bold text-gray-900">{topic.sentiment}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Sentiment</p>
        </div>
        <div className="w-px h-8 bg-gray-100 mx-3" />
        <div className="flex-1">
          <p className="text-[15px] font-bold text-gray-900">{topic.sources.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Source{topic.sources.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  )
}

function SourceIcon({ src }) {
  const color = PLATFORM_COLORS[src] || '#475467'
  const label = SOURCE_LABELS[src] || src
  return (
    <div
      title={label}
      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
      style={{ background: color }}
    >
      {label[0]}
    </div>
  )
}

function ListeningIllustration() {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center select-none">
      <svg viewBox="0 0 208 208" className="w-full h-full" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EEF4FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#EEF4FF" stopOpacity="0" />
          </radialGradient>
          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#155EEF" floodOpacity="0.12" />
          </filter>
        </defs>
        <circle cx="104" cy="108" r="88" fill="url(#bgGlow)" />
        <circle cx="104" cy="104" r="84" stroke="#C7D7FD" strokeWidth="1.5" strokeDasharray="5 6" strokeLinecap="round" />
        <circle cx="104" cy="104" r="60" fill="#EEF4FF" />
        <rect x="72" y="72" width="64" height="64" rx="18" fill="white" filter="url(#cardShadow)" />
        <circle cx="104" cy="104" r="8" fill="#155EEF" />
        <path d="M88 104 a16 16 0 0 1 32 0" stroke="#155EEF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M82 104 a22 22 0 0 1 44 0" stroke="#C7D7FD" strokeWidth="2" strokeLinecap="round" />
        <circle cx="162" cy="52" r="20" fill="#0F172A" />
        <text x="162" y="59" textAnchor="middle" fontSize="15" fill="white" fontWeight="700" fontFamily="sans-serif">X</text>
        <circle cx="46" cy="58" r="18" fill="#E1306C" />
        <rect x="38.5" y="50.5" width="15" height="15" rx="4" stroke="white" strokeWidth="1.5" />
        <circle cx="46" cy="58" r="4" stroke="white" strokeWidth="1.5" />
        <circle cx="52" cy="52.5" r="1.2" fill="white" />
        <circle cx="48" cy="156" r="18" fill="#FF4500" />
        <circle cx="48" cy="154" r="5.5" fill="white" />
        <path d="M40 160 a8 6 0 0 0 16 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="58" cy="150" r="2.5" fill="white" />
        <path d="M55 152 l3-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="162" cy="158" r="18" fill="#FF0000" />
        <rect x="154" y="151" width="16" height="14" rx="3" fill="white" />
        <path d="M159 154.5 l7 3.5 -7 3.5 z" fill="#FF0000" />
        <circle cx="104" cy="18" r="4.5" fill="#C7D7FD" />
        <circle cx="172" cy="104" r="3.5" fill="#73E2A3" />
        <circle cx="36" cy="104" r="3" fill="#6938EF" opacity="0.35" />
        <circle cx="148" cy="28" r="2.5" fill="#155EEF" opacity="0.4" />
        <circle cx="62" cy="28" r="2" fill="#E1306C" opacity="0.5" />
        <circle cx="180" cy="148" r="2.5" fill="#FF4500" opacity="0.4" />
      </svg>
    </div>
  )
}
