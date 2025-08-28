import { useData } from '../state/useData'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts'
import dayjs from 'dayjs'

export default function Dev(){
  const logs = useData(s=>s.apiLogs)
  const last = logs.slice().sort((a,b)=> a.timestamp.localeCompare(b.timestamp)).slice(-3000)
  const byHour = new Map<string, {count:number; errors:number; lat:number[]}>()
  for (const l of last){
    const hour = dayjs(l.timestamp).format('YYYY-MM-DD HH:00')
    const rec = byHour.get(hour) || {count:0, errors:0, lat:[]}
    rec.count += 1; if (l.status_code>=400) rec.errors += 1; rec.lat.push(l.latency_ms); byHour.set(hour, rec)
  }
  const series = Array.from(byHour.entries()).map(([hour, v])=>{
    const s = v.lat.slice().sort((a,b)=>a-b); const p95 = s[Math.floor(0.95*(s.length-1))]||0
    return { hour, errorRate: (v.errors/v.count)*100, p95 }
  }).sort((a,b)=> a.hour.localeCompare(b.hour))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Developer Console</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4"><div className="mb-2 font-medium">Error Rate (%) by Hour</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer><LineChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour"/><YAxis/><Tooltip/><Line type="monotone" dataKey="errorRate" dot={false} stroke="#a3a3a3"/></LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4"><div className="mb-2 font-medium">p95 Latency by Hour (ms)</div>
          <div style={{width:'100%', height:260}}>
            <ResponsiveContainer><BarChart data={series}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour"/><YAxis/><Tooltip/><Bar dataKey="p95"/></BarChart></ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
