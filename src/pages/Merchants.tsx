import { useData } from '../state/useData'
import dayjs from 'dayjs'
import { money } from '../lib/format'
import { BrandBadge } from '../lib/brands'

export default function Merchants(){
  const merchants = useData(s=>s.merchants)
  const txns = useData(s=>s.transactions)
  const start = dayjs().startOf('month')

  const rows = merchants.map(m=>{
    const all = txns.filter(t=> t.merchant_id===m.merchant_id && dayjs(t.created_at).isAfter(start))
    const succ = all.filter(t=> t.status==='succeeded')
    const vol = succ.reduce((a,b)=>a+(b.amount_usd||0),0)
    const net = succ.reduce((a,b)=>a+(b.net_revenue_usd||0),0)
    const approval = all.length? (succ.length/all.length) : 0
    return { m, vol, net, approval }
  }).sort((a,b)=>b.vol-a.vol)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Merchants</h1>
      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'70vh'}}>
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900 sticky top-0">
            <tr>
              <th className="th">Merchant</th><th className="th">Country</th><th className="th">Risk</th><th className="th">MTD Volume</th><th className="th">MTD Net</th><th className="th">Approval</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({m,vol,net,approval})=>(
              <tr key={m.merchant_id} className="border-b border-neutral-900 hover:bg-neutral-900/60 transition-colors">
                <td className="td"><BrandBadge name={m.name}/>{m.name}</td>
                <td className="td">{m.country}</td>
                <td className="td">{m.risk_level}</td>
                <td className="td">{money(vol)}</td>
                <td className="td">{money(net)}</td>
                <td className="td">{(approval*100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
