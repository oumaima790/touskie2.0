<script setup>
import { computed, onMounted, ref } from 'vue'

const transactions = ref([])

const VERIFICATION_CODE_KEY = 'touskie_delivery_verification_code'
const VERIFICATION_QR_KEY = 'touskie_delivery_verification_qr'
const DEFAULT_TRANSACTION_ID = 'TX-1042'

const verificationCode = ref('')

const hasTransactions = computed(() => transactions.value.length > 0)

const latestTransaction = computed(() => {
  if (!transactions.value.length) return null
  return transactions.value[transactions.value.length - 1]
})

const activeTransactionId = computed(() => {
  return latestTransaction.value?.id || latestTransaction.value?.transactionId || DEFAULT_TRANSACTION_ID
})

const qrPayload = computed(() => {
  if (!verificationCode.value) return ''
  return `TOUSKIE-VERIFY-${activeTransactionId.value}-${verificationCode.value}`
})

const qrImageUrl = computed(() => {
  if (!qrPayload.value) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrPayload.value)}`
})

const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  verificationCode.value = code
  localStorage.setItem(VERIFICATION_CODE_KEY, code)
  localStorage.setItem(VERIFICATION_QR_KEY, qrPayload.value)

  return code
}

const loadVerificationCode = () => {
  let savedCode = localStorage.getItem(VERIFICATION_CODE_KEY)

  if (!savedCode) {
    savedCode = generateVerificationCode()
  }

  verificationCode.value = savedCode
  localStorage.setItem(VERIFICATION_QR_KEY, qrPayload.value)
}

const regenerateDemoCode = () => {
  generateVerificationCode()
}

const loadTransactions = () => {
  const possibleKeys = [
    'transactions',
    'touskie_transactions',
    'transactionHistory',
    'purchaseHistory'
  ]

  for (const key of possibleKeys) {
    const saved = localStorage.getItem(key)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed)) {
          transactions.value = parsed
          return
        }
      } catch (error) {
        console.warn(`Could not parse ${key}`, error)
      }
    }
  }

  transactions.value = []
}

onMounted(() => {
  loadTransactions()

  if (transactions.value.length > 0) {
    loadVerificationCode()
  }
})
</script>

<template>
  <main class="transaction-page">
    <section class="page-header">
      <h1>Transaction History</h1>

      <p>
        Keep your verification QR/code private. Show it to the consultant only
        when the consultation or delivery is completed.
      </p>
    </section>

    <section
      v-if="hasTransactions"
      class="verification-card"
    >
      <div class="verification-content">
        <p class="eyebrow">
          Client Verification
        </p>

        <p class="code-label">
          Your completion code
        </p>

        <div class="code-box">
          {{ verificationCode }}
        </div>

        <p class="helper-text">
          Let the consultant scan this QR code or enter the 6-digit code before
          they confirm completion.
        </p>
      </div>

      <div class="qr-section">
        <div class="qr-box">
          <img
            :src="qrImageUrl"
            alt="Verification QR code"
          />

          <span></span>
        </div>

        <button
          type="button"
          class="outline-btn"
          @click="regenerateDemoCode"
        >
          Regenerate Code
        </button>
      </div>
    </section>

    <section
      v-else
      class="empty-verification-card"
    >
      <p class="eyebrow">
        Client Verification
      </p>

      <h2>No verification code yet</h2>

      <p>
        Complete a purchase or consultation first. A QR code and 6-digit
        completion code will appear here after a transaction exists.
      </p>
    </section>

    <section class="table-card">
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Listing</th>
            <th>Price</th>
            <th>Consultant Type</th>
            <th>Consultant</th>
            <th>Verification Code</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody v-if="transactions.length">
          <tr
            v-for="transaction in transactions"
            :key="transaction.id || transaction.transactionId || transaction.date"
          >
            <td>{{ transaction.buyer || transaction.buyerName || 'You' }}</td>
            <td>{{ transaction.listing || transaction.title || transaction.itemName || '—' }}</td>
            <td class="price-cell">{{ transaction.price || transaction.total || '—' }}</td>
            <td>{{ transaction.consultantType || transaction.type || '—' }}</td>
            <td>{{ transaction.consultant || transaction.consultantName || '—' }}</td>
            <td class="code-cell">{{ verificationCode }}</td>
            <td>{{ transaction.date || transaction.createdAt || '—' }}</td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td
              colspan="7"
              class="empty-state"
            >
              <div class="empty-icon">
                ▣
              </div>

              <strong>No transactions yet</strong>

              <span>Buy some listings to see transactions here</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<style scoped>
.transaction-page {
  min-height: 100vh;
  padding: 42px 32px;
  background: #071426;
  color: #ffffff;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 22px;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
}

.page-header p {
  margin: 0;
  color: #cbd5e1;
  font-size: 18px;
}

.verification-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;
  padding: 32px 24px;
  border: 1px solid rgba(255, 107, 19, 0.28);
  border-radius: 18px;
  background: #0b1a2e;
  color: #ffffff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.verification-content {
  flex: 1;
}

.eyebrow {
  margin: 0 0 18px;
  color: #ff812f;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.code-label {
  margin: 0 0 14px;
  color: #dbe7f5;
  font-size: 16px;
  font-weight: 700;
}

.code-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  padding: 14px 20px;
  border: 1px solid rgba(255, 107, 19, 0.35);
  border-radius: 14px;
  background: #102033;
  color: #ff812f;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0.25em;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
}

.helper-text {
  max-width: 720px;
  margin: 0;
  color: #a8b3c4;
  font-size: 16px;
  line-height: 1.6;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(255, 107, 19, 0.28);
  border-radius: 16px;
  background: #102033;
}

.qr-box img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
}

.qr-box span {
  margin-top: 4px;
  color: #dbe7f5;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.outline-btn {
  min-width: 150px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 107, 19, 0.55);
  border-radius: 6px;
  background: rgba(255, 107, 19, 0.12);
  color: #ff812f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.outline-btn:hover {
  background: rgba(255, 107, 19, 0.22);
}

.empty-verification-card {
  margin-bottom: 28px;
  padding: 28px 24px;
  border: 1px dashed rgba(255, 107, 19, 0.45);
  border-radius: 18px;
  background: #0b1a2e;
}

.empty-verification-card h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 22px;
}

.empty-verification-card p:last-child {
  margin: 0;
  color: #a8b3c4;
  font-size: 16px;
}

.table-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: #0b1a2e;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #0b1a2e;
}

thead {
  background: #10233d;
}

th {
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #dbe7f5;
  font-size: 15px;
  font-weight: 800;
  text-align: left;
}

td {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 15px;
}

tbody tr {
  background: #0b1a2e;
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: #112846;
}

.price-cell,
.code-cell {
  color: #ff812f;
  font-weight: 800;
}

.empty-state {
  height: 180px;
  text-align: center;
  color: #ffffff;
  background: #0b1a2e;
}

.empty-state strong,
.empty-state span {
  display: block;
}

.empty-state strong {
  margin-bottom: 6px;
}

.empty-state span {
  color: #a8b3c4;
}

.empty-icon {
  margin-bottom: 10px;
  color: #ff812f;
  font-size: 42px;
}

@media (max-width: 900px) {
  .transaction-page {
    padding: 28px 18px;
  }

  .verification-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .qr-section {
    width: 100%;
    align-items: flex-start;
  }

  .table-card {
    overflow-x: auto;
  }

  table {
    min-width: 900px;
  }
}
</style>