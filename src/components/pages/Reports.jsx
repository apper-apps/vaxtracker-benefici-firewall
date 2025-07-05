import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { administrationService } from '@/services/api/administrationService'

const Reports = () => {
  const [vaccineLots, setVaccineLots] = useState([])
  const [administrations, setAdministrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [reconciliationData, setReconciliationData] = useState({})
  const [reconciliationMode, setReconciliationMode] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [lotsData, adminData] = await Promise.all([
        vaccineLotService.getAll(),
        administrationService.getAll()
      ])
      setVaccineLots(lotsData)
      setAdministrations(adminData)
    } catch (err) {
      setError('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyReport = () => {
    const startDate = startOfMonth(new Date(selectedMonth))
    const endDate = endOfMonth(new Date(selectedMonth))
    
    const monthlyAdministrations = administrations.filter(admin => {
      const adminDate = new Date(admin.date)
      return adminDate >= startDate && adminDate <= endDate
    })

    const reportData = vaccineLots.map(lot => {
      const lotAdministrations = monthlyAdministrations.filter(admin => admin.lotId === lot.Id)
      const totalAdministered = lotAdministrations.reduce((sum, admin) => sum + admin.doses, 0)
      
      return {
        ...lot,
        administered: totalAdministered,
        reconciled: reconciliationData[lot.Id] || lot.quantityOnHand
      }
    })

    return reportData
  }

  const handleReconciliationChange = (lotId, value) => {
    setReconciliationData(prev => ({
      ...prev,
      [lotId]: parseInt(value) || 0
    }))
  }

  const saveReconciliation = async () => {
    try {
      for (const [lotId, newQuantity] of Object.entries(reconciliationData)) {
        const lot = vaccineLots.find(l => l.Id === parseInt(lotId))
        if (lot && newQuantity !== lot.quantityOnHand) {
          await vaccineLotService.update(parseInt(lotId), {
            ...lot,
            quantityOnHand: newQuantity
          })
        }
      }
      
      toast.success('Reconciliation saved successfully')
      setReconciliationMode(false)
      setReconciliationData({})
      await loadData()
    } catch (err) {
      toast.error('Failed to save reconciliation')
    }
  }

  const exportReport = () => {
    const reportData = generateMonthlyReport()
    const csvContent = [
      ['Commercial Name', 'Generic Name', 'Lot Number', 'Expiration Date', 'Quantity on Hand', 'Administered', 'Status'].join(','),
      ...reportData.map(lot => [
        lot.commercialName,
        lot.genericName,
        lot.lotNumber,
        format(new Date(lot.expirationDate), 'yyyy-MM-dd'),
        lot.quantityOnHand,
        lot.administered,
        new Date(lot.expirationDate) < new Date() ? 'Expired' : 'Active'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vaccine-report-${selectedMonth}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const reportData = generateMonthlyReport()
  const totalDoses = reportData.reduce((sum, lot) => sum + lot.quantityOnHand, 0)
  const totalAdministered = reportData.reduce((sum, lot) => sum + lot.administered, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">Monthly inventory and administration reports</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={exportReport}
          >
            Export Report
          </Button>
          <Button
            variant={reconciliationMode ? "danger" : "secondary"}
            icon={reconciliationMode ? "X" : "Edit"}
            onClick={() => {
              setReconciliationMode(!reconciliationMode)
              if (reconciliationMode) {
                setReconciliationData({})
              }
            }}
          >
            {reconciliationMode ? 'Cancel' : 'Reconcile'}
          </Button>
          {reconciliationMode && (
            <Button
              variant="primary"
              icon="Save"
              onClick={saveReconciliation}
            >
              Save Reconciliation
            </Button>
          )}
        </div>
      </div>

      {/* Report Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Report Month"
            type="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Total Doses</label>
            <div className="text-2xl font-bold text-slate-900">{totalDoses.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Administered</label>
            <div className="text-2xl font-bold text-green-600">{totalAdministered.toLocaleString()}</div>
          </div>
        </div>
      </motion.div>

      {/* Report Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vaccine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lot Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  On Hand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Administered
                </th>
                {reconciliationMode && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Physical Count
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reportData.map((lot) => (
                <tr key={lot.Id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{lot.commercialName}</div>
                    <div className="text-sm text-slate-500">{lot.genericName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {lot.lotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {format(new Date(lot.expirationDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {lot.quantityOnHand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {lot.administered}
                  </td>
                  {reconciliationMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={reconciliationData[lot.Id] || lot.quantityOnHand}
                        onChange={(e) => handleReconciliationChange(lot.Id, e.target.value)}
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports