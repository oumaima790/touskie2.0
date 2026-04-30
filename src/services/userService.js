import api from './api.js'

export default {
  async getAll() {
    try {
      const response = await api.get('/api/users')
      return response.data.data
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  },
  async fetchAllUsers() { return this.getAll() },
  async getAllUsers() { return this.getAll() },
  async delete(id) {
    try {
      await api.delete(`/api/users/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/api/users/${id}`)
      return response.data.data
    } catch (error) {
      return null
    }
  },
  async getUserById(id) { return this.getById(id) },
  async update(id, data) {
    try {
      const response = await api.put(`/api/users/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async register(userData) {
    try {
      const response = await api.post('/api/auth/signup', userData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}