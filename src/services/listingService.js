import api from './api.js'

export default {
  async getAll() {
    try {
      const response = await api.get('/api/listings/')
      return response.data
    } catch (error) {
      console.error('Error fetching listings:', error)
      return []
    }
  },

  async add(listing) {
    try {
      const response = await api.post('/api/listings/', listing)
      return response.data.data
    } catch (error) {
      console.error('Error adding listing:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await api.delete(`/listings/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting listing:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/listings/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching listing:', error)
      return null
    }
  },

  async update(id, listingData) {
    try {
      const response = await api.put(`/listings/${id}`, listingData)
      return response.data.data
    } catch (error) {
      console.error('Error updating listing:', error)
      throw error
    }
  }
};