<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Assisted Transaction Summary</h1>
        <p>Status overview. Confirm delivery triggers the popup.</p>
      </div>
      <span class="chip">{{ state.consultant.currentCase.caseId }}</span>
    </div>

    <div class="dark-card">
      <div class="summary-box">
        <strong>{{ state.consultant.currentCase.listing }}</strong>
        <span>Status: {{ state.consultant.currentCase.status }}</span>
      </div>

      <div class="divider"></div>

      <h2>Timeline</h2>

      <div class="timeline-item">
        <v-icon>mdi-check-circle-outline</v-icon>
        <div><strong>Validated</strong><span>Done</span></div>
      </div>

      <div class="timeline-item">
        <v-icon>mdi-truck-outline</v-icon>
        <div><strong>Delivery</strong><span>In progress</span></div>
      </div>

      <div class="timeline-item">
        <v-icon>mdi-progress-clock</v-icon>
        <div><strong>Completion</strong><span>Pending</span></div>
      </div>

      <div class="timeline-item">
        <v-icon>mdi-star-outline</v-icon>
        <div><strong>Review</strong><span>Pending</span></div>
      </div>

      <div class="actions">
        <button class="text-btn" @click="navigate('p46')">Back</button>
        <button class="primary-btn" @click="openConfirmDeliveryDialog">
          Confirm delivery
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { state, navigate, openConfirmDeliveryDialog } = useTouskieConsultantUI();
</script>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.page-header,
.dark-card {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
}

.page-header p {
  margin: 0;
  color: #a8b3c4;
}

.chip {
  height: fit-content;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 107, 19, 0.15);
  color: #ff6b13;
  font-weight: 700;
  border: 1px solid rgba(255, 107, 19, 0.35);
}

.dark-card {
  padding: 28px;
  border-radius: 18px;
  background: #071426;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.summary-box {
  padding: 18px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.13);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #bfdbfe;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.divider {
  height: 1px;
  margin: 24px 0;
  background: rgba(255, 255, 255, 0.08);
}

h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 800;
}

.timeline-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
}

.timeline-item .v-icon {
  color: #ff6b13;
}

.timeline-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-item span {
  color: #a8b3c4;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}

button {
  cursor: pointer;
}

.text-btn,
.primary-btn {
  border: none;
  border-radius: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.text-btn {
  background: transparent;
  color: white;
}

.primary-btn {
  padding: 14px 22px;
  background: #ff6b13;
  color: white;
}

@media (max-width: 900px) {
  .page {
    padding: 32px 20px;
  }

  .page-header {
    flex-direction: column;
  }
}
</style>