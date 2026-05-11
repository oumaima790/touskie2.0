// src/store/useTouskieConsultantUI.js
import { reactive, ref, computed } from "vue";

const state = reactive({
  onboarding: {
    cvFileName: "",
    cvUploaded: false,
    profile: {
      fullName: "New Consultant",
      skills: "",
      experience: "",
      bio: "",
      languages: "English",
      certifications: [],
    },
    availability: {
      mon: "Available",
      tue: "Available",
      wed: "Available",
      thu: "Available",
      fri: "Available",
      sat: "Unavailable",
      sun: "Unavailable",
      pauseAccepting: false,
    },
    packages: [
      { name: "Quick Review", duration: "30 min", price: 15 },
      { name: "Full Validation", duration: "60 min", price: 30 },
    ],
    submitted: false,
  },

  consultant: {
    active: true,
    kpis: { pending: 2, active: 1, completed: 14 },
    recent: [
      { t: "Validated listing #TX-1042", when: "Today 10:40" },
      { t: "Accepted request #RQ-882", when: "Yesterday 18:12" },
      { t: "Completed case #TX-1038", when: "2 days ago" },
    ],
    requests: [
      { id: "RQ-883", navigator: "Amina", publisher: "Karim", listing: "Canon Camera (Rent)", amount: 120, status: "Pending" },
      { id: "RQ-884", navigator: "Youssef", publisher: "Sara", listing: "Laptop Repair Service", amount: 65, status: "Pending" },
    ],
    currentCase: {
      caseId: "TX-1042",
      listing: "Dell Laptop (Sell)",
      navigator: "Amina",
      publisher: "Karim",
      price: 450,
      deadline: "2026-02-15",
      checklist: {
        completeness: true,
        identity: true,
        priceRealistic: true,
        termsClear: false,
      },
      risk: "Medium",
      notes: "",
      status: "Validation",
      verificationCode: "",
      verified: false,
    },
  },

  settings: {
    profileVisible: true,
    notifyEmail: true,
    notifyInApp: true,
  },

  dirtySettings: false,
});

const currentRoute = ref("p33");

const dialog = reactive({
  open: false,
  kind: "message",
  title: "",
  message: "",
  request: null,
  form: {},
  actions: [],
});

const days = [
  { key: "mon", label: "MON" },
  { key: "tue", label: "TUE" },
  { key: "wed", label: "WED" },
  { key: "thu", label: "THU" },
  { key: "fri", label: "FRI" },
  { key: "sat", label: "SAT" },
  { key: "sun", label: "SUN" },
];

const availabilityOptions = ["Available", "Unavailable", "Limited"];
const rejectReasons = ["Not my expertise", "Too busy", "Insufficient information", "Other"];

// ---- computed ----
const modeBadgeText = computed(() => {
  return "Consultant mode" + (state.dirtySettings ? " • Unsaved changes" : "");
});

const riskAlertType = computed(() => {
  const r = state.consultant.currentCase.risk;
  if (r === "High") return "error";
  if (r === "Medium") return "warning";
  return "success";
});

// ---- demo verification code helpers ----
function createVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getVerificationStorageKey() {
  return `touskie_verification_code_${state.consultant.currentCase.caseId}`;
}

function getVerifiedStorageKey() {
  return `touskie_verified_${state.consultant.currentCase.caseId}`;
}

function ensureVerificationCode() {
  if (typeof window === "undefined") return "";

  const key = getVerificationStorageKey();
  let code = window.localStorage.getItem(key);

  if (!code) {
    code = createVerificationCode();
    window.localStorage.setItem(key, code);
  }

  state.consultant.currentCase.verificationCode = code;
  state.consultant.currentCase.verified = window.localStorage.getItem(getVerifiedStorageKey()) === "true";

  return code;
}

function regenerateVerificationCode() {
  if (typeof window === "undefined") return;

  const code = createVerificationCode();
  window.localStorage.setItem(getVerificationStorageKey(), code);
  window.localStorage.removeItem(getVerifiedStorageKey());

  state.consultant.currentCase.verificationCode = code;
  state.consultant.currentCase.verified = false;
}

