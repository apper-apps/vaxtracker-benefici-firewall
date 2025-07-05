import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend = null, 
  color = 'primary',
  loading = false,
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary to-accent text-white',
    success: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
    info: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    neutral: 'bg-white text-slate-800 border border-slate-200'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div className="w-16 h-6 bg-slate-200 rounded"></div>
        </div>
        <div className="w-20 h-8 bg-slate-200 rounded mb-2"></div>
        <div className="w-32 h-4 bg-slate-200 rounded"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`${colorClasses[color]} rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.direction === 'up' ? 'text-green-100' : 'text-red-100'}`}>
            <ApperIcon name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} className="w-4 h-4" />
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold mb-2">
        {value}
      </div>
      
      <div className="text-sm opacity-90">
        {title}
      </div>
    </motion.div>
  )
}

export default MetricCard