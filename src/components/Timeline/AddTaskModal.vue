<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import Litepicker from "@/components/Base/Litepicker";
import TomSelect from "@/components/Base/TomSelect";
import useTaskApi, { type FormTask } from "@/api/client/TaskApi";
import useTaskCategoryApi from "@/api/client/TaskCategoryApi";
import useLocalUser from "@/composable/useLocalUser";
import useEnumsOptionApi from "@/api/client/EnumsOptionApi";

const props = defineProps<{
  open: boolean;
  projectCode: string;
  weddingDate: string;
  projectUsers?: any[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();
const isSubmitting = ref(false);

const { createTask, responseError } = useTaskApi();
const { getListTaskCategory } = useTaskCategoryApi();
const { getEnumsOption } = useEnumsOptionApi();
const { userId } = useLocalUser();

const taskCategories = ref<any[]>([]);
const taskPriorities = ref<any[]>([]);
const taskStatuses = ref<any[]>([]);

const fetchTaskCategories = async () => {
  try {
    const data = await getListTaskCategory();
    const list_priorities = await getEnumsOption("task_priorities");
    const list_statuses = await getEnumsOption("task_statuses");

    taskCategories.value = data?.payload?.data ?? [];
    taskPriorities.value = list_priorities?.payload?.data ?? [];
    taskStatuses.value = list_statuses?.payload?.data ?? [];
  } catch (_) {
    // error handled by useTaskCategoryApi
  }
};

const defaultForm: FormTask = {
  title: "",
  description: "",
  status: "",
  priority: "",
  due_date: "",
  assignee_ids: [],
  task_category_id: null,
};

const form = reactive<FormTask>({ ...defaultForm });

const taskCategoryIdString = computed({
  get: () => (form.task_category_id ? form.task_category_id.toString() : ""),
  set: (val: string) => {
    form.task_category_id = val ? parseInt(val, 10) : null;
  },
});

const assigneeIdsString = computed({
  get: () => form.assignee_ids.map(String),
  set: (val: string[]) => {
    form.assignee_ids = val.map((v) => parseInt(v, 10));
  },
});

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      Object.assign(form, defaultForm);
      form.assignee_ids = [userId.value];
      fetchTaskCategories();
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

const handleSubmitTask = async () => {
  try {
    isSubmitting.value = true;
    await createTask({
      projectCode: props.projectCode,
      payload: { ...form },
    });
    emit("success");
    closeModal();
  } catch (_) {
    // error handled by useTaskApi
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog size="xl" :open="open" @close="closeModal">
    <Dialog.Panel>
      <!-- Modal Header -->
      <Dialog.Title>
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary"
          >
            <Lucide icon="ClipboardList" class="w-5 h-5" />
          </div>
          <div>
            <h3
              class="text-base font-semibold text-slate-800 dark:text-slate-100"
            >
              Add New Task
            </h3>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5"
            >
              Fill in the details to create a new timeline task
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
      <form @submit.prevent="handleSubmitTask">
        <div class="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          <!-- Error Alert -->
          <div
            v-if="responseError"
            class="flex items-start gap-3 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
          >
            <Lucide icon="AlertCircle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ responseError.message }}</span>
          </div>

          <!-- Title -->
          <div>
            <FormLabel
              for="task-title"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Task Title <span class="text-danger">*</span>
            </FormLabel>
            <FormInput
              id="task-title"
              v-model="form.title"
              type="text"
              placeholder="e.g. Book the wedding venue"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <FormLabel
              for="task-description"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Description
            </FormLabel>
            <FormTextarea
              id="task-description"
              v-model="form.description"
              placeholder="Describe what needs to be done..."
              rows="3"
            />
          </div>

          <!-- Row: Status & Priority -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel
                for="task-status"
                class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Status <span class="text-danger">*</span>
              </FormLabel>
              <TomSelect
                id="task-status"
                v-model="form.status"
                class="w-full [&_.dropdown-input-wrap]:hidden"
                required
                :options="{ placeholder: 'Select status', dropdownParent: 'body' }"
              >
                <option
                  v-for="item in taskStatuses"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </TomSelect>
            </div>

            <div>
              <FormLabel
                for="task-priority"
                class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Priority <span class="text-danger">*</span>
              </FormLabel>
              <TomSelect
                id="task-priority"
                v-model="form.priority"
                class="w-full [&_.dropdown-input-wrap]:hidden"
                required
                :options="{ placeholder: 'Select priority', dropdownParent: 'body' }"
              >
                <option
                  v-for="item in taskPriorities"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </TomSelect>
            </div>
          </div>

          <!-- Due Date -->
          <div>
            <FormLabel
              for="task-due-date"
              class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Due Date <span class="text-danger">*</span>
            </FormLabel>
            <Litepicker
              id="task-due-date"
              v-model="form.due_date"
              :options="{
                autoApply: false,
                position: 'top left',
                format: 'D MMM, YYYY',
                dropdowns: {
                  minYear: 2000,
                  maxYear: null,
                  months: true,
                  years: true,
                },
                maxDate: props.weddingDate,
              }"
              class="w-full"
              required
            />
          </div>

          <!-- Row: User Assignment & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel
                for="task-user"
                class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Assigned To <span class="text-danger">*</span>
              </FormLabel>
              <TomSelect
                id="task-user"
                v-model="assigneeIdsString"
                class="w-full [&_.dropdown-input-wrap]:hidden"
                multiple
                required
                :options="{ placeholder: 'Select users', dropdownParent: 'body' }"
                :confirmOnDelete="false"
              >
                <option
                  v-for="user in projectUsers"
                  :key="user.id"
                  :value="user.id.toString()"
                >
                  {{ user.name }}
                </option>
              </TomSelect>
            </div>

            <div>
              <FormLabel
                for="task-category"
                class="font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Category
              </FormLabel>
              <TomSelect
                id="task-category"
                v-model="taskCategoryIdString"
                class="w-full [&_.dropdown-input-wrap]:hidden"
                :options="{ placeholder: 'Select category', dropdownParent: 'body' }"
              >
                <option
                  v-for="cat in taskCategories"
                  :key="cat.id"
                  :value="cat.id.toString()"
                >
                  {{ cat.name }}
                </option>
              </TomSelect>
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
            <Lucide v-else icon="Plus" class="w-4 h-4" />
            {{ isSubmitting ? "Saving..." : "Add Task" }}
          </button>
        </div>
      </form>
    </Dialog.Panel>
  </Dialog>
</template>
