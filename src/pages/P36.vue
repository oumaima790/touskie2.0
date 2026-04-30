<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Consultant Profile Form</h1>
        <p>Fill out your consultant profile. Add certifications via dialog.</p>
      </div>
      <span class="chip">Step 2 / 3</span>
    </div>

    <div class="grid">
      <div class="dark-card main-card">
        <div class="form-grid">
          <v-text-field v-model="state.onboarding.profile.fullName" label="Full name" prepend-icon="mdi-account" />
          <v-text-field
            v-model="state.onboarding.profile.skills"
            label="Skills (comma separated)"
            prepend-icon="mdi-star-outline"
            placeholder="e.g., valuation, contract review, IT audits"
          />
          <v-textarea v-model="state.onboarding.profile.experience" label="Experience" prepend-icon="mdi-briefcase-outline" />
          <v-textarea v-model="state.onboarding.profile.bio" label="Bio" prepend-icon="mdi-text" />
          <v-text-field v-model="state.onboarding.profile.languages" label="Languages" prepend-icon="mdi-translate" />
        </div>

        <div class="cert-header">
          <h2>Certifications</h2>
          <button class="small-btn" @click="openAddCertificationDialog">+ Add</button>
        </div>

        <div class="chips">
          <span
            v-for="(c, i) in state.onboarding.profile.certifications"
            :key="i"
            class="mini-chip"
          >
            {{ c }}
            <button @click="state.onboarding.profile.certifications.splice(i, 1)">×</button>
          </span>
        </div>

        <div v-if="!state.onboarding.profile.certifications.length" class="status-box info">
          <strong>No certifications</strong>
          <span>You can add certifications to build trust.</span>
        </div>

        <div class="actions">
          <button class="text-btn" @click="navigate('p34')">Back</button>
          <div>
            <button class="secondary-btn" @click="openSimpleDialog('Saved', 'Profile draft saved (mock).')">Save</button>
            <button class="primary-btn" @click="navigate('p38')">Next</button>
          </div>
        </div>
      </div>

      <div class="dark-card side-card">
        <h2>Public preview</h2>

        <div class="preview-top">
          <div>
            <h3>{{ state.onboarding.profile.fullName || "—" }}</h3>
            <p>{{ state.onboarding.profile.languages || "No languages yet" }}</p>
          </div>
          <span class="success-chip">Verified</span>
        </div>

        <div class="divider"></div>

        <div class="preview-section">
          <span>Skills</span>
          <p>{{ state.onboarding.profile.skills || "—" }}</p>
        </div>

        <div class="divider"></div>

        <div class="preview-section">
          <span>Bio</span>
          <p>{{ state.onboarding.profile.bio || "—" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { state, navigate, openSimpleDialog, openAddCertificationDialog } =
  useTouskieConsultantUI();
</script>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 28px;
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
  font-size: 17px;
}

.chip,
.mini-chip {
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 107, 19, 0.15);
  color: #ff6b13;
  font-weight: 700;
  border: 1px solid rgba(255, 107, 19, 0.35);
}

.grid {
  max-width: 1200px;
  margin: 0 auto;
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

.form-grid {
  display: grid;
  gap: 12px;
}

.cert-header,
.actions,
.preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cert-header {
  margin-top: 24px;
}

h2 {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 800;
}

.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mini-chip button {
  margin-left: 8px;
  border: none;
  background: transparent;
  color: #ff6b13;
  cursor: pointer;
}

.status-box {
  margin-top: 18px;
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

.actions {
  margin-top: 32px;
}

button {
  cursor: pointer;
}

.text-btn,
.secondary-btn,
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

.secondary-btn,
.small-btn {
  padding: 12px 18px;
  background: rgba(255, 107, 19, 0.14);
  color: #ff6b13;
}

.primary-btn {
  margin-left: 10px;
  padding: 12px 20px;
  background: #ff6b13;
  color: white;
}

.success-chip {
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.14);
  color: #bbf7d0;
  font-weight: 700;
}

.preview-top h3 {
  margin: 0;
}

.preview-top p,
.preview-section p {
  color: #a8b3c4;
}

.preview-section span {
  color: #ff6b13;
  font-size: 13px;
  font-weight: 800;
}

.divider {
  height: 1px;
  margin: 18px 0;
  background: rgba(255, 255, 255, 0.08);
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