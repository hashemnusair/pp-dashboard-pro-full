import { useSettings } from '../state/useSettings'
import { useData } from '../state/useData'

export default function Settings(){
  const { role, tz, setRole, setTz } = useSettings()
  const reload = useData(s=>s.reload)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card p-4 space-y-3">
        <div><div className="text-xs text-neutral-400 mb-1">Role</div>
          <select className="input" value={role} onChange={e=>setRole(e.target.value as any)}>
            {['Admin','Ops','Risk','Finance','Support','ReadOnly'].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div><div className="text-xs text-neutral-400 mb-1">Timezone (display only)</div>
          <input className="input" value={tz} onChange={e=>setTz(e.target.value)} />
        </div>
        <div className="text-xs text-neutral-500">CSV exports include a DEMO watermark. PII reveal is Admin-only and is audit-logged.</div>
        <button className="btn" onClick={reload}>Reload Data</button>
      </div>
    </div>
  )
}
