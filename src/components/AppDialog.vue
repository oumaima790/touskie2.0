<template>
  <v-dialog v-model="dialog.open" max-width="560" persistent>
    <v-card rounded="lg" class="touskie-dialog">
      <v-card-title class="text-subtitle-1 font-weight-bold dialog-title">
        {{ cleanDialogTitle }}
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="dialog.kind === 'message'" class="text-body-1">
          {{ dialog.message }}
        </div>

        <div v-else-if="dialog.kind === 'addCert'">
          <v-text-field
            v-model="dialog.form.certName"
            label="Certification name"
            prepend-icon="mdi-certificate-outline"
          />

          <v-file-input
            v-model="dialog.form.certProofFile"
            label="Proof file "
            prepend-icon="mdi-paperclip"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            show-size
            clearable
          />
        </div>

        <div v-else-if="dialog.kind === 'addPackage'">
          <v-text-field
            v-model="dialog.form.packName"
            label="Package name"
            prepend-icon="mdi-briefcase-outline"
          />

          <v-text-field
            v-model="dialog.form.packDuration"
            label="Duration"
            prepend-icon="mdi-timer-outline"
            placeholder="e.g., 60 min"
          />

          <v-text-field
            v-model="dialog.form.packPrice"
            label="Price (TND)"
            prepend-icon="mdi-cash"
            type="number"
          />
        </div>

        <div v-else-if="dialog.kind === 'deletePackage'">
          <v-alert
            type="warning"
            variant="tonal"
            title="Delete package?"
            :text="dialog.message"
          />
        </div>

        <div v-else-if="dialog.kind === 'incomingRequest'">
          <v-list density="compact" class="dark-list">
            <v-list-item title="Request ID" :subtitle="dialog.request?.id" />
            <v-list-item title="Listing" :subtitle="dialog.request?.listing" />
            <v-list-item title="Amount" :subtitle="`${dialog.request?.amount} TND`" />
            <v-list-item title="Navigator" :subtitle="dialog.request?.navigator" />
            <v-list-item title="Publisher" :subtitle="dialog.request?.publisher" />
          </v-list>
        </div>

        <div v-else-if="dialog.kind === 'rejectRequest'">
          <v-select
            v-model="dialog.form.rejReason"
            label="Reason"
            :items="rejectReasons"
            prepend-icon="mdi-alert-circle-outline"
          />

          <v-textarea
            v-model="dialog.form.rejText"
            label="Explanation"
            prepend-icon="mdi-text"
          />
        </div>

        <div v-else-if="dialog.kind === 'acceptRequest'">
          <v-alert
            type="info"
            variant="tonal"
            :title="`Accept ${dialog.request?.id}?`"
            text="You will start working on the validation screen (mock)."
          />

          <v-textarea
            v-model="dialog.form.acceptNote"
            label="Optional note"
            prepend-icon="mdi-text"
          />
        </div>

        <div v-else-if="dialog.kind === 'requestChanges'">
          <v-textarea
            v-model="dialog.form.chgText"
            label="Requested changes"
            prepend-icon="mdi-email-outline"
          />
        </div>

        <div v-else-if="dialog.kind === 'confirmDelivery'" class="delivery-confirm-box">
          <div class="verification-alert">
            <div class="alert-icon">
              <v-icon size="22">mdi-information</v-icon>
            </div>

            <div>
              <h3>Client verification required</h3>

              <p>
                Ask the client to show the QR code or give their 6-digit code
                before confirming completion.
              </p>
            </div>
          </div>

          <div class="verification-methods">
            <button
              type="button"
              class="scan-button"
              @click="startQrScanner"
            >
              <v-icon size="28">mdi-camera-outline</v-icon>
              <span>Scan QR Code</span>
            </button>

            <div class="or-divider">
              OR
            </div>

            <v-text-field
              v-model="dialog.form.deliveryCode"
              label="Enter 6-digit code"
              prepend-inner-icon="mdi-shield-check-outline"
              append-inner-icon="mdi-camera-outline"
              maxlength="6"
              inputmode="numeric"
              placeholder="Example: 373558"
              class="code-input"
              :error-messages="dialog.form.deliveryError ? [dialog.form.deliveryError] : []"
              @click:append-inner="startQrScanner"
              @input="cleanCodeInput"
            />
          </div>

          <div v-if="isScanning" class="scanner-panel">
            <div class="scanner-header">
              <strong>Camera scanner</strong>

              <button
                type="button"
                class="close-scan"
                @click="stopQrScanner"
              >
                Close
              </button>
            </div>

            <video
              ref="videoEl"
              class="scanner-video"
              autoplay
              muted
              playsinline
            />

            <p class="scanner-help">
              Point the camera at the client QR code. If scanning is not
              supported on this browser, enter the 6-digit code manually.
            </p>
          </div>

          <v-alert
            v-if="cameraError"
            type="warning"
            variant="tonal"
            class="mt-3"
            :text="cameraError"
          />
        </div>

        <div v-else-if="dialog.kind === 'deactivate'">
          <v-alert
            type="warning"
            variant="tonal"
            title="Deactivate consultant role?"
            text="You will stop receiving consulting requests (mock)."
          />
        </div>

        <div v-else-if="dialog.kind === 'unsaved'">
          <v-alert
            type="warning"
            variant="tonal"
            title="Unsaved Changes"
            text="You have unsaved changes. Leave without saving?"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          v-for="(a, i) in dialog.actions"
          :key="i"
          :color="a.color"
          :variant="a.variant || 'tonal'"
          @click="a.onClick"
        >
          {{ a.label }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useTouskieConsultantUI } from '../store/useTouskieConsultantUI'

