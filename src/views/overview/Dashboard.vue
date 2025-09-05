<script setup>
const quickLinks = [
  { to: { path: '/children' }, icon: 'mdi-account-school-outline', label: 'Child Profile' },
  { to: { path: '/goals' }, icon: 'mdi-bullseye-arrow', label: 'Goals' },
  { to: { path: '/scheduled-services' }, icon: 'mdi-hand-heart', label: 'Services' },
  { to: { path: '/notes' }, icon: 'mdi-note-text-outline', label: 'Notes' }
]

const featureCards = [
  {
    title: 'Child Profile',
    icon: 'mdi-account-school-outline',
    desc: 'View demographics, diagnoses, grade level, and key context to personalize support.',
    to: { path: '/children' }
  },
  {
    title: 'Goals',
    icon: 'mdi-bullseye-arrow',
    desc: 'Track measurable annual goals and short-term objectives by area and grade level.',
    to: { path: '/goals' }
  },
  {
    title: 'Services',
    icon: 'mdi-hand-heart',
    desc: 'Review scheduled services, providers, and minutes to ensure support is delivered.',
    to: { path: '/scheduled-services' }
  },
  {
    title: 'Notes',
    icon: 'mdi-note-text-outline',
    desc: 'Capture and review meeting notes, decisions, and updates linked to student progress.',
    to: { path: '/notes' }
  }
]
</script>

<template>
  <v-container class="py-8">
    <!-- Intro Card -->
    <v-card class="mb-6 rounded-2xl intro-card" elevation="6">
      <v-card-text class="text-body-1 text-high-emphasis">
        Welcome to the IEPPro Dashboard — your central hub for managing a student’s Individualized
        Education Plan (IEP). From here, you can view the child’s profile, track progress toward
        goals, review or update scheduled services, and capture important meeting notes.
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          v-for="link in quickLinks"
          :key="link.label"
          :to="link.to"
          color="primary"
          variant="flat"
          density="comfortable"
          elevation="6"
          class="rounded-l p-4 text-none font-weight-medium"
        >
          <v-icon start :icon="link.icon" />
          {{ link.label }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Feature Grid -->
    <v-row dense>
      <v-col v-for="card in featureCards" :key="card.title" cols="12" md="3">
        <v-card class="h-100 rounded-2xl feature-card" elevation="6">
          <v-card-title class="d-flex align-center gap-2 text-primary font-weight-semibold">
            <v-icon :icon="card.icon" color="primary" />
            {{ card.title }}
          </v-card-title>
          <v-card-text class="text-body-2 text-high-emphasis">
            {{ card.desc }}
          </v-card-text>
          <v-card-actions class="d-flex justify-end px-4 pb-4">
            <v-btn
              variant="text"
              color="primary"
              :to="card.to"
              class="d-flex justify-end font-weight-medium"
            >
              Open
              <v-icon end icon="mdi-arrow-right" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.intro-card {
  background: #fff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
}

.feature-card {
  background: #fff;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}
.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.v-btn {
  text-transform: none; /* keep labels clean */
}
</style>
