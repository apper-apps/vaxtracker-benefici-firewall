import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Inventory from '@/components/pages/Inventory'
import ReceiveVaccines from '@/components/pages/ReceiveVaccines'
import RecordAdministration from '@/components/pages/RecordAdministration'
import Reports from '@/components/pages/Reports'
import VaccineLoss from '@/components/pages/VaccineLoss'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/receive-vaccines" element={<ReceiveVaccines />} />
        <Route path="/record-administration" element={<RecordAdministration />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/vaccine-loss" element={<VaccineLoss />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App