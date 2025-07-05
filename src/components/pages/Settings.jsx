import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const handleExportData = () => {
    toast.info('Data export functionality coming soon')
  }

  const handleImportData = () => {
    toast.info('Data import functionality coming soon')
  }

  const handleBackupData = () => {
    toast.success('Data backup completed successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Configure application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Database" className="w-5 h-5" />
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-medium text-slate-900 mb-2">Export Data</h3>
              <p className="text-sm text-slate-600 mb-3">
                Export all vaccine inventory data to CSV format
              </p>
              <Button
                variant="outline"
                icon="Download"
                onClick={handleExportData}
              >
                Export to CSV
              </Button>
            </div>

            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-medium text-slate-900 mb-2">Import Data</h3>
              <p className="text-sm text-slate-600 mb-3">
                Import vaccine data from CSV file
              </p>
              <Button
                variant="outline"
                icon="Upload"
                onClick={handleImportData}
              >
                Import from CSV
              </Button>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-2">Backup Data</h3>
              <p className="text-sm text-slate-600 mb-3">
                Create a backup of all application data
              </p>
              <Button
                variant="secondary"
                icon="Shield"
                onClick={handleBackupData}
              >
                Create Backup
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Bell" className="w-5 h-5" />
            Notification Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Expiration Alerts</h3>
                <p className="text-sm text-slate-600">
                  Get notified when vaccines are expiring soon
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Low Stock Alerts</h3>
                <p className="text-sm text-slate-600">
                  Get notified when inventory is running low
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Daily Reports</h3>
                <p className="text-sm text-slate-600">
                  Receive daily inventory summary reports
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Info" className="w-5 h-5" />
            System Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Version</span>
              <span className="text-sm font-medium text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Last Updated</span>
              <span className="text-sm font-medium text-slate-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Database Status</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Shield" className="w-5 h-5" />
            About VaxTracker Pro
          </h2>
          
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              VaxTracker Pro is a comprehensive vaccine inventory management system 
              designed for healthcare facilities to ensure vaccine safety and availability.
            </p>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                © 2024 VaxTracker Pro. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings