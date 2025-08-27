<script setup></script>

<template>
  <v-container class="py-8">
    <v-card class="mb-6 rounded-2xl">
      <v-card-text class="text-body-1">
        Welcome to the IEPPro Dashboard — your central hub for managing a student’s Individualized
        Education Plan (IEP). From here, you can view the child’s profile, track progress toward
        goals, and review or update scheduled services.
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" color="primary" :to="{ path: '/children' }">
          <v-icon start icon="mdi-account-school-outline" />
          Child Profile
        </v-btn>
        <v-btn variant="text" color="primary" :to="{ path: '/goals' }">
          <v-icon start icon="mdi-bullseye-arrow" />
          Goals
        </v-btn>
        <v-btn variant="text" color="primary" :to="{ path: '/scheduled-services' }">
          <v-icon start icon="mdi-hand-heart" />
          Services
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-row dense>
      <v-col cols="12" md="4">
        <v-card class="h-100 rounded-2xl">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon icon="mdi-account-school-outline" />
            Child Profile
          </v-card-title>
          <v-card-text>
            View demographics, diagnoses, grade level, and key context to personalize support.
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" :to="{ path: '/children' }">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="h-100 rounded-2xl">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon icon="mdi-bullseye-arrow" />
            Goals
          </v-card-title>
          <v-card-text>
            Track measurable annual goals and short-term objectives by area and grade level.
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" :to="{ path: '/goals' }">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="h-100 rounded-2xl">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon icon="mdi-hand-heart" />
            Services
          </v-card-title>
          <v-card-text>
            Review scheduled services, providers, and minutes to ensure support is delivered.
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" :to="{ path: '/scheduled-services' }">Open</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
