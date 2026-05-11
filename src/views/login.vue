<template>
  <v-container fluid class="login-page">
    <v-card class="login-card">
      <v-card-title class="login-title">
        Login to Touskie
      </v-card-title>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="form.email"
          label="Email"
          type="email"
          variant="outlined"
          class="login-field"
          required
        />

        <v-text-field
          v-model="form.password"
          label="Password"
          type="password"
          variant="outlined"
          class="login-field"
          required
        />

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4 login-alert"
        >
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          block
          class="login-btn"
          :loading="isLoading"
        >
          Login
        </v-btn>

        <div class="signup-row">
          <span>Don't have an account?</span>

          <v-btn
            variant="text"
            size="small"
            class="signup-link"
            @click="$router.push('/signup')"
          >
            Sign Up
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import userService from '../services/userService.js'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const isLoading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

const login = async () => {
  if (!form.value.email || !form.value.password) {
    error.value = 'Please fill all fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await userService.login(form.value)

    const token = response?.token || response?.data?.token
    const user = response?.user || response?.data?.user

    if (token) {
      localStorage.setItem('token', token)
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    snackbarText.value = 'Login successful!'
    snackbar.value = true

    if (user?.role === 'consultant') {
      localStorage.setItem('openConsultantUI', 'true')
      window.dispatchEvent(new Event('open-consultant-ui'))

      setTimeout(() => {
        router.push('/')
      }, 300)
    } else {
      setTimeout(() => {
        router.push('/')
      }, 700)
    }
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Login failed. Please check your email and password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 72px);
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 107, 19, 0.08), transparent 26%),
    radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.14), transparent 30%),
    linear-gradient(180deg, #071426 0%, #0e203a 100%);
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
}

.login-card {
  width: 100%;
  max-width: 430px;
  padding: 34px 30px 28px;

  background: #0b1a2e !important;
  color: #ffffff !important;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;

  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.35),
    0 0 40px rgba(255, 107, 19, 0.08);
}

.login-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 26px;
  padding: 0;
}

.login-field {
  margin-bottom: 18px;
}

.login-field :deep(.v-field) {
  background: #102033 !important;
  color: #ffffff !important;
  border-radius: 8px;
}

.login-field :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.22) !important;
}

.login-field :deep(.v-field--focused .v-field__outline) {
  color: #ff6b13 !important;
}

.login-field :deep(.v-label) {
  color: #8fa1b7 !important;
}

.login-field :deep(input) {
  color: #ffffff !important;
}

.login-field :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.45) !important;
}

.login-alert {
  background: rgba(255, 107, 19, 0.12) !important;
  color: #ffb07a !important;
  border: 1px solid rgba(255, 107, 19, 0.3);
}

.login-btn {
  height: 46px;
  margin-top: 4px;

  background: #ff6b13 !important;
  color: #ffffff !important;

  text-transform: none;
  font-weight: 800;
  border-radius: 8px;

  box-shadow: 0 0 18px rgba(255, 107, 19, 0.28);
}

.login-btn:hover {
  background: #ff812f !important;
  box-shadow: 0 0 24px rgba(255, 107, 19, 0.42);
}

.signup-row {
  margin-top: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  color: #8fa1b7;
  font-size: 14px;
}

.signup-link {
  color: #ff812f !important;
  text-transform: none;
  font-weight: 800;
}

.signup-link:hover {
  color: #ff9b5c !important;
}
</style>