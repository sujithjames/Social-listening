import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, RefreshCw, Share2, Download, Bookmark, BookmarkCheck,
  ChevronDown, ExternalLink, TrendingUp, Flame, Eye, Heart, Repeat2, MessageSquare,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import CreateTopicModal from '../components/CreateTopicModal'

// ─── Config ───────────────────────────────────────────────────────────────────
const SOCIAL_PLATFORMS = ['X', 'Instagram', 'Reddit', 'YouTube', 'News', 'LinkedIn']
const DATE_OPTIONS = ['Last 7 days', 'Last 15 days', 'Last 30 days']

const PLATFORM_CONFIG = {
  X:         { color: '#0F172A' },
  Instagram: { color: '#E1306C' },
  Reddit:    { color: '#FF4500' },
  YouTube:   { color: '#EF4444' },
  News:      { color: '#155EEF' },
  LinkedIn:  { color: '#0077B5' },
}

const SENTIMENT_BADGE = {
  positive: 'text-positive bg-green-50 border-green-200',
  neutral: 'text-neutral-500 bg-neutral-100 border-neutral-200',
  negative: 'text-negative bg-red-50 border-red-200',
}
const EMOTION_COLORS = {
  Joy: '#EAB308', Trust: '#155EEF', Anticipation: '#A855F7',
  Surprise: '#EC4899', Anger: '#EF4444', Sadness: '#60A5FA',
}

// ─── Time-series data ─────────────────────────────────────────────────────────
const DAYS_SHORT = ['15','16','17','18','19','20','21','22','23','24','25','26','27','28','29']

const PLATFORM_DAILY = {
  X:         [28,25,33,36,30,28,36,44,40,50,46,56,58,49,53],
  Instagram: [18,20,16,24,27,22,18,28,32,30,35,39,37,42,46],
  Reddit:    [22,25,29,26,33,28,36,31,40,44,46,42,49,54,58],
  YouTube:   [ 5, 4, 6, 7, 5, 8, 7, 9, 6, 9,11, 7,12,10,13],
  News:      [ 4, 6, 4, 7, 5, 8, 6, 9, 7,10, 8,11,10,13,11],
  LinkedIn:  [ 3, 3, 4, 4, 5, 3, 5, 4, 7, 5, 6, 8, 6, 9, 8],
}
const PLATFORM_SENTIMENT = {
  X:         { positive: 62, neutral: 24, negative: 14 },
  Instagram: { positive: 75, neutral: 18, negative:  7 },
  Reddit:    { positive: 58, neutral: 28, negative: 14 },
  YouTube:   { positive: 55, neutral: 30, negative: 15 },
  News:      { positive: 72, neutral: 20, negative:  8 },
  LinkedIn:  { positive: 80, neutral: 15, negative:  5 },
}
const DAILY_MOOD = [-2,0,-3,1,3,-1,1,2,0,3,2,4,2,3,2]

const PLATFORM_ENGAGEMENT = {
  X:         { likes: 2840, shares: 1120, comments: 680,  reach: 42000 },
  Instagram: { likes: 5200, shares: 890,  comments: 1240, reach: 38000 },
  Reddit:    { likes: 1680, shares: 420,  comments: 2100, reach: 18000 },
  YouTube:   { likes: 890,  shares: 310,  comments: 420,  reach: 28000 },
  News:      { likes: 340,  shares: 890,  comments: 120,  reach: 85000 },
  LinkedIn:  { likes: 1240, shares: 680,  comments: 310,  reach: 22000 },
}
const PLATFORM_ENG_DAILY = {
  X:         [1.8,1.6,2.1,2.3,1.9,1.7,2.2,2.8,2.5,3.1,2.9,3.5,3.7,3.1,3.4],
  Instagram: [3.2,3.5,2.9,4.2,4.6,3.8,3.1,4.9,5.6,5.2,6.1,6.8,6.4,7.3,8.0],
  Reddit:    [1.0,1.2,1.4,1.2,1.6,1.3,1.8,1.5,2.0,2.2,2.3,2.1,2.5,2.7,2.9],
  YouTube:   [1.5,1.2,1.8,2.1,1.5,2.4,2.1,2.7,1.8,2.7,3.3,2.1,3.6,3.0,3.9],
  News:      [2.8,3.6,2.2,4.1,2.8,4.5,3.4,5.0,4.0,5.6,4.5,6.2,5.5,7.3,6.2],
  LinkedIn:  [2.4,2.2,3.0,2.8,3.6,2.2,4.1,3.2,5.0,3.6,4.6,5.5,4.1,5.9,5.0],
}

