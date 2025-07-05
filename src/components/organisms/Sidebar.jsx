import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ onClose = null }) => {
  const navigation = [
    { name: 'Dashboard', to: '/', icon: 'BarChart3' },
    { name: 'Inventory', to: '/inventory', icon: 'Package' },
    { name: 'Receive Vaccines', to: '/receive-vaccines', icon: 'PackagePlus' },
    { name: 'Record Administration', to: '/record-administration', icon: 'Syringe' },
    { name: 'Reports', to: '/reports', icon: 'FileText' },
    { name: 'Vaccine Loss', to: '/vaccine-loss', icon: 'AlertTriangle' },
    { name: 'Settings', to: '/settings', icon: 'Settings' },
  ]

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">VaxTracker</h1>
            <p className="text-xs text-slate-500">Pro</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 w-full"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.name}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Healthcare Staff</p>
            <p className="text-xs text-slate-500">Vaccine Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar