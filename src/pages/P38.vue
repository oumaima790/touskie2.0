<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Availability & Packages</h1>
        <p>Set when you work and what you offer. Add package via dialog.</p>
      </div>
      <span class="chip">Step 3 / 3</span>
    </div>

    <div class="grid">
      <div class="dark-card">
        <h2>Availability</h2>

        <div class="availability-grid">
          <v-select
            v-for="d in days"
            :key="d.key"
            :label="d.label"
            :items="availabilityOptions"
            v-model="state.onboarding.availability[d.key]"
            prepend-icon="mdi-calendar"
          />
        </div>

        <v-switch
          v-model="state.onboarding.availability.pauseAccepting"
          inset
          color="primary"
          label="Pause accepting requests"
          hint="Temporarily hide you from matching."
          persistent-hint
        />

        <div class="actions">
          <button class="text-btn" @click="navigate('p36')">Back</button>
          <button class="primary-btn" @click="navigate('p40')">Next</button>
        </div>
      </div>

      <div class="dark-card">
        <div class="card-header">
          <h2>Packages</h2>
          <button class="small-btn" @click="openAddPackageDialog">+ Add</button>
        </div>

        <div v-if="state.onboarding.packages.length" class="package-list">
          <div
            v-for="(p, i) in state.onboarding.packages"
            :key="i"
            class="package-item"
          >
            <v-icon>mdi-briefcase-outline</v-icon>
            <div>
              <strong>{{ p.name }}</strong>
              <span>{{ p.duration }} • {{ p.price }} TND</span>
            </div>
            <button class="delete-btn" @click="openDeletePackageDialog(i)">×</button>
          </div>
        </div>

        <div v-else class="status-box info">
          <strong>No packages yet</strong>
          <span>Add at least one package so users can pick an offer.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const {
  state,
  days,
  availabilityOptions,
  navigate,
  openAddPackageDialog,
  openDeletePackageDialog,
} = useTouskieConsultantUI();
</script>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.page-header,
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

h2 {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 800;
}

.availability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.card-header,
.actions,
.package-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions {
  margin-top: 32px;
}

button {
  cursor: pointer;
}

.text-btn,
.primary-btn,
.small-btn {
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
  padding: 12px 20px;
  background: #ff6b13;
  color: white;
}

.small-btn {
  padding: 10px 14px;
  background: rgba(255, 107, 19, 0.14);
  color: #ff6b13;
}

.package-list {
  display: grid;
  gap: 14px;
}

.package-item {
  gap: 14px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.package-item .v-icon {
  color: #ff6b13;
}

.package-item div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.package-item span {
  color: #a8b3c4;
}

.delete-btn {
  border: none;
  background: transparent;
  color: #ff6b13;
  font-size: 24px;
}

.status-box {
  padding: 16px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info {
  background: rgba(59, 130, 246, 0.13);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #bfdbfe;
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

  .availability-grid {
    grid-template-columns: 1fr;
  }
}
</style>