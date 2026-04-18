<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import Litepicker from "@/components/Base/Litepicker";
import TomSelect from "@/components/Base/TomSelect";
import useTaskApi, { type FormTask } from "@/api/client/TaskApi";
import useTaskCategoryApi from "@/api/client/TaskCategoryApi";
import useEnumsOptionApi from "@/api/client/EnumsOptionApi";
import type ITask from "@/types/entities/Task";
import dayjs from "dayjs";

const props = defineProps<{
  open: boolean;
  projectCode: string;
  weddingDate?: string;
  projectUsers?: any[];
  task: ITask | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const { getTaskDetail, updateTask, deleteTask } = useTaskApi();
const { getListTaskCategory } = useTaskCategoryApi();
const { getEnumsOption } = useEnumsOptionApi();

const isSubmitting = ref(false);
const isLoading = ref(false);
const taskDetail = ref<ITask | null>(null);
const isDeleteConfirmOpen = ref(false);
const isEditing = ref(false);

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
  } catch (_) {}
};

const form = reactive<FormTask>({
  title: "",
  description: "",
  status: "",
  priority: "",
  due_date: "",
  assignee_ids: [],
  task_category_id: null,
});

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
  async (isOpen) => {
    if (isOpen && props.task) {
      isEditing.value = false;
      fetchTaskCategories();
      try {
        isLoading.value = true;
        const res = await getTaskDetail(props.projectCode, props.task.id);
        taskDetail.value =
          res?.payload?.data || res?.data || res?.payload || null;
          
        if (taskDetail.value) {
          form.title = taskDetail.value.title;
          form.description = taskDetail.value.description;
          form.status = taskDetail.value.status;
          form.priority = taskDetail.value.priority;
          form.due_date = taskDetail.value.due_date ? dayjs(taskDetail.value.due_date).format("D MMM, YYYY") : "";
          form.assignee_ids = taskDetail.value.assignees ? taskDetail.value.assignees.map((u:any)=>u.id) : [];
          form.task_category_id = taskDetail.value.task_category ? taskDetail.value.task_category.id : null;
        }
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    } else {
      taskDetail.value = null;
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit("close");
};

const handleMarkAsCompleted = async () => {
  if (!props.task) return;
  try {
    isSubmitting.value = true;
    await updateTask({
      projectCode: props.projectCode,
      taskId: props.task.id,
      payload: { ...form, status: "COMPLETED" },
    });
    emit("success");
    closeModal();
  } catch (e) {
    // handled
  } finally {
    isSubmitting.value = false;
  }
};

const saveChanges = async () => {
  if (!props.task) return;
  try {
    isSubmitting.value = true;
    await updateTask({
      projectCode: props.projectCode,
      taskId: props.task.id,
      payload: { ...form },
    });
    emit("success");
    isEditing.value = false;
    
    // refetch data
    const res = await getTaskDetail(props.projectCode, props.task.id);
    taskDetail.value = res?.payload?.data || res?.data || res?.payload || null;
  } catch (e) {
    // handled
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  if (!props.task) return;
  try {
    isSubmitting.value = true;
    await deleteTask({
      projectCode: props.projectCode,
      taskId: props.task.id,
    });
    emit("success");
    isDeleteConfirmOpen.value = false;
    closeModal();
  } catch (e) {
    // handled
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog size="lg" :open="open" @close="closeModal">
    <Dialog.Panel>
      <div
        v-if="isLoading"
        class="p-16 flex flex-col items-center justify-center text-slate-500"
      >
        <Lucide icon="Loader" class="w-8 h-8 animate-spin mb-4 text-primary" />
        <span class="text-sm font-medium">Loading details...</span>
      </div>
      <div v-else-if="taskDetail">
        <!-- Header -->
        <div
          class="px-6 py-5 bg-gradient-to-r from-[#faf6f3] to-white rounded-t-lg border-b border-slate-100 flex items-center justify-between"
        >
          <div class="flex flex-1 items-center gap-3 pr-4">
            <div
              class="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-[#f0e4db] text-slate-700"
            >
              <Lucide icon="MapPin" class="w-5 h-5 opacity-70" />
            </div>
            
            <h3 v-if="!isEditing" class="text-xl font-bold text-slate-800">
              {{ taskDetail.title }}
            </h3>
            <FormInput
              v-else
              v-model="form.title"
              type="text"
              class="w-full text-base font-bold shadow-sm border-slate-200"
              placeholder="Task Title"
            />
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="px-3 py-1.5 text-xs font-semibold text-[#8e6b5a] bg-[#f0e4db] rounded-lg hover:bg-[#A27A68] hover:text-white transition"
            >
              <Lucide icon="Edit2" class="w-3.5 h-3.5 inline mr-1" />
              Edit
            </button>
            <button
              @click="closeModal"
              class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Lucide icon="X" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-6 pb-8" :class="isEditing ? 'max-h-[60vh] overflow-y-auto' : ''">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <!-- Due Date -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Due Date
              </div>
              <div v-if="!isEditing" class="flex items-center text-slate-700 font-medium text-sm">
                <Lucide icon="Calendar" class="w-4 h-4 mr-2 opacity-70" />
                {{
                  new Date(taskDetail.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                }}
              </div>
              <div v-else>
                <Litepicker
                  v-model="form.due_date"
                  :options="{
                    autoApply: false,
                    format: 'D MMM, YYYY',
                    maxDate: props.weddingDate,
                  }"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Status
              </div>
              <div
                v-if="!isEditing"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  taskDetail.status === 'COMPLETED'
                    ? 'bg-success/20 text-success'
                    : taskDetail.status === 'PENDING'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-orange-50 text-orange-600'
                "
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                {{
                  taskDetail.status === "COMPLETED"
                    ? "Completed"
                    : taskDetail.status === "IN_PROGRESS"
                      ? "In Progress"
                      : taskDetail.status
                }}
              </div>
              <div v-else>
                <TomSelect
                  v-model="form.status"
                  class="w-full [&_.dropdown-input-wrap]:hidden"
                  :options="{ placeholder: 'Select status' }"
                >
                  <option v-for="item in taskStatuses" :key="item.value" :value="item.value">{{ item.label }}</option>
                </TomSelect>
              </div>
            </div>

            <!-- Assigned To -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Assigned To
              </div>
              <div v-if="!isEditing" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shadow-sm">
                  <img src="https://ui-avatars.com/api/?name=User" class="w-full h-full object-cover"/>
                </div>
                <span class="text-sm font-medium text-slate-700">
                  {{
                    taskDetail.assignees && taskDetail.assignees.length > 0
                      ? taskDetail.assignees.map((u: any) => u.name).join(", ")
                      : "Unassigned"
                  }}
                </span>
              </div>
              <div v-else>
                <TomSelect
                  v-model="assigneeIdsString"
                  class="w-full [&_.dropdown-input-wrap]:hidden"
                  multiple
                  :options="{ placeholder: 'Select users' }"
                >
                  <option v-for="user in projectUsers" :key="user.id" :value="user.id.toString()">
                    {{ user.name }}
                  </option>
                </TomSelect>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Priority
              </div>
              <div
                v-if="!isEditing"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  taskDetail.priority === 'HIGH' ||
                  taskDetail.priority === 'URGENT'
                    ? 'bg-red-100 text-red-600'
                    : taskDetail.priority === 'LOW'
                      ? 'bg-success/20 text-success'
                      : 'bg-slate-100 text-slate-600'
                "
              >
                <span class="font-black mr-1" v-if="taskDetail.priority === 'HIGH' || taskDetail.priority === 'URGENT'">!</span>
                {{ taskDetail.priority }}
              </div>
              <div v-else>
                <TomSelect
                  v-model="form.priority"
                  class="w-full [&_.dropdown-input-wrap]:hidden"
                  :options="{ placeholder: 'Select priority' }"
                >
                  <option v-for="item in taskPriorities" :key="item.value" :value="item.value">{{ item.label }}</option>
                </TomSelect>
              </div>
            </div>

            <!-- Category -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </div>
              <div v-if="!isEditing">
                  <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0e4db] text-[#8e6e5a]" v-if="taskDetail.task_category">
                    <Lucide icon="Home" class="w-3 h-3 mr-1.5" />
                    {{ taskDetail.task_category.name }}
                  </div>
                  <div class="text-sm text-slate-400" v-else>Uncategorized</div>
              </div>
              <div v-else>
                <TomSelect
                  v-model="taskCategoryIdString"
                  class="w-full [&_.dropdown-input-wrap]:hidden"
                  :options="{ placeholder: 'Select category' }"
                >
                  <option v-for="cat in taskCategories" :key="cat.id" :value="cat.id.toString()">{{ cat.name }}</option>
                </TomSelect>
              </div>
            </div>

            <!-- Estimated Cost -->
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Estimated Cost
              </div>
              <div class="text-sm font-bold text-slate-800">Rp 0</div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-8">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Notes
            </div>
            <div v-if="!isEditing" class="p-4 rounded-xl border border-orange-50 bg-[#fffdfb] text-slate-600 text-sm leading-relaxed min-h-[100px] whitespace-pre-wrap">{{ taskDetail.description || "No notes provided." }}</div>
            <FormTextarea
              v-else
              v-model="form.description"
              rows="4"
              placeholder="Add some notes about this task..."
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
          <button
            @click="isDeleteConfirmOpen = true"
            type="button"
            class="text-sm font-bold text-danger flex items-center hover:text-danger/80 transition-colors"
            v-if="!isEditing"
          >
            <Lucide icon="Trash2" class="w-4 h-4 mr-1.5" /> Delete Task
          </button>
          <div v-else></div> <!-- spacer when editing so buttons align right -->
          
          <div class="flex items-center gap-3">
            <button
              v-if="!isEditing"
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              v-if="!isEditing && taskDetail.status !== 'COMPLETED'"
              type="button"
              @click="handleMarkAsCompleted"
              :disabled="isSubmitting"
              class="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm bg-[#c0997e] hover:bg-[#a68269] disabled:opacity-60 transition-colors flex items-center"
            >
              <Lucide v-if="isSubmitting" icon="Loader" class="w-4 h-4 animate-spin mr-2" />
              {{ isSubmitting ? "Saving..." : "Mark as Completed" }}
            </button>

            <!-- Edit specific buttons -->
            <button
              v-if="isEditing"
              type="button"
              @click="isEditing = false"
              class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              :disabled="isSubmitting"
            >
              Cancel Edit
            </button>
            <button
              v-if="isEditing"
              type="button"
              @click="saveChanges"
              :disabled="isSubmitting"
              class="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center"
            >
              <Lucide v-if="isSubmitting" icon="Loader" class="w-4 h-4 animate-spin mr-2" />
              {{ isSubmitting ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Delete Confirmation Modal -->
  <Dialog :open="isDeleteConfirmOpen" @close="isDeleteConfirmOpen = false">
    <Dialog.Panel>
      <div class="px-6 py-5 text-center">
        <Lucide icon="AlertCircle" class="w-16 h-16 text-danger mx-auto mt-3 mb-4" />
        <h3 class="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
        <p class="text-slate-500 mb-6 font-medium">Do you really want to delete this task? This process cannot be undone.</p>
        <div class="flex justify-center gap-3 pb-3">
          <button type="button" @click="isDeleteConfirmOpen = false" class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border-none" :disabled="isSubmitting">
            Cancel
          </button>
          <button type="button" @click="handleDelete" :disabled="isSubmitting" class="px-5 py-2.5 text-sm font-medium text-white bg-danger hover:bg-danger/80 rounded-lg transition-colors border-none flex items-center shadow-sm">
            <Lucide v-if="isSubmitting" icon="Loader" class="w-4 h-4 animate-spin mr-2" />
            {{ isSubmitting ? "Deleting..." : "Yes, delete task!" }}
          </button>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
