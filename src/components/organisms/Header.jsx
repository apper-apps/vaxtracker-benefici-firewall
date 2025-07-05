import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  
  const getPageTitle = () => {
    const routes = {
      '/': 'Dashboard',
      '/inventory': 'Inventory Management',
      '/receive-vaccines': 'Receive Vaccines',
      '/record-administration': 'Record Administration',
      '/reports': 'Reports',
      '/vaccine-loss': 'Vaccine Loss',
      '/settings': 'Settings'
    }
    return routes[location.pathname] || 'VaxTracker Pro'
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-slate-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <ApperIcon name="Bell" className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header