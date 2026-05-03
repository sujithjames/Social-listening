import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const MOCK_TOPICS = [
  { id: 1, name: 'HighLevel', mentions: 1248, sentiment: 68, platforms: ['X', 'Reddit', 'Instagram'], updated: '2 hours ago' },
  { id: 2, name: 'Email Marketing', mentions: 843, sentiment: 54, platforms: ['X', 'News'], updated: '4 hours ago' },
  { id: 3, name: 'Marketing Automation', mentions: 612, sentiment: 61, platforms: ['Reddit', 'YouTube'], updated: '6 hours ago' },
]

export default function TopicsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] flex flex-col overflow-hidden">
        <div className="px-8 py-5 flex items-center justify-between border-b border-gray-200">
          <Header title="Saved topics" subtitle="Auto-refreshed every 6 hours" />
          <button
            onClick={() => navigate('/search')}
            className="px-4 py-2 bg-hl-blue hover:bg-hl-blue-dark text-white text-[14px] font-semibold rounded-lg transition-colors"
          >
            + New topic
          </button>
        </div>

        <div className="px-8 py-5 flex flex-col gap-3">
          {MOCK_TOPICS.length === 0 ? (
            <div className="text-center py-24 text-neutral-400">
              <p className="text-[14px] font-medium mb-2">No saved topics yet</p>
              <p className="text-[13px]">Search for a keyword and save it to track it over time.</p>
            </div>
          ) : (
            <>
              {MOCK_TOPICS.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => navigate('/topic-detail', { state: { query: topic.name, isSavedTopic: true } })}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-6 cursor-pointer hover:border-hl-blue transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-gray-900 mb-1">{topic.name}</p>
                    <p className="text-[12px] text-gray-400">Updated {topic.updated}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-gray-900">{topic.mentions.toLocaleString()}</p>
                    <p className="text-[12px] text-gray-400">Mentions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-positive">{topic.sentiment}%</p>
                    <p className="text-[12px] text-gray-400">Positive</p>
                  </div>
                  <div className="flex gap-1">
                    {topic.platforms.map(p => (
                      <span key={p} className="text-[12px] px-2 py-0.5 rounded-full bg-hl-blue-light text-hl-blue font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              ))}
            </>
          )}

          <p className="text-[12px] text-gray-400 mt-2">3 of 3 topics used on Free plan · <span className="text-hl-blue cursor-pointer hover:underline">Upgrade for 100 topics</span></p>
        </div>
      </div>
    </div>
  )
}
