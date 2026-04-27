import { useLocation, useNavigate } from 'react-router-dom'

const MOCK_POSTS = [
  {
    id: 1,
    platform: 'X',
    author: '@marketingpro',
    date: 'Apr 24, 2026',
    text: 'HighLevel has completely transformed how we manage our clients. The automation alone saves us 10+ hours a week.',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 2,
    platform: 'Reddit',
    author: 'u/agencyowner_dan',
    date: 'Apr 23, 2026',
    text: 'Switched from HubSpot to HighLevel 6 months ago. Honestly the onboarding was rough but the value is undeniable once you get it set up.',
    sentiment: 'neutral',
    url: '#',
  },
  {
    id: 3,
    platform: 'Instagram',
    author: '@digitalstrategyco',
    date: 'Apr 22, 2026',
    text: "Our clients are seeing 3x lead conversion with the HighLevel funnels. If you're not using this yet, you're leaving money on the table.",
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 4,
    platform: 'News',
    author: 'MarTech Today',
    date: 'Apr 21, 2026',
    text: 'HighLevel continues to challenge legacy CRM platforms with its all-in-one agency suite, attracting over 60,000 agency customers globally.',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 5,
    platform: 'YouTube',
    author: 'AgencyGrowthPodcast',
    date: 'Apr 20, 2026',
    text: "Just dropped a 45-min breakdown of HighLevel's new Social Planner. Mixed feelings -- the UI needs work but the features are solid.",
    sentiment: 'neutral',
    url: '#',
  },
]

const SENTIMENT_COLORS = {
  positive: 'text-positive bg-green-50 border-green-200',
  neutral: 'text-neutral-500 bg-neutral-100 border-neutral-200',
  negative: 'text-negative bg-red-50 border-red-200',
}

const PLATFORM_COLORS = {
  X: 'bg-neutral-900 text-white',
  Reddit: 'bg-orange-500 text-white',
  Instagram: 'bg-pink-500 text-white',
  YouTube: 'bg-red-600 text-white',
  News: 'bg-hl-blue text-white',
}

export default function InsightsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const query = state?.query || 'HighLevel'

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/search')}
          className="text-sm text-hl-blue hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        <span className="text-neutral-300">|</span>
        <span className="text-sm text-neutral-500">Results for</span>
        <span className="text-sm font-semibold text-neutral-900">"{query}"</span>
        <span className="ml-auto text-xs text-neutral-400">Last 15 days · 1,248 mentions</span>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Mentions', value: '1,248', delta: '+12%', up: true },
          { label: 'Positive Sentiment', value: '68%', delta: '+5%', up: true },
          { label: 'Negative Sentiment', value: '11%', delta: '-2%', up: true },
          { label: 'Engagement', value: '24.3K', delta: '+8%', up: true },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
            <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-neutral-900">{m.value}</p>
            <p className={`text-xs mt-1 ${m.up ? 'text-positive' : 'text-negative'}`}>{m.delta} vs prev period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Share of voice */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm col-span-2">
          <p className="text-sm font-semibold text-neutral-900 mb-4">Share of Voice by Platform</p>
          <div className="space-y-3">
            {[
              { name: 'X', pct: 38 },
              { name: 'Reddit', pct: 27 },
              { name: 'Instagram', pct: 19 },
              { name: 'News', pct: 10 },
              { name: 'YouTube', pct: 6 },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-16">{p.name}</span>
                <div className="flex-1 bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-hl-blue h-2 rounded-full"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-neutral-700 w-8 text-right">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion radar (static) */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900 mb-4">Emotion Breakdown</p>
          <div className="space-y-2">
            {[
              { label: 'Joy', value: 42, color: 'bg-yellow-400' },
              { label: 'Trust', value: 28, color: 'bg-hl-blue' },
              { label: 'Anticipation', value: 15, color: 'bg-purple-400' },
              { label: 'Surprise', value: 8, color: 'bg-pink-400' },
              { label: 'Anger', value: 7, color: 'bg-red-400' },
            ].map(e => (
              <div key={e.label} className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 w-20">{e.label}</span>
                <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                  <div className={`${e.color} h-1.5 rounded-full`} style={{ width: `${e.value}%` }} />
                </div>
                <span className="text-xs text-neutral-500 w-6 text-right">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation feed */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-900">Conversation Feed</p>
          <span className="text-xs text-neutral-400">Showing 5 of 1,248</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {MOCK_POSTS.map(post => (
            <div key={post.id} className="px-5 py-4 flex gap-4">
              <div className="flex flex-col items-start gap-2 shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[post.platform]}`}>
                  {post.platform}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-neutral-700">{post.author}</span>
                  <span className="text-xs text-neutral-400">{post.date}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${SENTIMENT_COLORS[post.sentiment]}`}>
                    {post.sentiment}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{post.text}</p>
                <a href={post.url} className="text-xs text-hl-blue hover:underline mt-1 inline-block">
                  View post →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
