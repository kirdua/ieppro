// Styles
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/util/colors'
import 'vuetify/styles'

const iepproTheme = {
  dark: false,
  colors: {
    primary: '#008080', // Teal (Main Theme)
    secondary: '#66A182', // Soft Green
    accent: '#FF8C42', // Warm Orange
    background: '#D4D4D4',
    surface: '#FFFFFF',
    text: '#333333',

    // Status Colors
    scheduled: '#007BFF', // Blue
    confirmed: '#28A745', // Green
    rescheduled: '#FFA500', // Orange
    canceled: '#DC3545', // Red
    completed: '#6F42C1', // Purple

    pending: '#FFA500', // Orange
    paid: '#28A745', // Green
    failed: '#DC3545', // Red
    refunded: '#007BFF', // Blue

    healthy: '#28A745', // Green
    underTreatment: '#FFA500', // Orange
    critical: '#DC3545', // Red
    recovering: '#007BFF', // Blue
    deceased: '#212529', // Black

    newRecord: '#007BFF', // Blue
    reviewed: '#28A745', // Green
    requiresAction: '#FFA500', // Orange
    archived: '#F8F9FA', // Light Gray

    activePrescription: '#28A745', // Green
    completedPrescription: '#007BFF', // Blue
    expiredPrescription: '#FFA500', // Orange
    stoppedPrescription: '#DC3545', // Red

    available: '#28A745', // Green
    busy: '#FFA500', // Orange
    offline: '#6C757D', // Gray
    onLeave: '#DC3545' // Red
  }
}

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'iepproTheme',
    themes: {
      iepproTheme
    },
    options: {
      customProperties: true
    },
    typography: {
      fontFamily: 'Poppins, Roboto, sans-serif'
    }
  }
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
