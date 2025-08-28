import { create } from 'zustand'

type AuthState = {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const STORAGE_KEY = 'auth:isAuthenticated'

function readInitialAuth(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: readInitialAuth(),
  async login(username, password) {
    // Simulate a short delay and check the provided credentials
    await new Promise((r) => setTimeout(r, 200))
    const ok = username === 'OmarFMoghli' && password === 'adminOmar#2004'
    if (ok) {
      set({ isAuthenticated: true })
      try { localStorage.setItem(STORAGE_KEY, 'true') } catch {}
    }
    return ok
  },
  logout() {
    set({ isAuthenticated: false })
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }
}))


