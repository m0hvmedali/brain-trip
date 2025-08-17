import React, { Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/common/Navigation'
import SettingsPanel from './components/common/SettingsPanel'
import LoadingSpinner from './components/common/LoadingSpinner'
import { useStore } from './store/useStore'
// import FloatingHearts from './components/ui/FloatingHearts'
import { registerNotificationService } from './services/notificationService'
// import HomePage from './pages/Home'
// استيراد الصفحات باستخدام Lazy loading
const MemoriesPage = React.lazy(() => import('./pages/Memories'))
const GamePage = React.lazy(() => import('./pages/Game'))
const MapPage = React.lazy(() => import('./pages/Map'))
const JanaPage = React.lazy(() => import('./pages/Jana'))
const MemoryRoomPage = React.lazy(() => import('./pages/MemoryRoom'))
const GratitudePage = React.lazy(() => import('./pages/Gratitude'))
const DreamsPage = React.lazy(() => import('./pages/Dreams'))
const PlaylistPage = React.lazy(() => import('./pages/Playlist'))
const HomePage = React.lazy(() => import('./pages/Home'))
const Chat = React.lazy(() => import('./components/memories/ChatSimulator'))
function App() {
  const { darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled } = useStore()
  
  useEffect(() => {
    // استعادة الإعدادات من localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const savedNotifications = localStorage.getItem('notificationsEnabled') === 'true'
    
    setDarkMode(savedDarkMode)
    setNotificationsEnabled(savedNotifications)
    
    // تطبيق الوضع الداكن
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
    
    // تسجيل خدمة الإشعارات
    if (savedNotifications) {
      registerNotificationService()
    }
  }, [setDarkMode, setNotificationsEnabled])

  return (
    <div className="overflow-x-hidden relative min-h-screen">
      {/* <FloatingHearts count={20} /> */}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/jana" element={<JanaPage />} />
          <Route path="/room" element={<MemoryRoomPage />} />
          <Route path="/gratitude" element={<GratitudePage />} />
          <Route path="/dreams" element={<DreamsPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Suspense>
      
      <Navigation />
    </div>
  )
}

export default App