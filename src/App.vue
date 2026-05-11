<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

const mode = ref("router"); // "router" | "window"

const drawer = ref(false);
const showChatbot = ref(false);

const route = useRoute();
const router = useRouter();

const currentUser = ref(JSON.parse(localStorage.getItem("user")) || null);

const isLoggedIn = computed(() => {
  return Boolean(localStorage.getItem("token") || currentUser.value);
});

function refreshCurrentUser() {
  currentUser.value = JSON.parse(localStorage.getItem("user")) || null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("consultantMode");
  localStorage.removeItem("touskie_user");
  localStorage.removeItem("touskie_token");

  refreshCurrentUser();
  router.push("/login");
}

const categories = [
  { name: "Strategy", icon: "📊" },
  { name: "Finance", icon: "💰" },
  { name: "Digital", icon: "💻" },
  { name: "Operations", icon: "⚙️" },
  { name: "Legal", icon: "⚖️" }
];

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

function goRouterMode() {
  mode.value = "router";
}

function goWindowMode() {
  mode.value = "window";

  if (!window.location.hash) {
    window.location.hash = "#/p33";
  }

  onHashChange();
  window.addEventListener("hashchange", onHashChange);
}

function handleConsultantSignupRedirect() {
  const shouldOpenConsultantUI = localStorage.getItem("openConsultantUI");

  if (shouldOpenConsultantUI === "true") {
    localStorage.removeItem("openConsultantUI");
    goWindowMode();
  }
}

watch(
  () => route.fullPath,
  () => {
    refreshCurrentUser();
  }
);

onMounted(() => {
  refreshCurrentUser();
  handleConsultantSignupRedirect();

  window.addEventListener("open-consultant-ui", goWindowMode);

  window.addEventListener("storage", refreshCurrentUser);

  if (mode.value === "window") {
    window.addEventListener("hashchange", onHashChange);

    if (!window.location.hash) {
      window.location.hash = "#/p33";
    }

    onHashChange();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", onHashChange);
  window.removeEventListener("open-consultant-ui", goWindowMode);
  window.removeEventListener("storage", refreshCurrentUser);
});
</script>

<template>
  <v-app class="app-shell">
    <!-- E-COMMERCE MODE -->
    <template v-if="mode === 'router'">
      <v-app-bar
        class="main-app-bar px-4"
        elevation="4"
        height="72"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" />

        <v-app-bar-title class="brand font-weight-bold" @click="$router.push('/')">
          Touskie <span class="sub">E-commerce</span>
        </v-app-bar-title>

        <div class="header-categories">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="header-link"
              >
                
                
              </v-btn>
            </template>

            <v-list class="category-menu">
              <v-list-item
                v-for="cat in categories"
                :key="cat.name"
                @click="$router.push('/listings')"
              >
                <v-list-item-title>
                  {{ cat.icon }} {{ cat.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-spacer />

        <template v-if="!isLoggedIn">
          <v-btn
            variant="text"
            class="header-link"
            @click="$router.push('/login')"
          >
            Log In
          </v-btn>

          <v-btn
            variant="text"
            class="header-link"
            @click="$router.push('/signup')"
          >
            Sign Up
          </v-btn>
        </template>

        <template v-else>
          <v-btn
            variant="text"
            class="header-link logout-link"
            @click="logout"
          >
            Logout
          </v-btn>
        </template>

        <v-btn
          class="post-project-btn"
          @click="$router.push('/?postProject=1')"
        >
          Post A Project
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary class="app-drawer">
        <v-list class="drawer-list">
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

      <v-main class="main-background">
        <router-view />
      </v-main>

      <button class="chatbot-button" @click="showChatbot = true">
        <v-icon>mdi-robot</v-icon>
      </button>

      <AIChatbot v-model="showChatbot" />
    </template>

    <!-- CONSULTANT MODE -->
    <template v-else>
      <TopBar />

      <v-main class="main-background">
        <v-container fluid class="pa-6 consultant-container">
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
        class="ecommerce-button"
        @click="goRouterMode"
      >
        E-commerce UI
      </v-btn>
    </template>
  </v-app>
</template>

<style>
html,
body,
#app {
  background: #071426 !important;
  margin: 0;
  min-height: 100vh;
}

.v-application {
  background: #071426 !important;
}

.v-main {
  background: linear-gradient(180deg, #071426 0%, #0e203a 100%) !important;
}
</style>

<style scoped>
.app-shell {
  background: #071426 !important;
  color: #ffffff;
  min-height: 100vh;
}

.main-app-bar {
  background: #071426 !important;
  color: white !important;
}

.main-background {
  background: linear-gradient(180deg, #071426 0%, #0e203a 100%) !important;
  min-height: 100vh;
}

.consultant-container {
  background: transparent !important;
  min-height: 100vh;
}

.app-drawer {
  background: #0b1a2e !important;
  color: #ffffff !important;
}

.drawer-list {
  background: #0b1a2e !important;
  color: #ffffff !important;
}

.drawer-list :deep(.v-list-item-title) {
  color: #ffffff !important;
}

.brand {
  color: #ff6b13 !important;
  font-weight: 800;
  cursor: pointer;
}

.sub {
  color: #ffffff;
}

.header-categories {
  margin-left: 34px;
}

.header-link {
  color: #dbe7f5 !important;
  text-transform: none;
  font-weight: 600;
  font-size: 15px;
}

.header-link:hover {
  color: #ff812f !important;
}

.logout-link {
  color: #ff9b6a !important;
}

.post-project-btn {
  margin-left: 12px;
  background: transparent !important;
  color: #ff6b13 !important;
  text-transform: none;
  font-weight: 800;
  font-size: 15px;
}

.post-project-btn:hover {
  background: rgba(255, 107, 19, 0.1) !important;
}

.category-menu {
  background: #071426 !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.category-menu :deep(.v-list-item-title) {
  color: white !important;
}

.category-menu :deep(.v-list-item:hover) {
  background: rgba(255, 107, 19, 0.12) !important;
}

.chatbot-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;

  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  outline: none;

  background: #ff6b13;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  box-shadow: 0 0 24px rgba(255, 107, 19, 0.45);
  transition: all 0.2s ease;
}

.chatbot-button:hover {
  background: #ff812f;
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 107, 19, 0.6);
}

.chatbot-button .v-icon {
  font-size: 28px;
}

.ecommerce-button {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  background-color: #ff6b13 !important;
  color: white !important;
}
</style>