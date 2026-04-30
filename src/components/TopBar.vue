<template>
  <v-app-bar
    height="64"
    elevation="0"
    style="background: #071426; color: white; border-bottom: 1px solid rgba(255,255,255,0.08);"
  >
    <!-- LEFT -->
    <div class="d-flex align-center pl-4">
      <div class="brand">Touskié</div>
      <div class="mode">Consultant mode</div>
    </div>

    <v-spacer />

    <!-- RIGHT -->
    <div class="d-flex align-center pr-4 ga-2">
      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn class="top-btn">Search</v-btn>
      <v-btn class="top-btn">Inbox</v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="top-btn">
            Profile
            <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item title="My profile" />
          <v-list-item title="Settings" />
          <v-list-item title="Logout" />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.brand {
  color: #ff6b13;
  font-weight: 800;
  font-size: 1.25rem;
  margin-right: 12px;
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
</style>