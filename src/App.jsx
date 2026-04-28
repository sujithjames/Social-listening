import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import SearchPage from './pages/SearchPage'
import InsightsPage from './pages/InsightsPage'
import TopicsPage from './pages/TopicsPage'
import TopicDetailPage from './pages/TopicDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/topic-detail" element={<TopicDetailPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
