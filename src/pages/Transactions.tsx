import * as React from 'react'
import { useData, type Transaction, type AuditLog } from '../state/useData'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { exportCsv } from '../lib/exportCsv'


const safeFixed = (v: any, n = 2) => {
  const num = Number(v)
  return Number.isFinite(num) ? num.toFixed(n) : '—'
}
const safeMoney = (v: any) => {
  const num = Number(v)
  return Number.isFinite(num)
    ? num.toLocaleString(undefined, { style:'currency', currency:'USD', maximumFractionDigits:2 })
    : '—'
}


function money(n:number){ return (n||0).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2}) }

type Filters = { q: string; status: string; method: string; merchant: string }

export default function Transactions(){
  const { transactions, appendAudit } = useData()
  const [filters, setFilters] = React.useState<Filters>({ q:'', status:'', method:'', merchant:'' })
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created_at', desc: true }])
  const [selected, setSelected] = React.useState<Transaction|null>(null)
  const [reviewed, setReviewed] = React.useState<Record<string, boolean>>({})
  const [viewName, setViewName] = React.useState('')
  const [views, setViews] = React.useState<Record<string, Filters>>(()=> JSON.parse(localStorage.getItem('txn_views')||'{}'))

  const filtered = React.useMemo(()=> transactions.filter(t=>{
    if (filters.status && t.status!==filters.status) return false
    if (filters.method && t.payment_method!==filters.method) return false
    if (filters.merchant && t.merchant_id!==filters.merchant) return false
    if (filters.q){
      const q = filters.q.toLowerCase()
      return Object.values(t).some(v=> String(v??'').toLowerCase().includes(q))
    }
    return true
  }), [transactions, filters])

  const saveView = ()=>{
    if (!viewName) return
    const next = {...views, [viewName]: filters}
    setViews(next); localStorage.setItem('txn_views', JSON.stringify(next)); setViewName('')
  }
  const loadView = (name:string)=>{ const v = views[name]; if (v) setFilters(v) }

  const columns = React.useMemo<ColumnDef<Transaction>[]>(() => [
    { accessorKey: 'txn_id', header: 'Txn ID' },
    { accessorKey: 'created_at', header: 'Created', cell: ({ getValue }) => new Date(getValue() as string).toLocaleString() },
    { accessorKey: 'merchant_id', header: 'Merchant' },
    { accessorKey: 'amount_usd', header: 'Amount (USD)', cell: ({ getValue }) => safeMoney(getValue()) },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'payment_method', header: 'Method' },
    { accessorKey: 'card_brand', header: 'Brand' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'risk_score', header: 'Risk', cell: ({ getValue }) => safeFixed(getValue(), 2) },
    { accessorKey: 'net_revenue_usd', header: 'Net Rev', cell: ({ getValue }) => safeMoney(getValue()) },
    { accessorKey: 'net_settlement_usd', header: 'Net Settle', cell: ({ getValue }) => safeMoney(getValue()) },
  ], [])
  

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const merchants = Array.from(new Set(transactions.map(t=>t.merchant_id))).sort()
  const methods = Array.from(new Set(transactions.map(t=>t.payment_method))).sort()
  const statuses = Array.from(new Set(transactions.map(t=>t.status))).sort()

  function markReview(t: Transaction){
    setReviewed(prev=> ({...prev, [t.txn_id]: !prev[t.txn_id]}))
    const e: AuditLog = { timestamp: new Date().toISOString(), actor:'hashem', action:'VIEW_TXN', target_type:'txn', target_id:t.txn_id, ip_address:'127.0.0.1' }
    appendAudit(e)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="flex gap-2 items-center">
          <input className="input" placeholder="Save view as…" value={viewName} onChange={e=>setViewName(e.target.value)} />
          <button className="btn" onClick={saveView}>Save View</button>
          <select className="input" onChange={e=> loadView(e.target.value)} defaultValue="">
            <option value="" disabled>Load view…</option>
            {Object.keys(views).map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="btn" onClick={()=> exportCsv('transactions_export.csv', table.getRowModel().rows.map(r=>r.original))}>Export CSV</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} placeholder="Search…" className="input w-64"/>
        <select className="input" value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})}>
          <option value="">All Status</option>
          {statuses.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" value={filters.method} onChange={e=>setFilters({...filters, method:e.target.value})}>
          <option value="">All Methods</option>
          {methods.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" value={filters.merchant} onChange={e=>setFilters({...filters, merchant:e.target.value})}>
          <option value="">All Merchants</option>
          {merchants.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-auto border border-neutral-800 rounded-xl" style={{maxHeight:'70vh'}}>
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900 sticky top-0">
            {table.getHeaderGroups().map(hg=>(
              <tr key={hg.id}>
                {hg.headers.map(h=>(
                  <th key={h.id} className="th cursor-pointer select-none" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{asc:' ▲', desc:' ▼'}[h.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(r=>(
              <tr key={r.id} className={"hover:bg-neutral-900/60 transition-colors " + (reviewed[(r.original as any).txn_id] ? "bg-neutral-900/40" : "")} onClick={()=> setSelected(r.original as any)}>
                {r.getVisibleCells().map(c=>(
                  <td key={c.id} className="td">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="card p-4 w-[720px] max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Transaction {selected.txn_id}</div>
              <button className="btn" onClick={()=> setSelected(null)}>Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><b>Created:</b> {new Date(selected.created_at).toLocaleString()}</div>
              <div><b>Merchant:</b> {selected.merchant_id}</div>
              <div><b>Amount USD:</b> {money(selected.amount_usd)}</div>
              <div><b>Status:</b> {selected.status}</div>
              <div><b>Method:</b> {selected.payment_method} • {selected.card_brand} • ••••{selected.card_last4}</div>
              <div><b>Geo:</b> {selected.city}, {selected.country}</div>
              <div><b>Risk:</b> {selected.risk_score.toFixed(2)}</div>
              <div><b>Fee / Processor / Net Rev:</b> {money(selected.fee_total_usd)} / {money(selected.processor_cost_usd)} / {money(selected.net_revenue_usd)}</div>
              <div><b>Settlement:</b> {money(selected.net_settlement_usd)} (batch {selected.settlement_batch_id})</div>
              <div><b>Auth:</b> {selected.auth_code}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={()=> markReview(selected)}>Mark for review</button>
              <button className="btn" onClick={()=> exportCsv(`txn_${selected.txn_id}.csv`, [selected])}>Export row</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
