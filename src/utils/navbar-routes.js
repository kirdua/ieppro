// /src/utils/navbar-routes.js
const isProd = import.meta.env.PROD

const routes = [
  {
    title: 'Overview',
    value: 'overview',
    icon: 'mdi-home-city',
    route: '/'
  },
  {
    title: 'Children Profiles',
    value: 'children',
    icon: 'mdi-account-school-outline',
    route: 'children'
  },
  {
    title: 'Goals',
    value: 'goals',
    icon: 'mdi-bullseye-arrow',
    route: 'goals'
  },
  {
    title: 'Scheduled Services',
    value: 'scheduled-services',
    icon: 'mdi-hand-heart',
    route: 'scheduled-services'
  },
  {
    title: 'Notes',
    value: 'notes',
    icon: 'mdi-note-text-outline',
    route: 'notes'
  },
  {
    title: 'Class Schedule',
    value: 'class-schedule',
    icon: 'mdi-calendar-clock',
    route: 'class-schedule',
    devOnly: true
  }
]

export default routes.filter((r) => !(isProd && r.devOnly))
