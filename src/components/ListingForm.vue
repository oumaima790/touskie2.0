<template>
  <v-card class="create-listing-card">
    <v-card-title class="create-listing-title">
      Create Listing
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="form.title"
        label="Title"
        variant="outlined"
        density="compact"
        class="form-field"
      />

      <v-textarea
        v-model="form.description"
        label="Description"
        variant="outlined"
        density="compact"
        rows="3"
        class="form-field"
      />

      <v-text-field
        v-model.number="form.price"
        label="Price"
        type="number"
        variant="outlined"
        density="compact"
        class="form-field"
      />

      <v-select
        v-model="form.publisherId"
        :items="users"
        :item-title="user => user.firstName + ' ' + user.lastName"
        item-value="id"
        label="Publisher"
        variant="outlined"
        density="compact"
        class="form-field dark-select"
        menu-icon="mdi-chevron-down"
        :menu-props="{ contentClass: 'dark-dropdown-menu' }"
      />

      <v-select
        v-model="form.category"
        :items="categories"
        label="Category"
        variant="outlined"
        density="compact"
        class="form-field dark-select"
        menu-icon="mdi-chevron-down"
        :menu-props="{ contentClass: 'dark-dropdown-menu' }"
      />
    </v-card-text>

    <v-card-actions class="create-listing-actions">
      <v-btn
        class="create-btn"
        @click="createListing"
        :loading="isLoading"
      >
        Create Listing
      </v-btn>

      <v-btn
        class="reset-btn"
        @click="resetForm"
      >
        Reset
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import listingService from '../services/listingService.js';
import userService from '../services/userService.js';

const emit = defineEmits(['listingCreated']);

const categories = ref(['Product', 'Rental', 'Service']);

const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const users = ref([]);

const form = ref({
  title: '',
  description: '',
  category: '',
  price: 0,
  publisherId: null
});

onMounted(async () => {
  try {
    const response = await userService.getAll();
    users.value = Array.isArray(response) ? response : response?.data ?? [];
  } catch (error) {
    console.error('Failed to load users:', error);
  }
});

const createListing = async () => {
  if (form.value.title && form.value.category && form.value.price && form.value.publisherId) {
    isLoading.value = true;

    try {
      const listing = {
        publisherId: form.value.publisherId,
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        price: form.value.price
      };

      await listingService.add(listing);

      resetForm();
      emit('listingCreated');

      snackbarText.value = 'Listing created successfully!';
      snackbarColor.value = 'success';
      snackbar.value = true;
    } catch (error) {
      snackbarText.value = 'Failed to create listing: ' + error.message;
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    snackbarText.value = 'Please fill all required fields';
    snackbarColor.value = 'warning';
    snackbar.value = true;
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    category: '',
    price: 0,
    publisherId: null
  };
};
</script>

<style scoped>
.create-listing-card {
  background: #0b1a2e !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.create-listing-title {
  color: #ffffff;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 18px 22px;
}

.form-field {
  margin-bottom: 10px;
}

.form-field :deep(.v-field) {
  background: #102033 !important;
  color: #ffffff !important;
  border-radius: 6px;
}

.form-field :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.24) !important;
}

.form-field :deep(.v-label) {
  color: #8fa1b7 !important;
}

.form-field :deep(input),
.form-field :deep(textarea) {
  color: #ffffff !important;
}

.form-field :deep(.v-select__selection-text) {
  color: #ffffff !important;
}

.form-field :deep(.v-icon) {
  color: #8fa1b7 !important;
}

/* Publisher + Category select inputs */
.dark-select :deep(.v-field) {
  background: #102033 !important;
}

.dark-select :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.24) !important;
}

.dark-select :deep(.v-label) {
  color: #8fa1b7 !important;
}

.dark-select :deep(.v-icon) {
  color: #8fa1b7 !important;
}

.create-listing-actions {
  padding: 8px 22px 22px;
  gap: 10px;
}

.create-btn {
  background: #ff6b13 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 6px;
}

.create-btn:hover {
  background: #ff812f !important;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #dbe7f5 !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 6px;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.12) !important;
}
</style>

<style>
/* Dropdown menu for Publisher and Category */
/* This is global because Vuetify renders v-select menus outside the component */
.dark-dropdown-menu {
  background: #102033 !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35) !important;
}

.dark-dropdown-menu .v-list {
  background: #102033 !important;
  color: #ffffff !important;
  padding: 4px !important;
}

.dark-dropdown-menu .v-list-item {
  background: #102033 !important;
  color: #ffffff !important;
  border-radius: 4px !important;
  min-height: 44px !important;
}

.dark-dropdown-menu .v-list-item:hover {
  background: #172b42 !important;
}

.dark-dropdown-menu .v-list-item--active {
  background: #1b334f !important;
  color: #ffffff !important;
}

.dark-dropdown-menu .v-list-item-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}
</style>