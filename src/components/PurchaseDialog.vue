<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-6">
        Purchase {{ selectedListing?.title }}
      </v-card-title>

      <v-card-text class="px-6">
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="Full Name"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Name is required']"
            class="mb-4"
          />

          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
            class="mb-4"
          />

          <v-text-field
            v-model="form.phone"
            label="Phone Number"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Phone is required']"
            class="mb-4"
          />

          <v-textarea
            v-model="form.address"
            label="Address"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Address is required']"
            rows="3"
            class="mb-4"
          />

          <v-radio-group
            v-model="form.consultantType"
            label="Consultant Type"
            :rules="[v => !!v || 'Please select consultant type']"
            class="mb-4"
          >
            <v-radio label="AI Consultant" value="ai"></v-radio>
            <v-radio label="Human Consultant" value="human"></v-radio>
          </v-radio-group>

          <v-select
            v-if="form.consultantType === 'human'"
            v-model="form.consultantId"
            :items="consultants"
            item-title="name"
            item-value="id"
            label="Choose Consultant"
            variant="outlined"
            density="compact"
            :rules="[v => !form.consultantType || form.consultantType === 'ai' || !!v || 'Please select a consultant']"
            class="mb-4"
          />

          <div v-if="selectedListing" class="pa-4 bg-grey-lighten-5 rounded">
            <h4 class="text-h6 mb-2">Purchase Summary</h4>
            <p><strong>Item:</strong> {{ selectedListing.title }}</p>
            <p><strong>Price:</strong> ${{ selectedListing.price }}</p>
            <p><strong>Consultant:</strong> {{ getConsultantName() }}</p>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          @click="confirmPurchase"
          :loading="loading"
          :disabled="!valid"
        >
          Confirm Purchase
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import consultantService from '../services/consultantService'
import transactionService from '../services/transactionService'

const props = defineProps({
  modelValue: Boolean,
  selectedListing: Object
})

const emit = defineEmits(['update:modelValue', 'purchaseCompleted'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  consultantType: '',
  consultantId: null
})

const valid = ref(false)
const loading = ref(false)
const consultants = ref([])

watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    consultants.value = await consultantService.getAll()
    form.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      consultantType: '',
      consultantId: null
    }
  }
})

const getConsultantName = () => {
  if (form.value.consultantType === 'ai') {
    return 'AI Consultant'
  } else if (form.value.consultantId) {
    const consultant = consultants.value.find(c => c.id === form.value.consultantId)
    return consultant ? consultant.name : 'Unknown'
  }
  return 'Not selected'
}

const confirmPurchase = async () => {
  if (!valid.value) return

  loading.value = true

  try {
    const transaction = {
      id: Date.now(),
      buyerName: form.value.name,
      buyerEmail: form.value.email,
      buyerPhone: form.value.phone,
      buyerAddress: form.value.address,
      listingTitle: props.selectedListing.title,
      price: props.selectedListing.price,
      consultantType: form.value.consultantType,
      consultantName: getConsultantName(),
      consultantId: form.value.consultantId,
      date: new Date().toLocaleString()
    }

    transactionService.add(transaction)
    emit('purchaseCompleted', transaction)
    closeDialog()
  } catch (error) {
    console.error('Purchase failed:', error)
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  dialog.value = false
}
</script>