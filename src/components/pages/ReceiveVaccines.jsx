import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineService } from '@/services/api/vaccineService'
import { vaccineLotService } from '@/services/api/vaccineLotService'

const ReceiveVaccines = () => {
  const navigate = useNavigate()
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    vaccineId: '',
    lotNumber: '',
    expirationDate: '',
    quantitySent: '',
    quantityReceived: '',
    passedInspection: '',
    failedInspection: '',
    discrepancyReason: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadVaccines()
  }, [])

  const loadVaccines = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await vaccineService.getAll()
      setVaccines(data)
    } catch (err) {
      setError('Failed to load vaccines')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-calculate passed/failed inspection
    if (field === 'quantityReceived' || field === 'failedInspection') {
      const received = field === 'quantityReceived' ? parseInt(value) || 0 : parseInt(formData.quantityReceived) || 0
      const failed = field === 'failedInspection' ? parseInt(value) || 0 : parseInt(formData.failedInspection) || 0
      const passed = received - failed
      
      if (field === 'quantityReceived') {
        setFormData(prev => ({ 
          ...prev, 
          quantityReceived: value,
          passedInspection: passed >= 0 ? passed.toString() : '0'
        }))
      } else {
        setFormData(prev => ({ 
          ...prev, 
          failedInspection: value,
          passedInspection: passed >= 0 ? passed.toString() : '0'
        }))
      }
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.vaccineId) errors.vaccineId = 'Vaccine is required'
    if (!formData.lotNumber) errors.lotNumber = 'Lot number is required'
    if (!formData.expirationDate) errors.expirationDate = 'Expiration date is required'
    if (!formData.quantitySent) errors.quantitySent = 'Quantity sent is required'
    if (!formData.quantityReceived) errors.quantityReceived = 'Quantity received is required'
    if (!formData.passedInspection && formData.passedInspection !== '0') errors.passedInspection = 'Passed inspection count is required'
    if (!formData.failedInspection && formData.failedInspection !== '0') errors.failedInspection = 'Failed inspection count is required'
    
    const sent = parseInt(formData.quantitySent) || 0
    const received = parseInt(formData.quantityReceived) || 0
    const passed = parseInt(formData.passedInspection) || 0
    const failed = parseInt(formData.failedInspection) || 0
    
    if (received > sent) {
      errors.quantityReceived = 'Quantity received cannot exceed quantity sent'
    }
    
    if (passed + failed !== received) {
      errors.failedInspection = 'Passed + Failed must equal quantity received'
    }
    
    if (failed > 0 && !formData.discrepancyReason) {
      errors.discrepancyReason = 'Discrepancy reason is required when vaccines fail inspection'
    }

    // Check if expiration date is in the future
    const expDate = new Date(formData.expirationDate)
    const now = new Date()
    if (expDate <= now) {
      errors.expirationDate = 'Expiration date must be in the future'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setSubmitting(true)
      
      const selectedVaccine = vaccines.find(v => v.Id === parseInt(formData.vaccineId))
      
      const newLot = {
        vaccineId: formData.vaccineId,
        commercialName: selectedVaccine.commercialName,
        genericName: selectedVaccine.genericName,
        vaccineFamily: selectedVaccine.vaccineFamily,
        lotNumber: formData.lotNumber,
        expirationDate: formData.expirationDate,
        quantityOnHand: parseInt(formData.passedInspection),
        receivedDate: new Date().toISOString(),
        passedInspection: parseInt(formData.passedInspection),
        failedInspection: parseInt(formData.failedInspection),
        discrepancyReason: formData.discrepancyReason || null
      }

      await vaccineLotService.create(newLot)
      toast.success('Vaccine lot received successfully')
      navigate('/inventory')
    } catch (err) {
      toast.error('Failed to receive vaccine lot')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      vaccineId: '',
      lotNumber: '',
      expirationDate: '',
      quantitySent: '',
      quantityReceived: '',
      passedInspection: '',
      failedInspection: '',
      discrepancyReason: ''
    })
    setFormErrors({})
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadVaccines} />
  }

  const vaccineOptions = vaccines.map(vaccine => ({
    value: vaccine.Id,
    label: `${vaccine.commercialName} (${vaccine.genericName})`
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Receive Vaccines</h1>
          <p className="text-slate-600">Record new vaccine shipment details</p>
        </div>
        <Button
          variant="outline"
          icon="ArrowLeft"
          onClick={() => navigate('/inventory')}
        >
          Back to Inventory
        </Button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Vaccine"
            type="select"
            value={formData.vaccineId}
            onChange={(value) => handleInputChange('vaccineId', value)}
            options={vaccineOptions}
            placeholder="Select vaccine"
            required
            error={formErrors.vaccineId}
          />
          
          <FormField
            label="Lot Number"
            type="text"
            value={formData.lotNumber}
            onChange={(value) => handleInputChange('lotNumber', value)}
            placeholder="Enter lot number"
            required
            error={formErrors.lotNumber}
          />
          
          <FormField
            label="Expiration Date"
            type="date"
            value={formData.expirationDate}
            onChange={(value) => handleInputChange('expirationDate', value)}
            required
            error={formErrors.expirationDate}
          />
          
          <FormField
            label="Quantity Sent"
            type="number"
            value={formData.quantitySent}
            onChange={(value) => handleInputChange('quantitySent', value)}
            placeholder="0"
            required
            error={formErrors.quantitySent}
          />
          
          <FormField
            label="Quantity Received"
            type="number"
            value={formData.quantityReceived}
            onChange={(value) => handleInputChange('quantityReceived', value)}
            placeholder="0"
            required
            error={formErrors.quantityReceived}
          />
          
          <FormField
            label="Doses Passed Inspection"
            type="number"
            value={formData.passedInspection}
            onChange={(value) => handleInputChange('passedInspection', value)}
            placeholder="0"
            required
            error={formErrors.passedInspection}
          />
          
          <FormField
            label="Doses Failed Inspection"
            type="number"
            value={formData.failedInspection}
            onChange={(value) => handleInputChange('failedInspection', value)}
            placeholder="0"
            required
            error={formErrors.failedInspection}
          />
        </div>

        {parseInt(formData.failedInspection) > 0 && (
          <FormField
            label="Discrepancy Reason"
            type="text"
            value={formData.discrepancyReason}
            onChange={(value) => handleInputChange('discrepancyReason', value)}
            placeholder="Describe the reason for failed inspection"
            required
            error={formErrors.discrepancyReason}
          />
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={submitting}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon="Save"
          >
            Receive Vaccines
          </Button>
        </div>
      </motion.form>
    </div>
  )
}

export default ReceiveVaccines