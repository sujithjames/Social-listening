import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, TrendingUp, RefreshCw, ChevronDown, Calendar, Globe, Tag, AtSign } from 'lucide-react'
import { siReddit } from 'simple-icons'
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
  "M0,30 C8,26 16,28 24,22 C32,16 40,20 48,14 C56,10 64,12 72,8 C80,6 88,10 96,6 C104,4 112,6 120,4",
  "M0,22 C8,20 16,26 24,20 C32,14 40,18 48,22 C56,18 64,12 72,10 C80,8 88,14 96,10 C104,8 112,6 120,4",
  "M0,18 C8,22 16,16 24,20 C32,24 40,16 48,12 C56,10 64,14 72,8 C80,6 88,8 96,6 C104,4 112,8 120,4",
  "M0,26 C8,20 16,22 24,16 C32,10 40,14 48,18 C56,14 64,10 72,8 C80,12 88,8 96,6 C104,4 112,6 120,2",
]

const TRENDING_DATA = [
  { id: 1, platform: 'X / Twitter', hashtag: '#ChampionsLeague', context: 'Trending in sports', metric: '32K posts', sparkline: SPARKLINE_PATHS[0] },
  { id: 2, platform: 'TikTok', hashtag: '#AIGenerated', context: 'Trending in tech', metric: '4.2M views', sparkline: SPARKLINE_PATHS[1] },
  { id: 3, platform: 'Google', hashtag: '#AITools', context: 'Rising search term', metric: '45K searches', sparkline: SPARKLINE_PATHS[2] },
  { id: 4, platform: 'Instagram', hashtag: '#ContentCreator', context: 'Trending in marketing', metric: '14K posts', sparkline: SPARKLINE_PATHS[3] },
  { id: 5, platform: 'Pinterest', hashtag: '#WebDesign', context: 'Trending in design', metric: '2.1K pins', sparkline: SPARKLINE_PATHS[4] },
  { id: 6, platform: 'LinkedIn', hashtag: '#EmailMarketing', context: 'Trending in business', metric: '8.7K posts', sparkline: SPARKLINE_PATHS[5] },
  { id: 7, platform: 'YouTube', hashtag: '#StartupLife', context: 'Trending in entrepreneurship', metric: '2.8M views', sparkline: SPARKLINE_PATHS[6] },
  { id: 8, platform: 'Reddit', hashtag: '#DigitalMarketing', context: 'Hot in r/marketing', metric: '4.3K comments', sparkline: SPARKLINE_PATHS[7] },
]


const GOOGLE_TRENDS = [
  { rank: 1, name: 'atlético nacional - jaguares',   metric: '100.9K searches', isNew: true,  change: null,   type: 'brand',   color: '#16A34A' },
  { rank: 2, name: 'bank holiday',                   metric: '100K searches',   isNew: true,  change: null,   type: 'keyword', color: '#2563EB' },
  { rank: 3, name: 'huachipato - univ. de concepción', metric: '20K searches', isNew: true,  change: null,   type: 'brand',   color: '#1D4ED8' },
  { rank: 4, name: 'holnapi időjárás',               metric: '20K searches',    isNew: false, change: '+24%', type: 'keyword', color: '#0EA5E9' },
  { rank: 5, name: 'tempo para amanhã',              metric: '20K searches',    isNew: true,  change: null,   type: 'keyword', color: '#0284C7' },
  { rank: 6, name: 'napoli vs milan',                metric: '8.3K searches',   isNew: true,  change: null,   type: 'brand',   color: '#7C3AED' },
  { rank: 7, name: 'casa pia vs benfica',            metric: '8K searches',     isNew: true,  change: null,   type: 'brand',   color: '#DC2626' },
]

