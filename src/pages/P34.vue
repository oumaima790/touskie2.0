<template>
  <div class="p34-page">
    <div class="p34-header">
      <div>
        <h1>Upload CV</h1>
        <p>Upload a CV to verify your expertise.</p>
      </div>

      <span class="chip">Step 1 / 3</span>
    </div>

    <div class="content-grid">
      <div class="dark-card main-card">
        <h2>Upload your CV</h2>

        <v-file-input
          label="Upload your CV (PDF/DOC)"
          prepend-icon="mdi-file-upload-outline"
          accept=".pdf,.doc,.docx"
          hint="Max 5MB (mock validation). Wrong format triggers P35 popup."
          persistent-hint
          class="file-input"
          @update:modelValue="onCvPicked"
        />

        <div
          class="status-box"
          :class="state.onboarding.cvUploaded ? 'success' : 'info'"
        >
          <strong>
            {{ state.onboarding.cvUploaded ? 'Uploaded' : 'Not uploaded' }}
          </strong>
          <span>
            {{ state.onboarding.cvUploaded ? state.onboarding.cvFileName : 'Please upload a file to continue.' }}
          </span>
        </div>

        <div class="actions">
          <button class="back-btn" @click="navigate('p33')">
            Back
          </button>

          <button
            class="continue-btn"
            :disabled="!state.onboarding.cvUploaded"
            @click="navigate('p36')"
          >
            Continue
          </button>
        </div>
      </div>

      <div class="dark-card tips-card">
        <h2>Tips</h2>

        <div class="tip">
          <v-icon>mdi-check-circle-outline</v-icon>
          <span>Include certifications and past work</span>
        </div>

        <div class="tip">
          <v-icon>mdi-check-circle-outline</v-icon>
          <span>Keep it readable and structured</span>
        </div>

        <div class="tip">
          <v-icon>mdi-check-circle-outline</v-icon>
          <span>Use a single PDF if possible</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const { state, navigate, onCvPicked } = useTouskieConsultantUI();
</script>

<style scoped>
.p34-page {
  min-height: calc(100vh - 64px);
  padding: 48px;
  background: #0e203a;
  color: white;
}

.p34-header {
  max-width: 1200px;
  margin: 0 auto 28px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.p34-header h1 {
  margin: 0 0 8px;
  color: white;
  font-size: 32px;
  font-weight: 800;
}

.p34-header p {
  margin: 0;
  color: #a8b3c4;
  font-size: 17px;
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

.content-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
}

.dark-card {
  padding: 28px;
  border-radius: 18px;
  background: #071426;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.dark-card h2 {
  margin: 0 0 24px;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.file-input {
  color: white;
}

.status-box {
  margin-top: 22px;
  padding: 16px 18px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-box.info {
  background: rgba(59, 130, 246, 0.13);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #bfdbfe;
}

.status-box.success {
  background: rgba(16, 185, 129, 0.13);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #bbf7d0;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.back-btn,
.continue-btn {
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

.continue-btn {
  padding: 14px 22px;
  border-radius: 10px;
  background: #ff6b13;
  color: white;
  font-weight: 800;
}

.continue-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.tip {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 0;
  color: white;
  font-size: 16px;
}

.tip .v-icon {
  color: #ff6b13;
}

@media (max-width: 900px) {
  .p34-page {
    padding: 32px 20px;
  }

  .p34-header {
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>