// Per-platform emotion breakdown (used for weighted radar)
const PLATFORM_EMOTIONS = {
  X:         { Joy:35, Trust:25, Anticipation:20, Surprise:10, Anger:7, Sadness:3 },
  Instagram: { Joy:55, Trust:30, Anticipation:10, Surprise:3,  Anger:1, Sadness:1 },
  Reddit:    { Joy:30, Trust:22, Anticipation:18, Surprise:8,  Anger:15,Sadness:7 },
  YouTube:   { Joy:40, Trust:28, Anticipation:15, Surprise:9,  Anger:5, Sadness:3 },
  News:      { Joy:20, Trust:40, Anticipation:22, Surprise:10, Anger:5, Sadness:3 },
  LinkedIn:  { Joy:45, Trust:38, Anticipation:12, Surprise:3,  Anger:1, Sadness:1 },
}

// ─── Heatmap (7 days × 24 hours, Mon–Sun) ─────────────────────────────────────
const HOUR_BASE  = [0,0,0,0,0,0,1,2,5,8,10,9,9,8,7,8,9,8,6,4,3,1,0,0]
const DAY_SCALE  = [9,10,9,9,8,4,3]
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HEATMAP_BASE = DAY_SCALE.map(ds => HOUR_BASE.map(hb => Math.round(hb * ds / 10 * 2)))

// ─── Static mock data ─────────────────────────────────────────────────────────
const KEYWORDS = [
  { word: 'automation', size: 18, weight: 700, color: '#155EEF' },
  { word: 'CRM',         size: 22, weight: 700, color: '#344054' },
  { word: 'agency',      size: 16, weight: 600, color: '#667085' },
  { word: 'funnels',     size: 14, weight: 500, color: '#155EEF' },
  { word: 'HighLevel',   size: 20, weight: 700, color: '#344054' },
  { word: 'clients',     size: 15, weight: 600, color: '#667085' },
  { word: 'marketing',   size: 13, weight: 500, color: '#155EEF' },
  { word: 'onboarding',  size: 14, weight: 500, color: '#344054' },
  { word: 'pipeline',    size: 16, weight: 600, color: '#667085' },
  { word: 'AI',          size: 18, weight: 700, color: '#155EEF' },
  { word: 'workflow',    size: 13, weight: 500, color: '#344054' },
  { word: 'leads',       size: 15, weight: 600, color: '#667085' },
  { word: 'SaaS',        size: 13, weight: 500, color: '#155EEF' },
  { word: 'conversion',  size: 14, weight: 500, color: '#344054' },
]

const TRENDING_TOPICS = [
  { name: 'HighLevel CRM',          change: '+34%', mentions: 312, hot: true  },
  { name: 'Marketing Automation',   change: '+18%', mentions: 228, hot: false },
  { name: 'Agency Software',        change: '+11%', mentions: 187, hot: false },
  { name: 'GoHighLevel vs HubSpot', change: '+22%', mentions: 156, hot: true  },
  { name: 'Sales Funnels 2026',     change: '+9%',  mentions: 134, hot: false },
]
const TRENDING_HASHTAGS = [
  { tag: '#HighLevel',            change: '+41%', count: 489, hot: true  },
  { tag: '#CRMsoftware',          change: '+23%', count: 312, hot: false },
  { tag: '#MarketingAutomation',  change: '+16%', count: 267, hot: true  },
  { tag: '#AgencyLife',           change: '+8%',  count: 198, hot: false },
  { tag: '#GoHighLevel',          change: '+29%', count: 176, hot: true  },
]

const AUDIENCE_LANGUAGE = [
  { name: 'English',    pct: 64 },{ name: 'Spanish',    pct: 12 },
  { name: 'Portuguese', pct: 8  },{ name: 'German',     pct: 5  },
  { name: 'French',     pct: 4  },{ name: 'Other',      pct: 7  },
]
const AUDIENCE_GENDER = [
  { name: 'Male',    value: 58, color: '#155EEF' },
  { name: 'Female',  value: 36, color: '#E1306C' },
  { name: 'Unknown', value:  6, color: '#D0D5DD' },
]
const AUDIENCE_AGE = [
  { name: '18–24', pct: 14 },{ name: '25–34', pct: 34 },
  { name: '35–44', pct: 28 },{ name: '45–54', pct: 14 },
  { name: '55–64', pct:  7 },{ name: '65+',   pct:  3 },
]
const AUDIENCE_LOCATIONS = [
  { name: 'United States',  pct: 48 },{ name: 'United Kingdom', pct: 11 },
  { name: 'Canada',         pct:  9 },{ name: 'Australia',      pct:  7 },
  { name: 'Germany',        pct:  5 },{ name: 'India',          pct:  4 },
]

