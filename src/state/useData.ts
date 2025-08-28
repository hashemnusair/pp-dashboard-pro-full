import { create } from 'zustand'
import Papa from 'papaparse'
import { useSettings } from './useSettings'

export type Transaction = { txn_id:string; created_at:string; merchant_id:string; customer_id:string; mcc:string; amount:number; currency:string; amount_usd:number; status:string; payment_method:string; card_brand:string; card_last4:string; country:string; city:string; risk_score:number; auth_code:string; fee_rate_percent:number; fixed_fee_cents:number; fee_total_usd:number; processor_cost_usd:number; net_revenue_usd:number; net_settlement_usd:number; settlement_batch_id:string }
export type Merchant = { merchant_id:string; name:string; mcc:string; mcc_description:string; country:string; website:string; onboarding_date:string; status:string; payout_schedule:string; fee_rate_percent:number; fixed_fee_cents:number; risk_level:string }
export type Customer = { customer_id:string; full_name:string; email:string; country:string; city:string; created_at:string }
export type Chargeback = { chargeback_id:string; original_txn_id:string; merchant_id:string; created_at:string; reason:string; amount_usd:number; status:string; deadline_at:string; evidence_submitted_at:string|null }
export type Payout = { payout_id:string; merchant_id:string; created_at:string; amount_usd:number; status:string; method:string; bank_account_last4:string; settlement_batches:string; payout_fee_usd:number }
export type ApiLog = { timestamp:string; method:string; endpoint:string; status_code:number; latency_ms:number; api_key_hash:string }
export type AuditLog = { timestamp:string; actor:string; action:string; target_type:string; target_id:string; ip_address:string }

type Store = {
  transactions: Transaction[]; merchants: Merchant[]; customers: Customer[]; payouts: Payout[]; chargebacks: Chargeback[]; apiLogs: ApiLog[]; auditLogs: AuditLog[];
  ready: boolean; error: Error|null; reload: ()=>void; appendAudit:(e:AuditLog)=>void; updateChargebackStatus:(id:string, status:string)=>void
}

const BASE = '/data'
// ⬇︎ replace existing loadCsv with this
function loadCsv<T>(file:string){
  return new Promise<T[]>((res, rej) => {
    Papa.parse<T>(`${BASE}/${file}`, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: (r: Papa.ParseResult<T>) => {
        // drop completely empty rows (caused by trailing newline / BOM / etc.)
        const rows = (r.data as unknown as any[]).filter(
          row => row && Object.values(row).some(v => v !== null && v !== undefined && v !== '')
        )
        res(rows as T[])
      },
      error: rej
    })
  })
}

export const useData = create<Store>((set,get)=>({
  transactions:[], merchants:[], customers:[], payouts:[], chargebacks:[], apiLogs:[], auditLogs:[],
  ready:false, error:null,
  reload: async ()=>{
    try{
      set({ready:false})
      const [transactionsRaw, merchants, customers, payouts, chargebacks, apiLogs, auditLogs] = await Promise.all([
        loadCsv<Transaction>('transactions_aug_final.csv'),
        loadCsv<Merchant>('merchants.csv'),
        loadCsv<Customer>('customers.csv'),
        loadCsv<Payout>('payouts.csv'),
        loadCsv<Chargeback>('chargebacks.csv'),
        loadCsv<ApiLog>('api_logs.csv'),
        loadCsv<AuditLog>('audit_logs.csv')
      ])

      // Basic numeric coercion for Transactions to avoid undefined in cells
      const txCoerced: Transaction[] = (transactionsRaw as Transaction[]).map((t)=> ({
        ...t,
        amount: Number((t as any).amount) || 0,
        amount_usd: Number((t as any).amount_usd) || 0,
        fee_rate_percent: Number((t as any).fee_rate_percent) || 0,
        fixed_fee_cents: Number((t as any).fixed_fee_cents) || 0,
        fee_total_usd: Number((t as any).fee_total_usd) || 0,
        processor_cost_usd: Number((t as any).processor_cost_usd) || 0,
        net_revenue_usd: Number((t as any).net_revenue_usd) || 0,
        net_settlement_usd: Number((t as any).net_settlement_usd) || 0,
        risk_score: Number((t as any).risk_score) || 0,
      }))

      set({
        transactions: txCoerced,
        merchants, customers, payouts, chargebacks, apiLogs, auditLogs,
        ready: true, error: null
      })
    }catch(error){
      set({ error: error instanceof Error ? error : new Error(String(error)), ready: false })
    }
  },
  appendAudit: (e)=> set({ auditLogs: [...get().auditLogs, e] }),
  updateChargebackStatus: (id, status)=> set({ chargebacks: get().chargebacks.map(c=> c.chargeback_id===id? {...c, status}: c) })
}))

export function useDataBootstrap(){
  const ready = useData(s=>s.ready), error = useData(s=>s.error), reload = useData(s=>s.reload)
  if (!ready && !error) reload()
  return { ready, error, reload }
}