const { dialog, rejectReasons } = useTouskieConsultantUI()

const videoEl = ref(null)
const isScanning = ref(false)
const cameraError = ref('')
const scannerStream = ref(null)
const scannerTimer = ref(null)

const cleanDialogTitle = computed(() => {
  return String(dialog.title || '').replace(/^P\d+\s*[—-]\s*/, '')
})

const extractSixDigitCode = value => {
  const text = String(value || '')
  const match = text.match(/\d{6}/)

  return match ? match[0] : ''
}

const cleanCodeInput = () => {
  dialog.form.deliveryError = ''

  if (!dialog.form.deliveryCode) return

  const code = extractSixDigitCode(dialog.form.deliveryCode)

  dialog.form.deliveryCode =
    code || dialog.form.deliveryCode.replace(/\D/g, '').slice(0, 6)
}

const applyScannedCode = value => {
  const code = extractSixDigitCode(value)

  if (!code) {
    cameraError.value = 'QR scanned, but no 6-digit verification code was found.'
    return
  }

  dialog.form.deliveryCode = code
  dialog.form.deliveryError = ''
  stopQrScanner()
}

const startQrScanner = async () => {
  cameraError.value = ''

  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value =
      'Camera access is not supported on this browser. Enter the 6-digit code manually.'
    return
  }

  if (!('BarcodeDetector' in window)) {
    cameraError.value =
      'QR scanning is not supported on this browser. Enter the 6-digit code manually.'
    return
  }

  try {
    isScanning.value = true

    await nextTick()

    scannerStream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      },
      audio: false
    })

    if (videoEl.value) {
      videoEl.value.srcObject = scannerStream.value
      await videoEl.value.play()
    }

    const detector = new BarcodeDetector({
      formats: ['qr_code']
    })

    scannerTimer.value = window.setInterval(async () => {
      if (!videoEl.value) return

      try {
        const codes = await detector.detect(videoEl.value)

        if (codes.length > 0) {
          applyScannedCode(codes[0].rawValue)
        }
      } catch (error) {
        console.warn('QR scan failed:', error)
      }
    }, 700)
  } catch (error) {
    console.error('Camera error:', error)
    cameraError.value =
      'Could not open the camera. Enter the 6-digit code manually.'
    stopQrScanner()
  }
}

const stopQrScanner = () => {
  if (scannerTimer.value) {
    clearInterval(scannerTimer.value)
    scannerTimer.value = null
  }

  if (scannerStream.value) {
    scannerStream.value.getTracks().forEach(track => track.stop())
    scannerStream.value = null
  }

  if (videoEl.value) {
    videoEl.value.srcObject = null
  }

  isScanning.value = false
}

