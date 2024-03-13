import { defineStore } from 'pinia'

export default defineStore('app', {
  state: () => ({
    showNavDrawer: false
  }),
  actions: {
    toggleNavDrawer() {
      this.showNavDrawer = !this.showNavDrawerå
    }
  }
})
