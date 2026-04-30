<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Validation Screen</h1>
        <p>Review transaction details and validate. Request changes triggers the dialog.</p>
      </div>
      <span class="chip">{{ state.consultant.currentCase.caseId }}</span>
    </div>

    <div class="grid">
      <div class="dark-card">
        <h2>Transaction details</h2>

        <div class="details-grid">
          <div>
            <div class="detail-item">
              <v-icon>mdi-tag-outline</v-icon>
              <div><strong>Listing</strong><span>{{ state.consultant.currentCase.listing }}</span></div>
            </div>

            <div class="detail-item">
              <v-icon>mdi-cash</v-icon>
              <div><strong>Price</strong><span>{{ state.consultant.currentCase.price }} TND</span></div>
            </div>

            <div class="detail-item">
              <v-icon>mdi-account</v-icon>
              <div><strong>Navigator</strong><span>{{ state.consultant.currentCase.navigator }}</span></div>
            </div>

            <div class="detail-item">
              <v-icon>mdi-account-outline</v-icon>
              <div><strong>Publisher</strong><span>{{ state.consultant.currentCase.publisher }}</span></div>
            </div>

            <div class="detail-item">
              <v-icon>mdi-calendar</v-icon>
              <div><strong>Deadline</strong><span>{{ state.consultant.currentCase.deadline }}</span></div>
            </div>
          </div>

          <div class="risk-box">
            <strong>Risk: {{ state.consultant.currentCase.risk }}</strong>
            <span>Use your checklist to decide approve or request changes.</span>
          </div>
        </div>

        <div class="divider"></div>

        <h2>Validation checklist</h2>

        <v-checkbox v-model="state.consultant.currentCase.checklist.completeness" label="Listing completeness" />
        <v-checkbox v-model="state.consultant.currentCase.checklist.identity" label="Identity verified" />
        <v-checkbox v-model="state.consultant.currentCase.checklist.priceRealistic" label="Price realistic" />
        <v-checkbox v-model="state.consultant.currentCase.checklist.termsClear" label="Terms clear" />

        <div class="divider"></div>

        <v-textarea
          v-model="state.consultant.currentCase.notes"
          label="Internal notes (private)"
          hint="Notes visible only to consultant (mock)."
          persistent-hint
          prepend-icon="mdi-note-text-outline"
        />

        <div class="actions">
          <button class="text-btn" @click="navigate('p42')">Back</button>
          <div>
            <button class="secondary-btn" @click="openRequestChangesDialog">Request changes</button>
            <button class="primary-btn" @click="approveCase">Approve</button>
          </div>
        </div>
      </div>

      <div class="dark-card">
        <h2>Help</h2>

        <div class="help-item">
          <v-icon>mdi-check</v-icon>
          <span>Approve only when checklist is fully satisfied.</span>
        </div>

        <div class="help-item">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <span>If terms are unclear, request changes.</span>
        </div>

        <div class="help-item">
          <v-icon>mdi-note-outline</v-icon>
          <span>Keep private notes short and factual.</span>
        </div>

        <button class="secondary-btn full" @click="navigate('p48')">
          Assisted Summary
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";

const {
  state,
  navigate,
  openRequestChangesDialog,
  approveCase,
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
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 800;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-item,
.help-item {
  display: flex;
  gap: 14px;
  padding: 13px 0;
}

.detail-item .v-icon,
.help-item .v-icon {
  color: #ff6b13;
}

.detail-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item span,
.risk-box span {
  color: #a8b3c4;
}

.risk-box {
  padding: 18px;
  border-radius: 14px;
  background: rgba(245, 158, 11, 0.13);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fde68a;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
}

.divider {
  height: 1px;
  margin: 24px 0;
  background: rgba(255, 255, 255, 0.08);
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
.secondary-btn,
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

.secondary-btn {
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

.full {
  width: 100%;
  margin-top: 24px;
}

@media (max-width: 900px) {
  .page {
    padding: 32px 20px;
  }

  .page-header,
  .grid,
  .details-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
    gap: 14px;
  }
}
</style>