import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useStore(state => state.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const success = await login(email, password)
    if (success) {
      // Small delay to let the store update settle
      setTimeout(() => {
        navigate('/dashboard')
        // Absolute fallback if router fails
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            window.location.href = '/dashboard'
          }
        }, 500)
      }, 100)
    } else {
      setError('Identifiants invalides')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-2xl font-bold text-brand-navy text-center uppercase tracking-wider">
              Admin Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">Robotic Competition Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-11 py-4 text-brand-navy font-semibold focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  placeholder="admin@robotics.upf"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-11 py-4 text-brand-navy font-semibold focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold py-3 px-4 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-navy/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="uppercase tracking-widest text-xs">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              UPF Robotic Challenge 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
