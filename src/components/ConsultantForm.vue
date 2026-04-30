<template>
  <v-card>
    <v-card-title>Create Consultant Case</v-card-title>
    <v-card-text>
      <v-select
        v-model="form.consultantId"
        :items="consultants"
        item-title="label"
        item-value="id"
        label="Consultant"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      <v-select
        v-model="form.caseType"
        :items="caseTypes"
        label="Case Type"
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
        v-model="form.review"
        label="Review (Optional)"
        variant="outlined"
        density="compact"
        rows="3"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="createCase" :loading="isLoading">Create Case</v-btn>
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
import { ref, computed, onMounted } from 'vue';
import consultantService from '../services/consultantService.js';
import userService from '../services/userService.js';

const caseTypes = ['validation', 'mediation'];
const statuses = ['open', 'in-progress', 'closed'];
const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = ref({
  consultantId: '',
  caseType: '',
  status: '',
  review: ''
});

onMounted(async () => {
  await loadConsultants();
});

const consultants = ref([]);

const loadConsultants = async () => {
  const consultantUsers = await userService.getByRole('consultant');
  consultants.value = consultantUsers.map(user => ({
    id: user.id,
    label: `${user.firstName} ${user.lastName}`
  }));
};

const createCase = async () => {
  if (form.value.consultantId && form.value.caseType && form.value.status) {
    isLoading.value = true;
    try {
      await consultantService.create(form.value);
      resetForm();
      // Emit event to parent to refresh the list
      emit('caseCreated');
      // Show success snackbar
      snackbarText.value = "Consultant case created successfully!";
      snackbarColor.value = "success";
      snackbar.value = true;
    } catch (error) {
      snackbarText.value = 'Failed to create consultant case: ' + (error.response?.data?.message || error.message);
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
    consultantId: '',
    caseType: '',
    status: '',
    review: ''
  };
};

// Define emit
const emit = defineEmits(['caseCreated']);
</script>
