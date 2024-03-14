import { defineStore } from 'pinia'
import axios from 'axios'

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}

const USERS_URL = '/api/users'

export default defineStore('user', {
  state: () => ({
    initialState,
    userInfo: initialState.userInfo,
    userLoggedIn: initialState.userInfo !== null
  }),
  actions: {
    async register(values) {
      await axios.post(`${USERS_URL}`, values)
      this.userLoggedIn = true
    },
    async login(values) {
      const { data } = await axios.post(`${USERS_URL}/auth`, values)
      this.userInfo = data
      this.userLoggedIn = true
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    async updateUserProfile(values) {
      const { data } = await axios.put(`${USERS_URL}/profile`, values)
      this.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    async logout() {
      localStorage.removeItem('userInfo')
      this.userLoggedIn = false
    }
  }
})
