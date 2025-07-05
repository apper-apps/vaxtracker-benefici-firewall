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

const RecordAdministration = () => {
  const [vaccineLots, setVaccineLots] = useState([])
  const [filteredLots, setFilteredLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [administrationData, setAdministrationData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadVaccineLots()
  }, [])

  useEffect(() => {
    filterVaccines()
  }, [vaccineLots, searchTerm])

  const loadVaccineLots = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await vaccineLotService.getAll()
      // Only show lots with available doses
const availableLots = data.filter(lot => (lot.quantity_on_hand || lot.quantityOnHand || 0) > 0)
      setVaccineLots(availableLots)
    } catch (err) {
      setError('Failed to load vaccine lots')
    } finally {
      setLoading(false)
    }
  }

  const filterVaccines = () => {
    if (!searchTerm) {
      setFilteredLots(vaccineLots)
      return
    }

const filtered = vaccineLots.filter(lot =>
      (lot.commercial_name || lot.commercialName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lot.generic_name || lot.genericName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lot.lot_number || lot.lotNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLots(filtered)
  }

  const handleAdministrationChange = (lotId, doses) => {
    setAdministrationData(prev => ({
      ...prev,
      [lotId]: parseInt(doses) || 0
    }))
  }

  const handleSaveAdministration = async () => {
    const administrations = Object.entries(administrationData)
      .filter(([_, doses]) => doses > 0)
      .map(([lotId, doses]) => ({ lotId: parseInt(lotId), doses }))

    if (administrations.length === 0) {
      toast.error('Please enter at least one administration record')
      return
    }

    // Validate doses don't exceed available quantity
    const errors = []
for (const { lotId, doses } of administrations) {
      const lot = vaccineLots.find(l => l.Id === lotId)
      if (lot && doses > (lot.quantity_on_hand || lot.quantityOnHand || 0)) {
        errors.push(`Cannot administer ${doses} doses of ${lot.commercial_name || lot.commercialName} (${lot.lot_number || lot.lotNumber}) - only ${lot.quantity_on_hand || lot.quantityOnHand || 0} available`)
      }
    }

    if (errors.length > 0) {
      toast.error(errors.join('\n'))
      return
    }

    try {
      setSubmitting(true)
      let totalDoses = 0

      for (const { lotId, doses } of administrations) {
        const lot = vaccineLots.find(l => l.Id === lotId)
        
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
        
        totalDoses += doses
      }

      toast.success(`Successfully recorded ${totalDoses} administered doses`)
      setAdministrationData({})
      await loadVaccineLots()
    } catch (err) {
      toast.error('Failed to record administration')
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalDoses = () => {
    return Object.values(administrationData).reduce((sum, doses) => sum + (doses || 0), 0)
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
          <h1 className="text-2xl font-bold text-slate-900">Record Administration</h1>
          <p className="text-slate-600">
            Enter administered doses for each vaccine lot
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            Total Doses: <span className="font-semibold text-slate-900">{getTotalDoses()}</span>
          </div>
          <Button
            variant="primary"
            icon="Save"
            onClick={handleSaveAdministration}
            loading={submitting}
            disabled={getTotalDoses() === 0}
          >
            Save Administration
          </Button>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <FormField
          label="Search Vaccines"
          type="text"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by vaccine name or lot number..."
          icon="Search"
        />
      </motion.div>

      {/* Administration Table */}
      <VaccineTable
        vaccines={filteredLots}
        showAdministration={true}
        onAdministrationChange={handleAdministrationChange}
      />

      {filteredLots.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-slate-500">No vaccine lots available for administration</p>
        </div>
      )}
    </div>
  )
}

export default RecordAdministration