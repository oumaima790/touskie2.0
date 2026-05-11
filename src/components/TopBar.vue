<template>
  <v-app-bar
    height="64"
    elevation="0"
    style="background: #071426; color: white; border-bottom: 1px solid rgba(255,255,255,0.08);"
  >
    <!-- LEFT -->
    <div class="d-flex align-center pl-4">
      <div class="brand" @click="goHome">Touskié</div>
      <div class="mode">{{ modeBadgeText }}</div>
    </div>

    <v-spacer />

    <!-- RIGHT -->
    <div class="d-flex align-center pr-4 ga-2">
      <v-btn icon @click="openNotifications">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn class="top-btn" @click="openSearch">
        Search
      </v-btn>

      <v-btn class="top-btn" @click="openInbox">
        Inbox
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="top-btn">
            Profile
            <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list class="profile-menu">
          <v-list-item
            title="My profile"
            prepend-icon="mdi-account-outline"
            @click="goToProfile"
          />

          <v-list-item
            title="Settings"
            prepend-icon="mdi-cog-outline"
            @click="goToSettings"
          />

          <v-list-item
            title="Logout"
            prepend-icon="mdi-logout"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useTouskieConsultantUI } from '../store/useTouskieConsultantUI'

const {
  navigate,
  modeBadgeText,
  openNotifications,
  openSearch,
  openInbox,
} = useTouskieConsultantUI()

function goHome() {
  navigate('p33')
}

function goToProfile() {
  navigate('p42')
}

function goToSettings() {
  navigate('p50')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('consultantMode')
  localStorage.removeItem('touskie_user')
  localStorage.removeItem('touskie_token')

  window.location.href = '/login'
}
</script>

<style scoped>
.brand {
  color: #ff6b13;
  font-weight: 800;
  font-size: 1.25rem;
  margin-right: 12px;
  cursor: pointer;
}

.mode {
  color: #a8b3c4;
  font-size: 0.9rem;
}

.top-btn {
  background: rgba(255,255,255,0.06);
  color: white;
  text-transform: none;
  font-weight: 600;
}

.profile-menu {
  background: #1f1f1f;
  color: white;
}

.profile-menu :deep(.v-list-item) {
  cursor: pointer;
}
</style>