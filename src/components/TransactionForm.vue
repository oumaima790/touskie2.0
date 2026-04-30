<template>
  <v-card>
    <v-card-title>Create Transaction</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="form.amount"
        label="Amount"
        type="number"
        variant="outlined"
        density="compact"
        prefix="$"
        class="mb-3"
      />
      <v-select
        v-model="form.type"
        :items="transactionTypes"
        label="Transaction Type"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      <v-select
        v-model="form.status"
        :items="statuses"
        label="Status"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      <v-textarea
        v-model="form.description"
        label="Description"
        variant="outlined"
        density="compact"
        rows="3"
        class="mb-3"
      />
      <v-select
        v-model="form.userId"
        :items="users"
        item-title="label"
        item-value="id"
        label="User"
        variant="outlined"
        density="compact"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="createTransaction" :loading="isLoading">Create Transaction</v-btn>
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
import { ref, onMounted } from 'vue';
import { transactionService } from '../services/transactionService.js';
import userService from '../services/userService.js';

const transactionTypes = ['income', 'expense', 'transfer'];
const statuses = ['pending', 'completed', 'failed'];
const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = ref({
  amount: 0,
  type: '',
  status: '',
  description: '',
  userId: ''
});

onMounted(async () => {
  await loadUsers();
});

const users = ref([]);

const loadUsers = async () => {
  const allUsers = await userService.getAllUsers();
  users.value = allUsers.map(user => ({
    id: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`
  }));
};

const createTransaction = async () => {
  if (form.value.amount && form.value.type && form.value.status && form.value.userId) {
    isLoading.value = true;
    try {
      await transactionService.create(form.value);
      resetForm();
      // Emit event to parent to refresh the list
      emit('transactionCreated');
      // Show success snackbar
      snackbarText.value = "Transaction created successfully!";
      snackbarColor.value = "success";
      snackbar.value = true;
    } catch (error) {
      snackbarText.value = 'Failed to create transaction: ' + (error.response?.data?.message || error.message);
      snackbarColor.value = "error";
      snackbar.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    snackbarText.value = 'Please fill all required fields';
    snackbarColor.value = "warning";
    snackbar.value = true;
  }
};

const resetForm = () => {
  form.value = {
    amount: 0,
    type: '',
    status: '',
    description: '',
    userId: ''
  };
};

// Define emit
const emit = defineEmits(['transactionCreated']);
</script>