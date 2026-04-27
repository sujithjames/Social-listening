import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, TrendingUp } from 'lucide-react'
import CreateTopicModal from '../components/CreateTopicModal'

const TOTAL_SEARCHES = 0
const MAX_SEARCHES = 3
const TOTAL_TOPICS = 1

const GOOGLE_TRENDS = [
  { rank: 1,  keyword: '#barcelona',                  count: '22K', unit: 'Searches', status: 'new' },
  { rank: 2,  keyword: '#racingvsbarcelona',           count: '22K', unit: 'Searches', status: 'new' },
  { rank: 3,  keyword: 'racing santander-barcelona',   count: '18K', unit: 'Searches', status: 'trending' },
  { rank: 4,  keyword: '#championsleague',             count: '15K', unit: 'Searches', status: 'new' },
  { rank: 5,  keyword: 'real madrid vs chelsea',       count: '12K', unit: 'Searches', status: 'trending' },
  { rank: 6,  keyword: '#ucl',                         count: '9K',  unit: 'Searches', status: 'trending' },
  { rank: 7,  keyword: 'football scores tonight',      count: '7K',  unit: 'Searches', status: 'trending' },
  { rank: 8,  keyword: '#premierleague',               count: '5K',  unit: 'Searches', status: 'new' },
]

const PINTEREST_TRENDS = [
  { rank: 1, keyword: 'heated rivalry',            count: '1,687', unit: 'Pins', status: 'trending' },
  { rank: 2, keyword: 'lifetime fitness',          count: '1,687', unit: 'Pins', status: 'trending' },
  { rank: 3, keyword: 'summer aesthetic outfits',  count: '1,542', unit: 'Pins', status: 'trending' },
  { rank: 4, keyword: 'home office setup 2024',    count: '1,201', unit: 'Pins', status: 'trending' },
  { rank: 5, keyword: 'healthy meal prep ideas',   count: '987',   unit: 'Pins', status: 'trending' },
  { rank: 6, keyword: 'minimalist interior design',count: '845',   unit: 'Pins', status: 'trending' },
  { rank: 7, keyword: 'tattoo inspiration',        count: '723',   unit: 'Pins', status: 'trending' },
  { rank: 8, keyword: 'wedding hairstyles',        count: '612',   unit: 'Pins', status: 'new' },
]

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('Topic')
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate('/insights', { state: { query } })
  }

  function handleTopicCreated({ title }) {
    setShowModal(false)
    navigate('/insights', { state: { query: title } })
  }

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
                Topics: <span className="font-normal text-gray-500">{TOTAL_TOPICS}</span>
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
          <div className="flex-1 flex flex-col items-center justify-center gap-5 pb-16">
            <ListeningIllustration />
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-[16px] font-semibold text-gray-900">
                Set up your first listening topic
              </p>
              <p className="text-[14px] text-gray-600 max-w-xs leading-relaxed">
                Add a topic to track keywords, brands, or trends and start gathering insights
                instantly.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded border border-[#84ADFF] bg-white text-[13px] font-semibold text-[#004EEB] hover:bg-hl-blue-light transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
            >
              <Plus size={14} />
              Create topic
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <div className="grid grid-cols-2 gap-4 pt-1">
              <TrendTable
                platform="Google"
                logo={<GoogleLogo />}
                rows={GOOGLE_TRENDS}
                onTrack={kw => navigate('/insights', { state: { query: kw } })}
              />
              <TrendTable
                platform="Pinterest keywords"
                logo={<PinterestLogo />}
                rows={PINTEREST_TRENDS}
                onTrack={kw => navigate('/insights', { state: { query: kw } })}
              />
            </div>
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

function TrendTable({ platform, logo, rows, onTrack }) {
  return (
    <div className="border border-gray-300 rounded overflow-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        {logo}
        <span className="text-[16px] font-semibold text-gray-900">{platform}</span>
      </div>
      {/* Column labels */}
      <div className="border-b border-gray-200 px-4 py-2 grid grid-cols-[20px_1fr_auto] gap-2 items-center">
        <span className="text-[12px] font-medium text-gray-400">#</span>
        <span className="text-[12px] font-medium text-gray-400">Keyword</span>
        <span className="text-[12px] font-medium text-gray-400">Volume</span>
      </div>
      {/* Rows */}
      {rows.map(row => (
        <div
          key={row.rank}
          className="border-b border-gray-200 last:border-b-0 px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-[14px] font-medium text-gray-500 w-5 shrink-0">{row.rank}</span>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-gray-900 truncate">{row.keyword}</p>
              <p className="text-[12px] text-gray-500">{row.count} {row.unit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {row.status === 'new' ? (
              <span className="text-[13px] font-semibold text-[#004EEB]">New</span>
            ) : (
              <TrendingUp size={15} className="text-positive" />
            )}
            <button
              onClick={() => onTrack(row.keyword)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2.5 rounded border border-[#84ADFF] bg-white text-[12px] font-semibold text-[#004EEB] hover:bg-hl-blue-light"
            >
              Track
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35Z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0 0 10 20Z" fill="#34A853"/>
      <path d="M4.405 11.9A6.01 6.01 0 0 1 4.09 10c0-.663.114-1.308.314-1.9V5.51H1.064A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.341-2.59Z" fill="#FBBC04"/>
      <path d="M10 3.977c1.468 0 2.786.505 3.822 1.496l2.868-2.868C14.959.992 12.695 0 10 0A9.996 9.996 0 0 0 1.064 5.51l3.341 2.59C5.19 5.736 7.395 3.977 10 3.977Z" fill="#EA4335"/>
    </svg>
  )
}

function PinterestLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#E60023"/>
      <path d="M10 3C6.134 3 3 6.134 3 10c0 2.967 1.792 5.52 4.368 6.632-.06-.544-.114-1.378.024-1.972.124-.536.832-3.526.832-3.526s-.212-.424-.212-1.052c0-.986.572-1.722 1.284-1.722.606 0 .9.455.9 1.001 0 .61-.388 1.522-.59 2.368-.168.706.355 1.282 1.048 1.282 1.258 0 2.228-1.326 2.228-3.24 0-1.695-1.218-2.879-2.956-2.879-2.013 0-3.194 1.51-3.194 3.07 0 .608.234 1.26.526 1.616a.21.21 0 0 1 .049.202c-.054.22-.172.706-.196.804-.032.13-.106.158-.244.095-1.468-.684-2.384-2.832-2.384-4.558 0-3.702 2.69-7.107 7.763-7.107 4.075 0 7.24 2.902 7.24 6.78 0 4.044-2.55 7.296-6.09 7.296-1.19 0-2.31-.619-2.694-1.349l-.732 2.73c-.266.02-.542.034-.82.034" fill="white"/>
    </svg>
  )
}

function ListeningIllustration() {
  return (
    <div className="relative w-52 h-52 flex items-center justify-center select-none">
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
