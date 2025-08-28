import { Link } from 'react-router-dom'
import { money, pct } from '../lib/format'
import { useMTD, topMerchants, methodMix, dailyVolumeSeries } from '../lib/kpi'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { BrandBadge } from '../lib/brands'

function Kpi({label, value}:{label:string, value:string}){
  return (
    <div className="card p-4 hover:bg-neutral-900 transition-colors">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold leading-tight tracking-tight">
        <span className="inline-block align-baseline whitespace-nowrap" style={{direction:'ltr'}} title={value}>{value}</span>
      </div>
    </div>
  )
}

export default function Summary(){
  const { gross, net, count, approvals, refunds, cb, avgTicket } = useMTD()
  const top = topMerchants(5)
  const mix = methodMix()
  const series = dailyVolumeSeries()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Executive Summary (MTD)</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Kpi label="Gross Volume" value={money(gross)} />
        <Kpi label="Gross Profit" value={money(net)} />
        <Kpi label="Transactions" value={count.toLocaleString()} />
        <Kpi label="Approval Rate" value={pct(approvals)} />
        <Kpi label="Refund Rate" value={pct(refunds)} />
        <Kpi label="Avg Ticket" value={money(avgTicket)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="mb-2 font-medium">Daily Volume (MTD)</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="volume" dot={false} stroke="#a3a3a3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <div className="mb-2 font-medium">Payment Method Mix (MTD)</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mix} dataKey="volume" nameKey="method" outerRadius={100}>
                  {mix.map((_,i)=>(<Cell key={i} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Top Merchants (MTD)</h2>
          <Link to="/merchants" className="text-sm text-neutral-400 hover:text-white">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {top.map((m,i)=>(
            <div key={i} className="flex items-center justify-between border-b border-neutral-800 py-2">
              <div className="text-sm flex items-center"><span className="mr-2">{i+1}.</span><BrandBadge name={m.name}/> {m.name}</div>
              <div className="text-sm">{money(m.volume)}</div>
            </div>
          ))}
          {top.length===0 && <div className="text-sm text-neutral-400">No data loaded.</div>}
        </div>
      </div>
    </div>
  )
}
