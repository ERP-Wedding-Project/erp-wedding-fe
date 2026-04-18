<script setup lang="ts">
import { ref, watch } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import useTaskApi from "@/api/client/TaskApi";
import type ITask from "@/types/entities/Task";

const props = defineProps<{
  open: boolean;
  projectCode: string;
  task: ITask | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const { getTaskDetail, updateTask, deleteTask } = useTaskApi();
const isSubmitting = ref(false);
const isLoading = ref(false);
const taskDetail = ref<ITask | null>(null);
const isDeleteConfirmOpen = ref(false);

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.task) {
      try {
        isLoading.value = true;
        const res = await getTaskDetail(props.projectCode, props.task.id);
        taskDetail.value =
          res?.payload?.data || res?.data || res?.payload || null;
        console.log(taskDetail.value);
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
      payload: { status: "COMPLETED" },
    });
    emit("success");
    closeModal();
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
          <div class="flex items-center gap-3">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f0e4db] text-slate-700"
            >
              <Lucide icon="MapPin" class="w-5 h-5 opacity-70" />
            </div>
            <h3 class="text-xl font-bold text-slate-800">
              {{ taskDetail.title }}
            </h3>
          </div>
          <button
            @click="closeModal"
            class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Lucide icon="X" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-6 pb-8">
          <div class="grid grid-cols-2 gap-y-6 gap-x-8">
            <!-- Due Date -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Due Date
              </div>
              <div class="flex items-center text-slate-700 font-medium text-sm">
                <Lucide icon="Calendar" class="w-4 h-4 mr-2 opacity-70" />
                {{
                  new Date(taskDetail.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                }}
              </div>
            </div>

            <!-- Status -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Status
              </div>
              <div
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
            </div>

            <!-- Assigned To -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Assigned To
              </div>
              <div class="flex items-center gap-2">
                <!-- Pseudo Avatar -->
                <div
                  class="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shadow-sm"
                >
                  <img
                    src="https://ui-avatars.com/api/?name=User"
                    class="w-full h-full object-cover"
                  />
                </div>
                <span class="text-sm font-medium text-slate-700">
                  {{
                    taskDetail.assignees && taskDetail.assignees.length > 0
                      ? taskDetail.assignees.map((u: any) => u.name).join(", ")
                      : "Unassigned"
                  }}
                </span>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Priority
              </div>
              <div
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
                <span
                  class="font-black mr-1"
                  v-if="
                    taskDetail.priority === 'HIGH' ||
                    taskDetail.priority === 'URGENT'
                  "
                  >!</span
                >
                {{ taskDetail.priority }}
              </div>
            </div>

            <!-- Category -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Category
              </div>
              <div
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f0e4db] text-[#8e6e5a]"
                v-if="taskDetail.task_category"
              >
                <Lucide icon="Home" class="w-3 h-3 mr-1.5" />
                {{ taskDetail.task_category.name }}
              </div>
              <div class="text-sm text-slate-400" v-else>Uncategorized</div>
            </div>

            <!-- Estimated Cost -->
            <div>
              <div
                class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
              >
                Estimated Cost
              </div>
              <div class="text-sm font-bold text-slate-800">Rp 0</div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-8">
            <div
              class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2"
            >
              Notes
            </div>
            <div
              class="p-4 rounded-xl border border-orange-50 bg-[#fffdfb] text-slate-600 text-sm leading-relaxed min-h-[100px]"
            >
              {{ taskDetail.description || "No notes provided." }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 rounded-b-lg"
        >
          <button
            @click="isDeleteConfirmOpen = true"
            type="button"
            class="text-sm font-bold text-danger flex items-center hover:text-danger/80 transition-colors"
            :disabled="isSubmitting"
          >
            <Lucide icon="Trash2" class="w-4 h-4 mr-1.5" />
            Delete Task
          </button>
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 transition-colors"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              v-if="taskDetail.status !== 'COMPLETED'"
              type="button"
              @click="handleMarkAsCompleted"
              :disabled="isSubmitting"
              class="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm bg-[#c0997e] hover:bg-[#a68269] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Lucide
                v-if="isSubmitting"
                icon="Loader"
                class="w-4 h-4 animate-spin mr-2"
              />
              {{ isSubmitting ? "Saving..." : "Mark as Completed" }}
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
