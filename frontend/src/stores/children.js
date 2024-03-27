import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const CHILDREN_URL = '/api/children' // Define CHILDREN_URL here

const useChildrenStore = defineStore('children', () => {
  const children = ref()

  const addChild = async (data) => {
    await axios.post(`${CHILDREN_URL}/register`, data)
  }

  const getChildrenProfiles = async (parentId) => {
    const { data } = await axios.get(`${CHILDREN_URL}`, parentId)
    children.value = data || []
  }

  return { children, addChild, getChildrenProfiles }
})

export default useChildrenStore
