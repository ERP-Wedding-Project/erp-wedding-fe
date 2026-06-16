<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import TomSelect from "@/components/Base/TomSelect";
import useExpenseApi, { type FormExpense } from "@/api/client/ExpenseApi";
import useExpenseCategoryApi from "@/api/client/ExpenseCategoryApi";
import useTaskApi from "@/api/client/TaskApi";
import { allowOnlyNumbers } from "@/core/helpers/utils";

const props = defineProps<{
  open: boolean;
  projectCode: string;
  initialCategoryId?: number | null;
  expense?: any | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const isSubmitting = ref(false);
const { createExpense, updateExpense, responseError } = useExpenseApi();
const { getListExpenseCategory } = useExpenseCategoryApi();
const { getListTask } = useTaskApi();

const expenseCategories = ref<any[]>([]);
const tasks = ref<any[]>([]);

const fetchData = async () => {
  try {
    const [catRes, taskRes] = await Promise.all([
      getListExpenseCategory(),
      getListTask(props.projectCode, { show_all: 1 }),
    ]);

    expenseCategories.value = catRes?.payload?.data ?? [];
    tasks.value = taskRes?.payload?.data ?? [];
  } catch (_) {
    // handled
  }
};

const defaultForm: FormExpense = {
  expense_category_id: 0,
  description: "",
  amount: 0,
  task_id: null,
};

const form = reactive<FormExpense>({ ...defaultForm });

const categoryIdString = computed({
  get: () =>
    form.expense_category_id ? form.expense_category_id.toString() : "",
  set: (val: string) => {
    form.expense_category_id = val ? parseInt(val, 10) : 0;
  },
});

const taskIdString = computed({
  get: () => (form.task_id ? form.task_id.toString() : ""),
  set: (val: string) => {
    form.task_id = val ? parseInt(val, 10) : null;
  },
});

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
  [() => props.open, () => props.expense],
  ([newOpen, newExpense]) => {
    if (newOpen) {
      if (newExpense) {
        // Edit Mode - Load existing data
        form.expense_category_id = newExpense.expense_category_id;
        form.description = newExpense.description || "";
        form.amount = newExpense.amount || 0;
        form.task_id = newExpense.task_id || null;
      } else {
        // Create Mode - Reset to defaults
        Object.assign(form, defaultForm);
        if (props.initialCategoryId) {
          form.expense_category_id = props.initialCategoryId;
        }
      }

      fetchData();
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
    if (form.expense_category_id === 0) {
      alert("Please select a category");
      return;
    }

    isSubmitting.value = true;
    if (props.expense) {
      await updateExpense({
        projectCode: props.projectCode,
        expenseId: props.expense.id,
        payload: { ...form },
      });
    } else {
      await createExpense({
        projectCode: props.projectCode,
        payload: { ...form },
      });
    }
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
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary"
          >
            <Lucide icon="DollarSign" class="w-5 h-5" />
          </div>
          <div>
            <h3
              class="text-base font-semibold text-slate-800 dark:text-slate-100"
            >
              {{ expense ? "Edit Expense" : "Add New Expense" }}
            </h3>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5"
            >
              {{
                expense
                  ? "Update existing expenditure details"
                  : "Record a new expenditure for your wedding"
              }}
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

          <!-- Related Task -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <FormLabel
                for="expense-task"
                class="font-medium text-slate-700 dark:text-slate-300"
              >
                Link to Task
              </FormLabel>
              <span class="text-[10px] text-slate-400 font-medium italic"
                >Optional</span
              >
            </div>
            <TomSelect
              id="expense-task"
              v-model="taskIdString"
              class="w-full"
              :options="{
                placeholder: 'Select task',
                dropdownParent: 'body',
              }"
            >
              <!-- <option value="">No task linked</option> -->

              <option
                v-for="task in tasks"
                :key="task.id"
                :value="task.id.toString()"
              >
                {{ task.title }}
              </option>
            </TomSelect>
          </div>

          <!-- Category -->
          <div>
            <FormLabel
              for="expense-category"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Category <span class="text-danger">*</span>
            </FormLabel>
            <TomSelect
              id="expense-category"
              v-model="categoryIdString"
              class="w-full"
              required
              :options="{
                placeholder: 'Select category',
                dropdownParent: 'body',
              }"
            >
              <option
                v-for="cat in expenseCategories"
                :key="cat.id"
                :value="cat.id.toString()"
              >
                {{ cat.name }}
              </option>
            </TomSelect>
          </div>

          <!-- Description -->
          <div>
            <FormLabel
              for="expense-description"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Description
            </FormLabel>
            <FormTextarea
              id="expense-description"
              v-model="form.description"
              placeholder="e.g. Venue down payment"
              rows="3"
            />
          </div>

          <!-- Amount -->
          <div>
            <FormLabel
              for="expense-amount"
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
                id="expense-amount"
                v-model="formattedAmount"
                type="text"
                class="pl-10"
                placeholder="0"
                required
                @keypress="allowOnlyNumbers"
              />
            </div>
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
            <Lucide v-else :icon="expense ? 'Check' : 'Plus'" class="w-4 h-4" />
            {{
              isSubmitting
                ? "Saving..."
                : expense
                  ? "Update Expense"
                  : "Add Expense"
            }}
          </button>
        </div>
      </form>
    </Dialog.Panel>
  </Dialog>
</template>
