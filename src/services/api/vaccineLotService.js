import vaccineLotsData from '@/services/mockData/vaccineLots.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const vaccineLotService = {
  async getAll() {
    await delay(300)
    return [...vaccineLotsData]
  },

  async getById(id) {
    await delay(200)
    const lot = vaccineLotsData.find(l => l.Id === id)
    if (!lot) throw new Error('Vaccine lot not found')
    return { ...lot }
  },

  async create(lotData) {
    await delay(400)
    const newId = Math.max(...vaccineLotsData.map(l => l.Id)) + 1
    const newLot = {
      Id: newId,
      ...lotData
    }
    vaccineLotsData.push(newLot)
    return { ...newLot }
  },

  async update(id, lotData) {
    await delay(300)
    const index = vaccineLotsData.findIndex(l => l.Id === id)
    if (index === -1) throw new Error('Vaccine lot not found')
    
    vaccineLotsData[index] = { ...vaccineLotsData[index], ...lotData }
    return { ...vaccineLotsData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = vaccineLotsData.findIndex(l => l.Id === id)
    if (index === -1) throw new Error('Vaccine lot not found')
    
    const deletedLot = vaccineLotsData.splice(index, 1)[0]
    return { ...deletedLot }
  }
}