const PINTEREST_TRENDS = [
  { rank: 1, name: 'spring nails',              metric: '991 pins', isNew: false, change: '+31%', type: 'hashtag', color: '#C026D3' },
  { rank: 2, name: 'spring nails 2026',         metric: '788 pins', isNew: false, change: '+18%', type: 'hashtag', color: '#DB2777' },
  { rank: 3, name: 'coffe',                     metric: '657 pins', isNew: false, change: '+12%', type: 'keyword', color: '#2563EB' },
  { rank: 4, name: 'corte de pelo degrafilado', metric: '600 pins', isNew: false, change: '+9%',  type: 'hashtag', color: '#9333EA' },
  { rank: 5, name: 'low cortisol',              metric: '588 pins', isNew: false, change: '+22%', type: 'keyword', color: '#0EA5E9' },
  { rank: 6, name: 'dibujo de rostro',          metric: '496 pins', isNew: false, change: '+7%',  type: 'keyword', color: '#0284C7' },
  { rank: 7, name: 'nails spring',              metric: '487 pins', isNew: false, change: '+14%', type: 'hashtag', color: '#E879F9' },
]

const WIKIPEDIA_TRENDS = [
  { rank: 1, name: 'Dhurandhar: The Revenge',        metric: '284.77K views', isNew: false, change: '+156%', type: 'brand',   color: '#7C3AED' },
  { rank: 2, name: 'Artemis II',                     metric: '204.38K views', isNew: false, change: '+88%',  type: 'brand',   color: '#0F172A' },
  { rank: 3, name: 'The Drama (film)',                metric: '195.14K views', isNew: false, change: '+43%',  type: 'brand',   color: '#DC2626' },
  { rank: 4, name: 'Lauren Betts',                   metric: '194.52K views', isNew: false, change: '+67%',  type: 'brand',   color: '#0077B5' },
  { rank: 5, name: 'List of highest-grossing films', metric: '187.94K views', isNew: false, change: '+19%',  type: 'keyword', color: '#475467' },
  { rank: 6, name: 'Easter',                         metric: '171.15K views', isNew: false, change: '+210%', type: 'keyword', color: '#D97706' },
  { rank: 7, name: '2026 Iran war',                  metric: '167.19K views', isNew: false, change: '+334%', type: 'keyword', color: '#2563EB' },
]

const REGIONS = ['Global', 'United States', 'India', 'United Kingdom', 'Brazil', 'Australia', 'Canada']

const SEARCH_SUGGESTIONS = [
  { query: 'HighLevel',              mentions: 1248, sentiment: 68 },
  { query: 'HighLevel CRM',          mentions: 843,  sentiment: 61 },
  { query: 'HighLevel vs HubSpot',   mentions: 512,  sentiment: 54 },
  { query: '#GoHighLevel',           mentions: 389,  sentiment: 72 },
  { query: 'GoHighLevel',            mentions: 756,  sentiment: 74 },
  { query: 'email marketing',        mentions: 2340, sentiment: 61 },
  { query: 'email automation',       mentions: 1120, sentiment: 63 },
  { query: 'marketing automation',   mentions: 1876, sentiment: 58 },
  { query: 'CRM software',           mentions: 3210, sentiment: 55 },
  { query: 'CRM for agencies',       mentions: 487,  sentiment: 67 },
  { query: 'agency software',        mentions: 987,  sentiment: 63 },
  { query: 'agency growth',          mentions: 891,  sentiment: 76 },
  { query: 'sales funnel',           mentions: 1543, sentiment: 67 },
  { query: 'funnel builder',         mentions: 634,  sentiment: 65 },
  { query: 'lead generation',        mentions: 2108, sentiment: 62 },
  { query: 'social media marketing', mentions: 4521, sentiment: 71 },
  { query: 'white label CRM',        mentions: 423,  sentiment: 69 },
  { query: 'HubSpot',                mentions: 5832, sentiment: 59 },
  { query: 'HubSpot vs Salesforce',  mentions: 1204, sentiment: 52 },
  { query: 'Salesforce',             mentions: 7241, sentiment: 57 },
  { query: '#SaaS',                  mentions: 8903, sentiment: 64 },
  { query: '#MarketingAutomation',   mentions: 2341, sentiment: 66 },
  { query: '#AgencyLife',            mentions: 1876, sentiment: 78 },
  { query: '#EmailMarketing',        mentions: 3102, sentiment: 69 },
]


