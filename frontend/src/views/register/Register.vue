<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { useFormRules } from '../../includes/validation'
import { toast } from 'vue3-toastify'

const router = useRouter()
const userStore = useUserStore()
const { nameRules, emailRules, passwordRules, getConfirmPasswordRules } = useFormRules()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Computed property for confirm password rules
const confirmPasswordRules = ref(getConfirmPasswordRules(password.value))

// Watch for changes in the password field and update confirm password rules accordingly
watch(password, (newPassword) => {
  confirmPasswordRules.value = getConfirmPasswordRules(newPassword)
})

// Computed property to check if passwords match
const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

// Computed property to disable or enable the register button based on password match
const isRegisterButtonDisabled = computed(() => {
  return !passwordsMatch.value
})

const submitForm = async () => {
  // Handle form submission logic here
  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value
  }

  try {
    await userStore.register(newUser)
    toast.success('Registration successful')
    setTimeout(router.push('/login'), 10000)
  } catch (error) {
    toast.error(error?.response?.data?.message || 'User registration failed')
  }
}
</script>
<template>
  <v-card max-width="450px" class="justify-center mx-auto mt-5">
    <div v-if="registrationError" class="error-message">
      {{ registrationError }}
    </div>
    <v-card-title class="headline">Sign up</v-card-title>
    <v-form @submit.prevent="submitForm" class="px-3 mt-3">
      <v-text-field v-model="name" label="Enter Name" :rules="nameRules" required> </v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        :rules="emailRules"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        :rules="passwordRules"
        required
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        :rules="confirmPasswordRules"
        required
      ></v-text-field>

      <!-- Use v-col to position the button on the right -->
      <v-col class="text-right" cols="12">
        Already signed up?
        <router-link class="text-blue text-decoration-none" to="/login">Login</router-link>
        <v-btn
          type="submit"
          color="primary"
          class="ml-2 text-decoration-none"
          :disabled="isRegisterButtonDisabled"
          >Register</v-btn
        >
      </v-col>
    </v-form>
  </v-card>
</template>

<style></style>
