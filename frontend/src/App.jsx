import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Login from './components/Auth/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const user = useStore(state => state.user)
  console.log('App user state:', user ? 'Logged In' : 'Logged Out')

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect based on auth state */}
        <Route 
          path="/" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/" replace />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
