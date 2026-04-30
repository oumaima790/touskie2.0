<template>
  <v-container class="fill-height d-flex align-center justify-center">

    <v-card width="400" elevation="6" class="pa-6">

      <v-card-title class="text-h5 text-center mb-4">
        Login to Touskie
      </v-card-title>

      <v-form ref="form" @submit.prevent="login">

        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
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
          Login
        </v-btn>

        <div class="text-center">
          <span style="color:#666;font-size:14px">Don't have an account? </span>
          <v-btn
            variant="text"
            color="#f97316"
            size="small"
            class="font-weight-bold"
            @click="$router.push('/signup')"
          >
            Sign Up
          </v-btn>
        </div>

      </v-form>

    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import userService from "../services/userService.js"

const formData = ref({
  email: "",
  password: ""
})

const router = useRouter()
const error = ref("")
const isLoading = ref(false)

const login = async () => {
  if (!formData.value.email || !formData.value.password) {
    error.value = "Please fill all fields"
    return
  }

  isLoading.value = true
  error.value = ""

  try {
    const response = await userService.login(formData.value)
    console.log("Login successful:", response)
    
    // Store token and user data
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    
    router.push("/")
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed. Please check your credentials."
    console.error("Login error:", err)
  } finally {
    isLoading.value = false
  }
}
</script>