watch(
  () => dialog.open,
  isOpen => {
    if (!isOpen) {
      stopQrScanner()
      cameraError.value = ''
    }
  }
)

onBeforeUnmount(() => {
  stopQrScanner()
})
</script>

<style scoped>
:deep(.touskie-dialog),
:deep(.v-card) {
  background: #071426 !important;
  color: #ffffff !important;
}

:deep(.v-card-title) {
  background: #071426 !important;
  color: #ffffff !important;
}

:deep(.v-card-text) {
  background: #071426 !important;
  color: #ffffff !important;
}

:deep(.v-card-actions) {
  background: #071426 !important;
}

:deep(.v-divider) {
  border-color: rgba(255, 255, 255, 0.12) !important;
}

:deep(.v-field) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
}

:deep(.v-field-label),
:deep(.v-field__input),
:deep(.v-icon),
:deep(.v-label) {
  color: #ffb07a !important;
}

:deep(.v-field__outline) {
  color: rgba(255, 107, 26, 0.45) !important;
}

:deep(.v-field--focused .v-field__outline) {
  color: #ff6b1a !important;
}

:deep(.v-btn) {
  color: #ff6b1a;
}

:deep(.v-btn.bg-primary),
:deep(.v-btn.bg-info) {
  background: #ff6b1a !important;
  color: #ffffff !important;
}

:deep(.v-alert) {
  background: rgba(255, 107, 26, 0.12) !important;
  color: #ffb07a !important;
  border: 1px solid rgba(255, 107, 26, 0.3);
}

:deep(.v-alert-title) {
  color: #ff6b1a !important;
}

.dark-list {
  background: #071426 !important;
  color: #ffffff !important;
}

:deep(.v-list) {
  background: #071426 !important;
  color: #ffffff !important;
}

:deep(.v-list-item-title) {
  color: #ffffff !important;
}

:deep(.v-list-item-subtitle) {
  color: #cbd5e1 !important;
}

.dialog-title {
  color: #ffffff;
}

.delivery-confirm-box {
  display: flex;
  flex-direction: column;
}

.verification-alert {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px 22px;
  border: 1px solid rgba(255, 107, 26, 0.35);
  border-radius: 8px;
  background: rgba(255, 107, 26, 0.12);
  color: #ff6b1a;
}

.alert-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ff6b1a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon :deep(.v-icon) {
  color: #ffffff !important;
}

.verification-alert h3 {
  margin: 0 0 6px;
  color: #ff6b1a;
  font-size: 24px;
  font-weight: 600;
}

.verification-alert p {
  margin: 0;
  color: #ffb07a;
  font-size: 16px;
  line-height: 1.45;
}

.verification-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scan-button {
  width: 100%;
  min-height: 78px;
  border: 1px dashed #ff6b1a;
  border-radius: 12px;
  background: rgba(255, 107, 26, 0.08);
  color: #ff6b1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.scan-button:hover {
  background: rgba(255, 107, 26, 0.16);
}

.scan-button :deep(.v-icon) {
  color: #ff6b1a !important;
}

.or-divider {
  color: #ffb07a;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
}

.code-input {
  margin-top: 0;
}

:deep(.code-input .v-field) {
  background: rgba(255, 255, 255, 0.06) !important;
}

:deep(.code-input .v-field-label),
:deep(.code-input .v-field__input),
:deep(.code-input .v-icon) {
  color: #ffb07a !important;
}

:deep(.code-input input::placeholder) {
  color: rgba(255, 176, 122, 0.65) !important;
}

.scanner-panel {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 107, 26, 0.35);
  border-radius: 12px;
  background: rgba(255, 107, 26, 0.08);
}

.scanner-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #ffffff;
}

.close-scan {
  border: none;
  background: transparent;
  color: #ff6b1a;
  font-weight: 700;
  cursor: pointer;
}

.scanner-video {
  width: 100%;
  max-height: 220px;
  border-radius: 10px;
  background: #000000;
  object-fit: cover;
}

.scanner-help {
  margin: 8px 0 0;
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.4;
}
</style>