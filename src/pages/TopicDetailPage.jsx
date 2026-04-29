import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Share2, Download, Bookmark, BookmarkCheck, ChevronDown, ExternalLink } from 'lucide-react'
import CreateTopicModal from '../components/CreateTopicModal'

const PLATFORMS = ['All', 'X', 'Instagram', 'Reddit', 'YouTube', 'News', 'LinkedIn']

function PlatformIcon({ name, size = 14 }) {
  const s = size
  switch (name) {
    case 'X':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0F172A"/>
          <path d="M18.24 14.87 24.07 8h-1.38l-5.07 5.88L13.26 8H8.4l6.1 8.88L8.4 24h1.38l5.33-6.19L19.44 24H24.3l-6.06-9.13Zm-1.88 2.19-.62-.88-4.92-7.03h2.11l3.97 5.67.62.88 5.15 7.36h-2.11l-4.2-5.99Z" fill="white"/>
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
          <circle cx="16" cy="17" r="5.5" fill="white"/>
          <circle cx="16" cy="15" r="3.5" fill="white"/>
          <path d="M11 17 a5 4 0 0 0 10 0" stroke="#FF4500" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <circle cx="14" cy="16.5" r="1" fill="#FF4500"/>
          <circle cx="18" cy="16.5" r="1" fill="#FF4500"/>
          <circle cx="20" cy="12" r="2" fill="white"/>
          <path d="M18 13.5 l2-1.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
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
    case 'News':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#155EEF"/>
          <rect x="8" y="10" width="16" height="12" rx="2" fill="white" fillOpacity="0.9"/>
          <path d="M11 14h10M11 17h7M11 20h5" stroke="#155EEF" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'LinkedIn':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0077B5"/>
          <path d="M10.5 13.5h2.5v9h-2.5v-9Zm1.25-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM15 13.5h2.4v1.2h.04c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.67 3 3.84V22.5h-2.5v-4.8c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.07V22.5H15v-9Z" fill="white"/>
        </svg>
      )
    default:
      return null
  }
}
const DATE_OPTIONS = ['Last 7 days', 'Last 15 days', 'Last 30 days']

const MOCK_POSTS = [
  { id: 1, platform: 'X', author: '@marketingpro', date: 'Apr 24, 2026', text: 'HighLevel has completely transformed how we manage our clients. The automation alone saves us 10+ hours a week.', sentiment: 'positive', url: '#' },
  { id: 2, platform: 'Reddit', author: 'u/agencyowner_dan', date: 'Apr 23, 2026', text: 'Switched from HubSpot to HighLevel 6 months ago. Honestly the onboarding was rough but the value is undeniable once you get it set up.', sentiment: 'neutral', url: '#' },
  { id: 3, platform: 'Instagram', author: '@digitalstrategyco', date: 'Apr 22, 2026', text: "Our clients are seeing 3x lead conversion with the HighLevel funnels. If you're not using this yet, you're leaving money on the table.", sentiment: 'positive', url: '#' },
  { id: 4, platform: 'News', author: 'MarTech Today', date: 'Apr 21, 2026', text: 'HighLevel continues to challenge legacy CRM platforms with its all-in-one agency suite, attracting over 60,000 agency customers globally.', sentiment: 'positive', url: '#' },
  { id: 5, platform: 'YouTube', author: 'AgencyGrowthPodcast', date: 'Apr 20, 2026', text: "Just dropped a 45-min breakdown of HighLevel's new Social Planner. Mixed feelings -- the UI needs work but the features are solid.", sentiment: 'neutral', url: '#' },
]

const PLATFORM_BADGE = {
  X: 'bg-neutral-900 text-white',
  Reddit: 'bg-orange-500 text-white',
  Instagram: 'bg-pink-500 text-white',
  YouTube: 'bg-red-600 text-white',
  News: 'bg-hl-blue text-white',
  LinkedIn: 'bg-blue-600 text-white',
}

