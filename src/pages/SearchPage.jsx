import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import CreateTopicModal from '../components/CreateTopicModal'

const TOTAL_SEARCHES = 0
const MAX_SEARCHES = 3
const TOTAL_TOPICS = 1

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

        {/* ── Empty state ── */}
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
