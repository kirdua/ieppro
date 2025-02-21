<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import { getFirebaseErrorMessage } from '@/utils/error-messages'
import { useFormRules } from '@/utils/validation'
import InfoModal from '@/components/modal/InfoModal.vue'
import tosData from '@/assets/tos/tos.json'

const props = defineProps({
  mode: String
})

const userStore = useUserStore()
const router = useRouter()
const { emailRules, passwordRules } = useFormRules()

const isRegister = computed(() => {
  return props.mode === 'register'
})

const name = ref('')
const email = ref('')
const password = ref('')
const termsOfService = ref(false)
const showTOSModal = ref(false)
const tosContent = ref(null)
const errorMessage = ref('')

onMounted(() => {
  tosContent.value = tosData
})

const handleSubmit = async () => {
  errorMessage.value = ''

  const user = {
    email: email.value,
    password: password.value
  }

  try {
    if (isRegister.value) {
      if (!termsOfService.value) {
        return (errorMessage.value = 'You must agree with Terms of Service')
      }
      await userStore.register({ ...user, name: name.value, tos: termsOfService.value })
      router.push('/user')
    } else {
      await userStore.login(user)
      router.push('/overview')
    }
  } catch (error) {
    console.error('Firebase Auth Error:', error) // Debugging line
    errorMessage.value = getFirebaseErrorMessage(error.code || error.message)
  }
}

const toggleMode = () => {
  router.push(isRegister.value ? '/login' : '/register')
}
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card class="pa-6" width="400">
      <v-card-title class="text-primary text-center">
        <v-icon icon="mdi-book-open-blank-variant"></v-icon>
        IEP Pro
      </v-card-title>

      <v-card-text>
        <v-alert v-if="errorMessage" class="mb-2" type="error" dense>{{ errorMessage }}</v-alert>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-if="isRegister" v-model="name" label="Full Name" required />
          <v-text-field v-model="email" label="Email" :rules="emailRules" type="email" required />
          <v-text-field
            v-model="password"
            label="Password"
            :rules="passwordRules"
            type="password"
            required
          />
          <v-checkbox v-if="isRegister" v-model="termsOfService" color="primary" required>
            <template v-slot:label>
              <div>
                I agree with
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <a
                      href="https://vuetifyjs.com"
                      @click.prevent="showTOSModal = true"
                      class="text-primary"
                    >
                      Terms of Service
                    </a>
                  </template>
                  View Terms of Service
                </v-tooltip>
              </div>
            </template>
          </v-checkbox>
          <v-btn block color="primary" type="submit">
            {{ isRegister ? 'Sign Up' : 'Login' }}
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn text @click="toggleMode">
          {{ isRegister ? 'Already have an account? Login' : 'Need an account? Sign Up' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <InfoModal v-model="showTOSModal">
      <template #title>Terms of Service for IEP Pro</template>

      <template v-if="tosContent">
        <strong class="text-primary">Effective Date:</strong> {{ tosContent.effectiveDate }}

        <div v-for="section in tosContent.sections" :key="section.title" class="mb-5">
          <v-divider class="mb-5" />
          <p class="text-primary font-weight-bold">{{ section.title }}</p>

          <template v-if="Array.isArray(section.content)">
            <ul class="no-bullets">
              <li v-for="(item, idx) in section.content" :key="idx">
                <strong class="text-primary">{{ item.subtitle }}:</strong> {{ item.description }}
              </li>
            </ul>
          </template>
          <template v-else>
            <p>{{ section.content }}</p>
          </template>
        </div>
      </template>
    </InfoModal>
  </v-container>
</template>

<style lang="css" scoped>
.no-bullets {
  list-style-type: none;
}
</style>
