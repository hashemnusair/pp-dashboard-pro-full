import { useData } from '../state/useData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Audit(){
  const audit = useData(s=>s.auditLogs)
  const byAction = new Map<string, number>(); for (const a of audit) byAction.set(a.action,(byAction.get(a.action)||0)+1)
  const series = Array.from(byAction.entries()).map(([action,count])=>({action, count})).sort((a,b)=>b.count-a.count)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <div className="card p-4"><div className="mb-2 font-medium">Actions Distribution</div>
        <div style={{width:'100%', height:260}}><ResponsiveContainer><BarChart data={series}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="action"/><YAxis/><Tooltip/><Bar dataKey="count"/></BarChart></ResponsiveContainer></div>
      </div>
      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'60vh'}}>
        <table className="min-w-full text-sm"><thead className="bg-neutral-900 sticky top-0"><tr>
          <th className="th">Time</th><th className="th">Actor</th><th className="th">Action</th><th className="th">Target</th><th className="th">IP</th>
        </tr></thead><tbody>
          {audit.map(a=>(<tr key={a.timestamp+a.actor+a.target_id} className="border-b border-neutral-900 hover:bg-neutral-900/60 transition-colors">
            <td className="td">{new Date(a.timestamp).toLocaleString()}</td><td className="td">{a.actor}</td><td className="td">{a.action}</td><td className="td">{a.target_type}:{a.target_id}</td><td className="td">{a.ip_address}</td>
          </tr>))}
        </tbody></table>
      </div>
    </div>
  )
}
