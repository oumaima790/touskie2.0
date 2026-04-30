<template>
  <v-dialog v-model="dialog.open" max-width="560" persistent>
    <v-card rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">{{ dialog.title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <div v-if="dialog.kind === 'message'" class="text-body-1">
          {{ dialog.message }}
        </div>

        <div v-else-if="dialog.kind === 'addCert'">
          <v-text-field v-model="dialog.form.certName" label="Certification name" prepend-icon="mdi-certificate-outline" />
          <v-text-field v-model="dialog.form.certProof" label="Proof (optional)" prepend-icon="mdi-link-variant" />
        </div>

        <div v-else-if="dialog.kind === 'addPackage'">
          <v-text-field v-model="dialog.form.packName" label="Package name" prepend-icon="mdi-briefcase-outline" />
          <v-text-field v-model="dialog.form.packDuration" label="Duration" prepend-icon="mdi-timer-outline" placeholder="e.g., 60 min" />
          <v-text-field v-model="dialog.form.packPrice" label="Price (TND)" prepend-icon="mdi-cash" type="number" />
        </div>

        <div v-else-if="dialog.kind === 'deletePackage'">
          <v-alert type="warning" variant="tonal" title="Delete package?" :text="dialog.message" />
        </div>

        <div v-else-if="dialog.kind === 'incomingRequest'">
          <v-list density="compact">
            <v-list-item title="Request ID" :subtitle="dialog.request?.id" />
            <v-list-item title="Listing" :subtitle="dialog.request?.listing" />
            <v-list-item title="Amount" :subtitle="`${dialog.request?.amount} TND`" />
            <v-list-item title="Navigator" :subtitle="dialog.request?.navigator" />
            <v-list-item title="Publisher" :subtitle="dialog.request?.publisher" />
          </v-list>
        </div>

        <div v-else-if="dialog.kind === 'rejectRequest'">
          <v-select v-model="dialog.form.rejReason" label="Reason" :items="rejectReasons" prepend-icon="mdi-alert-circle-outline" />
          <v-textarea v-model="dialog.form.rejText" label="Explanation" prepend-icon="mdi-text" />
        </div>

        <div v-else-if="dialog.kind === 'acceptRequest'">
          <v-alert type="info" variant="tonal" :title="`Accept ${dialog.request?.id}?`" text="You will start working on the validation screen (mock)." />
          <v-textarea v-model="dialog.form.acceptNote" label="Optional note" prepend-icon="mdi-text" />
        </div>

        <div v-else-if="dialog.kind === 'requestChanges'">
          <v-textarea v-model="dialog.form.chgText" label="Requested changes" prepend-icon="mdi-email-outline" />
        </div>

        <div v-else-if="dialog.kind === 'confirmDelivery'">
          <v-alert type="info" variant="tonal" title="Confirm delivery?" text="This marks the case as completed (mock)." />
          <v-textarea v-model="dialog.form.delNote" label="Optional note" prepend-icon="mdi-note-text-outline" />
        </div>

        <div v-else-if="dialog.kind === 'deactivate'">
          <v-alert type="warning" variant="tonal" title="Deactivate consultant role?" text="You will stop receiving consulting requests (mock)." />
        </div>

        <div v-else-if="dialog.kind === 'unsaved'">
          <v-alert type="warning" variant="tonal" title="Unsaved Changes" text="You have unsaved changes. Leave without saving?" />
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
import { useTouskieConsultantUI } from "../store/useTouskieConsultantUI";
const { dialog, rejectReasons } = useTouskieConsultantUI();
</script>