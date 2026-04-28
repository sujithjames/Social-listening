import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, TrendingUp, ThumbsUp, ThumbsDown, MessageCircle, Share2, Calendar, Upload,
  LayoutDashboard, Heart, PieChart, Zap, MessageSquare,
  Smile, Shield, Sparkles, Lightbulb, Flame,
  ArrowUpRight, Globe, Hash, Minus,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview',       label: 'Overview',         Icon: LayoutDashboard },
  { id: 'sentiment',      label: 'Sentiment',        Icon: Heart },
  { id: 'share-of-voice', label: 'Share of Voice',   Icon: PieChart },
  { id: 'trend',          label: 'Trend Over Time',  Icon: TrendingUp },
  { id: 'engagement',     label: 'Engagement',       Icon: Zap },
  { id: 'mentions',       label: 'Recent Mentions',  Icon: MessageSquare },
]

const TREND_DATA = [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 72 },
  { label: 'Mar', value: 58 },
  { label: 'Apr', value: 94 },
  { label: 'May', value: 87 },
  { label: 'Jun', value: 112 },
  { label: 'Jul', value: 98 },
  { label: 'Aug', value: 134 },
  { label: 'Sep', value: 156 },
  { label: 'Oct', value: 143 },
  { label: 'Nov', value: 178 },
  { label: 'Dec', value: 201 },
]

const SENTIMENT_SEGMENTS = [
  { label: 'Positive', pct: 68, color: '#16A34A' },
  { label: 'Neutral',  pct: 21, color: '#D0D5DD' },
  { label: 'Negative', pct: 11, color: '#DC2626' },
]

const PLATFORMS = [
  { name: 'X',         color: '#0F172A', pct: 42, mentions: 524 },
  { name: 'Reddit',    color: '#FF4500', pct: 28, mentions: 349 },
  { name: 'Instagram', color: '#E1306C', pct: 18, mentions: 225 },
  { name: 'News',      color: '#155EEF', pct: 12, mentions: 150 },
]

const EMOTIONS = [
  { label: 'Joy',          pct: 42, color: '#16A34A', Icon: Smile },
  { label: 'Trust',        pct: 28, color: '#155EEF', Icon: Shield },
  { label: 'Anticipation', pct: 15, color: '#D97706', Icon: Sparkles },
  { label: 'Surprise',     pct: 8,  color: '#6938EF', Icon: Lightbulb },
  { label: 'Anger',        pct: 7,  color: '#DC2626', Icon: Flame },
]

const POSTS = [
  {
    id: 1, platform: 'X', platformColor: '#0F172A',
    author: '@marketingpro', date: 'Apr 24',
    text: 'HighLevel has completely transformed how we manage our clients. The automation alone saves us 10+ hours a week.',
    sentiment: 'positive', likes: 124, comments: 18,
  },
  {
    id: 2, platform: 'Reddit', platformColor: '#FF4500',
    author: 'u/agencyowner_dan', date: 'Apr 23',
    text: 'Switched from HubSpot to HighLevel 6 months ago. Honestly the onboarding was rough but the value is undeniable once you get it set up.',
    sentiment: 'neutral', likes: 89, comments: 34,
  },
  {
    id: 3, platform: 'Instagram', platformColor: '#E1306C',
    author: '@digitalstrategyco', date: 'Apr 22',
    text: "Our clients are seeing 3x lead conversion with the HighLevel funnels. If you're not using this yet, you're leaving money on the table.",
    sentiment: 'positive', likes: 256, comments: 42,
  },
  {
    id: 4, platform: 'News', platformColor: '#155EEF',
    author: 'MarTech Today', date: 'Apr 21',
    text: 'HighLevel continues to challenge legacy CRM platforms with its all-in-one agency suite, attracting over 60,000 agency customers globally.',
    sentiment: 'positive', likes: 45, comments: 12,
  },
]

const KPI_CARDS = [
  { label: 'Total Mentions',   value: '1,248', trend: '+12%', trendNote: 'vs last period', positive: true,  Icon: Hash,       iconColor: '#155EEF' },
  { label: 'Sentiment Score',  value: '68',    unit: '/100',  trend: '+3 pts', trendNote: 'vs last period', positive: true,  Icon: Smile,      iconColor: '#16A34A' },
  { label: 'Active Platforms', value: '4',     trend: 'X · Reddit · IG · News', trendNote: '', positive: null, Icon: Globe,  iconColor: '#D97706' },
  { label: 'Avg Engagement',   value: '24.3K', trend: '+8%',  trendNote: 'vs last period', positive: true,  Icon: TrendingUp, iconColor: '#6938EF' },
]

