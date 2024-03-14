<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { useFormRules } from '../../includes/validation'
import { toast } from 'vue3-toastify'

const userStore = useUserStore()
const router = useRouter()
const { emailRules, passwordRules } = useFormRules()

const email = ref('')
const password = ref('')

const submitForm = async () => {
  // Handle form submission logic here
  const userCredentials = {
    email: email.value,
    password: password.value
  }

  try {
    await userStore.login(userCredentials)
    router.push('/')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Login failed')
  }
}
</script>
<template>
  <v-card max-width="450px" class="justify-center mx-auto mt-5">
    <v-card-title class="headline">Sign up</v-card-title>
    <v-form @submit.prevent="submitForm" class="px-3 mt-3">
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

      <!-- Use v-col to position the button on the right -->
      <v-col class="text-right" cols="12">
        Not already signed up?
        <router-link class="text-blue text-decoration-none" to="/register">Register</router-link>
        <v-btn
          type="submit"
          color="primary"
          class="ml-2 text-decoration-none"
          :disabled="isRegisterButtonDisabled"
          >Login</v-btn
        >
      </v-col>
    </v-form>
  </v-card>
</template>

<style></style>
