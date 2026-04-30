<template>
  <v-card>
    <v-card-title>Create User</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="form.firstName"
        label="First Name"
        variant="outlined"
        density="compact"
      />
      <v-text-field
        v-model="form.lastName"
        label="Last Name"
        variant="outlined"
        density="compact"
      />
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        variant="outlined"
        density="compact"
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        type="password"
        variant="outlined"
        density="compact"
      />
      <v-select
        v-model="form.role"
        :items="roles"
        label="Role"
        variant="outlined"
        density="compact"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="createUser" :loading="isLoading">Create User</v-btn>
      <v-btn @click="resetForm">Reset</v-btn>
    </v-card-actions>
  </v-card>

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import userService from '../services/userService.js';

const roles = ['user', 'consultant', 'publisher'];
const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
});

const createUser = async () => {
  if (form.value.firstName && form.value.lastName && form.value.email && form.value.password && form.value.role) {
    isLoading.value = true;
    try {
      await userService.create(form.value);
      resetForm();
      // Emit event to parent to refresh the list
      emit('userCreated');
      // Show success snackbar
      snackbarText.value = "User created successfully!";
      snackbarColor.value = "success";
      snackbar.value = true;
    } catch (error) {
      snackbarText.value = 'Failed to create user: ' + (error.response?.data?.message || error.message);
      snackbarColor.value = "error";
      snackbar.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    snackbarText.value = 'Please fill all fields';
    snackbarColor.value = "warning";
    snackbar.value = true;
  }
};

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  };
};

// Define emit
const emit = defineEmits(['userCreated']);
</script>
