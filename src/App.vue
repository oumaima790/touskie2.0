<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const mode = ref("router"); // "router" | "window"

const router = useRouter();
const drawer = ref(false);
const showChatbot = ref(false);

import { useTouskieConsultantUI } from "./store/useTouskieConsultantUI";

import TopBar from "./components/TopBar.vue";
import AppDialog from "./components/AppDialog.vue";
import AIChatbot from "./components/AIChatbot.vue";

import P33 from "./pages/P33.vue";
import P34 from "./pages/P34.vue";
import P36 from "./pages/P36.vue";
import P38 from "./pages/P38.vue";
import P40 from "./pages/P40.vue";
import P42 from "./pages/P42.vue";
import P46 from "./pages/P46.vue";
import P48 from "./pages/P48.vue";
import P50 from "./pages/P50.vue";
import About from "./pages/About.vue";

const { currentRoute, onHashChange } = useTouskieConsultantUI();

onMounted(() => {
  if (mode.value === "window") {
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = "#/p33";
    onHashChange();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", onHashChange);
});

function goRouterMode() {
  mode.value = "router";
}

function goWindowMode() {
  mode.value = "window";
  if (!window.location.hash) window.location.hash = "#/p33";
  onHashChange();
  window.addEventListener("hashchange", onHashChange);
}
</script>

<template>
  <v-app style="background: #0e203a;">
    <template v-if="mode === 'router'">
      <v-app-bar
        style="background: #071426; color: white;"
        elevation="4"
        height="64"
        class="px-4"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" />

        <v-app-bar-title class="brand font-weight-bold" @click="$router.push('/')">
          Touskie <span class="sub">E-commerce</span>
        </v-app-bar-title>

        <v-spacer />

        <v-btn variant="text" @click="goWindowMode" class="consultant-link">
          Consultant UI
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <router-link to="/" style="text-decoration: none;">
            <v-list-item>
              <v-list-item-title>Welcome</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link to="/users" style="text-decoration: none;">
            <v-list-item>
              <v-list-item-title>Users</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link to="/listings" style="text-decoration: none;">
            <v-list-item>
              <v-list-item-title>Listings</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link to="/transaction" style="text-decoration: none;">
            <v-list-item>
              <v-list-item-title>Transaction</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link to="/consultants" style="text-decoration: none;">
            <v-list-item>
              <v-list-item-title>Consultants</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list>
      </v-navigation-drawer>

      <v-main style="background: linear-gradient(180deg, #071426 0%, #0e203a 100%); min-height: 100vh;">
        <router-view />
      </v-main>

      <v-btn
        fab
        style="position: fixed; right: 24px; bottom: 24px; z-index: 1000; background-color: #ff6b13; color: white;"
        @click="showChatbot = true"
        class="chatbot-button"
      >
        <v-icon>mdi-robot</v-icon>
      </v-btn>

      <AIChatbot v-model="showChatbot" />
    </template>

    <template v-else>
      <TopBar />

      <v-main style="background: linear-gradient(180deg, #071426 0%, #0e203a 100%); min-height: 100vh;">
        <v-container fluid class="pa-6" style="background: transparent;">
          <v-window v-model="currentRoute">
            <v-window-item value="p33"><P33 /></v-window-item>
            <v-window-item value="p34"><P34 /></v-window-item>
            <v-window-item value="p36"><P36 /></v-window-item>
            <v-window-item value="p38"><P38 /></v-window-item>
            <v-window-item value="p40"><P40 /></v-window-item>
            <v-window-item value="p42"><P42 /></v-window-item>
            <v-window-item value="p46"><P46 /></v-window-item>
            <v-window-item value="p48"><P48 /></v-window-item>
            <v-window-item value="p50"><P50 /></v-window-item>
            <v-window-item value="about"><About /></v-window-item>
          </v-window>
        </v-container>
      </v-main>

      <AppDialog />

      <v-btn
        style="position: fixed; right: 16px; bottom: 16px; z-index: 9999; background-color: #ff6b13; color: white;"
        @click="goRouterMode"
      >
        E-commerce UI
      </v-btn>
    </template>
  </v-app>
</template>

<style scoped>
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateX(4px);
  background-color: rgba(255, 107, 19, 0.1);
}

.brand {
  color: #ff6b13 !important;
  font-weight: 700;
  cursor: pointer;
}

.sub {
  color: #ffffff;
}

.consultant-link {
  color: #ff6b13 !important;
}
</style>