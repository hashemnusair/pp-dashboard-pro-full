import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function Login(){
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)
    const ok = await login(username.trim(), password)
    setLoading(false)
    if (ok) navigate('/')
    else setError('Invalid credentials')
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-200 p-6">
      <div className="w-full max-w-sm card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 grid place-items-center font-semibold">P</div>
          <div className="text-neutral-400">PaymentOps</div>
        </div>
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-neutral-400 mb-4">Enter your credentials to access the dashboard.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Username</label>
            <input className="input w-full" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Password</label>
            <input className="input w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button className="btn w-full justify-center" disabled={loading}>
            {loading? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}


