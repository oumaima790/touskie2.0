<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Consultant Settings</h1>
        <p>Preferences for profile visibility and notifications. Leaving with unsaved changes shows a warning.</p>
      </div>
      <span class="chip">Settings</span>
    </div>

    <div class="grid">
      <div class="dark-card">
        <h2>Preferences</h2>

        <v-switch
          v-model="state.settings.profileVisible"
          color="primary"
          label="Public profile visibility"
          hint="If off, you won't appear in search."
          persistent-hint
          @update:modelValue="markDirty"
        />

        <div class="divider"></div>

        <v-switch
          v-model="state.settings.notifyEmail"
          color="primary"
          label="Email notifications"
          hint="Requests, reminders, updates."
          persistent-hint
          @update:modelValue="markDirty"
        />

        <v-switch
          v-model="state.settings.notifyInApp"
          color="primary"
          label="In-app notifications"
          hint="Bell icon notifications."
          persistent-hint
          @update:modelValue="markDirty"
        />

        <div class="divider"></div>

        <button class="danger-btn" @click="openDeactivateDialog">
          <v-icon>mdi-account-off-outline</v-icon>
          Deactivate consultant role
        </button>

        <div class="actions">
          <button class="text-btn" @click="settingsBack">Back</button>
          <button
            class="primary-btn"
            :disabled="!state.dirtySettings"
            @click="saveSettings"
          >
            Save changes
          </button>
        </div>
      </div>

      <div class="dark-card">
        <h2>Preview</h2>

        <div class="preview-item">
          <strong>Profile visible</strong>
          <span>{{ state.settings.profileVisible ? "Yes" : "No" }}</span>
        </div>

        <div class="preview-item">
          <strong>Email notifications</strong>
          <span>{{ state.settings.notifyEmail ? "On" : "Off" }}</span>
        </div>

        <div class="preview-item">
          <strong>In-app notifications</strong>
          <span>{{ state.settings.notifyInApp ? "On" : "Off" }}</span>
        </div>

        <div class="preview-item">
          <strong>Unsaved changes</strong>
          <span>{{ state.dirtySettings ? "Yes" : "No" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const {
  state,
  markDirty,
  saveSettings,
  settingsBack,
  openDeactivateDialog,
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
  margin: 0 0 22px;
  font-size: 20px;
  font-weight: 800;
}

.divider {
  height: 1px;
  margin: 20px 0;
  background: rgba(255, 255, 255, 0.08);
}

.danger-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
  font-weight: 800;
  cursor: pointer;
}

.actions {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}

.text-btn,
.primary-btn {
  border: none;
  border-radius: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
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

.primary-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.preview-item {
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-item span {
  color: #a8b3c4;
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
}
</style>