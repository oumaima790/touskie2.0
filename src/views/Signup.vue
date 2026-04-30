<template>
  <template v-if="!embedded">
    <v-app>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="450" elevation="6" class="pa-6">
          <v-card-title class="text-h5 text-center mb-4">
            Create Account
          </v-card-title>

          <v-form ref="form" @submit.prevent="signup">
            <v-text-field
              v-model="formData.firstName"
              label="First Name"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.lastName"
              label="Last Name"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              variant="outlined"
              required
              class="mb-3"
            />
              <v-text-field
              v-model="formData.phone "
              label="Phone "
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-select
              v-model="formData.role"
              label="Account Type"
              :items="['user', 'consultant', 'publisher']"
              variant="outlined"
              required
              class="mb-4"
            />

            <v-alert v-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="#f97316"
              block
              class="text-white font-weight-bold mb-3"
              :loading="isLoading"
            >
              Sign Up
            </v-btn>

            <div class="text-center">
              <span style="color:#666;font-size:14px">Already have an account? </span>
              <v-btn
                variant="text"
                color="#f97316"
                size="small"
                class="font-weight-bold"
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
        <v-card width="450" elevation="6" class="pa-6">
          <v-card-title class="text-h5 text-center mb-4">
            Create Account
          </v-card-title>

          <v-form ref="form" @submit.prevent="signup">
            <v-text-field
              v-model="formData.firstName"
              label="First Name"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.lastName"
              label="Last Name"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              variant="outlined"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="formData.phone "
              label="Phone "
              variant="outlined"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              variant="outlined"
              required
              class="mb-3"
            />

            <v-select
              v-model="formData.role"
              label="Account Type"
              :items="['user', 'consultant', 'publisher']"
              variant="outlined"
              required
              class="mb-4"
            />

            <v-alert v-if="error" type="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="#f97316"
              block
              class="text-white font-weight-bold mb-3"
              :loading="isLoading"
            >
              Sign Up
            </v-btn>

            <div class="text-center">
              <span style="color:#666;font-size:14px">Already have an account? </span>
              <v-btn
                variant="text"
                color="#f97316"
                size="small"
                class="font-weight-bold"
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
  if (!formData.value.firstName || !formData.value.lastName || !formData.value.email || !formData.value.password|| !formData.value.phone) {
    error.value = "Please fill all fields"
    return
  }

  isLoading.value = true
  error.value = ""

  try {
    const response = await userService.register(formData.value)
    console.log("Signup successful:", response)
    // Store token if provided
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    // Show success snackbar
    snackbar.value = true
    snackbarText.value = "Account created successfully!"

    if (props.embedded) {
      // When embedded, notify parent so it can switch to post project form
      setTimeout(() => {
        emit("signedUp")
      }, 1000)
    } else {
      // Default standalone route behavior
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
