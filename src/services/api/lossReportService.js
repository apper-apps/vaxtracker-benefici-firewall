import lossReportsData from '@/services/mockData/lossReports.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const lossReportService = {
  async getAll() {
    await delay(300)
    return [...lossReportsData]
  },

  async getById(id) {
    await delay(200)
    const report = lossReportsData.find(r => r.Id === id)
    if (!report) throw new Error('Loss report not found')
    return { ...report }
  },

  async create(reportData) {
    await delay(400)
    const newId = Math.max(...lossReportsData.map(r => r.Id)) + 1
    const newReport = {
      Id: newId,
      ...reportData
    }
    lossReportsData.push(newReport)
    return { ...newReport }
  },

  async update(id, reportData) {
    await delay(300)
    const index = lossReportsData.findIndex(r => r.Id === id)
    if (index === -1) throw new Error('Loss report not found')
    
    lossReportsData[index] = { ...lossReportsData[index], ...reportData }
    return { ...lossReportsData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = lossReportsData.findIndex(r => r.Id === id)
    if (index === -1) throw new Error('Loss report not found')
    
    const deletedReport = lossReportsData.splice(index, 1)[0]
    return { ...deletedReport }
  }
}