function normalizeVerificationInput(value) {
  const text = String(value || "").trim();
  const exactCode = text.match(/^\d{6}$/);
  if (exactCode) return exactCode[0];

  const embeddedCode = text.match(/(\d{6})/);
  return embeddedCode ? embeddedCode[1] : text;
}

function completeCurrentCaseAfterVerification() {
  state.consultant.currentCase.status = "Completed";
  state.consultant.currentCase.verified = true;
  state.consultant.kpis.active = Math.max(0, state.consultant.kpis.active - 1);
  state.consultant.kpis.completed += 1;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(getVerifiedStorageKey(), "true");
  }
}

// ---- routing helpers (keeps your hash style) ----
function route() {
  const hash = window.location.hash.replace("#", "") || "/p33";
  const path = hash.startsWith("/") ? hash.slice(1) : hash;
  const seg = path.split("?")[0];
  return seg || "p33";
}

function navigate(r) {
  window.location.hash = `#/${r}`;
}

function onHashChange() {
  const r = route();

  if (state.dirtySettings && currentRoute.value === "p50" && r !== "p50") {
    openUnsavedDialog(() => {
      state.dirtySettings = false;
      currentRoute.value = r;
      window.location.hash = `#/${r}`;
    });
    window.location.hash = "#/p50";
    return;
  }

  currentRoute.value = r;
}

// ---- dialog helpers ----
function closeDialog() {
  dialog.open = false;
  dialog.kind = "message";
  dialog.title = "";
  dialog.message = "";
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [];
}

function openSimpleDialog(title, message) {
  dialog.open = true;
  dialog.kind = "message";
  dialog.title = title;
  dialog.message = message;
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [{ label: "OK", color: "primary", variant: "tonal", onClick: closeDialog }];
}

function openNotifications() {
  openSimpleDialog("Notifications", "Consultant notifications (mock): New request received, Profile approved, Reminder.");
}
function openSearch() {
  openSimpleDialog("Search", "Search is not implemented in this prototype.");
}
function openInbox() {
  openSimpleDialog("Inbox", "Inbox is not implemented in this prototype.");
}

function onCvPicked(files) {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;

  const name = String(file.name || "").toLowerCase();
  const ok = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");

  if (!ok) {
    openSimpleDialog("P35 — CV Upload Error", "Invalid file format. Please upload a PDF or DOC/DOCX.");
    state.onboarding.cvUploaded = false;
    state.onboarding.cvFileName = "";
    return;
  }

  state.onboarding.cvUploaded = true;
  state.onboarding.cvFileName = file.name;
}

function openAddCertificationDialog() {
  dialog.open = true;
  dialog.kind = "addCert";
  dialog.title = "Add Certification";
  dialog.message = "";
  dialog.request = null;
  dialog.form = {
    certName: "",
    certProofFile: null
  };

  dialog.actions = [
    {
      label: "Cancel",
      color: undefined,
      variant: "text",
      onClick: closeDialog
    },
    {
      label: "Add",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        const name = String(dialog.form.certName || "").trim();

        if (!name) {
          openSimpleDialog("Missing name", "Please enter a certification name.");
          return;
        }

        const pickedFile = Array.isArray(dialog.form.certProofFile)
          ? dialog.form.certProofFile[0]
          : dialog.form.certProofFile;

        if (pickedFile) {
          const fileName = String(pickedFile.name || "");
          const lowerName = fileName.toLowerCase();

          const isValidFile =
            lowerName.endsWith(".pdf") ||
            lowerName.endsWith(".png") ||
            lowerName.endsWith(".jpg") ||
            lowerName.endsWith(".jpeg") ||
            lowerName.endsWith(".doc") ||
            lowerName.endsWith(".docx");

          if (!isValidFile) {
            openSimpleDialog(
              "Invalid file",
              "Please upload a PDF, image, DOC, or DOCX file."
            );
            return;
          }

          state.onboarding.profile.certifications.push(`${name} — ${fileName}`);
        } else {
          state.onboarding.profile.certifications.push(name);
        }

        closeDialog();
      }
    }
  ];
}