const SENTIMENT_BADGE = {
  positive: 'text-positive bg-green-50 border-green-200',
  neutral: 'text-neutral-500 bg-neutral-100 border-neutral-200',
  negative: 'text-negative bg-red-50 border-red-200',
}

const KPI_CARDS = [
  { label: 'Total Mentions', value: '1,248', delta: '+12%', up: true },
  { label: 'Positive', value: '849', delta: '+5%', up: true },
  { label: 'Neutral', value: '262', delta: '-1%', up: false },
  { label: 'Negative', value: '137', delta: '-2%', up: true },
  { label: 'Net Sentiment', value: '64/100', delta: '+7pts', up: true },
]

const PLATFORM_DIST = [
  { name: 'X', count: 474, pct: 38 },
  { name: 'Reddit', count: 337, pct: 27 },
  { name: 'Instagram', count: 237, pct: 19 },
  { name: 'News', count: 125, pct: 10 },
  { name: 'YouTube', count: 75, pct: 6 },
]

const EMOTIONS = [
  { label: 'Joy', value: 42, color: 'bg-yellow-400' },
  { label: 'Trust', value: 28, color: 'bg-hl-blue' },
  { label: 'Anticipation', value: 15, color: 'bg-purple-400' },
  { label: 'Surprise', value: 8, color: 'bg-pink-400' },
  { label: 'Anger', value: 7, color: 'bg-red-400' },
  { label: 'Sadness', value: 5, color: 'bg-blue-300' },
  { label: 'Disgust', value: 3, color: 'bg-orange-400' },
]

const KEYWORDS = [
  { word: 'automation', size: 'text-[18px]', weight: 'font-bold', color: '#155EEF' },
  { word: 'CRM', size: 'text-[22px]', weight: 'font-bold', color: '#344054' },
  { word: 'agency', size: 'text-[16px]', weight: 'font-semibold', color: '#667085' },
  { word: 'funnels', size: 'text-[14px]', weight: 'font-medium', color: '#155EEF' },
  { word: 'HighLevel', size: 'text-[20px]', weight: 'font-bold', color: '#344054' },
  { word: 'clients', size: 'text-[15px]', weight: 'font-semibold', color: '#667085' },
  { word: 'marketing', size: 'text-[13px]', weight: 'font-medium', color: '#155EEF' },
  { word: 'onboarding', size: 'text-[14px]', weight: 'font-medium', color: '#344054' },
  { word: 'pipeline', size: 'text-[16px]', weight: 'font-semibold', color: '#667085' },
  { word: 'AI', size: 'text-[18px]', weight: 'font-bold', color: '#155EEF' },
  { word: 'workflow', size: 'text-[13px]', weight: 'font-medium', color: '#344054' },
  { word: 'leads', size: 'text-[15px]', weight: 'font-semibold', color: '#667085' },
  { word: 'SaaS', size: 'text-[13px]', weight: 'font-medium', color: '#155EEF' },
  { word: 'conversion', size: 'text-[14px]', weight: 'font-medium', color: '#344054' },
  { word: 'social planner', size: 'text-[12px]', weight: 'font-medium', color: '#667085' },
]

const TREND_PATH = "M0,52 C10,48 20,44 30,40 C40,36 50,42 60,38 C70,34 80,26 90,22 C100,18 110,28 120,24 C130,20 140,14 150,10 C160,6 170,12 180,8 C190,4 200,6 210,4 C220,2 230,8 240,4"
const TREND_LABELS = ['Apr 14', 'Apr 16', 'Apr 18', 'Apr 20', 'Apr 22', 'Apr 24', 'Apr 26', 'Apr 28']

