<template>
  <template v-if="!embedded">
    <v-app>
      <v-container class="signup-page fill-height d-flex align-center justify-center">
        <v-card width="450" elevation="6" class="signup-card pa-6">
          <v-card-title class="signup-title text-h5 text-center mb-4">
            Create Account
          </v-card-title>

          <v-form ref="form" @submit.prevent="signup">
            <v-text-field
              v-model="formData.firstName"
              label="First Name"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.lastName"
              label="Last Name"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.phone"
              label="Phone"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-select
              v-model="formData.role"
              label="Account Type"
              :items="['user', 'consultant', 'publisher']"
              variant="outlined"
              required
              class="signup-field dark-select mb-4"
              menu-icon="mdi-chevron-down"
              :menu-props="{ contentClass: 'signup-dropdown-menu' }"
            />

            <v-alert v-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              block
              class="signup-btn mb-3"
              :loading="isLoading"
            >
              Sign Up
            </v-btn>

            <div class="text-center">
              <span class="login-text">Already have an account? </span>

              <v-btn
                variant="text"
                size="small"
                class="login-btn"
                @click="$router.push('/login')"
              >
                Log In
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
    </v-app>
  </template>

  <template v-else>
    <div class="signup-embedded">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="450" elevation="6" class="signup-card pa-6">
          <v-card-title class="signup-title text-h5 text-center mb-4">
            Create Account
          </v-card-title>

          <v-form ref="form" @submit.prevent="signup">
            <v-text-field
              v-model="formData.firstName"
              label="First Name"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.lastName"
              label="Last Name"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.phone"
              label="Phone"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              variant="outlined"
              required
              class="signup-field mb-3"
            />

            <v-select
              v-model="formData.role"
              label="Account Type"
              :items="['user', 'consultant', 'publisher']"
              variant="outlined"
              required
              class="signup-field dark-select mb-4"
              menu-icon="mdi-chevron-down"
              :menu-props="{ contentClass: 'signup-dropdown-menu' }"
            />

            <v-alert v-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              block
              class="signup-btn mb-3"
              :loading="isLoading"
            >
              Sign Up
            </v-btn>

            <div class="text-center">
              <span class="login-text">Already have an account? </span>

              <v-btn
                variant="text"
                size="small"
                class="login-btn"
                @click="$router.push('/login')"
              >
                Log In
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
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import userService from "../services/userService.js"

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["signedUp"])

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "user"
})

const router = useRouter()
const error = ref("")
const isLoading = ref(false)
const snackbar = ref(false)
const snackbarText = ref("")

const signup = async () => {
  if (
    !formData.value.firstName ||
    !formData.value.lastName ||
    !formData.value.email ||
    !formData.value.password ||
    !formData.value.phone
  ) {
    error.value = "Please fill all fields"
    return
  }

  isLoading.value = true
  error.value = ""

  try {
    const response = await userService.register(formData.value)
    console.log("Signup successful:", response)

    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    snackbar.value = true
    snackbarText.value = "Account created successfully!"

    if (props.embedded) {
      setTimeout(() => {
        emit("signedUp")
      }, 1000)
    } else if (formData.value.role === "consultant") {
      localStorage.setItem("openConsultantUI", "true")
      window.dispatchEvent(new Event("open-consultant-ui"))

      setTimeout(() => {
        router.push("/")
      }, 300)
    } else {
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Signup failed. Please try again."
    console.error("Signup error:", err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.signup-page,
.signup-embedded {
  background: #071426;
  color: #ffffff;
  min-height: 100vh;
}

.signup-card {
  background: #0b1a2e !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.signup-title {
  color: #ffffff;
  font-weight: 700;
}

.signup-field :deep(.v-field) {
  background: #102033 !important;
  color: #ffffff !important;
  border-radius: 6px;
}

.signup-field :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.24) !important;
}

.signup-field :deep(.v-label) {
  color: #8fa1b7 !important;
}

.signup-field :deep(input) {
  color: #ffffff !important;
}

.signup-field :deep(.v-icon) {
  color: #8fa1b7 !important;
}

.signup-field :deep(.v-select__selection-text) {
  color: #ffffff !important;
}

.signup-btn {
  background: #ff6b13 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 6px;
}

.signup-btn:hover {
  background: #ff812f !important;
}

.login-text {
  color: #8fa1b7;
  font-size: 14px;
}

.login-btn {
  color: #ff812f !important;
  font-weight: 700;
  text-transform: none;
}
</style>

<style>
.signup-dropdown-menu {
  background: #102033 !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35) !important;
}

.signup-dropdown-menu .v-list {
  background: #102033 !important;
  color: #ffffff !important;
  padding: 4px !important;
}

.signup-dropdown-menu .v-list-item {
  background: #102033 !important;
  color: #ffffff !important;
  border-radius: 4px !important;
  min-height: 44px !important;
}

.signup-dropdown-menu .v-list-item:hover {
  background: #172b42 !important;
}

.signup-dropdown-menu .v-list-item--active {
  background: #1b334f !important;
}

.signup-dropdown-menu .v-list-item-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}
</style>