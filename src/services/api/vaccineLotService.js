import { toast } from 'react-toastify'

export const vaccineLotService = {
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
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "vaccine_family" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "received_date" } },
          { field: { Name: "passed_inspection" } },
          { field: { Name: "failed_inspection" } },
          { field: { Name: "discrepancy_reason" } },
          { field: { Name: "administered_doses" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('vaccine_lot', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching vaccine lots:', error)
      toast.error('Failed to fetch vaccine lots')
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
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "vaccine_family" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "received_date" } },
          { field: { Name: "passed_inspection" } },
          { field: { Name: "failed_inspection" } },
          { field: { Name: "discrepancy_reason" } },
          { field: { Name: "administered_doses" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      }
      
      const response = await apperClient.getRecordById('vaccine_lot', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching vaccine lot with ID ${id}:`, error)
      toast.error('Failed to fetch vaccine lot')
      return null
    }
  },

  async create(lotData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const updateableData = {
        Name: lotData.Name || lotData.name || `${lotData.commercial_name || lotData.commercialName} - ${lotData.lot_number || lotData.lotNumber}`,
        Tags: lotData.Tags || lotData.tags || '',
        Owner: lotData.Owner || lotData.owner,
        commercial_name: lotData.commercial_name || lotData.commercialName,
        generic_name: lotData.generic_name || lotData.genericName,
        vaccine_family: lotData.vaccine_family || lotData.vaccineFamily,
        lot_number: lotData.lot_number || lotData.lotNumber,
        expiration_date: lotData.expiration_date || lotData.expirationDate,
        quantity_on_hand: lotData.quantity_on_hand || lotData.quantityOnHand || 0,
        received_date: lotData.received_date || lotData.receivedDate || new Date().toISOString(),
        passed_inspection: lotData.passed_inspection || lotData.passedInspection || 0,
        failed_inspection: lotData.failed_inspection || lotData.failedInspection || 0,
        discrepancy_reason: lotData.discrepancy_reason || lotData.discrepancyReason || '',
        administered_doses: lotData.administered_doses || lotData.administeredDoses || 0,
        vaccine_id: lotData.vaccine_id || lotData.vaccineId
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await apperClient.createRecord('vaccine_lot', params)
      
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
          toast.success('Vaccine lot created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating vaccine lot:', error)
      toast.error('Failed to create vaccine lot')
      return null
    }
  },

  async update(id, lotData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: lotData.Name || lotData.name,
        Tags: lotData.Tags || lotData.tags || '',
        Owner: lotData.Owner || lotData.owner,
        commercial_name: lotData.commercial_name || lotData.commercialName,
        generic_name: lotData.generic_name || lotData.genericName,
        vaccine_family: lotData.vaccine_family || lotData.vaccineFamily,
        lot_number: lotData.lot_number || lotData.lotNumber,
        expiration_date: lotData.expiration_date || lotData.expirationDate,
        quantity_on_hand: lotData.quantity_on_hand !== undefined ? lotData.quantity_on_hand : lotData.quantityOnHand,
        received_date: lotData.received_date || lotData.receivedDate,
        passed_inspection: lotData.passed_inspection !== undefined ? lotData.passed_inspection : lotData.passedInspection,
        failed_inspection: lotData.failed_inspection !== undefined ? lotData.failed_inspection : lotData.failedInspection,
        discrepancy_reason: lotData.discrepancy_reason || lotData.discrepancyReason || '',
        administered_doses: lotData.administered_doses !== undefined ? lotData.administered_doses : lotData.administeredDoses,
        vaccine_id: lotData.vaccine_id || lotData.vaccineId
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await apperClient.updateRecord('vaccine_lot', params)
      
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
          toast.success('Vaccine lot updated successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating vaccine lot:', error)
      toast.error('Failed to update vaccine lot')
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
      
      const response = await apperClient.deleteRecord('vaccine_lot', params)
      
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
          toast.success('Vaccine lot deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting vaccine lot:', error)
      toast.error('Failed to delete vaccine lot')
      return false
    }
  }
}