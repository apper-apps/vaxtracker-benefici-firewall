import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { lossReportService } from '@/services/api/lossReportService'

const VaccineLoss = () => {
  const [vaccineLots, setVaccineLots] = useState([])
  const [lossReports, setLossReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    lotId: '',
    quantity: '',
    reason: '',
    details: '',
    trainingCompleted: false
  })
  const [formErrors, setFormErrors] = useState({})

  const lossReasons = [
    { value: 'expired', label: 'Expired' },
    { value: 'damaged', label: 'Damaged in Transit' },
    { value: 'temperature', label: 'Temperature Excursion' },
    { value: 'broken_vial', label: 'Broken Vial' },
    { value: 'contamination', label: 'Contamination' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [lotsData, reportsData] = await Promise.all([
        vaccineLotService.getAll(),
        lossReportService.getAll()
      ])
      setVaccineLots(lotsData.filter(lot => lot.quantityOnHand > 0))
      setLossReports(reportsData)
    } catch (err) {
      setError('Failed to load data')
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
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.lotId) errors.lotId = 'Vaccine lot is required'
    if (!formData.quantity) errors.quantity = 'Quantity is required'
    if (!formData.reason) errors.reason = 'Loss reason is required'
    if (!formData.details) errors.details = 'Details are required'
    if (!formData.trainingCompleted) errors.trainingCompleted = 'Training completion confirmation is required'
    
    const quantity = parseInt(formData.quantity) || 0
    if (quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0'
    }
    
    if (formData.lotId) {
      const selectedLot = vaccineLots.find(lot => lot.Id === parseInt(formData.lotId))
      if (selectedLot && quantity > selectedLot.quantityOnHand) {
        errors.quantity = `Quantity cannot exceed available doses (${selectedLot.quantityOnHand})`
      }
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
      
      const selectedLot = vaccineLots.find(lot => lot.Id === parseInt(formData.lotId))
      const lossQuantity = parseInt(formData.quantity)
      
      // Create loss report
      await lossReportService.create({
        lotId: parseInt(formData.lotId),
        quantity: lossQuantity,
        reason: formData.reason,
        details: formData.details,
        trainingCompleted: formData.trainingCompleted,
        date: new Date().toISOString()
      })

      // Update vaccine lot quantity
      const updatedLot = {
        ...selectedLot,
        quantityOnHand: selectedLot.quantityOnHand - lossQuantity
      }
      await vaccineLotService.update(parseInt(formData.lotId), updatedLot)

      toast.success('Vaccine loss recorded successfully')
      
      // Reset form
      setFormData({
        lotId: '',
        quantity: '',
        reason: '',
        details: '',
        trainingCompleted: false
      })
      
      // Reload data
      await loadData()
    } catch (err) {
      toast.error('Failed to record vaccine loss')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  const vaccineOptions = vaccineLots.map(lot => ({
    value: lot.Id,
    label: `${lot.commercialName} - ${lot.lotNumber} (${lot.quantityOnHand} doses)`
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vaccine Loss Reporting</h1>
        <p className="text-slate-600">Report vaccine wastage or loss by lot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Report Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Loss</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Vaccine Lot"
              type="select"
              value={formData.lotId}
              onChange={(value) => handleInputChange('lotId', value)}
              options={vaccineOptions}
              placeholder="Select vaccine lot"
              required
              error={formErrors.lotId}
            />

            <FormField
              label="Quantity Lost"
              type="number"
              value={formData.quantity}
              onChange={(value) => handleInputChange('quantity', value)}
              placeholder="Enter number of doses lost"
              required
              error={formErrors.quantity}
            />

            <FormField
              label="Loss Reason"
              type="select"
              value={formData.reason}
              onChange={(value) => handleInputChange('reason', value)}
              options={lossReasons}
              placeholder="Select reason for loss"
              required
              error={formErrors.reason}
            />

            <FormField
              label="Details"
              type="text"
              value={formData.details}
              onChange={(value) => handleInputChange('details', value)}
              placeholder="Provide detailed explanation"
              required
              error={formErrors.details}
            />

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.trainingCompleted}
                  onChange={(e) => handleInputChange('trainingCompleted', e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-700">
                  I have completed the mandatory loss prevention training
                </span>
              </label>
              {formErrors.trainingCompleted && (
                <p className="text-sm text-red-600">{formErrors.trainingCompleted}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon="Save"
              className="w-full"
            >
              Record Loss
            </Button>
          </form>
        </motion.div>

        {/* Recent Loss Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Loss Reports</h2>
          
          <div className="space-y-4">
            {lossReports.slice(0, 5).map((report) => {
              const lot = vaccineLots.find(l => l.Id === report.lotId)
              return (
                <div key={report.Id} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">
                        {lot ? `${lot.commercialName} - ${lot.lotNumber}` : 'Unknown Lot'}
                      </p>
                      <p className="text-sm text-slate-600">
                        {report.quantity} doses - {report.reason}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {lossReports.length === 0 && (
              <p className="text-slate-500 text-center py-4">No loss reports recorded</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VaccineLoss