function openAddPackageDialog() {
  dialog.open = true;
  dialog.kind = "addPackage";
  dialog.title = "P39 — Add Consulting Package";
  dialog.message = "";
  dialog.request = null;
  dialog.form = { packName: "", packDuration: "", packPrice: "" };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Save",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        const name = String(dialog.form.packName || "").trim();
        const dur = String(dialog.form.packDuration || "").trim();
        const price = Number(dialog.form.packPrice);

        if (!name || !dur || !Number.isFinite(price)) {
          openSimpleDialog("Missing fields", "Fill all fields correctly.");
          return;
        }

        state.onboarding.packages.push({ name, duration: dur, price });
        closeDialog();
      },
    },
  ];
}

function openDeletePackageDialog(index) {
  const pkg = state.onboarding.packages[index];
  dialog.open = true;
  dialog.kind = "deletePackage";
  dialog.title = "Delete package?";
  dialog.message = `Delete "${pkg.name}"?`;
  dialog.request = null;
  dialog.form = { index };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Delete",
      color: "error",
      variant: "tonal",
      onClick: () => {
        state.onboarding.packages.splice(index, 1);
        closeDialog();
      },
    },
  ];
}

function submitApplication() {
  state.onboarding.submitted = true;

  dialog.open = true;
  dialog.kind = "message";
  dialog.title = "Submission Confirmation";
  dialog.message = "Application submitted successfully. You can start using the consultant dashboard ";
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [
    {
      label: "OK",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        closeDialog();
        navigate("p42");
      },
    },
  ];
}

function openIncomingRequestDialog(req) {
  dialog.open = true;
  dialog.kind = "incomingRequest";
  dialog.title = "P43 — Incoming Consulting Request";
  dialog.message = "";
  dialog.request = req;
  dialog.form = {};
  dialog.actions = [
    { label: "Reject", color: "error", variant: "tonal", onClick: () => openRejectDialog(req) },
    { label: "Accept", color: "primary", variant: "tonal", onClick: () => openAcceptDialog(req) },
  ];
}

function openRejectDialog(req) {
  dialog.open = true;
  dialog.kind = "rejectRequest";
  dialog.title = "P45 — Reject Request";
  dialog.message = "";
  dialog.request = req;
  dialog.form = { rejReason: rejectReasons[0], rejText: "" };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Reject",
      color: "error",
      variant: "tonal",
      onClick: () => {
        req.status = "Rejected";
        state.consultant.kpis.pending = Math.max(0, state.consultant.kpis.pending - 1);
        closeDialog();
        openSimpleDialog("Rejected", `Request ${req.id} rejected (mock).`);
      },
    },
  ];
}

function openAcceptDialog(req) {
  dialog.open = true;
  dialog.kind = "acceptRequest";
  dialog.title = "P44 — Accept Request";
  dialog.message = "";
  dialog.request = req;
  dialog.form = { acceptNote: "" };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Confirm",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        req.status = "Accepted";
        state.consultant.kpis.pending = Math.max(0, state.consultant.kpis.pending - 1);
        state.consultant.kpis.active += 1;
        closeDialog();
        navigate("p46");
      },
    },
  ];
}

function openRequestChangesDialog() {
  dialog.open = true;
  dialog.kind = "requestChanges";
  dialog.title = "P47 — Request Changes";
  dialog.message = "";
  dialog.request = null;
  dialog.form = { chgText: "" };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Send",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        const t = String(dialog.form.chgText || "").trim();
        state.consultant.currentCase.status = "Changes Requested";
        if (t) {
          state.consultant.currentCase.notes =
            (state.consultant.currentCase.notes ? state.consultant.currentCase.notes + "\n" : "") + "Changes: " + t;
        }
        closeDialog();
        openSimpleDialog("Sent", "Changes request sent (mock).");
      },
    },
  ];
}

