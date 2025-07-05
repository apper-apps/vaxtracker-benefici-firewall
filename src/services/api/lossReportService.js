import { toast } from 'react-toastify'

export const lossReportService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "lot_id" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "details" } },
          { field: { Name: "training_completed" } },
          { field: { Name: "date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('loss_report', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching loss reports:', error)
      toast.error('Failed to fetch loss reports')
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "lot_id" } },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "details" } },
          { field: { Name: "training_completed" } },
          { field: { Name: "date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      }
      
      const response = await apperClient.getRecordById('loss_report', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching loss report with ID ${id}:`, error)
      toast.error('Failed to fetch loss report')
      return null
    }
  },

  async create(reportData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const updateableData = {
        Name: reportData.Name || reportData.name || `Loss Report - ${new Date().toLocaleDateString()}`,
        Tags: reportData.Tags || reportData.tags || '',
        Owner: reportData.Owner || reportData.owner,
        lot_id: reportData.lot_id || reportData.lotId,
        quantity: reportData.quantity,
        reason: reportData.reason,
        details: reportData.details,
        training_completed: reportData.training_completed !== undefined ? (reportData.training_completed ? 'yes' : 'no') : (reportData.trainingCompleted ? 'yes' : 'no'),
        date: reportData.date || new Date().toISOString()
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await apperClient.createRecord('loss_report', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Loss report created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating loss report:', error)
      toast.error('Failed to create loss report')
      return null
    }
  },

  async update(id, reportData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: reportData.Name || reportData.name,
        Tags: reportData.Tags || reportData.tags || '',
        Owner: reportData.Owner || reportData.owner,
        lot_id: reportData.lot_id || reportData.lotId,
        quantity: reportData.quantity,
        reason: reportData.reason,
        details: reportData.details,
        training_completed: reportData.training_completed !== undefined ? (reportData.training_completed ? 'yes' : 'no') : (reportData.trainingCompleted ? 'yes' : 'no'),
        date: reportData.date
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await apperClient.updateRecord('loss_report', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Loss report updated successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating loss report:', error)
      toast.error('Failed to update loss report')
      return null
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('loss_report', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Loss report deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting loss report:', error)
      toast.error('Failed to delete loss report')
      return false
    }
  }
}