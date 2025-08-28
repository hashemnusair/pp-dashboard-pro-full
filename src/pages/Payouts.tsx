import * as React from 'react'
import { useData } from '../state/useData'
import dayjs from 'dayjs'
import { money } from '../lib/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Payouts(){
  const payouts = useData(s=>s.payouts)
  const [q, setQ] = React.useState('')

  const filtered = payouts.filter(p=> !q || p.merchant_id.includes(q) || p.status.includes(q) || p.method.includes(q))

  const weekMap = new Map<string, number>()
  for (const p of payouts){ const wk = dayjs(p.created_at).startOf('week').format('YYYY-MM-DD'); weekMap.set(wk,(weekMap.get(wk)||0)+(p.amount_usd||0)) }
  const series = Array.from(weekMap.entries()).map(([week, amount])=>({week, amount})).sort((a,b)=>a.week.localeCompare(b.week))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payouts</h1>
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"/>
      </div>

      <div className="card p-4">
        <div className="mb-2 font-medium">Weekly Payout Totals</div>
        <div style={{width:'100%', height:260}}>
          <ResponsiveContainer>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" /><YAxis /><Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'60vh'}}>
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900 sticky top-0">
            <tr>
              <th className="th">Payout ID</th><th className="th">Merchant</th><th className="th">Date</th><th className="th">Amount</th><th className="th">Status</th><th className="th">Method</th><th className="th">Bank</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.payout_id} className="border-b border-neutral-900 hover:bg-neutral-900/60 transition-colors">
                <td className="td">{p.payout_id}</td>
                <td className="td">{p.merchant_id}</td>
                <td className="td">{new Date(p.created_at).toLocaleString()}</td>
                <td className="td">{money(p.amount_usd)}</td>
                <td className="td">{p.status}</td>
                <td className="td">{p.method}</td>
                <td className="td">•••• {p.bank_account_last4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
