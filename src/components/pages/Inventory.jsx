import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import VaccineTable from '@/components/organisms/VaccineTable'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { administrationService } from '@/services/api/administrationService'

const Inventory = () => {
  const [vaccineLots, setVaccineLots] = useState([])
  const [filteredLots, setFilteredLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    vaccineFamily: '',
    status: ''
  })

  useEffect(() => {
    loadVaccineLots()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [vaccineLots, filters])

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

  const applyFilters = () => {
    let filtered = [...vaccineLots]

    // Search filter
if (filters.search) {
      filtered = filtered.filter(lot =>
        (lot.commercial_name || lot.commercialName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (lot.generic_name || lot.genericName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (lot.lot_number || lot.lotNumber || '').toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Vaccine family filter
if (filters.vaccineFamily) {
      filtered = filtered.filter(lot => (lot.vaccine_family || lot.vaccineFamily) === filters.vaccineFamily)
    }

    // Status filter
    if (filters.status) {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      
filtered = filtered.filter(lot => {
        const expDate = new Date(lot.expiration_date || lot.expirationDate)
        switch (filters.status) {
          case 'good':
            return expDate > thirtyDaysFromNow
          case 'expiring':
            return expDate <= thirtyDaysFromNow && expDate > now
          case 'expired':
            return expDate <= now
          default:
            return true
        }
      })
    }

    setFilteredLots(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAdministrationChange = async (lotId, doses) => {
    try {
      const lot = vaccineLots.find(l => l.Id === lotId)
      if (!lot) return

if (doses > (lot.quantity_on_hand || lot.quantityOnHand || 0)) {
        toast.error('Cannot administer more doses than available')
        return
      }

// Record administration
      await administrationService.create({
        lot_id: lotId,
        doses,
        date: new Date().toISOString(),
        administered_by: 'Healthcare Staff'
      })

      // Update lot quantity
      const updatedLot = {
        ...lot,
        quantity_on_hand: (lot.quantity_on_hand || lot.quantityOnHand || 0) - doses
      }
      await vaccineLotService.update(lotId, updatedLot)

      // Reload data
      await loadVaccineLots()
      toast.success(`${doses} doses administered successfully`)
    } catch (err) {
      toast.error('Failed to record administration')
    }
  }

const getVaccineFamilyOptions = () => {
    const families = [...new Set(vaccineLots.map(lot => lot.vaccine_family || lot.vaccineFamily))]
    return families.map(family => ({ value: family, label: family }))
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadVaccineLots} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vaccine Inventory</h1>
          <p className="text-slate-600">
            {filteredLots.length} of {vaccineLots.length} vaccine lots
          </p>
        </div>
        <Button
          variant="primary"
          icon="Download"
          onClick={() => toast.info('Export functionality coming soon')}
        >
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Search"
            type="text"
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
            placeholder="Search by name, lot number..."
            icon="Search"
          />
          <FormField
            label="Vaccine Family"
            type="select"
            value={filters.vaccineFamily}
            onChange={(value) => handleFilterChange('vaccineFamily', value)}
            options={getVaccineFamilyOptions()}
            placeholder="All families"
          />
          <FormField
            label="Status"
            type="select"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: 'good', label: 'Good' },
              { value: 'expiring', label: 'Expiring Soon' },
              { value: 'expired', label: 'Expired' }
            ]}
            placeholder="All statuses"
          />
        </div>
      </motion.div>

      {/* Vaccine Table */}
      <VaccineTable
        vaccines={filteredLots}
        showAdministration={true}
        onAdministrationChange={handleAdministrationChange}
      />
    </div>
  )
}

export default Inventory