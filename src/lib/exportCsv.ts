import { saveAs } from 'file-saver'
export function exportCsv(filename: string, rows: any[], columns?: string[]){
  const ts = new Date().toISOString()
  const keys = columns ?? Object.keys(rows[0] ?? {})
  const lines = [[`DEMO DATA — exported at`, ts].join(','), keys.join(',')]
  for(const r of rows){ lines.push(keys.map(k=>cell(r[k])).join(',')) }
  const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'})
  saveAs(blob, filename)
}
function cell(v:any){ if(v==null) return ''; const s=String(v).replace(/"/g,'""'); return /[",\n]/.test(s)?`"${s}"`:s }
