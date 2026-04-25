import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LotteryList from './pages/LotteryList'
import LotteryCreate from './pages/LotteryCreate'
import LotteryDetail from './pages/LotteryDetail'
import WinnerSelection from './pages/WinnerSelection'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import Support from './pages/Support'
import CMS from './pages/CMS'
import Settings from './pages/Settings'
import Finance from './pages/Finance'
import Notifications from './pages/Notifications'

export default function App() {
  const [auth, setAuth] = useState(false)

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={() => setAuth(false)} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lotteries" element={<LotteryList />} />
          <Route path="lotteries/create" element={<LotteryCreate />} />
          <Route path="lotteries/:id" element={<LotteryDetail />} />
          <Route path="lotteries/:id/winner" element={<WinnerSelection />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="support" element={<Support />} />
          <Route path="cms" element={<CMS />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
