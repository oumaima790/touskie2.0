<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Review & Submit</h1>
        <p>Review your info then submit your application.</p>
      </div>
      
    </div>

    <div class="dark-card">
      <div class="review-grid">
        <div>
          <h2>Profile</h2>

          <div class="review-item">
            <v-icon>mdi-account</v-icon>
            <div><strong>Name</strong><span>{{ state.onboarding.profile.fullName || "—" }}</span></div>
          </div>

          <div class="review-item">
            <v-icon>mdi-translate</v-icon>
            <div><strong>Languages</strong><span>{{ state.onboarding.profile.languages || "—" }}</span></div>
          </div>

          <div class="review-item">
            <v-icon>mdi-star-outline</v-icon>
            <div><strong>Skills</strong><span>{{ state.onboarding.profile.skills || "—" }}</span></div>
          </div>

          <div class="review-item">
            <v-icon>mdi-certificate-outline</v-icon>
            <div>
              <strong>Certifications</strong>
              <span>
                {{
                  state.onboarding.profile.certifications.length
                    ? state.onboarding.profile.certifications.join(", ")
                    : "—"
                }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2>Packages</h2>

          <div
            v-for="(p, i) in state.onboarding.packages"
            :key="i"
            class="review-item"
          >
            <v-icon>mdi-briefcase-outline</v-icon>
            <div>
              <strong>{{ p.name }}</strong>
              <span>{{ p.duration }} • {{ p.price }} TND</span>
            </div>
          </div>

          <div v-if="!state.onboarding.packages.length" class="empty">
            No packages added.
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="text-btn" @click="navigate('p38')">Back</button>
        <button class="primary-btn" @click="submitApplication">Submit application</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { state, navigate, submitApplication } = useTouskieConsultantUI();
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

.dark-card {
  padding: 28px;
  border-radius: 18px;
  background: #071426;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 800;
}

.review-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
}

.review-item .v-icon {
  color: #ff6b13;
}

.review-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-item span,
.empty {
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

  .review-grid {
    grid-template-columns: 1fr;
  }
}
</style>