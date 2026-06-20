<script setup lang="ts">
import { reactive, watch } from "vue";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import TomSelect from "@/components/Base/TomSelect";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: { role: string; identifiers: string[] }): void;
}>();

const formCollaborator = reactive({
  role: "Editor",
  identifiers: [] as string[],
});

const formCollaboratorErrors = reactive({
  role: "",
  identifiers: "",
});

// Reset form when modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      formCollaborator.role = "Editor";
      formCollaborator.identifiers = [];
      formCollaboratorErrors.role = "";
      formCollaboratorErrors.identifiers = "";
    }
  },
);

const submitAddCollaborator = () => {
  let hasError = false;
  formCollaboratorErrors.role = "";
  formCollaboratorErrors.identifiers = "";

  if (!formCollaborator.role) {
    formCollaboratorErrors.role = "Role is required.";
    hasError = true;
  }
  if (
    !formCollaborator.identifiers ||
    formCollaborator.identifiers.length === 0
  ) {
    formCollaboratorErrors.identifiers =
      "At least one email or phone number is required.";
    hasError = true;
  }

  if (hasError) return;

  emit("submit", {
    role: formCollaborator.role,
    identifiers: [...formCollaborator.identifiers],
  });
};

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <Dialog :open="open" @close="handleClose">
    <Dialog.Panel>
      <div class="p-5">
        <h2 class="text-xl font-bold mb-4">Invite Collaborator</h2>

        <!-- Role Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Role</label>
          <select
            v-model="formCollaborator.role"
            class="form-select w-full"
            :class="{ 'border-danger': formCollaboratorErrors.role }"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <div
            v-if="formCollaboratorErrors.role"
            class="text-danger mt-1 text-xs"
          >
            {{ formCollaboratorErrors.role }}
          </div>
        </div>

        <!-- Identifiers (Email/Phone) -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Emails</label>
          <TomSelect
            v-model="formCollaborator.identifiers"
            :options="{
              create: true,
              placeholder: 'Add email or phone number...',
            }"
            multiple
            class="w-full"
            :class="{ 'border-danger': formCollaboratorErrors.identifiers }"
          />
          <div
            v-if="formCollaboratorErrors.identifiers"
            class="text-danger mt-1 text-xs"
          >
            {{ formCollaboratorErrors.identifiers }}
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button variant="outline-secondary" @click="handleClose">
            Cancel
          </Button>
          <Button variant="primary" @click="submitAddCollaborator">
            Invite
          </Button>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
