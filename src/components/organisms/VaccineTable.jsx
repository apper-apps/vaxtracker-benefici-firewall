import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'

const VaccineTable = ({ 
  vaccines = [], 
  loading = false, 
  onAdministrationChange = () => {},
  showAdministration = false,
  sortable = true 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [administrationData, setAdministrationData] = useState({})

  const sortedVaccines = useMemo(() => {
    if (!sortConfig.key) return vaccines
    
    return [...vaccines].sort((a, b) => {
let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]
      
      if (sortConfig.key === 'expiration_date' || sortConfig.key === 'expirationDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [vaccines, sortConfig])

  const handleSort = (key) => {
    if (!sortable) return
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleAdministrationChange = (lotId, value) => {
    const numValue = parseInt(value) || 0
    setAdministrationData(prev => ({
      ...prev,
      [lotId]: numValue
    }))
    onAdministrationChange(lotId, numValue)
  }

  const getExpirationStatus = (expirationDate) => {
    const now = new Date()
    const expDate = new Date(expirationDate)
    const thirtyDaysFromNow = addDays(now, 30)
    
    if (isBefore(expDate, now)) {
      return { status: 'expired', variant: 'danger', label: 'Expired' }
    } else if (isBefore(expDate, thirtyDaysFromNow)) {
      return { status: 'expiring', variant: 'warning', label: 'Expiring Soon' }
    } else {
      return { status: 'good', variant: 'success', label: 'Good' }
    }
  }

  const SortableHeader = ({ label, sortKey, className = '' }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-slate-100' : ''} ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortable && sortConfig.key === sortKey && (
          <ApperIcon 
            name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
            className="w-4 h-4" 
          />
        )}
      </div>
    </th>
  )

  if (loading) {
    return <Loading type="table" />
  }

  if (vaccines.length === 0) {
    return (
      <Empty
        title="No vaccines found"
        description="No vaccine inventory data available"
        icon="Package"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
<SortableHeader label="Vaccine Name" sortKey="commercial_name" />
              <SortableHeader label="Generic Name" sortKey="generic_name" />
              <SortableHeader label="Lot Number" sortKey="lot_number" />
              <SortableHeader label="Expiration Date" sortKey="expiration_date" />
              <SortableHeader label="Quantity on Hand" sortKey="quantity_on_hand" />
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              {showAdministration && (
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Administered Doses
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedVaccines.map((vaccine, index) => {
              const expirationStatus = getExpirationStatus(vaccine.expiration_date || vaccine.expirationDate)
              
              return (
                <motion.tr
                  key={vaccine.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {vaccine.commercial_name || vaccine.commercialName}
                    </div>
                    <div className="text-sm text-slate-500">
                      {vaccine.vaccine_family || vaccine.vaccineFamily}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {vaccine.generic_name || vaccine.genericName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {vaccine.lot_number || vaccine.lotNumber}
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {format(new Date(vaccine.expiration_date || vaccine.expirationDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {vaccine.quantity_on_hand || vaccine.quantityOnHand}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={expirationStatus.variant}>
                      {expirationStatus.label}
                    </Badge>
                  </td>
                  {showAdministration && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max={vaccine.quantity_on_hand || vaccine.quantityOnHand}
                        value={administrationData[vaccine.Id] || ''}
                        onChange={(e) => handleAdministrationChange(vaccine.Id, e.target.value)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                  )}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default VaccineTable