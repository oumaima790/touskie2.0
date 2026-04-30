import api from './api.js'

export default {
  async getAll() {
    try {
      const response = await api.get('/api/transactions')
      return response.data.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  },
  async add(transaction) {
    try {
      const response = await api.post('/api/transactions', transaction)
      return response.data.data
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },
  async create(transaction) { return this.add(transaction) },
  async delete(id) {
    try {
      await api.delete(`/api/transactions/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/api/transactions/${id}`)
      return response.data.data
    } catch (error) {
      return null
    }
  },
  async update(id, data) {
    try {
      const response = await api.put(`/api/transactions/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}