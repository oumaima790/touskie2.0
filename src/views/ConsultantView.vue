<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-6">Available Work</h2>
        <v-row>
          <v-col v-for="job in jobs" :key="job.id" cols="12" sm="6" md="4">
            <v-card elevation="2" class="h-100">
              <v-card-text class="py-6">
                <h3 class="text-h6 mb-2">{{ job.title }}</h3>
                <p class="text-body-2 mb-3" style="color: #666">{{ job.description }}</p>
                <v-chip size="small" color="#f97316" text-color="white" class="mb-3">
                  {{ job.category }}
                </v-chip>
                <div class="d-flex justify-space-between align-center">
                  <span class="font-weight-bold text-primary">${{ job.price }}</span>
                  <span style="font-size: 12px; color: #999">{{ job.dateAdded }}</span>
                </div>
                <div class="mt-3">
                  <v-btn color="primary" size="small" block>
                    Apply for Job
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col v-if="jobs.length === 0" cols="12">
            <v-alert type="info">No work available yet</v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- AI Chatbot Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-robot</v-icon>
            AI Consultant Assistant
            <v-spacer />
            <v-btn color="primary" @click="showChatbot = true">
              <v-icon class="mr-1">mdi-chat</v-icon>
              Chat with AI
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-4">
              Need help with your consulting work? Chat with our AI assistant for guidance on projects,
              best practices, and career advice.
            </p>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-chip color="primary" variant="outlined" class="mb-2">
                  💼 Project Analysis
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-chip color="primary" variant="outlined" class="mb-2">
                  📈 Career Guidance
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-chip color="primary" variant="outlined" class="mb-2">
                  🎯 Best Practices
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-chip color="primary" variant="outlined" class="mb-2">
                  🤝 Client Relations
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AIChatbot v-model="showChatbot" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import listingService from '../services/listingService.js'
import AIChatbot from '../components/AIChatbot.vue'

const jobs = computed(() => listingService.getAll())
const showChatbot = ref(false)

onMounted(async () => {
  await listingService.getAll()
})
</script>