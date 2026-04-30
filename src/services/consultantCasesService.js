import api from './api.js'

export default {
  async getAll() {
    try {
      const response = await api.get('/api/consultant-cases')
      return response.data.data
    } catch (error) {
      console.error('Error fetching consultant cases:', error)
      return []
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/consultant-cases/${id}`)
      return response.data.data
    } catch (error) {
      return null
    }
  },

  async create(caseData) {
    try {
      const response = await api.post('/api/consultant-cases', caseData)
      return response.data.data
    } catch (error) {
      console.error('Error creating consultant case:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/api/consultant-cases/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Error updating consultant case:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await api.delete(`/api/consultant-cases/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting consultant case:', error)
      throw error
    }
  }
}