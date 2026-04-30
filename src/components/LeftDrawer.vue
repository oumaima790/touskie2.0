<template>
  <v-navigation-drawer permanent width="280" elevation="4" class="pa-4">
    <v-list density="compact" nav class="py-4">
      <v-list-subheader class="text-uppercase font-weight-bold mb-4" style="color: #f97316;">
        Navigation Menu
      </v-list-subheader>

      <v-list-item
        :active="currentRoute === 'p33'"
        @click="navigate('p33')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-account-plus</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Join as Consultant</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p34'"
        @click="navigate('p34')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-file-upload</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Upload CV</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p36'"
        @click="navigate('p36')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-card-account-details</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Profile Form</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p38'"
        @click="navigate('p38')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-calendar-clock</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Availability & Packages</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p40'"
        @click="navigate('p40')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-check-circle</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Review & Submit</v-list-item-title>
      </v-list-item>

      <v-divider class="my-4" />

      <v-list-item
        :active="currentRoute === 'p42'"
        @click="navigate('p42')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-view-dashboard</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p46'"
        @click="navigate('p46')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-shield-check</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Validation</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p48'"
        @click="navigate('p48')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-file-chart</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Assisted Summary</v-list-item-title>
      </v-list-item>

      <v-list-item
        :active="currentRoute === 'p50'"
        @click="navigate('p50')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-cog</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Settings</v-list-item-title>
      </v-list-item>

      <v-divider class="my-4" />

      <v-list-item
        :active="currentRoute === 'about'"
        @click="navigate('about')"
        class="mb-2 rounded-lg hover-lift"
        style="transition: all 0.3s ease;"
      >
        <template #prepend>
          <v-icon color="#f97316">mdi-information</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">Notes</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateX(4px);
  background-color: rgba(249, 115, 22, 0.1);
}

.v-list-item--active {
  background-color: rgba(249, 115, 22, 0.2);
  border-left: 4px solid #f97316;
}
</style>

<script setup>
import { computed } from "vue";
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { currentRoute: cr, navigate } = useTouskieConsultantUI();
const currentRoute = computed(() => cr.value);
</script>