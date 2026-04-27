import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Login from './components/Auth/Login'
import Dashboard from './pages/Dashboard'
import LivePage from './pages/LivePage'

export default function App() {
  const user = useStore(state => state.user)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public: Live competition view */}
        <Route path="/" element={<LivePage />} />

        {/* Admin login */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Protected dashboard */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
