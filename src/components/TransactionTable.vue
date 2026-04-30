<template>
  <v-card elevation="2">
    <v-table>
      <thead>
        <tr style="background-color: #f5f5f5">
          <th class="font-weight-bold">Amount</th>
          <th class="font-weight-bold">Type</th>
          <th class="font-weight-bold">Status</th>
          <th class="font-weight-bold">Description</th>
          <th class="font-weight-bold">User</th>
          <th class="font-weight-bold">Date</th>
          <th class="font-weight-bold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id" style="border-bottom: 1px solid #eee">
          <td class="py-3 font-weight-bold">${{ transaction.amount }}</td>
          <td class="py-3">
            <v-chip size="small" :color="getTypeColor(transaction.type)" text-color="white">
              {{ transaction.type }}
            </v-chip>
          </td>
          <td class="py-3">
            <v-chip size="small" :color="getStatusColor(transaction.status)" text-color="white">
              {{ transaction.status }}
            </v-chip>
          </td>
          <td class="py-3" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis">
            {{ transaction.description || 'N/A' }}
          </td>
          <td class="py-3">{{ getUserName(transaction.userId) }}</td>
          <td class="py-3">{{ formatDate(transaction.createdAt) }}</td>
          <td class="py-3">
            <v-btn icon color="red" @click="deleteTransaction(transaction.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="7" class="text-center py-4" style="color: #999">
            No transactions yet
          </td>
        </tr>
      </tbody>
    </v-table>
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
import { transactionService } from '../services/transactionService.js';
import userService from '../services/userService.js';

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['transactionDeleted']);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const deleteTransaction = async (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await transactionService.delete(id);
      snackbarText.value = "Transaction deleted successfully!";
      snackbarColor.value = "success";
      snackbar.value = true;
      emit('transactionDeleted');
    } catch (error) {
      snackbarText.value = 'Failed to delete transaction: ' + (error.response?.data?.message || error.message);
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  }
};

const getUserName = (userId) => {
  const user = userService.getUserById(userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
};

const getTypeColor = (type) => {
  const colors = {
    'income': '#4caf50',
    'expense': '#f44336',
    'transfer': '#2196f3'
  };
  return colors[type] || '#999';
};

const getStatusColor = (status) => {
  const colors = {
    'pending': '#ff9800',
    'completed': '#4caf50',
    'failed': '#f44336'
  };
  return colors[status] || '#999';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
</script>