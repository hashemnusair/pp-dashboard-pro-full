import * as React from 'react'
import { useData } from '../state/useData'
import dayjs from 'dayjs'
import { money } from '../lib/format'

function sla(deadline: string){
  const now = dayjs()
  const due = dayjs(deadline)
  const diff = due.diff(now, 'hour')
  if (diff <= 0) return { text: 'Overdue', cls: 'text-red-400' }
  if (diff < 72) return { text: `${diff}h`, cls: 'text-amber-300' }
  return { text: `${Math.ceil(diff/24)}d`, cls: 'text-neutral-300' }
}

export default function Chargebacks(){
  const { chargebacks, updateChargebackStatus, appendAudit } = useData()
  const [status, setStatus] = React.useState('')
  const [q, setQ] = React.useState('')

  const filtered = chargebacks.filter(c=> (status? c.status===status : true) && (!q || c.chargeback_id.includes(q) || c.original_txn_id.includes(q) || c.merchant_id.includes(q)))

  function submitRepresentment(id:string){
    updateChargebackStatus(id, 'representment_submitted')
    appendAudit({ timestamp:new Date().toISOString(), actor:'hashem', action:'SUBMIT_REPRESENTMENT', target_type:'chargeback', target_id:id, ip_address:'127.0.0.1' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chargebacks</h1>
        <div className="flex gap-2">
          <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"/>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All Status</option>
            {Array.from(new Set(chargebacks.map(x=>x.status))).map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'70vh'}}>
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900 sticky top-0">
            <tr>
              <th className="th">CB ID</th><th className="th">Txn</th><th className="th">Merchant</th><th className="th">Reason</th><th className="th">Amount</th><th className="th">Status</th><th className="th">Deadline</th><th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c=>{
              const d = sla(c.deadline_at)
              return (
                <tr key={c.chargeback_id} className="border-b border-neutral-900 hover:bg-neutral-900/60 transition-colors">
                  <td className="td">{c.chargeback_id}</td>
                  <td className="td">{c.original_txn_id}</td>
                  <td className="td">{c.merchant_id}</td>
                  <td className="td">{c.reason}</td>
                  <td className="td">{money(c.amount_usd)}</td>
                  <td className="td">{c.status}</td>
                  <td className={`td ${d.cls}`}>{new Date(c.deadline_at).toLocaleDateString()} • {d.text}</td>
                  <td className="td"><button className="btn" onClick={()=>submitRepresentment(c.chargeback_id)}>Submit Representment</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
