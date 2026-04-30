<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h4 font-weight-bold">Add Listing</h2>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            class="hover-lift"
            @click="showForm = !showForm"
          >
            {{ showForm ? 'Hide Form' : 'Add Listing' }}
          </v-btn>
        </div>
        <v-expand-transition>
          <div v-show="showForm">
            <v-card elevation="3" class="pa-4 mb-6">
              <ListingForm @listingCreated="onListingCreated" />
            </v-card>
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-medium">All Listings</h2>
          <v-text-field
            v-model="search"
            label="Search listings..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 300px;"
            class="mr-4"
          />
        </div>
        <v-card elevation="3">
          <v-table hover>
            <thead>
              <tr style="background-color: #f8f9fa">
                <th class="font-weight-bold text-left pa-4">Title</th>
                <th class="font-weight-bold text-left pa-4">Description</th>
                <th class="font-weight-bold text-left pa-4">Category</th>
                <th class="font-weight-bold text-left pa-4">Price</th>
                <th class="font-weight-bold text-left pa-4">Date Added</th>
                <th class="font-weight-bold text-left pa-4">Publisher</th>
                <th class="font-weight-bold text-center pa-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="listing in filteredListings"
                :key="listing._id"
                style="border-bottom: 1px solid #e9ecef"
                class="hover-row"
              >
                <td class="pa-4 font-weight-medium">{{ listing.title }}</td>
                <td class="pa-4" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis">
                  {{ listing.description }}
                </td>
                <td class="pa-4">
                  <v-chip size="small" color="#f97316" text-color="white" variant="flat">
                    {{ listing.category }}
                  </v-chip>
                </td>
                <td class="pa-4 font-weight-bold text-primary">${{ listing.price }}</td>
                <td class="pa-4">{{ new Date(listing.dateAdded).toLocaleDateString() }}</td>
                <td class="pa-4">{{ getPublisherName(listing.publisherId) }}</td>
                <td class="pa-4 text-center">
                  <v-btn color="green" size="small" @click="openPurchaseDialog(listing)" class="mr-2">
                    Buy
                  </v-btn>
                  <v-btn icon="mdi-delete" color="error" size="small" @click="deleteListing(listing._id)" />
                </td>
              </tr>
              <tr v-if="filteredListings.length === 0">
                <td colspan="7" class="text-center pa-8" style="color: #6c757d">
                  <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-package-variant</v-icon>
                  <div class="text-h6">No listings found</div>
                  <div v-if="search" class="text-body-2">Try adjusting your search terms</div>
                  <div v-else class="text-body-2">Create your first listing to get started</div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>

    <PurchaseDialog
      v-model="showPurchaseDialog"
      :selected-listing="selectedListing"
      @purchase-completed="onPurchaseCompleted"
    />
  </v-container>
</template>

<style scoped>
.hover-lift {
  transition: all 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.hover-row:hover {
  background-color: #f8f9fa !important;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ListingForm from '../components/ListingForm.vue';
import PurchaseDialog from '../components/PurchaseDialog.vue';
import listingService from '../services/listingService.js';
import userService from '../services/userService.js';

const listings = ref([]);
const users = ref([]);
const showForm = ref(false);
const search = ref('');
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const showPurchaseDialog = ref(false);
const selectedListing = ref(null);

onMounted(async () => {
  await loadListings();
});

const filteredListings = computed(() => {
  if (!Array.isArray(listings.value)) return [];
  if (!search.value) return listings.value;
  return listings.value.filter(listing =>
    listing.title?.toLowerCase().includes(search.value.toLowerCase()) ||
    listing.description?.toLowerCase().includes(search.value.toLowerCase()) ||
    listing.category?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// ✅ Resolve publisher name from loaded users
const getPublisherName = (publisherId) => {
  const user = users.value.find(u => String(u.id) === String(publisherId) || String(u._id) === String(publisherId));
  return user ? `${user.firstName} ${user.lastName}` : publisherId;
};

const loadListings = async () => {
  try {
    const raw = await listingService.getAll();
    listings.value = Array.isArray(raw) ? raw : raw?.data ?? [];

    const rawUsers = await userService.getAll();
    users.value = Array.isArray(rawUsers) ? rawUsers : rawUsers?.data ?? [];
  } catch (e) {
    console.error('Error loading data:', e);
  }
};

const onListingCreated = async () => {
  await loadListings();
  snackbarText.value = 'Listing created successfully!';
  snackbarColor.value = 'success';
  snackbar.value = true;
};

const deleteListing = async (id) => {
  if (confirm('Are you sure you want to delete this listing?')) {
    try {
      await listingService.delete(id);
      await loadListings();
      snackbarText.value = 'Listing deleted successfully!';
      snackbarColor.value = 'success';
      snackbar.value = true;
    } catch (e) {
      snackbarText.value = 'Failed to delete listing';
      snackbarColor.value = 'error';
      snackbar.value = true;
    }
  }
};

const openPurchaseDialog = (listing) => {
  selectedListing.value = listing;
  showPurchaseDialog.value = true;
};

const onPurchaseCompleted = () => {
  snackbarText.value = 'Purchase completed successfully!';
  snackbarColor.value = 'success';
  snackbar.value = true;
};
</script>