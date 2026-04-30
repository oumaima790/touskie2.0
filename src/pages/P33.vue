<template>
  <div class="p33-page">
    <div class="p33-header">
      <div>
        <h1>Join as Consultant</h1>
        <p>
          Apply to become a trusted consultant. You'll upload a CV, complete your profile,
          set availability, and define packages.
        </p>
      </div>

      <span class="chip">Onboarding</span>
    </div>

    <div class="dark-card">
      <h2>What you'll do</h2>

      <div class="item">
        <v-icon>mdi-file-upload-outline</v-icon>
        <span>Upload your CV (PDF/DOC)</span>
      </div>

      <div class="item">
        <v-icon>mdi-account-edit-outline</v-icon>
        <span>Describe skills, experience, certifications</span>
      </div>

      <div class="item">
        <v-icon>mdi-calendar-clock-outline</v-icon>
        <span>Set availability and consulting packages</span>
      </div>

      <div class="actions">
        <button
          class="back-btn"
          @click="openSimpleDialog('Back', 'This is the first onboarding page. Use the sidebar to navigate.')"
        >
          Back
        </button>

        <button class="apply-btn" @click="navigate('p34')">
          Apply as Consultant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { navigate, openSimpleDialog } = useTouskieConsultantUI();
</script>

<style scoped>
.p33-page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.p33-header {
  max-width: 1100px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.p33-header h1 {
  margin: 0 0 8px;
  color: white;
  font-size: 32px;
  font-weight: 800;
}

.p33-header p {
  margin: 0;
  max-width: 800px;
  color: #a8b3c4;
  font-size: 17px;
  line-height: 1.5;
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
  max-width: 980px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 18px;
  background: #071426;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.dark-card h2 {
  margin: 0 0 24px;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.item {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 18px 0;
  color: white;
  font-size: 20px;
}

.item .v-icon {
  color: #ff6b13;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.back-btn,
.apply-btn {
  border: none;
  cursor: pointer;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.back-btn {
  background: transparent;
  color: white;
}

.apply-btn {
  padding: 14px 22px;
  border-radius: 10px;
  background: #ff6b13;
  color: white;
  font-weight: 800;
}
</style>