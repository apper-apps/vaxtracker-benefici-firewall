import administrationsData from '@/services/mockData/administrations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const administrationService = {
  async getAll() {
    await delay(300)
    return [...administrationsData]
  },

  async getById(id) {
    await delay(200)
    const administration = administrationsData.find(a => a.Id === id)
    if (!administration) throw new Error('Administration record not found')
    return { ...administration }
  },

  async create(administrationData) {
    await delay(400)
    const newId = Math.max(...administrationsData.map(a => a.Id)) + 1
    const newAdministration = {
      Id: newId,
      ...administrationData
    }
    administrationsData.push(newAdministration)
    return { ...newAdministration }
  },

  async update(id, administrationData) {
    await delay(300)
    const index = administrationsData.findIndex(a => a.Id === id)
    if (index === -1) throw new Error('Administration record not found')
    
    administrationsData[index] = { ...administrationsData[index], ...administrationData }
    return { ...administrationsData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = administrationsData.findIndex(a => a.Id === id)
    if (index === -1) throw new Error('Administration record not found')
    
    const deletedAdministration = administrationsData.splice(index, 1)[0]
    return { ...deletedAdministration }
  }
}