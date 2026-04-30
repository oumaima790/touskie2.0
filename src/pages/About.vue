<template>
  <v-sheet class="mx-auto pl-12 pr-8 pt-6 pb-6" width="100%" max-width="1600">
    <v-row align="center" justify="space-between" class="mb-4">
      <div>
        <div class="text-h5 font-weight-bold">Notes</div>
        <div class="text-body-2 text-medium-emphasis">
          This file implements the Consultant UI flow (P33–P51) using only Vuetify components.
        </div>
      </div>
      <v-chip variant="tonal">Info</v-chip>
    </v-row>

    <v-card rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">Dialogs included</v-card-title>
      <v-divider />
      <v-card-text>
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-alert-circle-outline" title="P35 — CV upload error" />
          <v-list-item prepend-icon="mdi-certificate-outline" title="P37 — Add certification" />
          <v-list-item prepend-icon="mdi-briefcase-plus-outline" title="P39 — Add package" />
          <v-list-item prepend-icon="mdi-check-circle-outline" title="P41 — Submission confirmation" />
          <v-list-item prepend-icon="mdi-inbox-arrow-down-outline" title="P43 — Incoming request popup" />
          <v-list-item prepend-icon="mdi-check" title="P44 — Accept request" />
          <v-list-item prepend-icon="mdi-close" title="P45 — Reject request" />
          <v-list-item prepend-icon="mdi-email-outline" title="P47 — Request changes" />
          <v-list-item prepend-icon="mdi-truck-check-outline" title="P49 — Confirm delivery" />
          <v-list-item prepend-icon="mdi-account-off-outline" title="P51 — Deactivate consultant role" />
          <v-list-item prepend-icon="mdi-content-save-alert-outline" title="Unsaved changes warning (P72-like)" />
        </v-list>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup>
/* no logic needed */
</script>