// src/plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar' // 👈 labs import

const iepproTheme = {
  dark: false,
  colors: {
    primary: '#385F73',
    secondary: '#66A182',
    accent: '#FF8C42',
    background: '#D4D4D4',
    surface: '#FFFFFF',
    text: '#333333',
    scheduled: '#007BFF',
    confirmed: '#28A745',
    rescheduled: '#FFA500',
    canceled: '#DC3545',
    completed: '#6F42C1',
    pending: '#FFA500',
    paid: '#28A745',
    failed: '#DC3545',
    refunded: '#007BFF',
    healthy: '#28A745',
    underTreatment: '#FFA500',
    critical: '#DC3545',
    recovering: '#007BFF',
    deceased: '#212529',
    newRecord: '#007BFF',
    reviewed: '#28A745',
    requiresAction: '#FFA500',
    archived: '#F8F9FA',
    activePrescription: '#28A745',
    completedPrescription: '#007BFF',
    expiredPrescription: '#FFA500',
    stoppedPrescription: '#DC3545',
    available: '#28A745',
    busy: '#FFA500',
    offline: '#6C757D',
    onLeave: '#DC3545'
  }
}

export default createVuetify({
  components: { VCalendar },

  theme: {
    defaultTheme: 'iepproTheme',
    themes: { iepproTheme }
  }
})
