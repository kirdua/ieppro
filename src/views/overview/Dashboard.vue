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

<!-- keep your <script setup> as-is -->

<template>
  <v-container class="py-10">
    <!-- Header / Intro -->
    <v-sheet class="header-hero rounded-2xl mb-8" border="thin" elevation="6">
      <div class="hero-inner">
        <div class="hero-text">
          <h2 class="hero-title text-primary">IEPPro Dashboard</h2>
          <p class="hero-subtitle text-high-emphasis text-primary">
            Your central hub for managing a student’s IEP—view profiles, track goals, monitor
            services, and capture meeting notes.
          </p>
        </div>

        <div class="hero-actions d-flex flex-wrap gap-3 justify-center align-end">
          <v-btn
            v-for="link in quickLinks"
            :key="link.label"
            :to="link.to"
            color="primary"
            variant="flat"
            class="mx-1"
            density="comfortable"
          >
            <v-icon start :icon="link.icon" />
            {{ link.label }}
          </v-btn>
        </div>
      </div>
    </v-sheet>

    <!-- Feature Grid -->
    <v-row dense>
      <v-col v-for="card in featureCards" :key="card.title" cols="12" sm="6" md="3">
        <v-card class="h-100 rounded-2xl card-pro text-primary" elevation="6">
          <!-- stronger shadow -->
          <v-card-item class="pb-0">
            <template #prepend>
              <v-avatar size="36" class="avatar-solid text-primary">
                <!-- solid, not translucent -->
                <v-icon :icon="card.icon" />
              </v-avatar>
            </template>
            <v-card-title class="text-h6 text-high-emphasis text-primary">{{
              card.title
            }}</v-card-title>
          </v-card-item>

          <v-divider class="pro-divider my-2" />

          <v-card-text class="text-body-2 text-high-emphasis text-primary">
            {{ card.desc }}
          </v-card-text>

          <v-card-actions class="justify-end pt-0">
            <v-btn variant="text" color="primary" :to="card.to" density="comfortable" class="bold">
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
/* Remove the gray wash; rely on global app background (see section 2). */
.header-hero {
  background: #fff; /* solid surface, no tint */
  drop-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
}

/* Tight, readable header */
.hero-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.25rem;
  padding: 24px;
}
.hero-title {
  margin: 0;
  font-weight: 700;
}
.hero-subtitle {
  margin: 6px 0 0 0;
}

/* Cards: solid white + stronger shadow */
.card-pro {
  background: #fff; /* solid white in light theme */
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  transition:
    box-shadow 160ms ease,
    transform 160ms ease;
}
.card-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

/* Solid avatar chip to increase icon contrast */
.avatar-solid {
  background: color-mix(in oklab, var(--v-theme-primary) 18%, white);
  color: var(--v-theme-primary);
}

/* Divider with clearer contrast */
.pro-divider {
  opacity: 0.9;
}

@media (max-width: 960px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