const RANK_STYLE = {
  1: { text: 'text-amber-500',  bg: 'bg-amber-50'  },
  2: { text: 'text-slate-400',  bg: 'bg-slate-50'  },
  3: { text: 'text-orange-400', bg: 'bg-orange-50' },
}

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
    case 'TikTok':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0F172A"/>
          <path d="M21 9h-2.5v9.5a2.5 2.5 0 1 1-2.5-2.5V13.5a5 5 0 1 0 5 5V13.2a6.8 6.8 0 0 0 4 1.3v-2.5A4.2 4.2 0 0 1 21 9Z" fill="white"/>
        </svg>
      )
    case 'LinkedIn':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0077B5"/>
          <path d="M10.5 13.5h2.5v9h-2.5v-9Zm1.25-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM15 13.5h2.4v1.2h.04c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.67 3 3.84V22.5h-2.5v-4.8c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.07V22.5H15v-9Z" fill="white"/>
        </svg>
      )
    case 'Instagram':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#E1306C"/>
          <rect x="8.5" y="8.5" width="15" height="15" rx="4.5" stroke="white" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5"/>
          <circle cx="21" cy="11" r="1.2" fill="white"/>
        </svg>
      )
    case 'Reddit':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF4500"/>
          <g transform="translate(7, 7) scale(0.75)">
            <path d={siReddit.path} fill="white"/>
          </g>
        </svg>
      )
    case 'Wikipedia':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="white"/>
          <circle cx="16" cy="16" r="13" stroke="#A2A9B1" strokeWidth="0.8" strokeDasharray="2.5 2"/>
          <text x="16" y="21.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="Georgia, serif" fontStyle="italic" fill="#101828">W</text>
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
    <svg viewBox="0 0 120 32" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
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
  const [trackDefault, setTrackDefault] = useState('')
  const [topics, setTopics] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    setTopics(loadTopicsFromStorage())
  }, [])

  useEffect(() => {
    function handleMouseDown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const suggestions = query.trim()
    ? SEARCH_SUGGESTIONS.filter(s => s.query.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate('/topic-detail', { state: { query, isSavedTopic: false } })
  }

  function handleTopicCreated({ title, sources, keywords }) {
    const kwArray = typeof keywords === 'string'
      ? keywords.split(',').map(k => k.trim()).filter(Boolean)
      : (Array.isArray(keywords) ? keywords : [])
    const newTopic = {
      id: Date.now(),
      name: title,
      keywords: kwArray,
      mentions: Math.floor(Math.random() * 900) + 150,
      sentiment: Math.floor(Math.random() * 35) + 45,
      sources,
      updated: 'Just now',
    }
    const updatedTopics = [...topics, newTopic]
    setTopics(updatedTopics)
    saveTopicsToStorage(updatedTopics)
    navigate('/topic-detail', { state: { query: title, isSavedTopic: true } })
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
        <div className="flex items-center justify-between px-8 py-4">
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

          <div className="flex items-center gap-3 text-[14px]">
            <span className="font-medium text-gray-900">
              Total searches:{' '}
              <span className="font-normal text-gray-500">{TOTAL_SEARCHES}/{MAX_SEARCHES}</span>
            </span>
          </div>
        </div>

        {/* ── Search section ── */}
        <div className="px-8 pb-5 flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-gray-700">Explore</label>
          <form onSubmit={handleSearch} className="flex items-center gap-2.5">
            <div className="relative flex-1" ref={searchRef}>
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search any keywords, brand or hashtags"
                className="w-full pl-9 pr-4 h-9 rounded-md border border-gray-300 bg-white text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  {suggestions.map(s => {
                    const sentimentColor = s.sentiment >= 65 ? 'text-positive' : s.sentiment >= 55 ? 'text-warning' : 'text-negative'
                    const dotColor = s.sentiment >= 65 ? 'bg-positive' : s.sentiment >= 55 ? 'bg-warning' : 'bg-negative'
                    return (
                      <div
                        key={s.query}
                        onMouseDown={() => { navigate('/topic-detail', { state: { query: s.query } }); setShowSuggestions(false) }}
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      >
                        <Search size={12} className="text-gray-300 shrink-0" />
                        <span className="flex-1 text-[13px] text-gray-700">{s.query}</span>
                        <span className="text-[11px] text-gray-400">{s.mentions.toLocaleString()} mentions</span>
                        <div className={`flex items-center gap-1 text-[11px] font-semibold ${sentimentColor}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                          {s.sentiment}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
          <div className="flex-1 overflow-y-auto px-8 pb-5">
            <div className="flex flex-col gap-5">

              {topics.length === 0 ? (
                /* Blank state: illustration + CTA */
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
              ) : (
                /* Topics state: summary → cards */
                <div className="space-y-4 pt-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Your listening topics</p>
                      <p className="text-[16px] font-semibold text-gray-900">
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

                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Total mentions</p>
                      <p className="text-[20px] font-bold text-gray-900">{totalMentions.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Avg sentiment</p>
                      <p className="text-[20px] font-bold text-positive">{avgSentiment}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Active topics</p>
                      <p className="text-[20px] font-bold text-gray-900">{topics.length}</p>
                    </div>
                  </div>

                  {/* Topic cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {topics.map(topic => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        onDelete={() => handleDeleteTopic(topic.id)}
                        onClick={() => navigate('/topic-detail', { state: { query: topic.name, isSavedTopic: true } })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Trending section — always visible */}
              <div className="border-t border-gray-100 pt-5 space-y-4 pb-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">What's trending elsewhere</p>
                    <p className="text-[16px] font-semibold text-gray-900">A peek at what's trending right now</p>
                  </div>
                  <button onClick={() => setActiveTab('Social trends')} className="text-[13px] font-semibold text-hl-blue hover:underline flex items-center gap-1">
                    See all trends →
                  </button>
                </div>

                <div className="relative -mx-5">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth px-5 pb-1" style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '20px' }}>
                    {TRENDING_DATA.map(trend => (
                      <div
                        key={trend.id}
                        onClick={() => navigate('/topic-detail', { state: { query: trend.hashtag } })}
                        className="w-[200px] shrink-0 bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2.5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <div>
                          <p className="text-[17px] font-bold text-gray-900 leading-tight">{trend.hashtag}</p>
                          <p className="text-[12px] text-gray-400 mt-0.5">{trend.context}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <PlatformIcon platform={trend.platform} size={16} />
                            <p className="text-[12px] text-gray-400 font-medium">{trend.platform}</p>
                          </div>
                          <p className="text-[12px] font-semibold text-gray-600">{trend.metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-14 bg-gradient-to-l from-white to-transparent" />
                </div>
              </div>

            </div>
          </div>
        ) : (
          <SocialTrendsTab onTrack={name => { setTrackDefault(name); setShowModal(true) }} />
        )}
      </div>

      {showModal && (
        <CreateTopicModal
          defaultTitle={trackDefault}
          onClose={() => { setShowModal(false); setTrackDefault('') }}
          onCreated={handleTopicCreated}
        />
      )}
    </div>
  )
}

function TopicCard({ topic, onDelete, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl border border-gray-200 p-3.5 flex flex-col gap-2.5 hover:shadow-md hover:border-gray-300 transition-all relative group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-gray-900 leading-snug">{topic.name}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="shrink-0 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all group-hover:text-gray-400"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Tracking keywords */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-gray-400 font-medium">Tracking</span>
        {(Array.isArray(topic.keywords) && topic.keywords.length > 0 ? topic.keywords : [topic.name]).slice(0, 3).map((kw, i) => (
          <span key={i} className="text-[11px] font-medium text-hl-blue bg-hl-blue-light px-2 py-0.5 rounded-full">
            {kw}
          </span>
        ))}
      </div>

      {/* Source icons */}
      <div className="flex gap-1">
        {topic.sources.slice(0, 5).map(src => (
          <SourceIcon key={src} src={src} />
        ))}
        {topic.sources.length > 5 && (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500">
            +{topic.sources.length - 5}
          </div>
        )}
      </div>

      {/* Trend sparkline */}
      <Sparkline path={SPARKLINE_PATHS[topic.id % SPARKLINE_PATHS.length]} />

      {/* Stats row */}
      <div className="flex items-center pt-2 border-t border-gray-100 mt-auto">
        <div className="flex-1">
          <p className="text-[14px] font-bold text-gray-900">{topic.mentions.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Mentions</p>
        </div>
        <div className="w-px h-7 bg-gray-100 mx-2.5" />
        <div className="flex-1">
          <p className="text-[14px] font-bold text-gray-900">{topic.sentiment}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Sentiment</p>
        </div>
        <div className="w-px h-7 bg-gray-100 mx-2.5" />
        <div className="flex-1">
          <p className="text-[14px] font-bold text-gray-900">{topic.sources.length}</p>
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
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
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
        <g transform="translate(38, 146) scale(0.833)">
          <path d={siReddit.path} fill="white"/>
        </g>
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

function RegionPicker() {
  const [open, setOpen] = useState(false)
  const [region, setRegion] = useState('Global')
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-300 bg-white text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
      >
        <Globe size={14} className="text-gray-400" />
        {region}
        <ChevronDown size={12} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => { setRegion(r); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center justify-between ${
                  region === r ? 'text-hl-blue font-semibold bg-hl-blue-light' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {r}
                {region === r && <span className="text-hl-blue text-[11px]">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TrendThumbnail({ type, color }) {
  return (
    <div
      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
      style={{ background: `${color}22` }}
    >
      {type === 'hashtag' ? (
        <span className="text-[17px] font-black leading-none" style={{ color }}>#</span>
      ) : type === 'brand' ? (
        <AtSign size={15} style={{ color }} strokeWidth={1.8} />
      ) : (
        <Tag size={15} style={{ color }} strokeWidth={1.8} />
      )}
    </div>
  )
}

function TrendColumn({ title, logo, accentColor, items, onTrack }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${accentColor}12 0%, transparent 70%)` }}>
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
          {logo}
        </div>
        <p className="text-[14px] font-semibold text-gray-900 flex-1">{title}</p>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const medal = RANK_STYLE[item.rank]
          return (
            <div key={item.rank} className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <span className={`text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${medal ? `${medal.text} ${medal.bg}` : 'text-gray-400'}`}>
                {item.rank}
              </span>
              <TrendThumbnail type={item.type} color={item.color} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.metric}</p>
              </div>
              <div className="shrink-0 w-16 flex items-center justify-end">
                <button
                  onClick={e => { e.stopPropagation(); onTrack(item.name) }}
                  className="hidden group-hover:flex items-center gap-0.5 text-[11px] font-semibold text-hl-blue bg-hl-blue-light hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                >
                  + Track
                </button>
                <div className="flex group-hover:hidden items-center gap-1">
                  {item.isNew ? (
                    <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">New</span>
                  ) : (
                    <>
                      <TrendingUp size={12} className="text-green-500" />
                      {item.change && <span className="text-[11px] font-semibold text-green-600">{item.change}</span>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SocialTrendsTab({ onTrack }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 pb-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pt-1">
        <RegionPicker />
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            <Calendar size={14} />
            Apr 29, 2026
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-[20px] font-semibold text-gray-900">Social trends</p>
        <p className="text-[12px] text-gray-400">Updated just now</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TrendColumn
          title="Google trends"
          logo={<PlatformIcon platform="Google" size={32} />}
          accentColor="#4285F4"
          items={GOOGLE_TRENDS}
          onTrack={onTrack}
        />
        <TrendColumn
          title="Pinterest keywords"
          logo={<PlatformIcon platform="Pinterest" size={32} />}
          accentColor="#E60023"
          items={PINTEREST_TRENDS}
          onTrack={onTrack}
        />
        <TrendColumn
          title="Wikipedia pageviews"
          logo={<PlatformIcon platform="Wikipedia" size={32} />}
          accentColor="#94A3B8"
          items={WIKIPEDIA_TRENDS}
          onTrack={onTrack}
        />
      </div>
    </div>
  )
}

