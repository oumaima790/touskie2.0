<template>
  <v-app-bar color="#0a1628" elevation="0" height="64" class="px-4">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" class="d-lg-none" />

    <v-app-bar-title class="d-flex align-center">
      <router-link to="/" style="text-decoration: none;">
        <div class="brand-logo">
          <span class="brand-text">Touskie</span>
          <span class="brand-subtitle">B2B</span>
        </div>
      </router-link>
    </v-app-bar-title>

    <v-spacer />

    <div class="d-none d-lg-flex align-center gap-4">
      <router-link to="/" style="text-decoration: none;">
        <v-btn variant="text" class="nav-btn">Welcome</v-btn>
      </router-link>
      <v-btn variant="text" class="nav-btn consultant-link" @click="$router.push('/consultant-ui')">
        Hire A Consultant
      </v-btn>
      <v-btn variant="text" class="nav-btn consultant-link" @click="$router.push('/consultant-ui')">
        Find Work
      </v-btn>
      <router-link to="/users" style="text-decoration: none;">
        <v-btn variant="text" class="nav-btn">Users</v-btn>
      </router-link>
      <router-link to="/listings" style="text-decoration: none;">
        <v-btn variant="text" class="nav-btn">Listings</v-btn>
      </router-link>
      <router-link to="/transactions" style="text-decoration: none;">
        <v-btn variant="text" class="nav-btn">Transactions</v-btn>
      </router-link>
      <router-link to="/consultants" style="text-decoration: none;">
        <v-btn variant="text" class="nav-btn">Consultants</v-btn>
      </router-link>
    </div>

    <div class="d-flex align-center gap-2">
      <v-btn variant="text" class="text-capitalize mr-1" style="color:#ccc;font-size:15px" @click="$router.push('/login')">
        Log In
      </v-btn>
      <v-btn variant="text" class="text-capitalize mr-3" style="color:#ccc;font-size:15px" @click="$router.push('/signup')">
        Sign Up
      </v-btn>
      <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold" rounded="lg" size="large" @click="$router.push('/signup')">
        Post a Project
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineEmits(['toggle-drawer']);
const router = useRouter();

const handlePostProjectClick = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;
  if (currentUser) {
    router.push('/listings');
  } else {
    // Ensure user sees the signup interface before listing creation
    router.push({ path: '/', query: { postProject: '1' } });
  }
};
</script>

<style scoped>
.brand-logo {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-text {
  font-size: 22px;
  font-weight: 800;
  color: #ff6b00 !important;
  transition: all 0.3s ease;
}

.brand-subtitle {
  font-size: 11px;
  color: #888;
  margin-left: 6px;
  letter-spacing: 2px;
}

.brand-logo:hover .brand-text {
  color: #e55a00;
  transform: scale(1.05);
}

.nav-btn {
  color: #ccc;
  font-size: 15px;
  text-transform: capitalize;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #f97316;
  background-color: rgba(249, 115, 22, 0.1);
}

.consultant-link {
  color: #ff6b00 !important;
}
</style>