import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label,
  value = '',
  onChange = () => {},
  options = [],
  placeholder = 'Select an option',
  error = '',
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const selectClasses = `
    w-full px-4 py-2 border rounded-lg text-sm transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 hover:border-slate-400'}
    ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}
    appearance-none cursor-pointer
  `

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <motion.select
          whileFocus={{ scale: 1.01 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Select