function SentimentDonut({ positive = 68, neutral = 21, negative = 11 }) {
  const r = 52
  const cx = 68
  const cy = 68
  const circ = 2 * Math.PI * r
  const gap = 4
  const posLen = (positive / 100) * circ - gap
  const neutLen = (neutral / 100) * circ - gap
  const negLen = (negative / 100) * circ - gap
  const base = circ * 0.25

  return (
    <div className="flex items-center gap-4">
      <svg width={136} height={136} viewBox="0 0 136 136">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F4F7" strokeWidth={15} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#16A34A" strokeWidth={15}
          strokeDasharray={`${posLen} ${circ}`}
          strokeDashoffset={base}
          strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D0D5DD" strokeWidth={15}
          strokeDasharray={`${neutLen} ${circ}`}
          strokeDashoffset={base - (positive / 100) * circ - gap / 2}
          strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#DC2626" strokeWidth={15}
          strokeDasharray={`${negLen} ${circ}`}
          strokeDashoffset={base - ((positive + neutral) / 100) * circ - gap}
          strokeLinecap="round" />
        <text x={cx} y={cx - 7} textAnchor="middle" fontSize={21} fontWeight={700} fill="#101828">{positive}%</text>
        <text x={cx} y={cx + 12} textAnchor="middle" fontSize={11} fill="#667085">Positive</text>
      </svg>
      <div className="flex flex-col gap-2.5">
        {[
          { label: 'Positive', pct: positive, dot: 'bg-positive' },
          { label: 'Neutral', pct: neutral, dot: 'bg-gray-300' },
          { label: 'Negative', pct: negative, dot: 'bg-negative' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
            <span className="text-[12px] text-neutral-500 w-16">{s.label}</span>
            <span className="text-[13px] font-semibold text-neutral-800">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendChart() {
  return (
    <div>
      <svg viewBox="0 0 240 56" fill="none" className="w-full h-14" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#155EEF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#155EEF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${TREND_PATH} L240,56 L0,56 Z`} fill="url(#trend-fill)" />
        <path d={TREND_PATH} stroke="#155EEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div className="flex items-center justify-between mt-1 px-0.5">
        {TREND_LABELS.map(d => (
          <span key={d} className="text-[10px] text-neutral-400">{d}</span>
        ))}
      </div>
    </div>
  )
}

export default function TopicDetailPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const query = state?.query || 'HighLevel'
  const isSavedTopic = state?.isSavedTopic ?? false

  const [activePlatform, setActivePlatform] = useState('All')
  const [dateRange, setDateRange] = useState('Last 15 days')
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [saved, setSaved] = useState(isSavedTopic)
  const [showSaveModal, setShowSaveModal] = useState(false)

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] flex flex-col flex-1 overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="border-b border-neutral-200 px-5 py-2.5 flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="w-px h-5 bg-neutral-200 shrink-0" />

        <p className="text-[14px] font-semibold text-neutral-900 shrink-0 max-w-[200px] truncate">"{query}"</p>

        <div className="w-px h-5 bg-neutral-200 shrink-0" />

        {/* Platform filter chips */}
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                activePlatform === p
                  ? 'bg-hl-blue text-white'
                  : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
              }`}
            >
              {p !== 'All' && <PlatformIcon name={p} size={14} />}
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Date range picker */}
          <div className="relative">
            <button
              onClick={() => setShowDateMenu(v => !v)}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-neutral-200 text-[12px] text-neutral-700 hover:bg-gray-50 transition-colors"
            >
              {dateRange}
              <ChevronDown size={12} className="text-neutral-400" />
            </button>
            {showDateMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 w-36 py-1">
                {DATE_OPTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => { setDateRange(d); setShowDateMenu(false) }}
                    className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors ${
                      dateRange === d ? 'text-hl-blue font-semibold' : 'text-neutral-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors" title="Refresh">
            <RefreshCw size={13} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors" title="Share">
            <Share2 size={13} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors" title="Download">
            <Download size={13} />
          </button>

          <div className="w-px h-5 bg-neutral-200" />

          {saved ? (
            <div className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-green-50 border border-green-200 text-positive text-[12px] font-semibold">
              <BookmarkCheck size={13} />
              Saved
            </div>
          ) : (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-hl-blue hover:bg-hl-blue-dark text-white text-[12px] font-semibold transition-colors"
            >
              <Bookmark size={13} />
              Save as Topic
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-[11px] text-neutral-400">Last updated 2 hours ago · {dateRange} · 1,248 mentions</p>

        {/* KPI cards — F-08 */}
        <div className="grid grid-cols-5 gap-3">
          {KPI_CARDS.map(m => (
            <div key={m.label} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
              <p className="text-[11px] text-neutral-500 mb-1 font-medium">{m.label}</p>
              <p className="text-[20px] font-bold text-neutral-900 leading-tight">{m.value}</p>
              <p className={`text-[11px] mt-1 font-medium ${m.up ? 'text-positive' : 'text-negative'}`}>
                {m.delta} vs prev period
              </p>
            </div>
          ))}
        </div>

        {/* Row 2: Sentiment donut + Platform dist + Emotion — F-09, F-10, F-11 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-neutral-900 mb-3">Sentiment Distribution</p>
            <SentimentDonut positive={68} neutral={21} negative={11} />
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-neutral-900 mb-3">Share of Voice by Platform</p>
            <div className="space-y-3">
              {PLATFORM_DIST.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-20 shrink-0">
                    <PlatformIcon name={p.name} size={14} />
                    <span className="text-[11px] text-neutral-500">{p.name}</span>
                  </div>
                  <div className="flex-1 bg-neutral-100 rounded-full h-2">
                    <div className="bg-hl-blue h-2 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-600 w-20 text-right shrink-0">{p.count.toLocaleString()} · {p.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-neutral-900 mb-3">Emotion Radar</p>
            <div className="space-y-2.5">
              {EMOTIONS.map(e => (
                <div key={e.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500 w-20 shrink-0">{e.label}</span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                    <div className={`${e.color} h-1.5 rounded-full`} style={{ width: `${e.value}%` }} />
                  </div>
                  <span className="text-[11px] text-neutral-500 w-6 text-right shrink-0">{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mention trend — F-12 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-neutral-900">Mentions Over Time</p>
            <span className="text-[11px] text-neutral-400">{dateRange}</span>
          </div>
          <TrendChart />
        </div>

        {/* Keyword cloud + Conversation feed — F-13 P1, F-15 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-neutral-900 mb-3">Top Keywords</p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 items-baseline">
              {KEYWORDS.map(k => (
                <span
                  key={k.word}
                  className={`${k.size} ${k.weight} leading-snug cursor-default hover:opacity-70 transition-opacity`}
                  style={{ color: k.color }}
                >
                  {k.word}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-neutral-900">Conversation Feed</p>
              <span className="text-[11px] text-neutral-400">Showing 5 of 1,248</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {MOCK_POSTS.map(post => (
                <div key={post.id} className="px-5 py-3.5 flex gap-3">
                  <div className="shrink-0 pt-0.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${PLATFORM_BADGE[post.platform] || 'bg-neutral-200 text-neutral-700'}`}>
                      {post.platform}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium text-neutral-700">{post.author}</span>
                      <span className="text-[11px] text-neutral-400">{post.date}</span>
                      <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full border ${SENTIMENT_BADGE[post.sentiment]}`}>
                        {post.sentiment}
                      </span>
                    </div>
                    <p className="text-[13px] text-neutral-600 leading-relaxed">{post.text}</p>
                    <a href={post.url} className="inline-flex items-center gap-1 text-[11px] text-hl-blue hover:underline mt-1">
                      View post <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      </div>

      {showSaveModal && (
        <CreateTopicModal
          onClose={() => setShowSaveModal(false)}
          onCreated={() => { setSaved(true); setShowSaveModal(false) }}
        />
      )}
    </div>
  )
}
