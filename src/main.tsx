import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './shell/App'
import Login from './pages/Login'
import { useAuth } from './state/useAuth'

function RequireAuth({children}:{children:React.ReactNode}){
  const isAuthed = useAuth(s=>s.isAuthenticated)
  if (!isAuthed) return <Navigate to="/login" replace />
  return <>{children}</>
}
import Summary from './pages/Summary'
import Transactions from './pages/Transactions'
import Merchants from './pages/Merchants'
import Payouts from './pages/Payouts'
import Chargebacks from './pages/Chargebacks'
import Customers from './pages/Customers'
import Dev from './pages/Dev'
import Audit from './pages/Audit'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path:'/', element: <RequireAuth><App /></RequireAuth>,
    children: [
      { index: true, element: <Summary /> },
      { path: 'txns', element: <Transactions /> },
      { path: 'merchants', element: <Merchants /> },
      { path: 'payouts', element: <Payouts /> },
      { path: 'cb', element: <Chargebacks /> },
      { path: 'customers', element: <Customers /> },
      { path: 'dev', element: <Dev /> },
      { path: 'audit', element: <Audit /> },
      { path: 'settings', element: <Settings /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
