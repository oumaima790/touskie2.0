<template>
  <v-container fluid class="pa-6 listing-page">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h4 font-weight-bold page-title">Add Listing</h2>

          <v-btn
            prepend-icon="mdi-plus"
            size="large"
            class="hover-lift add-listing-btn"
            @click="showForm = !showForm"
          >
            {{ showForm ? 'Hide Form' : 'Add Listing' }}
          </v-btn>
        </div>

        <v-expand-transition>
          <div v-show="showForm">
            <v-card elevation="3" class="pa-4 mb-6 form-card">
              <ListingForm @listingCreated="onListingCreated" />
            </v-card>
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-medium page-title">All Listings</h2>

          <v-text-field
            v-model="search"
            label="Search listings..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 380px;"
            class="search-field"
            hide-details
          />
        </div>

        <v-card elevation="3" class="listings-card">
          <v-table hover class="listings-table">
            <thead>
              <tr>
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
                class="hover-row"
              >
                <td class="pa-4 font-weight-medium">
                  {{ listing.title }}
                </td>

                <td class="pa-4 listing-description">
                  {{ listing.description }}
                </td>

                <td class="pa-4">
                  <v-chip
                    size="small"
                    class="category-chip"
                    variant="flat"
                  >
                    {{ listing.category }}
                  </v-chip>
                </td>

                <td class="pa-4 font-weight-bold listing-price">
                  ${{ listing.price }}
                </td>

                <td class="pa-4">
                  {{ new Date(listing.dateAdded).toLocaleDateString() }}
                </td>

                <td class="pa-4">
                  {{ getPublisherName(listing.publisherId) }}
                </td>

                <td class="pa-4 text-center">
                  <v-btn
                    size="small"
                    class="mr-2 buy-btn"
                    @click="openPurchaseDialog(listing)"
                  >
                    Buy
                  </v-btn>

                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    class="delete-btn"
                    @click="deleteListing(listing._id)"
                  />
                </td>
              </tr>

              <tr v-if="filteredListings.length === 0">
                <td colspan="7" class="text-center pa-8 empty-state">
                  <v-icon size="48" class="mb-2 empty-icon">
                    mdi-package-variant
                  </v-icon>

                  <div class="text-h6">No listings found</div>

                  <div v-if="search" class="text-body-2">
                    Try adjusting your search terms
                  </div>

                  <div v-else class="text-body-2">
                    Create your first listing to get started
                  </div>
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

<script setup>
import { ref, onMounted, computed } from 'vue';
import ListingForm from '../components/ListingForm.vue';
import PurchaseDialog from '../components/PurchaseDialog.vue';
import listingService from '../services/listingService.js';
import userService from '../services/userService.js';

const demoListings = [
  {
    _id: 'demo-1',
    title: 'Industrial Solar Energy Project - 5MW',
    description: 'Large renewable energy project looking for strategic and financial consulting.',
    category: 'Renewable Energy',
    price: 15000,
    dateAdded: '2026-05-11',
    publisherId: 'demo-publisher-1'
  },
  {
    _id: 'demo-2',
    title: 'Commercial Warehouse Investment',
    description: 'Warehouse investment opportunity requiring real estate and logistics advisory.',
    category: 'Real Estate',
    price: 28000,
    dateAdded: '2026-05-10',
    publisherId: 'demo-publisher-2'
  },
  {
    _id: 'demo-3',
    title: 'Smart Logistics Software',
    description: 'Technology project needing digital transformation and software consulting.',
    category: 'Technology',
    price: 48000,
    dateAdded: '2026-05-09',
    publisherId: 'demo-publisher-3'
  },
  {
    _id: 'demo-4',
    title: 'Business Strategy Consulting',
    description: 'Company looking for market expansion and growth strategy support.',
    category: 'Consulting',
    price: 12000,
    dateAdded: '2026-05-08',
    publisherId: 'demo-publisher-4'
  },
  {
    _id: 'demo-5',
    title: 'Agricultural Export Partnership',
    description: 'Agriculture export project looking for legal, logistics, and market advisory.',
    category: 'Agriculture',
    price: 22000,
    dateAdded: '2026-05-07',
    publisherId: 'demo-publisher-5'
  },
  {
    _id: 'demo-6',
    title: 'Data Center Infrastructure Project',
    description: 'Infrastructure project requiring IT, finance, and operational consulting.',
    category: 'Technology',
    price: 35000,
    dateAdded: '2026-05-06',
    publisherId: 'demo-publisher-6'
  }
];