const MOCK_POSTS = [
  { id:1, platform:'X',         author:'@marketingpro',            date:'Apr 24', text:"HighLevel has completely transformed how we manage our clients. The automation alone saves us 10+ hours a week.", sentiment:'positive' },
  { id:2, platform:'Reddit',    author:'u/agencyowner_dan',        date:'Apr 23', text:"Switched from HubSpot to HighLevel 6 months ago. Honestly the onboarding was rough but the value is undeniable once you get it set up.", sentiment:'neutral' },
  { id:3, platform:'Instagram', author:'@digitalstrategyco',       date:'Apr 22', text:"Our clients are seeing 3x lead conversion with HighLevel funnels. If you're not using this yet, you're leaving money on the table.", sentiment:'positive' },
  { id:4, platform:'News',      author:'MarTech Today',            date:'Apr 21', text:"HighLevel continues to challenge legacy CRM platforms with its all-in-one agency suite, attracting over 60,000 agency customers globally.", sentiment:'positive' },
  { id:5, platform:'YouTube',   author:'AgencyGrowthPodcast',      date:'Apr 20', text:"Just dropped a 45-min breakdown of HighLevel's new Social Planner. Mixed feelings — the UI needs work but the features are solid.", sentiment:'neutral' },
  { id:6, platform:'LinkedIn',  author:'Sarah Chen · Growth Lead', date:'Apr 19', text:"We migrated our entire agency stack to HighLevel Q1 2026. ROI has been incredible — 40% reduction in tool costs and better client retention.", sentiment:'positive' },
]

// ─── Helper components ────────────────────────────────────────────────────────
function PlatformIcon({ name, size = 14 }) {
  const s = size
  switch (name) {
    case 'X': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#0F172A"/>
        <path d="M18.24 14.87 24.07 8h-1.38l-5.07 5.88L13.26 8H8.4l6.1 8.88L8.4 24h1.38l5.33-6.19L19.44 24H24.3l-6.06-9.13Zm-1.88 2.19-.62-.88-4.92-7.03h2.11l3.97 5.67.62.88 5.15 7.36h-2.11l-4.2-5.99Z" fill="white"/>
      </svg>
    )
    case 'Instagram': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#E1306C"/>
        <rect x="8.5" y="8.5" width="15" height="15" rx="4.5" stroke="white" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5"/>
        <circle cx="21" cy="11" r="1.2" fill="white"/>
      </svg>
    )
    case 'Reddit': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FF4500"/>
        <circle cx="16" cy="17" r="5.5" fill="white"/><circle cx="16" cy="15" r="3.5" fill="white"/>
        <path d="M11 17 a5 4 0 0 0 10 0" stroke="#FF4500" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <circle cx="14" cy="16.5" r="1" fill="#FF4500"/><circle cx="18" cy="16.5" r="1" fill="#FF4500"/>
        <circle cx="20" cy="12" r="2" fill="white"/>
        <path d="M18 13.5 l2-1.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    )
    case 'YouTube': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FF0000"/>
        <path d="M24.7 12.1a2.27 2.27 0 0 0-1.6-1.61C21.6 10.1 16 10.1 16 10.1s-5.6 0-7.1.4a2.27 2.27 0 0 0-1.6 1.6c-.4 1.5-.4 4.6-.4 4.6s0 3.1.4 4.6a2.27 2.27 0 0 0 1.6 1.6c1.5.4 7.1.4 7.1.4s5.6 0 7.1-.4a2.27 2.27 0 0 0 1.6-1.6c.4-1.5.4-4.6.4-4.6s0-3.1-.4-4.6Z" fill="white" fillOpacity="0.9"/>
        <path d="M14.2 18.8V13l4.7 2.9-4.7 2.9Z" fill="#FF0000"/>
      </svg>
    )
    case 'News': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#155EEF"/>
        <rect x="8" y="10" width="16" height="12" rx="2" fill="white" fillOpacity="0.9"/>
        <path d="M11 14h10M11 17h7M11 20h5" stroke="#155EEF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
    case 'LinkedIn': return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#0077B5"/>
        <path d="M10.5 13.5h2.5v9h-2.5v-9Zm1.25-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM15 13.5h2.4v1.2h.04c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.67 3 3.84V22.5h-2.5v-4.8c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.07V22.5H15v-9Z" fill="white"/>
      </svg>
    )
    default: return null
  }
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-[12px] min-w-[130px]">
      <p className="font-semibold text-neutral-600 mb-1.5 text-[11px]">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 mb-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color ?? p.fill ?? '#155EEF' }} />
            <span className="text-[11px] text-neutral-500 capitalize">{p.name}</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-800">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
      <div className="flex-1 h-px bg-neutral-100" />
    </div>
  )
}

