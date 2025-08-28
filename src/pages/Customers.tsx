import * as React from 'react'
import { useData } from '../state/useData'
import { useSettings } from '../state/useSettings'

function mask(s:string){ if (!s) return ''; const [name, domain] = s.split('@'); if (!domain) return s; return name.slice(0,2)+'***@'+domain }

export default function Customers(){
  const customers = useData(s=>s.customers)
  const appendAudit = useData(s=>s.appendAudit)
  const { role } = useSettings()
  const [reveal, setReveal] = React.useState(false)
  const canReveal = role === 'Admin'

  function toggleReveal(next:boolean){
    if (next && !reveal && canReveal){
      appendAudit({ timestamp:new Date().toISOString(), actor:'hashem', action:'VIEW_PII', target_type:'customer', target_id:'*', ip_address:'127.0.0.1' })
    }
    setReveal(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <div className="text-sm">
          <label className={`mr-2 ${canReveal? '' : 'opacity-50'}`}>
            <input type="checkbox" disabled={!canReveal} checked={reveal} onChange={e=>toggleReveal(e.target.checked)} /> Reveal PII (Admin only)
          </label>
        </div>
      </div>
      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'70vh'}}>
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900 sticky top-0"><tr>
            <th className="th">Customer</th><th className="th">Email</th><th className="th">Country</th><th className="th">City</th><th className="th">Created</th>
          </tr></thead>
          <tbody>
            {customers.map(c=>(
              <tr key={c.customer_id} className="border-b border-neutral-900 hover:bg-neutral-900/60 transition-colors">
                <td className="td">{reveal? c.full_name : 'Hidden'}</td>
                <td className="td">{reveal? c.email : mask(c.email)}</td>
                <td className="td">{c.country}</td>
                <td className="td">{c.city}</td>
                <td className="td">{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!canReveal && <div className="text-xs text-neutral-500">Switch role to Admin in Settings to reveal PII. Audit events are recorded for PII reveals.</div>}
    </div>
  )
}
