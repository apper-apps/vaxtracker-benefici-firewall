import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction = null,
  icon = "Package"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty