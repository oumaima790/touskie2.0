import api from './api.js'

export default {
  async getAll() {
    try {
      const response = await api.get('/api/consultants')
      return response.data.data
    } catch (error) {
      console.error('Error fetching consultants:', error)
      return []
    }
  },
  async add(consultant) {
    try {
      const response = await api.post('/api/consultants', consultant)
      return response.data.data
    } catch (error) {
      console.error('Error adding consultant:', error)
      throw error
    }
  },
  async create(consultant) { return this.add(consultant) },
  async delete(id) {
    try {
      await api.delete(`/api/consultants/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting consultant:', error)
      throw error
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/api/consultants/${id}`)
      return response.data.data
    } catch (error) {
      return null
    }
  },
  async update(id, data) {
    try {
      const response = await api.put(`/api/consultants/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}