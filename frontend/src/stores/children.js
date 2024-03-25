import { defineStore } from 'pinia'
import axios from 'axios'

const CHILDREN_URL = '/api/children' // Define CHILDREN_URL here

export default defineStore('children', {
  state: () => ({
    children: [],
    childInfo: {},
    childId: ''
  }),
  actions: {
    async addChild(data) {
      await axios.post(`${CHILDREN_URL}/register`, data)
    },
    async getChildrenProfiles(parentId) {
      const { data } = await axios.get(`${CHILDREN_URL}`, parentId)
      this.children = data || []
    }
  }
})
