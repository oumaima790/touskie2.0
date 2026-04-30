<template>
  <v-card>
    <v-card-title>Create Listing</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="form.title"
        label="Title"
        variant="outlined"
        density="compact"
      />
      <v-textarea
        v-model="form.description"
        label="Description"
        variant="outlined"
        density="compact"
        rows="3"
      />
      <v-text-field
        v-model.number="form.price"
        label="Price"
        type="number"
        variant="outlined"
        density="compact"
      />
      <v-select
        v-model="form.publisherId"
        :items="users"
        :item-title="user => user.firstName + ' ' + user.lastName"
        item-value="id"
        label="Publisher"
        variant="outlined"
        density="compact"
      />

      <v-divider class="my-4" />

      <div class="text-subtitle-2 mb-2">Reorder Categories (Drag & Drop)</div>
      <v-list>
        <v-list-item
          v-for="(category, index) in orderedCategories"
          :key="category"
          class="mb-2"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
        >
          <v-card variant="outlined" class="pa-2">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-drag</v-icon>
              <span>{{ category }}</span>
              <v-spacer />
              <v-radio-group v-model="form.category" inline hide-details>
                <v-radio :value="category" />
              </v-radio-group>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="createListing" :loading="isLoading">Create Listing</v-btn>
      <v-btn @click="resetForm">Reset</v-btn>
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

const orderedCategories = ref(['Product', 'Rental', 'Service']);
const draggedIndex = ref(null);

const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const users = ref([]);

const form = ref({
  title: '',
  description: '',
  category: '',
  price: 0,
  publisherId: null  // ✅ unified field, bound directly to v-select
});

onMounted(async () => {
  try {
    const response = await userService.getAll();
    users.value = response;
  } catch (error) {
    console.error("Failed to load users:", error);
  }
});

const dragStart = (index) => {
  draggedIndex.value = index;
};

const drop = (index) => {
  if (draggedIndex.value !== null) {
    const item = orderedCategories.value[draggedIndex.value];
    orderedCategories.value.splice(draggedIndex.value, 1);
    orderedCategories.value.splice(index, 0, item);
    draggedIndex.value = null;
  }
};

const createListing = async () => {
  if (form.value.title && form.value.category && form.value.price && form.value.publisherId) {
    isLoading.value = true;
    try {
      const listing = {
        // ✅ No productId — MongoDB auto-generates _id
        publisherId: form.value.publisherId,
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        price: form.value.price
      };

      await listingService.add(listing);
      resetForm();
      emit('listingCreated');
      snackbarText.value = "Listing created successfully!";
      snackbarColor.value = "success";
      snackbar.value = true;
    } catch (error) {
      snackbarText.value = "Failed to create listing: " + error.message;
      snackbarColor.value = "error";
      snackbar.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    snackbarText.value = "Please fill all required fields";
    snackbarColor.value = "warning";
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