function approveCase() {
  const chk = state.consultant.currentCase.checklist;
  const allOk = Object.values(chk).every(Boolean);

  if (!allOk) {
    openSimpleDialog("Cannot approve", "Please complete the checklist before approving (mock rule).");
    return;
  }

  state.consultant.currentCase.status = "Approved";

  dialog.open = true;
  dialog.kind = "message";
  dialog.title = "Approved";
  dialog.message = "Validation approved. Assisted transaction created (mock).";
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [
    {
      label: "Go to summary (P48)",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        closeDialog();
        navigate("p48");
      },
    },
  ];
}

function openConfirmDeliveryDialog() {
  ensureVerificationCode();

  dialog.open = true;
  dialog.kind = "confirmDelivery";
  dialog.title = "P49 — Confirm Delivery";
  dialog.message = "";
  dialog.request = null;
  dialog.form = {
    delNote: "",
    deliveryCode: "",
    deliveryError: "",
  };
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Confirm",
      color: "primary",
      variant: "tonal",
      onClick: () => {
        const enteredCode = normalizeVerificationInput(dialog.form.deliveryCode);
        const expectedCode = ensureVerificationCode();

        if (!enteredCode) {
          dialog.form.deliveryError = "Enter the client verification code first.";
          return;
        }

        if (enteredCode !== expectedCode) {
          dialog.form.deliveryError = "Invalid code. Ask the client to show the QR code or give the 6-digit code.";
          return;
        }

        completeCurrentCaseAfterVerification();
        closeDialog();
        openSimpleDialog("Done", "Code verified. Case marked completed (mock).");
        navigate("p42");
      },
    },
  ];
}

function markDirty() {
  state.dirtySettings = true;
}

function saveSettings() {
  state.dirtySettings = false;
  openSimpleDialog("Saved", "Settings saved (mock).");
}

function openUnsavedDialog(onLeave) {
  dialog.open = true;
  dialog.kind = "unsaved";
  dialog.title = "Unsaved Changes";
  dialog.message = "";
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [
    { label: "Stay", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Leave",
      color: "error",
      variant: "tonal",
      onClick: () => {
        closeDialog();
        if (typeof onLeave === "function") onLeave();
      },
    },
  ];
}

function settingsBack() {
  if (state.dirtySettings) {
    openUnsavedDialog(() => {
      state.dirtySettings = false;
      navigate("p42");
    });
  } else {
    navigate("p42");
  }
}

function openDeactivateDialog() {
  dialog.open = true;
  dialog.kind = "deactivate";
  dialog.title = "P51 — Deactivate Consultant Role";
  dialog.message = "";
  dialog.request = null;
  dialog.form = {};
  dialog.actions = [
    { label: "Cancel", color: undefined, variant: "text", onClick: closeDialog },
    {
      label: "Deactivate",
      color: "error",
      variant: "tonal",
      onClick: () => {
        state.consultant.active = false;
        closeDialog();
        openSimpleDialog("Deactivated", "Consultant role deactivated (mock).");
        navigate("p33");
      },
    },
  ];
}

// singleton composable
export function useTouskieConsultantUI() {
  return {
    state,
    currentRoute,
    dialog,
    days,
    availabilityOptions,
    rejectReasons,

    modeBadgeText,
    riskAlertType,

    route,
    onHashChange,
    navigate,

    closeDialog,
    openSimpleDialog,

    openNotifications,
    openSearch,
    openInbox,

    onCvPicked,
    openAddCertificationDialog,
    openAddPackageDialog,
    openDeletePackageDialog,

    submitApplication,

    openIncomingRequestDialog,
    openRejectDialog,
    openAcceptDialog,

    openRequestChangesDialog,
    approveCase,

    ensureVerificationCode,
    regenerateVerificationCode,
    openConfirmDeliveryDialog,

    markDirty,
    saveSettings,
    settingsBack,
    openUnsavedDialog,
    openDeactivateDialog,
  };
}