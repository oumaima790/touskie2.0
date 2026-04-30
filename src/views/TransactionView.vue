<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-6">Transaction History</h2>
        <v-card elevation="3">
          <v-data-table
            :items="transactions"
            :headers="headers"
            class="elevation-1"
            :items-per-page="10"
          >
            <template #no-data>
              <div class="text-center pa-8">
                <v-icon size="48" class="mb-2" color="grey-lighten-1">mdi-cash-multiple</v-icon>
                <div class="text-h6">No transactions yet</div>
                <div class="text-body-2">Buy some listings to see transactions here</div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import transactionService from '../services/transactionService.js'

const transactions = computed(() => transactionService.getAll().value)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Buyer', value: 'buyerName' },
  { title: 'Listing', value: 'listingTitle' },
  { title: 'Price', value: 'price' },
  { title: 'Consultant Type', value: 'consultantType' },
  { title: 'Consultant', value: 'consultantName' },
  { title: 'Date', value: 'date' }
]
</script>