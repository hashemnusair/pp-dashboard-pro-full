import * as React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, CreditCard, Store, Wallet, ShieldAlert, Users, Code2, ScrollText, Settings as SettingsIcon, PanelLeft, LogOut } from 'lucide-react'
import { useDataBootstrap } from '../state/useData'
import { useSettings } from '../state/useSettings'
import { useAuth } from '../state/useAuth'

function NavItem({to, label, Icon, collapsed}:{to:string; label:string; Icon:any; collapsed:boolean}){
  return (
    <NavLink
      to={to}
      title={label}
      className={({isActive})=>`group flex items-center ${collapsed? 'justify-center px-0' : 'gap-3 px-2'} py-2 rounded-md transition-colors ${isActive? 'text-white' : 'text-neutral-300 hover:text-white'}`}
    >
      <span className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 grid place-items-center text-neutral-200 group-hover:bg-neutral-700 transition-colors">
        <Icon className="w-5 h-5" />
      </span>
      <span className={`${collapsed? 'opacity-0 -translate-x-2 pointer-events-none select-none w-0 overflow-hidden' : 'opacity-100 translate-x-0'} transition-all duration-200`}>{label}</span>
    </NavLink>
  )
}

export default function App(){
  const { ready, error, reload } = useDataBootstrap()
  const { role, tz, setRole } = useSettings()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const { logout } = useAuth()

  return (
    <div className="min-h-screen grid transition-all duration-300" style={{ gridTemplateColumns: `${sidebarOpen ? '280px' : '80px'} 1fr` }}>
      <aside className="border-r border-neutral-800 p-4 space-y-4 transition-all duration-300 sticky top-0 self-start h-screen overflow-y-auto">
        <div className="flex items-center gap-3">
          <button aria-label="Toggle sidebar" onClick={()=> setSidebarOpen(s=>!s)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700">
            <PanelLeft className="w-5 h-5"/>
          </button>
          {sidebarOpen && <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-sm font-semibold">P</div>}
          <div className={`${sidebarOpen? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none select-none w-0 overflow-hidden'} text-sm text-neutral-400 transition-all duration-200`}>PaymentOps</div>
        </div>
        <nav className="flex flex-col gap-1.5">
          <NavItem to="/" label="Home" Icon={Home} collapsed={!sidebarOpen} />
          <NavItem to="/txns" label="Transactions" Icon={CreditCard} collapsed={!sidebarOpen} />
          <NavItem to="/merchants" label="Merchants" Icon={Store} collapsed={!sidebarOpen} />
          <NavItem to="/payouts" label="Payouts" Icon={Wallet} collapsed={!sidebarOpen} />
          <NavItem to="/cb" label="Chargebacks" Icon={ShieldAlert} collapsed={!sidebarOpen} />
          <NavItem to="/customers" label="Customers" Icon={Users} collapsed={!sidebarOpen} />
          <NavItem to="/dev" label="Developer Console" Icon={Code2} collapsed={!sidebarOpen} />
          <NavItem to="/audit" label="Audit Logs" Icon={ScrollText} collapsed={!sidebarOpen} />
          <NavItem to="/settings" label="Settings" Icon={SettingsIcon} collapsed={!sidebarOpen} />
        </nav>
        <div className={`text-xs text-neutral-400 space-y-2 ${sidebarOpen? '' : 'hidden'}`}>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.6)]"></span>
            <span>SERVERS ONLINE • {tz}</span>
          </div>
          <div>Role:
            <select value={role} onChange={e=>setRole(e.target.value as any)} className="ml-2 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs">
              {['Admin','Ops','Risk','Finance','Support','ReadOnly'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={reload} className="text-xs underline">Reload data</button>
          {error && <div className="text-red-400 mt-2 text-xs">{String(error)}</div>}
          <button onClick={logout} className="btn w-full justify-start mt-2"><LogOut className="w-4 h-4"/> Logout</button>
        </div>
      </aside>
      <main className="p-6">
        <div className="max-w-screen-2xl mx-auto">
          {!ready? <div className="text-neutral-400">Loading demo data…</div> : <Outlet/>}
        </div>
      </main>
    </div>
  )
}
