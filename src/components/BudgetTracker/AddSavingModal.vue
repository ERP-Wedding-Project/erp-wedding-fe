<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import useSavingApi, { type FormSaving } from "@/api/client/SavingApi";
import { allowOnlyNumbers } from "@/core/helpers/utils";

const props = defineProps<{
  open: boolean;
  projectCode: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const isSubmitting = ref(false);
const { createSaving, responseError } = useSavingApi();

const defaultForm: FormSaving = {
  type: "SAVING",
  amount: 0,
  note: "",
  expense_id: null,
};

const form = reactive<FormSaving>({ ...defaultForm });

const formattedAmount = computed({
  get: () => {
    if (form.amount === 0) return "0";
    if (!form.amount) return "";
    return new Intl.NumberFormat("id-ID").format(form.amount);
  },
  set: (val: string) => {
    const numericValue = parseInt(val.replace(/\D/g, ""), 10);
    form.amount = isNaN(numericValue) ? 0 : numericValue;
  },
});

watch(
  () => props.open,
  (newOpen) => {
    if (newOpen) {
      Object.assign(form, defaultForm);
      if (responseError.value) {
        responseError.value = null;
      }
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    await createSaving({
      projectCode: props.projectCode,
      payload: form,
    });
    emit("success");
    closeModal();
  } catch (_) {
    // handled
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog size="lg" :open="open" @close="closeModal">
    <Dialog.Panel>
      <!-- Modal Header -->
      <Dialog.Title>
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-success/10 text-success"
          >
            <Lucide icon="PiggyBank" class="w-5 h-5" />
          </div>
          <div>
            <h3
              class="text-base font-semibold text-slate-800 dark:text-slate-100"
            >
              Add New Saving
            </h3>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5"
            >
              Record a new deposit to your wedding savings
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 transition-colors"
        >
          <Lucide icon="X" class="w-5 h-5" />
        </button>
      </Dialog.Title>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-5">
          <!-- Error Alert -->
          <div
            v-if="responseError"
            class="flex items-start gap-3 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
          >
            <Lucide icon="AlertCircle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ responseError.message }}</span>
          </div>

          <!-- Amount -->
          <div>
            <FormLabel
              for="saving-amount"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Amount (IDR) <span class="text-danger">*</span>
            </FormLabel>
            <div class="relative mt-2">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <span class="text-slate-500 text-sm font-bold">Rp</span>
              </div>
              <FormInput
                id="saving-amount"
                v-model="formattedAmount"
                type="text"
                class="pl-10"
                placeholder="0"
                required
                @keypress="allowOnlyNumbers"
              />
            </div>
          </div>

          <!-- Note -->
          <div>
            <FormLabel
              for="saving-note"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Note
            </FormLabel>
            <FormTextarea
              id="saving-note"
              v-model="form.note"
              placeholder="Add some notes here..."
              rows="3"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-darkmode-400"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-darkmode-400 hover:bg-slate-200 dark:hover:bg-darkmode-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Lucide
              v-if="isSubmitting"
              icon="Loader"
              class="w-4 h-4 animate-spin"
            />
            <Lucide v-else icon="PiggyBank" class="w-4 h-4" />
            {{ isSubmitting ? "Saving..." : "Add Saving" }}
          </button>
        </div>
      </form>
    </Dialog.Panel>
  </Dialog>
</template>
