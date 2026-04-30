<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Consultant Dashboard</h1>
        <p>Overview of requests and cases.</p>
      </div>
      <span class="success-chip">Working</span>
    </div>

    <div class="kpi-grid">
      <div class="dark-card kpi">
        <span>Pending Requests</span>
        <strong>{{ state.consultant.kpis.pending }}</strong>
      </div>

      <div class="dark-card kpi">
        <span>Active Transactions</span>
        <strong>{{ state.consultant.kpis.active }}</strong>
      </div>

      <div class="dark-card kpi">
        <span>Completed</span>
        <strong>{{ state.consultant.kpis.completed }}</strong>
      </div>
    </div>

    <div class="grid">
      <div class="dark-card">
        <h2>Incoming Requests</h2>

        <div
          v-for="r in state.consultant.requests"
          :key="r.id"
          class="request-item"
        >
          <v-icon>mdi-inbox-arrow-down-outline</v-icon>
          <div>
            <strong>{{ r.id }} — {{ r.listing }}</strong>
            <span>{{ r.amount }} TND • Navigator: {{ r.navigator }} • Publisher: {{ r.publisher }}</span>
          </div>
          <button class="small-btn" @click="openIncomingRequestDialog(r)">Open</button>
        </div>
      </div>

      <div class="dark-card">
        <h2>Recent Activity</h2>

        <div
          v-for="(x, i) in state.consultant.recent"
          :key="i"
          class="activity-item"
        >
          <v-icon>mdi-history</v-icon>
          <div>
            <strong>{{ x.t }}</strong>
            <span>{{ x.when }}</span>
          </div>
        </div>

        <div class="side-actions">
          <button class="secondary-btn" @click="navigate('p46')">Validation</button>
          <button class="secondary-btn" @click="navigate('p50')">Settings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { state, navigate, openIncomingRequestDialog } = useTouskieConsultantUI();
</script>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.page-header,
.kpi-grid,
.grid {
  max-width: 1200px;
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

.page-header p,
.request-item span,
.activity-item span,
.kpi span {
  color: #a8b3c4;
}

.success-chip {
  height: fit-content;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  color: #bbf7d0;
  font-weight: 700;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
}

.dark-card {
  padding: 28px;
  border-radius: 18px;
  background: #071426;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.kpi {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi strong {
  color: #ff6b13;
  font-size: 36px;
}

h2 {
  margin: 0 0 22px;
  font-size: 20px;
  font-weight: 800;
}

.request-item,
.activity-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.request-item:last-child,
.activity-item:last-child {
  border-bottom: none;
}

.request-item .v-icon,
.activity-item .v-icon {
  color: #ff6b13;
}

.request-item div,
.activity-item div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

button {
  cursor: pointer;
}

.small-btn,
.secondary-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: rgba(255, 107, 19, 0.14);
  color: #ff6b13;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.side-actions {
  margin-top: 24px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .page {
    padding: 32px 20px;
  }

  .page-header,
  .grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>