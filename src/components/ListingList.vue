<template>
  <v-container>
    <v-card class="mb-6">
      <v-card-title>Users</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="userHeaders"
          :items="users"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn size="small" color="error" @click="deleteUser(item._id)">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title>Listings</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="listingHeaders"
          :items="listings"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn size="small" color="error" @click="deleteListing(item._id)">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title>Consultant Cases</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="caseHeaders"
          :items="cases"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn size="small" color="error" @click="deleteCase(item._id)">
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import userService from '../services/userService.js';
import listingService from '../services/listingService.js';
import consultantService from '../services/consultantService.js';

const users = ref([]);
const listings = ref([]);
const cases = ref([]);

// ✅ Build headers dynamically from API data, excluding internal fields
const buildHeaders = (items) => {
  if (!items || items.length === 0) return [];
  const excluded = ['__v', 'updatedAt'];
  return [
    ...Object.keys(items[0])
      .filter(key => !excluded.includes(key))
      .map(key => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        key
      })),
    { title: 'Actions', key: 'actions', sortable: false }
  ];
};

const userHeaders = computed(() => buildHeaders(users.value));
const listingHeaders = computed(() => buildHeaders(listings.value));
const caseHeaders = computed(() => buildHeaders(cases.value));

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  users.value = await userService.getAll();
  listings.value = await listingService.getAll();
  cases.value = await consultantService.getAll();

  console.log('users:', users.value);
  console.log('listings:', listings.value);
  console.log('cases:', cases.value);
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userService.delete(id);
      await loadData();
    } catch (error) {
      alert('Failed to delete user');
    }
  }
};

const deleteListing = async (id) => {
  if (confirm('Are you sure you want to delete this listing?')) {
    try {
      await listingService.delete(id);
      await loadData();
    } catch (error) {
      alert('Failed to delete listing');
    }
  }
};

const deleteCase = async (id) => {
  if (confirm('Are you sure you want to delete this case?')) {
    try {
      await consultantService.delete(id);
      await loadData();
    } catch (error) {
      alert('Failed to delete case');
    }
  }
};
</script>