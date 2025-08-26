<script setup>
import { ref, onMounted } from 'vue'
import useUserStore from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const profileForm = ref({
  name: '',
  email: '',
  role: 'Parent',
  organization: '',
  phone: '',
  timezone: '',
  profilePic: null,
  profilePicUrl: ''
})

const isUpdating = ref(false)
const timezones = ['EST', 'CST', 'MST', 'PST']
const roles = ['Educator', 'Therapist', 'Administrator', 'Other', 'Parent']

onMounted(async () => {
  await userStore.fetchUserProfile()
  Object.assign(profileForm.value, userInfo.value)
  console.log(profileForm)
})

const updateProfile = async () => {
  isUpdating.value = true
  await userStore.updateUserProfile(profileForm.value)
  isUpdating.value = false
}
</script>

<template>
  <v-container>
    <v-card flat>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="profileForm.name" label="Name" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profileForm.email" label="Email" type="email" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="profileForm.role" label="Role" :items="roles" disabled />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profileForm.organization" label="Organization / School Name" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="profileForm.phone" label="Phone Number" type="tel" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="profileForm.timezone" label="Timezone" :items="timezones" />
            </v-col>
            <v-col cols="12">
              <v-file-input
                label="Upload Profile Picture"
                v-model="profileForm.profilePic"
                accept="image/*"
                prepend-icon="mdi-camera"
              />
            </v-col>
            <v-col cols="12" class="text-center">
              <v-avatar v-if="userInfo?.profilePicUrl" size="120">
                <img :src="userInfo.profilePicUrl" alt="Profile Picture" />
              </v-avatar>
            </v-col>
          </v-row>
        </v-form>
        <v-progress-circular v-if="isUpdating" indeterminate color="primary" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateProfile" :disabled="isUpdating">
          Update Profile
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-avatar img {
  object-fit: cover;
}
</style>
