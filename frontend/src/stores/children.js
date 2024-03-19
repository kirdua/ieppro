import { defineStore } from 'pinia'
import axios from 'axios'

const CHLDREN_URL = '/api/children'

export default defineStore('children', {
  state: () => ({
    children: [],
    childInfo: {}
  }),
  actions: {
    async addChild(data) {
      await axios.post(`${CHILDREN_URL}/register`, data)
    }
  }
})
