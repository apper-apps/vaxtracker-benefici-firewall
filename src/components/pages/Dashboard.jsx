import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isAfter, isBefore, addDays } from 'date-fns'
import MetricCard from '@/components/molecules/MetricCard'
import AlertBanner from '@/components/molecules/AlertBanner'
import Button from '@/components/atoms/Button'
import VaccineTable from '@/components/organisms/VaccineTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineLotService } from '@/services/api/vaccineLotService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [vaccineLots, setVaccineLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVaccineLots()
  }, [])

  const loadVaccineLots = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await vaccineLotService.getAll()
      setVaccineLots(data)
    } catch (err) {
      setError('Failed to load vaccine inventory')
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = () => {
    if (vaccineLots.length === 0) {
      return {
        totalDoses: 0,
        administeredDoses: 0,
        expiringSoon: 0,
        expired: 0,
        lowStock: 0
      }
    }

    const now = new Date()
    const thirtyDaysFromNow = addDays(now, 30)
    
    return vaccineLots.reduce((acc, lot) => {
      const expDate = new Date(lot.expirationDate)
      const administered = lot.administeredDoses || 0
      
      acc.totalDoses += lot.quantityOnHand
      acc.administeredDoses += administered
      
      if (isBefore(expDate, now)) {
        acc.expired += 1
      } else if (isBefore(expDate, thirtyDaysFromNow)) {
        acc.expiringSoon += 1
      }
      
      if (lot.quantityOnHand <= 10) {
        acc.lowStock += 1
      }
      
      return acc
    }, {
      totalDoses: 0,
      administeredDoses: 0,
      expiringSoon: 0,
      expired: 0,
      lowStock: 0
    })
  }

  const getExpiringVaccines = () => {
    const now = new Date()
    const thirtyDaysFromNow = addDays(now, 30)
    
    return vaccineLots.filter(lot => {
      const expDate = new Date(lot.expirationDate)
      return isBefore(expDate, thirtyDaysFromNow) && isAfter(expDate, now)
    }).slice(0, 5)
  }

  const getLowStockVaccines = () => {
    return vaccineLots.filter(lot => lot.quantityOnHand <= 10).slice(0, 5)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadVaccineLots} />
  }

  const metrics = calculateMetrics()
  const expiringVaccines = getExpiringVaccines()
  const lowStockVaccines = getLowStockVaccines()

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {metrics.expired > 0 && (
        <AlertBanner
          type="danger"
          title="Expired Vaccines"
          message={`${metrics.expired} vaccine lot${metrics.expired > 1 ? 's have' : ' has'} expired and must be removed from inventory.`}
          actions={[
            { label: 'View Details', onClick: () => navigate('/inventory') }
          ]}
        />
      )}
      
      {metrics.expiringSoon > 0 && (
        <AlertBanner
          type="warning"
          title="Vaccines Expiring Soon"
          message={`${metrics.expiringSoon} vaccine lot${metrics.expiringSoon > 1 ? 's are' : ' is'} expiring within 30 days.`}
          actions={[
            { label: 'View Details', onClick: () => navigate('/inventory') }
          ]}
        />
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Doses"
          value={metrics.totalDoses.toLocaleString()}
          icon="Package"
          color="primary"
        />
        <MetricCard
          title="Administered Doses"
          value={metrics.administeredDoses.toLocaleString()}
          icon="Syringe"
          color="success"
        />
        <MetricCard
          title="Expiring Soon"
          value={metrics.expiringSoon}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Expired Doses"
          value={metrics.expired}
          icon="AlertTriangle"
          color="danger"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            size="lg"
            icon="PackagePlus"
            onClick={() => navigate('/receive-vaccines')}
            className="justify-start"
          >
            Receive Vaccines
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon="Syringe"
            onClick={() => navigate('/record-administration')}
            className="justify-start"
          >
            Record Administration
          </Button>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Vaccines */}
        {expiringVaccines.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Expiring Soon</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/inventory')}
              >
                View All
              </Button>
            </div>
            <VaccineTable
              vaccines={expiringVaccines}
              sortable={false}
              showAdministration={false}
            />
          </div>
        )}

        {/* Low Stock */}
        {lowStockVaccines.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Low Stock Items</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/inventory')}
              >
                View All
              </Button>
            </div>
            <VaccineTable
              vaccines={lowStockVaccines}
              sortable={false}
              showAdministration={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard