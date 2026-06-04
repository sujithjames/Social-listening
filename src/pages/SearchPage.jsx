import { useState, useEffect, useRef, useId } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Calendar, Globe, Tag, AtSign, LayoutGrid, List, ArrowUp, ArrowDown, MoreVertical, Filter, ExternalLink, Check } from 'lucide-react'
import { siReddit } from 'simple-icons'
import CreateTopicModal from '../components/CreateTopicModal'
import PlatformIcon from '../components/PlatformIcon'

const STORAGE_KEY = 'sl.topics.v1'
const TOTAL_SEARCHES = 0
const MAX_SEARCHES = 3

const SOURCE_LABELS = {
  facebook: 'Facebook', twitter: 'X', instagram: 'Instagram',
  youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn',
  reddit: 'Reddit', web: 'Web', telegram: 'Telegram', news: 'News',
}

const SOURCE_TO_PLATFORM = {
  facebook: 'Facebook', twitter: 'X / Twitter', instagram: 'Instagram',
  youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn',
  reddit: 'Reddit', web: 'Web', telegram: 'Telegram', news: 'News',
  // Topic detail page saves capitalized platform names
  X: 'X / Twitter', Instagram: 'Instagram', Reddit: 'Reddit',
  YouTube: 'YouTube', News: 'News', LinkedIn: 'LinkedIn',
  TikTok: 'TikTok', Facebook: 'Facebook',
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

const CREATED_BY_USERS = [
  { name: 'Devon Lane',   color: '#155EEF' },
  { name: 'Sarah Chen',   color: '#16A34A' },
  { name: 'Marcus Reid',  color: '#7C3AED' },
]

function getCreatedBy(topicId) {
  return CREATED_BY_USERS[(topicId || 0) % CREATED_BY_USERS.length]
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

function Sparkline({ path }) {
  const uid = useId()
  const id = `grad-${uid.replace(/:/g, '')}`
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
  const [topicsView, setTopicsView] = useState('list')
  const [topicsFilter, setTopicsFilter] = useState('')
  const searchRef = useRef(null)
  const trendingRef = useRef(null)
  const [trendingScroll, setTrendingScroll] = useState({ atStart: true, atEnd: false })
  const navigate = useNavigate()

  function handleTrendingScroll() {
    const el = trendingRef.current
    if (!el) return
    setTrendingScroll({
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    })
  }

  function scrollTrending(dir) {
    const el = trendingRef.current
    if (!el) return
    el.scrollBy({ left: dir * 224, behavior: 'smooth' })
  }

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

  const positiveCount = topics.reduce((sum, t) => sum + Math.round(t.mentions * t.sentiment / 100), 0)
  const negativeCount = topics.reduce((sum, t) => sum + Math.round(t.mentions * (100 - t.sentiment) * 0.3 / 100), 0)
  const neutralCount = Math.max(0, totalMentions - positiveCount - negativeCount)
  const avgNegativePct = topics.length > 0
    ? Math.round(topics.reduce((sum, t) => sum + (100 - t.sentiment) * 0.3, 0) / topics.length)
    : 0
  const netScore = avgSentiment - avgNegativePct

  const filteredTopics = topicsFilter.trim()
    ? topics.filter(t => {
        const q = topicsFilter.toLowerCase()
        return t.name.toLowerCase().includes(q) ||
          (Array.isArray(t.keywords) ? t.keywords : []).some(k => k.toLowerCase().includes(q))
      })
    : topics

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
                    ? 'bg-white text-primary-700 font-semibold shadow-sm'
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
        <div className="px-8 pb-6 flex flex-col gap-2">
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
                        <span className="text-[12px] text-gray-400">{s.mentions.toLocaleString()} mentions</span>
                        <div className={`flex items-center gap-1 text-[12px] font-semibold ${sentimentColor}`}>
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
              className="h-9 px-5 rounded-lg bg-hl-blue border border-hl-blue text-white text-[14px] font-semibold hover:bg-hl-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
            >
              Search
            </button>
          </form>
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'Topic' ? (
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="flex flex-col gap-10">

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
                    className="flex items-center gap-1.5 h-9 px-5 rounded-lg border border-hl-blue-border bg-white text-[13px] font-semibold text-primary-700 hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    <Plus size={13} />
                    Create topic
                  </button>
                </div>
              ) : (
                /* Topics state: summary → cards/list */
                <div className="space-y-6 pt-1">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[16px] font-semibold text-gray-900">
                        {topics.length} active {topics.length === 1 ? 'topic' : 'topics'}
                      </p>
                      <p className="text-[13px] text-gray-500 mt-0.5">Auto-refreshed every 6 hours</p>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-1.5 h-8 px-3 rounded border border-hl-blue-border bg-white text-[13px] font-semibold text-primary-700 hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)] shrink-0"
                    >
                      <Plus size={13} />
                      Create topic
                    </button>
                  </div>

                  {/* Summary stats — 5 equal cards */}
                  <div className="grid grid-cols-5 gap-4">
                    {/* Total mentions */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1.5">
                      <p className="text-[13px] font-medium text-gray-500">Total mentions</p>
                      <p className="text-[24px] font-semibold text-gray-900 leading-none">{totalMentions.toLocaleString()}</p>
                      <span className="text-[11px] text-positive font-medium">↑ 12% vs prev</span>
                    </div>

                    {/* Positive */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1.5">
                      <p className="text-[13px] font-medium text-gray-500">Positive</p>
                      <p className="text-[24px] font-semibold text-gray-900 leading-none">{positiveCount.toLocaleString()}</p>
                      <span className="text-[11px] text-positive font-medium">↑ 5% vs prev</span>
                    </div>

                    {/* Neutral */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1.5">
                      <p className="text-[13px] font-medium text-gray-500">Neutral</p>
                      <p className="text-[24px] font-semibold text-gray-900 leading-none">{neutralCount.toLocaleString()}</p>
                      <span className="text-[11px] text-negative font-medium">↓ 1% vs prev</span>
                    </div>

                    {/* Negative */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1.5">
                      <p className="text-[13px] font-medium text-gray-500">Negative</p>
                      <p className="text-[24px] font-semibold text-gray-900 leading-none">{negativeCount.toLocaleString()}</p>
                      <span className="text-[11px] text-negative font-medium">↓ 2% vs prev</span>
                    </div>

                    {/* Net sentiment */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1.5">
                      <p className="text-[13px] font-medium text-gray-500">Net sentiment</p>
                      <p className="text-[24px] font-semibold text-gray-900 leading-none">{netScore} pts</p>
                      <span className="text-[11px] text-positive font-medium">↑ 7 pts vs prev</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Block 1: shared controls — retained across both views */}
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] text-neutral-500">{filteredTopics.length} of {topics.length} topics</p>
                      <div className="flex items-center gap-2">
                        <ViewToggle topicsView={topicsView} setTopicsView={setTopicsView} />
                        <div className="relative">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                          <input
                            type="text"
                            value={topicsFilter}
                            onChange={e => setTopicsFilter(e.target.value)}
                            placeholder="Filter topics..."
                            className="w-56 h-8 pl-8 pr-3 rounded-md border border-gray-300 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-hl-blue shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {topicsView === 'list' ? (
                      <TopicsList
                        topics={filteredTopics}
                        filter={topicsFilter}
                        onRowClick={topic => navigate('/topic-detail', { state: { query: topic.name, isSavedTopic: true } })}
                        onDelete={handleDeleteTopic}
                      />
                    ) : (
                      filteredTopics.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-neutral-400">
                          <p className="text-[13px]">No topics match "{topicsFilter}"</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {filteredTopics.map(topic => (
                            <TopicCard
                              key={topic.id}
                              topic={topic}
                              onDelete={() => handleDeleteTopic(topic.id)}
                              onClick={() => navigate('/topic-detail', { state: { query: topic.name, isSavedTopic: true } })}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Trending section — always visible */}
              <div className="pt-2 space-y-6 pb-2">
                <div className="h-px bg-gray-100 -mx-1" />
                <div className="flex items-end justify-between">
                  <p className="text-[16px] font-semibold text-gray-900">Trending now</p>
                  <button onClick={() => setActiveTab('Social trends')} className="text-[13px] font-semibold text-hl-blue hover:underline flex items-center gap-1">
                    See all trends →
                  </button>
                </div>

                <div className="relative -mx-5 group/trending">
                  {/* Left fade */}
                  <div className={`pointer-events-none absolute left-0 top-0 bottom-1 w-20 bg-gradient-to-r from-white to-transparent z-10 transition-opacity duration-200 ${trendingScroll.atStart ? 'opacity-0' : 'opacity-100'}`} />
                  {/* Right fade */}
                  <div className={`pointer-events-none absolute right-0 top-0 bottom-1 w-20 bg-gradient-to-l from-white to-transparent z-10 transition-opacity duration-200 ${trendingScroll.atEnd ? 'opacity-0' : 'opacity-100'}`} />

                  {/* Left arrow */}
                  <button
                    onClick={() => scrollTrending(-1)}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-150 ${trendingScroll.atStart ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/trending:opacity-100 hover:bg-gray-50'}`}
                  >
                    <ChevronLeft size={14} className="text-gray-600" />
                  </button>
                  {/* Right arrow */}
                  <button
                    onClick={() => scrollTrending(1)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-150 ${trendingScroll.atEnd ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/trending:opacity-100 hover:bg-gray-50'}`}
                  >
                    <ChevronRight size={14} className="text-gray-600" />
                  </button>

                  <div
                    ref={trendingRef}
                    onScroll={handleTrendingScroll}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-5 pb-1"
                    style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '20px' }}
                  >
                    {TRENDING_DATA.map(trend => (
                      <div
                        key={trend.id}
                        onClick={() => navigate('/topic-detail', { state: { query: trend.hashtag } })}
                        className="w-[200px] shrink-0 bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2.5 hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <div>
                          <p className="text-[16px] font-semibold text-gray-900 leading-tight">{trend.hashtag}</p>
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
    <div onClick={onClick} className="bg-white rounded-xl border border-gray-100 p-3.5 flex flex-col gap-2.5 hover:shadow-sm hover:border-gray-200 transition-all relative group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-gray-900 leading-snug">{topic.name}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="shrink-0 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group-hover:text-gray-400"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Tracking keywords */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[12px] text-gray-400 font-medium">Tracking</span>
        {(Array.isArray(topic.keywords) && topic.keywords.length > 0 ? topic.keywords : [topic.name]).slice(0, 3).map((kw, i) => (
          <span key={i} className="text-[12px] font-medium text-hl-blue bg-hl-blue-light px-2 py-0.5 rounded-full">
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
          <p className="text-[14px] font-semibold text-gray-900">{topic.mentions.toLocaleString()}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Mentions</p>
        </div>
        <div className="w-px h-7 bg-gray-100 mx-2.5" />
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-gray-900">{topic.sentiment}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Sentiment</p>
        </div>
        <div className="w-px h-7 bg-gray-100 mx-2.5" />
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-gray-900">{topic.sources.length}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Source{topic.sources.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  )
}

function SourceIcon({ src }) {
  const label = SOURCE_LABELS[src] || src
  const platformName = SOURCE_TO_PLATFORM[src]
  return (
    <div title={label} className="shrink-0">
      <PlatformIcon platform={platformName} size={24} />
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
                {region === r && <span className="text-hl-blue text-[12px]">✓</span>}
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
        <span className="text-[14px] font-semibold leading-none" style={{ color }}>#</span>
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
              <span className={`text-[12px] font-semibold w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${medal ? `${medal.text} ${medal.bg}` : 'text-gray-400'}`}>
                {item.rank}
              </span>
              <TrendThumbnail type={item.type} color={item.color} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{item.metric}</p>
              </div>
              <div className="shrink-0 w-16 flex items-center justify-end">
                <button
                  onClick={e => { e.stopPropagation(); onTrack(item.name) }}
                  className="hidden group-hover:flex items-center gap-0.5 text-[12px] font-semibold text-hl-blue bg-hl-blue-light hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                >
                  + Track
                </button>
                <div className="flex group-hover:hidden items-center gap-1">
                  {item.isNew ? (
                    <span className="text-[12px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">New</span>
                  ) : (
                    <>
                      <TrendingUp size={12} className="text-green-500" />
                      {item.change && <span className="text-[12px] font-semibold text-green-600">{item.change}</span>}
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
        <p className="text-[16px] font-semibold text-gray-900">Social trends</p>
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

function deriveTopicMetrics(topic) {
  const seed = (topic.id || 0) % 100
  const volume30d = topic.mentions ? topic.mentions * 8 + seed * 37 : 5000 + seed * 120
  const change30d = ((seed % 50) - 10)
  const createdDate = topic.updated === 'Just now' ? 'Today' : 'Apr 8, 2026'
  return { volume30d, change30d, createdDate }
}

function TopicSourceBadge({ src }) {
  const label = SOURCE_LABELS[src] || src
  const platformName = SOURCE_TO_PLATFORM[src]
  return (
    <div title={label} className="shrink-0 ring-2 ring-white rounded-full">
      <PlatformIcon platform={platformName} size={20} />
    </div>
  )
}

function ChangeIndicator({ value }) {
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  const color = up ? 'text-positive' : 'text-negative'
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-medium ${color}`}>
      <Icon size={13} strokeWidth={2} />
      {up ? '+' : ''}{value}%
    </span>
  )
}

function sortValueFor(topic, key) {
  switch (key) {
    case 'name':        return topic.name.toLowerCase()
    case 'sources':     return (topic.sources || []).length
    case 'keywords':    return (Array.isArray(topic.keywords) ? topic.keywords : []).length
    case 'createdBy':   return getCreatedBy(topic.id).name.toLowerCase()
    case 'createdDate': return topic.createdDate
    case 'volume30d':   return topic.volume30d
    case 'change30d':   return topic.change30d
    default:            return ''
  }
}

function TopicsList({ topics, filter, onRowClick, onDelete }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  let rows = topics.map(t => ({ ...t, ...deriveTopicMetrics(t) }))

  if (sortKey) {
    rows = [...rows].sort((a, b) => {
      const av = sortValueFor(a, sortKey)
      const bv = sortValueFor(b, sortKey)
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
  }

  function setSort(key, dir) {
    setSortKey(key)
    setSortDir(dir)
  }

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)

  useEffect(() => { setPage(1) }, [topics.length, sortKey, sortDir, perPage])

  const total = rows.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, lastPage)
  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1
  const end = Math.min(safePage * perPage, total)
  const paged = rows.slice((safePage - 1) * perPage, safePage * perPage)

  return (
    <>
      {/* Block 2: table card — table only */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {rows.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <p className="text-[13px]">No topics match "{filter}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <ColumnHeader label="Topic title"   sortKey="name"        current={sortKey} dir={sortDir} onSort={setSort} />
                  <ColumnHeader label="Network"       sortKey="sources"     current={sortKey} dir={sortDir} onSort={setSort} />
                  <ColumnHeader label="Keywords"      sortKey="keywords"    current={sortKey} dir={sortDir} onSort={setSort} />
                  <ColumnHeader label="Created by"    sortKey="createdBy"   current={sortKey} dir={sortDir} onSort={setSort} />
                  <ColumnHeader label="Created date"  sortKey="createdDate" current={sortKey} dir={sortDir} onSort={setSort} />
                  <ColumnHeader label="30 day volume" sortKey="volume30d"   current={sortKey} dir={sortDir} onSort={setSort} align="right" />
                  <ColumnHeader label="% Change"      sortKey="change30d"   current={sortKey} dir={sortDir} onSort={setSort} align="right" />
                  <th className="w-10 px-2 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map(t => {
                  const createdBy = getCreatedBy(t.id)
                  return (
                    <tr
                      key={t.id}
                      onClick={() => onRowClick(t)}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3 text-[14px] font-medium text-neutral-900">{t.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-1.5">
                          {(t.sources || []).slice(0, 5).map(s => <TopicSourceBadge key={s} src={s} />)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {(Array.isArray(t.keywords) ? t.keywords : []).slice(0, 2).map((k, i) => (
                            <span key={i} className="text-[12px] font-medium text-hl-blue bg-hl-blue-light px-1.5 py-0.5 rounded">{k}</span>
                          ))}
                          {Array.isArray(t.keywords) && t.keywords.length > 2 && (
                            <span className="text-[12px] text-neutral-400">+{t.keywords.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <UserAvatar user={createdBy} />
                          <span className="text-[13px] text-neutral-700 font-medium">{createdBy.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-neutral-600">{t.createdDate}</td>
                      <td className="px-4 py-3 text-[14px] font-semibold text-neutral-900 text-right tabular-nums">{t.volume30d.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right"><ChangeIndicator value={t.change30d} /></td>
                      <td className="px-2 py-3">
                        <RowKebabMenu
                          onOpen={() => onRowClick(t)}
                          onDelete={() => onDelete(t.id)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block 3: pagination — outside the table card, right-aligned */}
      {rows.length > 0 && (
        <TablePagination
          page={safePage}
          perPage={perPage}
          total={total}
          start={start}
          end={end}
          lastPage={lastPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      )}
    </>
  )
}

function ColumnHeader({ label, sortKey, current, dir, onSort, align = 'left' }) {
  const active = current === sortKey
  const ChevIcon = dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th className={`px-4 py-2.5 text-[12px] font-medium text-neutral-500 border-r border-gray-200 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <span className="inline-flex items-center gap-1.5">
        <span className={active ? 'text-neutral-900' : ''}>{label}</span>
        {active && <ChevIcon size={11} className="text-hl-blue" />}
        <ColumnSortMenu
          active={active}
          dir={dir}
          onSort={direction => onSort(sortKey, direction)}
          align={align}
        />
      </span>
    </th>
  )
}

function ColumnSortMenu({ active, dir, onSort, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  function handleToggle(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + 4,
        left: align === 'right' ? rect.right - 176 : rect.left,
      })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <span className="inline-flex">
      <button
        ref={btnRef}
        onClick={handleToggle}
        title="Sort options"
        className={`p-0.5 rounded transition-colors ${
          active ? 'text-hl-blue' : 'text-neutral-300 hover:text-neutral-500'
        }`}
      >
        <Filter size={11} />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
          className="w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] py-1"
        >
          <button
            onClick={() => { onSort('asc'); setOpen(false) }}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-[13px] text-left hover:bg-gray-50 transition-colors ${
              active && dir === 'asc' ? 'text-hl-blue font-medium' : 'text-neutral-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ArrowUp size={12} className={active && dir === 'asc' ? 'text-hl-blue' : 'text-neutral-400'} />
              Sort ascending
            </span>
            {active && dir === 'asc' && <Check size={12} className="text-hl-blue" />}
          </button>
          <button
            onClick={() => { onSort('desc'); setOpen(false) }}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-[13px] text-left hover:bg-gray-50 transition-colors ${
              active && dir === 'desc' ? 'text-hl-blue font-medium' : 'text-neutral-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ArrowDown size={12} className={active && dir === 'desc' ? 'text-hl-blue' : 'text-neutral-400'} />
              Sort descending
            </span>
            {active && dir === 'desc' && <Check size={12} className="text-hl-blue" />}
          </button>
        </div>,
        document.body
      )}
    </span>
  )
}

function ViewToggle({ topicsView, setTopicsView }) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
      <button
        onClick={() => setTopicsView('grid')}
        title="Grid view"
        className={`flex items-center justify-center w-8 h-7 rounded-md transition-all ${
          topicsView === 'grid' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        <LayoutGrid size={14} />
      </button>
      <button
        onClick={() => setTopicsView('list')}
        title="List view"
        className={`flex items-center justify-center w-8 h-7 rounded-md transition-all ${
          topicsView === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        <List size={14} />
      </button>
    </div>
  )
}

function UserAvatar({ user, size = 24 }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ background: user.color, width: size, height: size }}
    >
      <span className="text-white font-semibold leading-none" style={{ fontSize: Math.round(size * 0.42) }}>{initials}</span>
    </div>
  )
}

function RowKebabMenu({ onOpen, onDelete }) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  function handleToggle(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleToggle}
        title="More actions"
        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
          open ? 'bg-gray-100 text-neutral-700' : 'text-neutral-400 hover:text-neutral-700 hover:bg-gray-100'
        }`}
      >
        <MoreVertical size={14} />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, right: menuPos.right }}
          className="w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] py-1"
        >
          <button
            onClick={e => { e.stopPropagation(); onOpen(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-neutral-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={12} className="text-neutral-400" />
            Open
          </button>
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={e => { e.stopPropagation(); onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

function TablePagination({ page, perPage, total, start, end, lastPage, onPageChange, onPerPageChange }) {
  return (
    <div className="flex items-center justify-end gap-4 text-[13px]">
      <div className="flex items-center gap-2 text-neutral-600">
        <span>Rows per page</span>
        <div className="relative">
          <select
            value={perPage}
            onChange={e => onPerPageChange(Number(e.target.value))}
            className="appearance-none h-7 pl-2.5 pr-7 rounded-md border border-gray-200 bg-white text-[13px] text-neutral-700 focus:outline-none focus:border-hl-blue cursor-pointer"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>
      <span className="text-neutral-600">{start}-{end} of {total}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-7 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-neutral-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="h-7 min-w-7 px-2 rounded-lg border border-hl-blue text-hl-blue text-[13px] font-semibold flex items-center justify-center">
          {page}
        </span>
        <button
          onClick={() => onPageChange(Math.min(lastPage, page + 1))}
          disabled={page >= lastPage}
          className="h-7 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-neutral-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

