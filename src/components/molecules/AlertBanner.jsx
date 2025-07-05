import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const AlertBanner = ({ 
  type = 'warning', 
  title, 
  message, 
  actions = [],
  onDismiss = null,
  className = '' 
}) => {
  const typeClasses = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const iconMap = {
    warning: 'AlertTriangle',
    danger: 'AlertCircle',
    info: 'Info',
    success: 'CheckCircle'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 ${typeClasses[type]} ${className}`}
    >
      <div className="flex items-start gap-3">
        <ApperIcon name={iconMap[type]} className="w-5 h-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
          
          {actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default AlertBanner