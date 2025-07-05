import vaccinesData from '@/services/mockData/vaccines.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const vaccineService = {
  async getAll() {
    await delay(300)
    return [...vaccinesData]
  },

  async getById(id) {
    await delay(200)
    const vaccine = vaccinesData.find(v => v.Id === id)
    if (!vaccine) throw new Error('Vaccine not found')
    return { ...vaccine }
  },

  async create(vaccineData) {
    await delay(400)
    const newId = Math.max(...vaccinesData.map(v => v.Id)) + 1
    const newVaccine = {
      Id: newId,
      ...vaccineData,
      currentStock: 0
    }
    vaccinesData.push(newVaccine)
    return { ...newVaccine }
  },

  async update(id, vaccineData) {
    await delay(300)
    const index = vaccinesData.findIndex(v => v.Id === id)
    if (index === -1) throw new Error('Vaccine not found')
    
    vaccinesData[index] = { ...vaccinesData[index], ...vaccineData }
    return { ...vaccinesData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = vaccinesData.findIndex(v => v.Id === id)
    if (index === -1) throw new Error('Vaccine not found')
    
    const deletedVaccine = vaccinesData.splice(index, 1)[0]
    return { ...deletedVaccine }
  }
}