const demoPublishers = {
  'demo-publisher-1': 'Yassine FRIAA',
  'demo-publisher-2': 'Ahmed Yacine Ben Ahmed',
  'demo-publisher-3': 'Mohamed Amine Trabelsi',
  'demo-publisher-4': 'Nourhene Ben Salah',
  'demo-publisher-5': 'Sarra Jaziri',
  'demo-publisher-6': 'Mehdi Ben Romdhane'
};

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

const getPublisherName = (publisherId) => {
  if (demoPublishers[publisherId]) {
    return demoPublishers[publisherId];
  }

  const user = users.value.find(
    u => String(u.id) === String(publisherId) || String(u._id) === String(publisherId)
  );

  return user ? `${user.firstName} ${user.lastName}` : publisherId;
};

const loadListings = async () => {
  try {
    const raw = await listingService.getAll();
    const apiListings = Array.isArray(raw) ? raw : raw?.data ?? [];

    listings.value = [
      ...demoListings,
      ...apiListings
    ];

    const rawUsers = await userService.getAll();
    users.value = Array.isArray(rawUsers) ? rawUsers : rawUsers?.data ?? [];
  } catch (e) {
    console.error('Error loading data:', e);
    listings.value = demoListings;
  }
};

const onListingCreated = async () => {
  await loadListings();

  snackbarText.value = 'Listing created successfully!';
  snackbarColor.value = 'success';
  snackbar.value = true;
};

const deleteListing = async (id) => {
  if (String(id).startsWith('demo-')) {
    listings.value = listings.value.filter(listing => listing._id !== id);

    snackbarText.value = 'Demo listing removed from the page!';
    snackbarColor.value = 'success';
    snackbar.value = true;
    return;
  }

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

<style scoped>
.listing-page {
  background: #071426;
  color: #ffffff;
  min-height: 100vh;
}

.page-title {
  color: #ffffff;
}

.form-card {
  background: #0b1a2e !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.add-listing-btn {
  background: #ff6b13 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 700;
}

.add-listing-btn:hover {
  background: #ff812f !important;
}

.search-field {
  color: #ffffff;
}

.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.04) !important;
  border-radius: 6px;
}

.search-field :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.45) !important;
}

.search-field :deep(.v-label) {
  color: #a8b3c4 !important;
}

.search-field :deep(input) {
  color: #ffffff !important;
}

.search-field :deep(.v-icon) {
  color: #a8b3c4 !important;
}

.listings-card {
  background: #0b1a2e !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.listings-table {
  background: #0b1a2e !important;
  color: #ffffff !important;
}

.listings-table :deep(table) {
  background: #0b1a2e !important;
}

.listings-table :deep(thead) {
  background: #10233d !important;
}

.listings-table :deep(th) {
  background: #10233d !important;
  color: #dbe7f5 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.listings-table :deep(tbody tr) {
  background: #0b1a2e !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.listings-table :deep(tbody tr:hover) {
  background: #112846 !important;
}

.listings-table :deep(td) {
  color: #ffffff !important;
}

.listing-description {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #dbe7f5 !important;
}

.category-chip {
  background: #ff6b13 !important;
  color: #ffffff !important;
  font-weight: 700;
}

.listing-price {
  color: #ff812f !important;
}

.buy-btn {
  background: #ff6b13 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 6px;
}

.buy-btn:hover {
  background: #ff812f !important;
}

.delete-btn {
  background: rgba(255, 107, 19, 0.16) !important;
  color: #ff812f !important;
  border: 1px solid rgba(255, 107, 19, 0.45);
}

.delete-btn:hover {
  background: rgba(255, 107, 19, 0.28) !important;
}

.empty-state {
  color: #a8b3c4 !important;
  background: #0b1a2e !important;
}

.empty-icon {
  color: #64748b !important;
}

.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 19, 0.25);
}

.hover-row {
  transition: background 0.2s ease;
}
</style>