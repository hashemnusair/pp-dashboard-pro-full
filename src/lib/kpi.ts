import dayjs from 'dayjs'
import { useData, type Transaction } from '../state/useData'
export function useMTD(){
  const txns = useData(s=>s.transactions)
  const start = dayjs().startOf('month')
  const all = txns.filter(t=> dayjs(t.created_at).isAfter(start))
  const succ = all.filter(t=> t.status==='succeeded')
  const gross = sum(succ,'amount_usd'), net = sum(succ,'net_revenue_usd')
  const count = succ.length, approvals = all.length? succ.length/all.length : 0
  const refunds = rate(all,'refunded'), cb = cbRate()
  const avgTicket = count? gross/count : 0
  return { gross, net, count, approvals, refunds, cb, avgTicket }
}
function sum(rows:Transaction[], key:keyof Transaction){ let s=0; for(const r of rows) s+=(r[key] as number)||0; return s }
function rate(rows:Transaction[], st:string){ const n = rows.filter(t=>t.status===st).length; return rows.length? n/rows.length:0 }
function cbRate(){
  const { transactions, chargebacks } = useData.getState()
  const start = dayjs().startOf('month')
  const succ = transactions.filter(t=> t.status==='succeeded' && dayjs(t.created_at).isAfter(start))
  const cbs = chargebacks.filter(c=> dayjs(c.created_at).isAfter(start))
  return succ.length? cbs.length/succ.length:0
}
export function topMerchants(limit=5){
  const { transactions, merchants } = useData.getState()
  const start = dayjs().startOf('month')
  const succ = transactions.filter(t=> t.status==='succeeded' && dayjs(t.created_at).isAfter(start))
  const map = new Map<string, number>()
  for(const t of succ) map.set(t.merchant_id,(map.get(t.merchant_id)||0)+(t.amount_usd||0))
  return Array.from(map.entries()).map(([merchant_id, volume])=>({merchant_id, name: merchants.find(m=>m.merchant_id===merchant_id)?.name||merchant_id, volume})).sort((a,b)=>b.volume-a.volume).slice(0,limit)
}
export function methodMix(){
  const { transactions } = useData.getState()
  const start = dayjs().startOf('month')
  const succ = transactions.filter(t=> t.status==='succeeded' && dayjs(t.created_at).isAfter(start))
  const map = new Map<string, number>()
  for(const t of succ) map.set(t.payment_method,(map.get(t.payment_method)||0)+(t.amount_usd||0))
  return Array.from(map.entries()).map(([method, volume])=>({method, volume})).sort((a,b)=>b.volume-a.volume)
}
export function dailyVolumeSeries(){
  const { transactions } = useData.getState()
  const start = dayjs().startOf('month')
  const succ = transactions.filter(t=> t.status==='succeeded' && dayjs(t.created_at).isAfter(start))
  const map = new Map<string, number>()
  for(const t of succ){ const k = t.created_at.slice(0,10); map.set(k,(map.get(k)||0)+(t.amount_usd||0)) }
  return Array.from(map.entries()).map(([date, volume])=>({date, volume})).sort((a,b)=>a.date.localeCompare(b.date))
}