function ActivityHeatmap({ data }) {
  const [hovered, setHovered] = useState(null)
  const maxVal = 20
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-[3px]" style={{ paddingTop: 20 }}>
          {DAY_LABELS.map(d => (
            <div key={d} className="h-4 flex items-center justify-end">
              <span className="text-[9px] text-neutral-400 w-6">{d}</span>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex mb-1">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 flex justify-center">
                {h % 6 === 0 && <span className="text-[9px] text-neutral-400">{h}h</span>}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[3px]">
            {data.map((row, d) => (
              <div key={d} className="flex gap-[3px]">
                {row.map((val, h) => {
                  const intensity = Math.min(val / maxVal, 1)
                  const isHov = hovered?.d === d && hovered?.h === h
                  return (
                    <div
                      key={h}
                      className="flex-1 h-4 rounded-[2px] cursor-default transition-all"
                      style={{
                        background: val === 0 ? '#F2F4F7' : `rgba(21,94,239,${0.08 + intensity * 0.82})`,
                        outline: isHov ? '1.5px solid #155EEF' : 'none',
                      }}
                      onMouseEnter={() => setHovered({ d, h, val })}
                      onMouseLeave={() => setHovered(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        {hovered ? (
          <p className="text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700">{DAY_LABELS[hovered.d]}</span>
            {' '}at {hovered.h}:00 — <span className="font-semibold text-hl-blue">{hovered.val} mentions</span>
          </p>
        ) : (
          <p className="text-[11px] text-neutral-400">Hover to see hourly details</p>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-neutral-400">Less</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(i => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: i === 0 ? '#F2F4F7' : `rgba(21,94,239,${0.08 + i * 0.82})` }} />
          ))}
          <span className="text-[9px] text-neutral-400">More</span>
        </div>
      </div>
    </div>
  )
}

function SentimentDonut({ positive, neutral, negative }) {
  const r = 52, cx = 68, cy = 68
  const circ = 2 * Math.PI * r
  const gap = 4
  const base = circ * 0.25
  const posLen = (positive / 100) * circ - gap
  const neutLen = (neutral / 100) * circ - gap
  const negLen = (negative / 100) * circ - gap
  return (
    <div className="flex items-center gap-4">
      <svg width={136} height={136} viewBox="0 0 136 136">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2F4F7" strokeWidth={15} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#16A34A" strokeWidth={15}
          strokeDasharray={`${posLen} ${circ}`} strokeDashoffset={base} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D0D5DD" strokeWidth={15}
          strokeDasharray={`${neutLen} ${circ}`} strokeDashoffset={base - (positive / 100) * circ - gap / 2} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#DC2626" strokeWidth={15}
          strokeDasharray={`${negLen} ${circ}`} strokeDashoffset={base - ((positive + neutral) / 100) * circ - gap} strokeLinecap="round" />
        <text x={cx} y={cx - 7} textAnchor="middle" fontSize={21} fontWeight={700} fill="#101828">{positive}%</text>
        <text x={cx} y={cx + 12} textAnchor="middle" fontSize={11} fill="#667085">Positive</text>
      </svg>
      <div className="flex flex-col gap-2.5">
        {[{ label:'Positive', pct: positive, dot:'bg-positive' },
          { label:'Neutral',  pct: neutral,  dot:'bg-gray-300' },
          { label:'Negative', pct: negative, dot:'bg-negative' }].map(s => (
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function TopicDetailPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const query = state?.query || 'HighLevel'
  const isSavedTopic = state?.isSavedTopic ?? false

  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(SOCIAL_PLATFORMS))
  const [dateRange, setDateRange] = useState('Last 15 days')
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [saved, setSaved] = useState(isSavedTopic)
  const [showSaveModal, setShowSaveModal] = useState(false)

  const allSelected = selectedPlatforms.size === SOCIAL_PLATFORMS.length

  function togglePlatform(p) {
    if (p === 'All') { setSelectedPlatforms(new Set(SOCIAL_PLATFORMS)); return }
    setSelectedPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(p)) { if (next.size === 1) return prev; next.delete(p) }
      else next.add(p)
      return next
    })
  }

  const computed = useMemo(() => {
    const pList = SOCIAL_PLATFORMS.filter(p => selectedPlatforms.has(p))

    const daily = DAYS_SHORT.map((day, i) => {
      const mentions = pList.reduce((s, p) => s + PLATFORM_DAILY[p][i], 0)
      const posMentions = pList.reduce((s, p) => s + Math.round(PLATFORM_DAILY[p][i] * PLATFORM_SENTIMENT[p].positive / 100), 0)
      const negMentions = pList.reduce((s, p) => s + Math.round(PLATFORM_DAILY[p][i] * PLATFORM_SENTIMENT[p].negative / 100), 0)
      const mood = DAILY_MOOD[i]
      const positive = mentions > 0 ? Math.min(95, Math.max(5, Math.round(posMentions / mentions * 100) + mood)) : 0
      const negative = mentions > 0 ? Math.min(80, Math.max(2, Math.round(negMentions / mentions * 100) - Math.round(mood / 2))) : 0
      const neutral = Math.max(0, 100 - positive - negative)
      const engagement = pList.reduce((s, p) => s + Math.round(PLATFORM_ENG_DAILY[p][i] * 200), 0)
      return { day, mentions, positive, negative, neutral, engagement }
    })

    const totalMentions = daily.reduce((s, d) => s + d.mentions, 0)
    const avgPositive = Math.round(daily.reduce((s, d) => s + d.positive, 0) / daily.length)
    const avgNegative = Math.round(daily.reduce((s, d) => s + d.negative, 0) / daily.length)
    const avgNeutral = 100 - avgPositive - avgNegative

    const platformData = pList.map(p => ({
      name: p,
      color: PLATFORM_CONFIG[p].color,
      mentions: PLATFORM_DAILY[p].reduce((s, v) => s + v, 0),
    }))

    const platformTrends = DAYS_SHORT.map((day, i) => {
      const entry = { day }
      pList.forEach(p => { entry[p] = PLATFORM_DAILY[p][i] })
      return entry
    })

    const engTotals = pList.reduce((acc, p) => {
      const e = PLATFORM_ENGAGEMENT[p]
      return { likes: acc.likes + e.likes, shares: acc.shares + e.shares, comments: acc.comments + e.comments, reach: acc.reach + e.reach }
    }, { likes: 0, shares: 0, comments: 0, reach: 0 })

    const platformEngData = pList.map(p => ({
      name: p,
      color: PLATFORM_CONFIG[p].color,
      value: PLATFORM_ENGAGEMENT[p].likes + PLATFORM_ENGAGEMENT[p].shares + PLATFORM_ENGAGEMENT[p].comments,
    }))

    const totalPlatformMentions = pList.reduce((s, p) => s + PLATFORM_DAILY[p].reduce((a, b) => a + b, 0), 0)
    const emotions = Object.keys(EMOTION_COLORS).map(subject => {
      const val = pList.reduce((s, p) => {
        const platTotal = PLATFORM_DAILY[p].reduce((a, b) => a + b, 0)
        return s + (PLATFORM_EMOTIONS[p][subject] ?? 0) * platTotal / totalPlatformMentions
      }, 0)
      return { subject, value: Math.round(val), color: EMOTION_COLORS[subject] }
    })

    const heatScale = pList.length / SOCIAL_PLATFORMS.length
    const heatmap = HEATMAP_BASE.map(row => row.map(v => Math.round(v * heatScale)))

    const posts = MOCK_POSTS.filter(post => selectedPlatforms.has(post.platform))

    return { daily, totalMentions, avgPositive, avgNegative, avgNeutral, platformData, platformTrends, engTotals, platformEngData, emotions, heatmap, posts, pList }
  }, [selectedPlatforms])

  const positiveCount = Math.round(computed.totalMentions * computed.avgPositive / 100)
  const negativeCount = Math.round(computed.totalMentions * computed.avgNegative / 100)
  const neutralCount  = computed.totalMentions - positiveCount - negativeCount
  const netScore      = computed.avgPositive - computed.avgNegative

  const axisStyle = { fontSize: 10, fill: '#98A2B3' }
  const gridStyle = { stroke: '#F2F4F7', strokeDasharray: '3 3' }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] flex flex-col flex-1 overflow-hidden">

        {/* ── Toolbar ── */}
        <div className="border-b border-neutral-200 px-5 py-2.5 flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors shrink-0"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="w-px h-5 bg-neutral-200 shrink-0" />
          <p className="text-[14px] font-semibold text-neutral-900 shrink-0 max-w-[200px] truncate">"{query}"</p>
          <div className="w-px h-5 bg-neutral-200 shrink-0" />

          {/* Multi-select platform chips */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
            <button
              onClick={() => togglePlatform('All')}
              className={`px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                allSelected ? 'bg-hl-blue text-white' : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
              }`}
            >All</button>
            {SOCIAL_PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                  selectedPlatforms.has(p) ? 'bg-hl-blue text-white' : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
                }`}
              >
                <PlatformIcon name={p} size={14} />{p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowDateMenu(v => !v)}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-neutral-200 text-[12px] text-neutral-700 hover:bg-gray-50 transition-colors"
              >
                {dateRange}<ChevronDown size={12} className="text-neutral-400" />
              </button>
              {showDateMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 w-36 py-1">
                  {DATE_OPTIONS.map(d => (
                    <button key={d} onClick={() => { setDateRange(d); setShowDateMenu(false) }}
                      className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors ${dateRange === d ? 'text-hl-blue font-semibold' : 'text-neutral-700'}`}
                    >{d}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors"><RefreshCw size={13} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors"><Share2 size={13} /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-500 hover:bg-gray-50 transition-colors"><Download size={13} /></button>
            <div className="w-px h-5 bg-neutral-200" />
            {saved ? (
              <div className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-green-50 border border-green-200 text-positive text-[12px] font-semibold">
                <BookmarkCheck size={13} />Saved
              </div>
            ) : (
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-hl-blue hover:bg-hl-blue-dark text-white text-[12px] font-semibold transition-colors"
              >
                <Bookmark size={13} />Save as Topic
              </button>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          <p className="text-[11px] text-neutral-400 -mb-4">Last updated 2 hours ago · {dateRange} · {computed.totalMentions.toLocaleString()} mentions</p>

          {/* ─ KPI Cards ─ */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label:'Total Mentions', value: computed.totalMentions.toLocaleString(), delta:'+12%', up:true },
              { label:'Positive',       value: positiveCount.toLocaleString(),           delta:'+5%',  up:true },
              { label:'Neutral',        value: neutralCount.toLocaleString(),            delta:'-1%',  up:false },
              { label:'Negative',       value: negativeCount.toLocaleString(),           delta:'-2%',  up:true },
              { label:'Net Sentiment',  value: `${netScore} pts`,                        delta:'+7pts',up:true },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
                <p className="text-[11px] text-neutral-500 mb-1 font-medium">{m.label}</p>
                <p className="text-[20px] font-bold text-neutral-900 leading-tight">{m.value}</p>
                <p className={`text-[11px] mt-1 font-medium ${m.up ? 'text-positive' : 'text-negative'}`}>{m.delta} vs prev</p>
              </div>
            ))}
          </div>

          {/* ─ Sentiment Analysis ─ */}
          <div>
            <SectionHeader label="Sentiment Analysis" />
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Sentiment Distribution</p>
                <SentimentDonut positive={computed.avgPositive} neutral={computed.avgNeutral} negative={computed.avgNegative} />
              </div>
              <div className="col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-1">Sentiment over Time</p>
                <div className="flex items-center gap-4 mb-3">
                  {[{ label:'Positive', color:'#16A34A' },{ label:'Negative', color:'#DC2626' }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                      <span className="text-[10px] text-neutral-500">{l.label} %</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={computed.daily} margin={{ top:4, right:4, bottom:0, left:-20 }}>
                    <defs>
                      <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={ChartTooltip} cursor={{ stroke:'#E5E7EB', strokeWidth:1 }} />
                    <Area type="monotone" dataKey="positive" name="Positive" stroke="#16A34A" strokeWidth={2} fill="url(#gradPos)" dot={false} />
                    <Area type="monotone" dataKey="negative" name="Negative" stroke="#DC2626" strokeWidth={2} fill="url(#gradNeg)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ─ Mentions ─ */}
          <div>
            <SectionHeader label="Mentions" />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Mentions by Platform</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={computed.platformData} margin={{ top:4, right:4, bottom:0, left:-20 }}>
                    <CartesianGrid {...gridStyle} vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip content={ChartTooltip} cursor={{ fill:'rgba(21,94,239,0.04)' }} />
                    <Bar dataKey="mentions" name="Mentions" radius={[4,4,0,0]}>
                      {computed.platformData.map((p, i) => <Cell key={i} fill={p.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-1">Mentions & Sentiment over Time</p>
                <div className="flex items-center gap-4 mb-3">
                  {[{ label:'Mentions', color:'#EEF4FF', border:'#155EEF' },{ label:'Positive %', color:'#16A34A' }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: l.color, border: l.border ? `1px solid ${l.border}` : 'none' }} />
                      <span className="text-[10px] text-neutral-500">{l.label}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <ComposedChart data={computed.daily} margin={{ top:4, right:30, bottom:0, left:-20 }}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="count" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="pct" orientation="right" domain={[0,100]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={ChartTooltip} cursor={{ fill:'rgba(21,94,239,0.04)' }} />
                    <Bar yAxisId="count" dataKey="mentions" name="Mentions" fill="#E2E8F0" stroke="#94A3B8" strokeWidth={0.5} radius={[3,3,0,0]} />
                    <Line yAxisId="pct" type="monotone" dataKey="positive" name="Positive %" stroke="#16A34A" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
              <p className="text-[13px] font-semibold text-neutral-900 mb-4">Activity Heatmap</p>
              <ActivityHeatmap data={computed.heatmap} />
            </div>
          </div>

          {/* ─ Platform Intelligence ─ */}
          <div>
            <SectionHeader label="Platform Intelligence" />
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Share of Voice</p>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={computed.platformData.map(p => ({ name: p.name, value: p.mentions, color: p.color }))}
                      cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                      {computed.platformData.map((p, i) => <Cell key={i} fill={p.color} />)}
                    </Pie>
                    <Tooltip content={ChartTooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {computed.platformData.map(p => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                      <span className="text-[10px] text-neutral-500">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-1">Platform Trends over Time</p>
                <div className="flex flex-wrap gap-3 mb-3">
                  {computed.pList.map(p => (
                    <div key={p} className="flex items-center gap-1.5">
                      <div className="w-4 h-0.5 rounded" style={{ background: PLATFORM_CONFIG[p].color }} />
                      <span className="text-[10px] text-neutral-500">{p}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={computed.platformTrends} margin={{ top:4, right:4, bottom:0, left:-20 }}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip content={ChartTooltip} cursor={{ stroke:'#E5E7EB', strokeWidth:1 }} />
                    {computed.pList.map(p => (
                      <Line key={p} type="monotone" dataKey={p} stroke={PLATFORM_CONFIG[p].color} strokeWidth={1.5} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ─ Emotion & Keywords ─ */}
          <div>
            <SectionHeader label="Emotion & Keywords" />
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-2">Emotion Radar</p>
                <ResponsiveContainer width="100%" height={190}>
                  <RadarChart data={computed.emotions} margin={{ top:10, right:20, bottom:10, left:20 }}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#667085' }} />
                    <Radar name="Emotion" dataKey="value" stroke="#155EEF" fill="#155EEF" fillOpacity={0.2} strokeWidth={1.5} />
                    <Tooltip content={ChartTooltip} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Emotion Breakdown</p>
                <div className="space-y-2.5">
                  {computed.emotions.map(e => (
                    <div key={e.subject} className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500 w-24 shrink-0">{e.subject}</span>
                      <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${e.value}%`, background: e.color }} />
                      </div>
                      <span className="text-[11px] text-neutral-500 w-6 text-right shrink-0">{e.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Top Keywords</p>
                <div className="flex flex-wrap gap-x-3 gap-y-2 items-baseline">
                  {KEYWORDS.map(k => (
                    <span key={k.word} className="leading-snug cursor-default hover:opacity-70 transition-opacity"
                      style={{ fontSize: k.size, fontWeight: k.weight, color: k.color }}>
                      {k.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─ Engagement ─ */}
          <div>
            <SectionHeader label="Engagement" />
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label:'Likes',    value: computed.engTotals.likes.toLocaleString(),    icon: Heart,        color:'text-pink-500',  bg:'bg-pink-50'  },
                { label:'Shares',   value: computed.engTotals.shares.toLocaleString(),   icon: Repeat2,      color:'text-hl-blue',   bg:'bg-hl-blue-light' },
                { label:'Comments', value: computed.engTotals.comments.toLocaleString(), icon: MessageSquare,color:'text-purple-500',bg:'bg-purple-50' },
                { label:'Reach',    value: (computed.engTotals.reach / 1000).toFixed(0) + 'K', icon: Eye,   color:'text-amber-500', bg:'bg-amber-50'  },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                    <m.icon size={15} className={m.color} />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-neutral-900 leading-tight">{m.value}</p>
                    <p className="text-[11px] text-neutral-400">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Engagement over Time</p>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={computed.daily} margin={{ top:4, right:4, bottom:0, left:-20 }}>
                    <defs>
                      <linearGradient id="gradEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#155EEF" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#155EEF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip content={ChartTooltip} cursor={{ stroke:'#E5E7EB', strokeWidth:1 }} />
                    <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#155EEF" strokeWidth={2} fill="url(#gradEng)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Engagement by Platform</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={computed.platformEngData} layout="vertical" margin={{ top:0, right:8, bottom:0, left:0 }}>
                    <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} hide />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={ChartTooltip} cursor={{ fill:'rgba(21,94,239,0.04)' }} />
                    <Bar dataKey="value" name="Engagement" radius={[0,4,4,0]}>
                      {computed.platformEngData.map((p, i) => <Cell key={i} fill={p.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ─ Conversation Insights ─ */}
          <div>
            <SectionHeader label="Conversation Insights" />
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={13} className="text-hl-blue" />
                    <p className="text-[13px] font-semibold text-neutral-900">Trending Topics</p>
                  </div>
                  <div className="space-y-2.5">
                    {TRENDING_TOPICS.map((t, i) => (
                      <div key={t.name} className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-neutral-300 w-4 shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-neutral-700 truncate">{t.name}</p>
                          <p className="text-[10px] text-neutral-400">{t.mentions.toLocaleString()} mentions</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {t.hot && <Flame size={11} className="text-orange-400" />}
                          <span className="text-[11px] font-semibold text-positive">{t.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px] font-black text-hl-blue">#</span>
                    <p className="text-[13px] font-semibold text-neutral-900">Trending Hashtags</p>
                  </div>
                  <div className="space-y-2.5">
                    {TRENDING_HASHTAGS.map((h, i) => (
                      <div key={h.tag} className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-neutral-300 w-4 shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-hl-blue truncate">{h.tag}</p>
                          <p className="text-[10px] text-neutral-400">{h.count.toLocaleString()} posts</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {h.hot && <Flame size={11} className="text-orange-400" />}
                          <span className="text-[11px] font-semibold text-positive">{h.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-neutral-900">Conversation Feed</p>
                  <span className="text-[11px] text-neutral-400">Showing {computed.posts.length} of {computed.totalMentions.toLocaleString()}</span>
                </div>
                {computed.posts.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-[13px]">No posts for selected platforms</div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {computed.posts.map(post => (
                      <div key={post.id} className="px-5 py-3.5 flex gap-3">
                        <div className="shrink-0 pt-0.5">
                          <PlatformIcon name={post.platform} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[12px] font-medium text-neutral-700">{post.author}</span>
                            <span className="text-[11px] text-neutral-400">{post.date}</span>
                            <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full border ${SENTIMENT_BADGE[post.sentiment]}`}>{post.sentiment}</span>
                          </div>
                          <p className="text-[13px] text-neutral-600 leading-relaxed">{post.text}</p>
                          <a href="#" className="inline-flex items-center gap-1 text-[11px] text-hl-blue hover:underline mt-1">View post <ExternalLink size={10} /></a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─ Audience Insights ─ */}
          <div>
            <SectionHeader label="Audience Insights" />
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Language</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={AUDIENCE_LANGUAGE} layout="vertical" margin={{ top:0, right:24, bottom:0, left:0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={62} />
                    <Tooltip content={ChartTooltip} cursor={{ fill:'rgba(21,94,239,0.04)' }} />
                    <Bar dataKey="pct" name="%" radius={[0,3,3,0]} fill="#155EEF" fillOpacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-2">Gender</p>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={AUDIENCE_GENDER} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value">
                      {AUDIENCE_GENDER.map((g, i) => <Cell key={i} fill={g.color} />)}
                    </Pie>
                    <Tooltip content={ChartTooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-1">
                  {AUDIENCE_GENDER.map(g => (
                    <div key={g.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                      <span className="text-[10px] text-neutral-500">{g.name} {g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Age Distribution</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={AUDIENCE_AGE} layout="vertical" margin={{ top:0, right:24, bottom:0, left:0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={38} />
                    <Tooltip content={ChartTooltip} cursor={{ fill:'rgba(21,94,239,0.04)' }} />
                    <Bar dataKey="pct" name="%" radius={[0,3,3,0]} fill="#A855F7" fillOpacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-neutral-900 mb-3">Top Locations</p>
                <div className="space-y-2.5">
                  {AUDIENCE_LOCATIONS.map(l => (
                    <div key={l.name} className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-600 w-24 shrink-0 truncate">{l.name}</span>
                      <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${l.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-neutral-500 w-6 text-right shrink-0">{l.pct}%</span>
                    </div>
                  ))}
                </div>
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