export default function TopicDetailPage() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')

  const topicName = decodeURIComponent(name || 'Topic')

  function scrollTo(id) {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex min-h-full">

      {/* ── Left mini-nav ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-gray-200 sticky top-0 self-start h-screen overflow-y-auto">
        <div className="py-6 px-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Sections</p>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-left w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-hl-blue-light text-hl-blue'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon size={14} strokeWidth={activeSection === id ? 2 : 1.8} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 bg-gray-50">

        {/* Sticky page header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/topics')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">{topicName}</h1>
              <p className="text-[11px] text-gray-400">Listening topic · Brand mentions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-300 bg-white text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Calendar size={13} className="text-gray-400" />
              Last 30 days
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#84ADFF] bg-white text-[13px] font-semibold text-[#004EEB] hover:bg-hl-blue-light transition-colors">
              <Upload size={13} />
              Export
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="p-6 space-y-5 max-w-5xl">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-16">
            <SectionLabel Icon={LayoutDashboard}>Overview</SectionLabel>
            <div className="grid grid-cols-4 gap-4">
              {KPI_CARDS.map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${card.iconColor}18` }}
                    >
                      <card.Icon size={15} style={{ color: card.iconColor }} />
                    </div>
                    <p className="text-[12px] font-medium text-gray-400 leading-tight">{card.label}</p>
                  </div>
                  <p className="text-[28px] font-bold text-gray-900 leading-none mb-2.5">
                    {card.value}
                    {card.unit && <span className="text-[15px] font-normal text-gray-400 ml-0.5">{card.unit}</span>}
                  </p>
                  <p className={`text-[12px] font-medium flex items-center gap-1 ${
                    card.positive === true ? 'text-positive' :
                    card.positive === false ? 'text-negative' :
                    'text-gray-400'
                  }`}>
                    {card.positive === true && <ArrowUpRight size={12} strokeWidth={2.5} />}
                    {card.trend}
                    {card.trendNote && <span className="text-gray-400 font-normal ml-0.5">{card.trendNote}</span>}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Sentiment + Emotions ── */}
          <section id="sentiment" className="scroll-mt-16">
            <SectionLabel Icon={Heart}>Sentiment</SectionLabel>
            <div className="grid grid-cols-2 gap-4">

              {/* Sentiment distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-[14px] font-semibold text-gray-900 mb-6">Sentiment Distribution</p>
                <div className="flex items-center gap-8">
                  <div className="relative shrink-0">
                    <DonutChart segments={SENTIMENT_SEGMENTS} size={140} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[22px] font-bold text-gray-900 leading-none">68%</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">Positive</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    {SENTIMENT_SEGMENTS.map(seg => (
                      <div key={seg.label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                            <span className="text-[13px] font-medium text-gray-700">{seg.label}</span>
                          </div>
                          <span className="text-[13px] font-semibold text-gray-900">{seg.pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${seg.pct}%`,
                              background: `linear-gradient(90deg, ${seg.color}, ${seg.color}bb)`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emotion breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-[14px] font-semibold text-gray-900 mb-6">Emotion Breakdown</p>
                <div className="flex flex-col gap-4">
                  {EMOTIONS.map(em => (
                    <div key={em.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <em.Icon size={13} style={{ color: em.color }} strokeWidth={2} />
                          <span className="text-[13px] font-medium text-gray-700">{em.label}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-900">{em.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${em.pct}%`,
                            background: `linear-gradient(90deg, ${em.color}, ${em.color}99)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Share of Voice ── */}
          <section id="share-of-voice" className="scroll-mt-16">
            <SectionLabel Icon={PieChart}>Share of Voice</SectionLabel>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[14px] font-semibold text-gray-900">By Platform</p>
                <div className="flex items-center gap-3">
                  {PLATFORMS.map(p => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[12px] text-gray-500">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked proportional bar */}
              <div className="h-3 rounded-full overflow-hidden flex mb-6">
                {PLATFORMS.map(p => (
                  <div key={p.name} style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                {PLATFORMS.map(platform => (
                  <div key={platform.name} className="flex items-center gap-4">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name[0]}
                    </div>
                    <span className="text-[13px] font-medium text-gray-700 w-20 shrink-0">{platform.name}</span>
                    <div className="flex-1">
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${platform.pct}%`,
                            background: `linear-gradient(90deg, ${platform.color}, ${platform.color}cc)`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[12px] text-gray-400 w-24 text-right shrink-0">{platform.mentions.toLocaleString()} mentions</span>
                    <span className="text-[13px] font-bold text-gray-900 w-8 text-right shrink-0">{platform.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Trend over time ── */}
          <section id="trend" className="scroll-mt-16">
            <SectionLabel Icon={TrendingUp}>Trend Over Time</SectionLabel>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[14px] font-semibold text-gray-900">Mention Volume</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-positive bg-green-50 px-2.5 py-1 rounded-full">
                    <ArrowUpRight size={12} strokeWidth={2.5} />
                    +347% Jan → Dec
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1.5 rounded-sm bg-hl-blue" />
                    <span className="text-[12px] text-gray-400">Mentions / month</span>
                  </div>
                </div>
              </div>
              <TrendBarChart data={TREND_DATA} />
            </div>
          </section>

          {/* ── Engagement ── */}
          <section id="engagement" className="scroll-mt-16">
            <SectionLabel Icon={Zap}>Engagement</SectionLabel>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Engagement', value: '24.3K', Icon: TrendingUp,    color: '#155EEF' },
                { label: 'Likes',            value: '12.1K', Icon: ThumbsUp,      color: '#16A34A' },
                { label: 'Comments',         value: '5.4K',  Icon: MessageCircle, color: '#D97706' },
                { label: 'Shares',           value: '6.8K',  Icon: Share2,        color: '#6938EF' },
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <span className="text-[12px] font-medium text-gray-400">{label}</span>
                  </div>
                  <p className="text-[26px] font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recent Mentions ── */}
          <section id="mentions" className="scroll-mt-16 pb-10">
            <SectionLabel Icon={MessageSquare}>Recent Mentions</SectionLabel>
            <div className="flex flex-col gap-3">
              {POSTS.map(post => (
                <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: post.platformColor }}
                      >
                        {post.platform}
                      </span>
                      <span className="text-[13px] font-medium text-gray-800">{post.author}</span>
                      <span className="text-[12px] text-gray-400">{post.date}</span>
                    </div>
                    <span className={`shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      post.sentiment === 'positive' ? 'bg-green-50 text-positive' :
                      post.sentiment === 'negative' ? 'bg-red-50 text-negative' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {post.sentiment === 'positive' ? <ThumbsUp size={10} /> :
                       post.sentiment === 'negative' ? <ThumbsDown size={10} /> :
                       <Minus size={10} />}
                      {post.sentiment}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-700 leading-relaxed mb-4 border-l-2 border-gray-100 pl-3">{post.text}</p>
                  <div className="flex items-center gap-5 text-[12px] text-gray-400">
                    <span className="flex items-center gap-1.5"><ThumbsUp size={12} />{post.likes}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={12} />{post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children, Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={12} className="text-gray-400" strokeWidth={2} />}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{children}</p>
    </div>
  )
}

function DonutChart({ segments, size }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.32
  const sw = size * 0.13
  const c = 2 * Math.PI * r
  let cumPct = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EAECF0" strokeWidth={sw} />
      {segments.map((seg, i) => {
        const dash = Math.max(0, (seg.pct / 100) * c - 3)
        const rot = -90 + (cumPct / 100) * 360
        cumPct += seg.pct
        return (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
            transform={`rotate(${rot}, ${cx}, ${cy})`}
          />
        )
      })}
    </svg>
  )
}

function TrendBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value))
  const padL = 36, padR = 8, padT = 12, padB = 26
  const barW = 24, gap = 7
  const chartW = data.length * (barW + gap) - gap
  const chartH = 160
  const svgW = padL + chartW + padR
  const svgH = padT + chartH + padB

  const pts = data.map((d, i) => ({
    x: padL + i * (barW + gap) + barW / 2,
    y: padT + chartH * (1 - d.value / max),
  }))

  function smoothPath(points) {
    if (points.length < 2) return ''
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]
      const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(1)
      const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(1)
      const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(1)
      const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(1)
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
  }

  const linePath = smoothPath(pts)
  const baseY = (padT + chartH).toFixed(1)
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${baseY} L ${pts[0].x.toFixed(1)} ${baseY} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#155EEF" />
          <stop offset="100%" stopColor="#84ADFF" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#155EEF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#155EEF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <g key={frac}>
          <line
            x1={padL} y1={padT + chartH * (1 - frac)}
            x2={padL + chartW} y2={padT + chartH * (1 - frac)}
            stroke="#F2F4F7" strokeWidth={1}
          />
          <text
            x={padL - 6} y={padT + chartH * (1 - frac) + 4}
            textAnchor="end" fontSize={10} fill="#98A2B3"
          >
            {Math.round(max * frac)}
          </text>
        </g>
      ))}

      {/* Baseline */}
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#EAECF0" strokeWidth={1} />

      {/* Bars */}
      {data.map((d, i) => {
        const x = padL + i * (barW + gap)
        const bH = (d.value / max) * chartH
        return (
          <rect
            key={i}
            x={x} y={padT + chartH - bH}
            width={barW} height={bH}
            fill="url(#barGradient)"
            rx={4} ry={4}
          />
        )
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Trend line */}
      <path
        d={linePath}
        fill="none"
        stroke="#155EEF"
        strokeWidth={2}
        strokeOpacity={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#155EEF" />
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={padL + i * (barW + gap) + barW / 2}
          y={padT + chartH + 18}
          textAnchor="middle"
          fontSize={10}
          fill="#98A2B3"
        >
          {d.label}
        </text>
      ))}
    </svg>
  )
}
