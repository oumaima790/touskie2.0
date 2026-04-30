<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Users</h2>
        <UserForm @userCreated="loadUsers" />
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="mb-4">All Users</h2>
        <v-card elevation="2">
          <v-table>
            <thead>
              <tr style="background-color: #f5f5f5">
                <th class="font-weight-bold">Name</th>
                <th class="font-weight-bold">Email</th>
                <th class="font-weight-bold">Role</th>
                <th class="font-weight-bold">Created</th>
                <th class="font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" style="border-bottom: 1px solid #eee">
                <td class="py-3">{{ user.firstName }} {{ user.lastName }}</td>
                <td class="py-3">{{ user.email }}</td>
                <td class="py-3">
                  <v-chip size="small" :color="getRoleColor(user.role)" text-color="white">
                    {{ user.role }}
                  </v-chip>
                </td>
                <td class="py-3">{{ formatDate(user.createdAt) }}</td>
                <td class="py-3">
                  <v-btn size="small" variant="outlined" color="error" @click="deleteUser(user.id)">
                    Delete
                  </v-btn>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5" class="text-center py-4" style="color: #999">
                  No users yet
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserForm from '../components/UserForm.vue'
import userService from '../services/userService.js'

const users = ref([]);

onMounted(async () => {
  await loadUsers();
});

const loadUsers = async () => {
  users.value = await userService.fetchAllUsers();
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userService.delete(id);
      await loadUsers(); // Refresh the list
    } catch (error) {
      alert('Failed to delete user');
    }
  }
};

const getRoleColor = (role) => {
  const colors = {
    'user': '#2196f3',
    'consultant': '#ff9800',
    'publisher': '#4caf50'
  };
  return colors[role] || '#999';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
</script>