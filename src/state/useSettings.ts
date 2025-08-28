import { create } from 'zustand'
export type Role = 'Admin'|'Ops'|'Risk'|'Finance'|'Support'|'ReadOnly'
type Settings = { role: Role; tz: string; dataset: 'final'; setRole:(r:Role)=>void; setTz:(s:string)=>void }
const saved = typeof localStorage!=='undefined' ? JSON.parse(localStorage.getItem('pp_settings')||'{}') : {}
export const useSettings = create<Settings>((set,get)=>({
  role: saved.role ?? 'ReadOnly',
  tz: saved.tz ?? 'Asia/Amman',
  dataset: 'final',
  setRole: (role)=>{ set({role}); localStorage.setItem('pp_settings', JSON.stringify({...get(), role})) },
  setTz: (tz)=>{ set({tz}); localStorage.setItem('pp_settings', JSON.stringify({...get(), tz})) },
}))
