<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import InfoModal from '@/components/modal/InfoModal.vue'
import tosData from '@/assets/tos/tos.json'

// Optional helpers; if you don't have them, see fallback rules below.
import { useFormRules } from '@/utils/validation'
import { getFirebaseErrorMessage } from '@/utils/error-messages'

const props = defineProps({ mode: String })

const userStore = useUserStore()
const router = useRouter()

// ------- validation fallbacks (use your utils if you have them) -------
let emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Enter a valid email'
]
let passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => String(v).length >= 6 || 'Min 6 characters'
]

try {
  // If your utils exist, prefer them
  const rules = useFormRules?.()
  if (rules?.emailRules) emailRules = rules.emailRules
  if (rules?.passwordRules) passwordRules = rules.passwordRules
} catch {}
// ---------------------------------------------------------------------

const isRegister = computed(() => props.mode === 'register')

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const termsOfService = ref(false)

const showTOSModal = ref(false)
const tosContent = ref(null)

const errorMessage = ref('')
const loading = ref(false)

onMounted(() => {
  tosContent.value = tosData
})

function friendlyError(codeOrMsg) {
  if (typeof getFirebaseErrorMessage === 'function') {
    return getFirebaseErrorMessage(codeOrMsg)
  }
  // minimal fallback mapping
  const map = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'Email is already registered.',
    'auth/weak-password': 'Password is too weak.',
    'auth/invalid-email': 'Invalid email.',
    'auth/missing-credentials': 'Email and password required.'
  }
  return map[codeOrMsg] || 'Something went wrong. Please try again.'
}

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  const creds = { email: email.value, password: password.value }

  try {
    if (isRegister.value) {
      if (!termsOfService.value) {
        errorMessage.value = 'You must agree with Terms of Service'
        loading.value = false
        return
      }
      await userStore.register({ ...creds, name: name.value, tos: termsOfService.value })
      router.replace('/user') // profile page after signup
    } else {
      await userStore.login(creds)
      router.replace('/overview')
    }
  } catch (err) {
    console.error('Firebase Auth Error:', err)
    const code = err?.code || err?.message || 'auth/unknown'
    errorMessage.value = friendlyError(code)
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  router.push(isRegister.value ? '/login' : '/register')
}
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card class="pa-6" width="420">
      <v-card-title class="text-primary text-center d-flex align-center justify-center">
        <v-icon icon="mdi-book-open-blank-variant" class="mr-2" />
        IEP Pro
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="errorMessage"
          class="mb-3"
          type="error"
          density="comfortable"
          variant="tonal"
        >
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-if="isRegister"
            v-model="name"
            label="Full Name"
            autocomplete="name"
            :disabled="loading"
            required
          />

          <v-text-field
            v-model="email"
            label="Email"
            :rules="emailRules"
            type="email"
            autocomplete="email"
            :disabled="loading"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            :rules="passwordRules"
            autocomplete="current-password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :disabled="loading"
            required
          />

          <v-checkbox
            v-if="isRegister"
            v-model="termsOfService"
            color="primary"
            :disabled="loading"
            hide-details
          >
            <template #label>
              <div>
                I agree with
                <a href="#" @click.prevent="showTOSModal = true" class="text-primary">
                  Terms of Service
                </a>
              </div>
            </template>
          </v-checkbox>

          <v-btn
            block
            color="primary"
            type="submit"
            class="mt-2"
            :loading="loading"
            :disabled="loading"
          >
            {{ isRegister ? 'Sign Up' : 'Login' }}
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn variant="text" @click="toggleMode" :disabled="loading">
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

<style scoped>
.no-bullets {
  list-style-type: none;
  padding-left: 0;
}
</style>
