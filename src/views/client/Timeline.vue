<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import Lucide from "@/components/Base/Lucide";
import AddTaskModal from "@/components/Timeline/AddTaskModal.vue";
import TaskDetailModal from "@/components/Timeline/TaskDetailModal.vue";
import TimelineCalendarView from "@/components/Timeline/TimelineCalendarView.vue";
import TomSelect from "@/components/Base/TomSelect";
import useProjectApi from "@/api/client/ProjectApi";
import useTaskApi from "@/api/client/TaskApi";
import type ITask from "@/types/entities/Task";

// View Mode
const viewMode = ref<"timeline" | "calendar">("timeline");

// Modal
const isAddTaskModalOpen = ref(false);

const openAddTaskModal = () => {
  isAddTaskModalOpen.value = true;
};

const closeAddTaskModal = () => {
  isAddTaskModalOpen.value = false;
};

const onTaskAdded = () => {
  fetchTimelineData();
};

const activeProjectCode = ref("");
const activeWeddingDate = ref("");
const projectUsers = ref<any[]>([]);
const projectProgress = ref<any>({});

// State Dinamis
const stats = ref({
  percentage: 0,
  completedTasks: 0,
  totalTasks: 0,
  daysLeft: 0,
  estCost: "Rp 0",
});

// Filter & Sort State
const filterStatus = ref("");
const filterPriority = ref("");
const sortBy = ref("");

const isFilteredOrSorted = computed(() => {
  return (
    filterStatus.value !== "" ||
    filterPriority.value !== "" ||
    sortBy.value !== ""
  );
});

const phases = ref<
  {
    id: number;
    title: string;
    order: number;
    badge: { label: string; class: string };
    isMinimized: boolean;
    tasks: any[];
  }[]
>([]);

const plainTasks = ref<any[]>([]);

// All tasks for calendar view
const allTasks = computed(() => {
  if (isFilteredOrSorted.value) {
    return plainTasks.value;
  }
  return phases.value.flatMap((phase) => phase.tasks);
});

// Watch filters to re-fetch
watch([filterStatus, filterPriority, sortBy], () => {
  fetchTimelineData();
});

const { getListProject } = useProjectApi();
const { getListTask } = useTaskApi();

const formatTaskForDisplay = (t: ITask) => {
  let priorityClass = "bg-slate-100 text-slate-500 dark:bg-darkmode-400";
  let priorityIcon = "Flag";
  if (t.priority === "HIGH") {
    priorityClass = "bg-orange-100 text-orange-600 dark:bg-orange-500/20";
    priorityIcon = "AlertCircle";
  } else if (t.priority === "LOW") {
    priorityClass = "bg-success/20 text-success";
    priorityIcon = "CheckCircle";
  }

  let statusClass = " text-slate-500 ";
  let statusIcon = "Clock";
  if (t.status === "PENDING") {
    statusClass = " text-orange-600 ";
    statusIcon = "Clock";
  } else if (t.status === "COMPLETED") {
    statusClass = " text-success";
    statusIcon = "CheckCircle";
  }

  const formattedDate = new Date(t.due_date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return {
    rawTask: t,
    id: t.id,
    title: t.title,
    completed: t.status === "COMPLETED",
    dueDate: formattedDate,
    tags: [
      {
        label: `${t.priority} PRIORITY`,
        icon: priorityIcon,
        class: priorityClass,
      },
      ...(t.status
        ? [
            {
              label: t.status,
              icon: statusIcon,
              class: statusClass,
            },
          ]
        : []),
      ...(t.task_category
        ? [
            {
              label: t.task_category.name,
              icon: "Tag",
              class: "text-slate-500 dark:text-slate-400",
            },
          ]
        : []),
    ],
    avatars: t.assignees
      ?.filter((u: any) => u.avatar)
      .map((u: any) => u.avatar?.url),
    initials:
      t.assignees
        ?.filter((u: any) => !u.avatar)
        .map((u: any) =>
          u.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
        ) || [],
  };
};

const getPhaseByDate = (weddingDate: string, dueDate: string) => {
  const wedding = new Date(weddingDate);
  const taskDue = new Date(dueDate);

  const totalMonths =
    (wedding.getFullYear() - taskDue.getFullYear()) * 12 +
    (wedding.getMonth() - taskDue.getMonth());

  if (totalMonths >= 12) {
    return { id: 1, title: "12+ Months Before", order: 1 };
  } else if (totalMonths >= 9) {
    return { id: 2, title: "12-9 Months Before", order: 2 };
  } else if (totalMonths >= 6) {
    return { id: 3, title: "9-6 Months Before", order: 3 };
  } else if (totalMonths >= 3) {
    return { id: 4, title: "6-3 Months Before", order: 4 };
  } else if (totalMonths >= 1) {
    return { id: 5, title: "3-1 Months Before", order: 5 };
  } else {
    return { id: 6, title: "1 Month Before & Big Day", order: 6 };
  }
};

const fetchTimelineData = async () => {
  try {
    const savedProject = localStorage.getItem("activeProject");
    if (!savedProject) return;
    const parsedSaved = JSON.parse(savedProject);

    const params: any = {};
    if (filterStatus.value) params["filter[status]"] = filterStatus.value;
    if (filterPriority.value) params["filter[priority]"] = filterPriority.value;
    if (sortBy.value) params["sort"] = sortBy.value;

    // Fetch project metadata and tasks in parallel for better performance
    const [projectsRes, taskData] = await Promise.all([
      getListProject(),
      getListTask(parsedSaved.code, params),
    ]);

    // Update activeProject from the latest project list to get updated task_progress
    const activeProject =
      projectsRes?.payload?.data?.find(
        (p: any) => p.code === parsedSaved.code,
      ) || parsedSaved;

    // Keep localStorage in sync so other components reflect the latest progress
    localStorage.setItem("activeProject", JSON.stringify(activeProject));

    activeProjectCode.value = activeProject.code;
    activeWeddingDate.value = activeProject.wedding_date;
    projectUsers.value = activeProject.users || [];
    projectProgress.value = activeProject.task_progress || {};

    const apiTasks: ITask[] = taskData?.payload?.data || [];

    const tempPhases: Record<string, any> = {};
    const tempPlainTasks: any[] = [];
    let completedCount = 0;

    apiTasks.forEach((t: ITask) => {
      const completed = t.status === "COMPLETED";
      if (completed) completedCount++;

      const formatted = formatTaskForDisplay(t);

      if (isFilteredOrSorted.value) {
        tempPlainTasks.push(formatted);
      } else {
        const phaseInfo = getPhaseByDate(activeWeddingDate.value, t.due_date);
        if (!tempPhases[phaseInfo.order]) {
          tempPhases[phaseInfo.order] = {
            id: phaseInfo.id,
            title: phaseInfo.title,
            order: phaseInfo.order,
            badge: {
              label: "In Progress",
              class: "bg-primary/20 text-primary",
            },
            tasks: [],
          };
        }
        tempPhases[phaseInfo.order].tasks.push(formatted);
      }
    });

    plainTasks.value = tempPlainTasks;

    const currentPhases = phases.value;
    phases.value = Object.values(tempPhases)
      .sort((a, b) => a.order - b.order)
      .map((p) => {
        const existing = currentPhases.find((cp) => cp.id === p.id);
        return { ...p, isMinimized: existing ? existing.isMinimized : false };
      });

    // Update stats from the latest project progress metadata
    stats.value.totalTasks = projectProgress.value.total || 0;
    stats.value.completedTasks = projectProgress.value.completed || 0;
    stats.value.percentage = projectProgress.value.completion_percentage || 0;

    const today = new Date();
    const wedDate = new Date(activeWeddingDate.value);
    const diffTime = Math.abs(wedDate.getTime() - today.getTime());
    stats.value.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format estCost
    stats.value.estCost = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(activeProject.total_budget || 0);
  } catch (error) {
    console.error("Gagal mendapatkan data timeline:", error);
  }
};

onMounted(() => {
  fetchTimelineData();
});

const isTaskDetailModalOpen = ref(false);
const selectedTask = ref<ITask | null>(null);

const toggleTask = (task: any) => {
  selectedTask.value = task.rawTask;
  isTaskDetailModalOpen.value = true;
};

const closeTaskDetailModal = () => {
  isTaskDetailModalOpen.value = false;
  setTimeout(() => {
    selectedTask.value = null;
  }, 300);
};
</script>

<template>
  <div class="py-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center justify-between intro-y">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Wedding Timeline
        </h2>
        <div class="mt-1 text-slate-500 dark:text-slate-400">
          Manage your tasks and stay on track for your big day.
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
        <!-- View Toggle -->
        <div
          class="inline-flex rounded-lg border border-slate-200 dark:border-darkmode-400 p-1 bg-slate-50 dark:bg-darkmode-600"
        >
          <button
            @click="viewMode = 'timeline'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2"
            :class="
              viewMode === 'timeline'
                ? 'bg-white dark:bg-darkmode-400 text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            "
          >
            <Lucide icon="List" class="w-4 h-4" />
            Timeline
          </button>
          <button
            @click="viewMode = 'calendar'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2"
            :class="
              viewMode === 'calendar'
                ? 'bg-white dark:bg-darkmode-400 text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            "
          >
            <Lucide icon="Calendar" class="w-4 h-4" />
            Calendar
          </button>
        </div>
        <button
          @click="openAddTaskModal"
          class="px-5 py-2.5 bg-primary text-white font-medium rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center"
        >
          <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Task
        </button>
      </div>
    </div>

    <!-- Planning Progress -->
    <div
      class="box p-8 mt-8 intro-y flex flex-col lg:flex-row items-center justify-between border border-slate-100/50 dark:border-darkmode-400 shadow-sm relative overflow-hidden group"
    >
      <!-- Decorator blur effect -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700"
      ></div>

      <div class="w-full lg:w-2/3 pr-0 lg:pr-10 z-10">
        <div
          class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3"
        >
          Planning Progress
        </div>
        <div class="flex items-end gap-3 mb-5">
          <div
            class="text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-none"
          >
            {{ stats.percentage }}%
          </div>
          <div class="text-slate-500 font-medium pb-1">
            {{ stats.completedTasks }} of {{ stats.totalTasks }} tasks completed
          </div>
        </div>
        <div
          class="w-full h-3 bg-slate-100 dark:bg-darkmode-400 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-primary transition-all duration-1000 ease-out"
            :style="{ width: stats.percentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Dividers and stats -->
      <div
        class="w-full lg:w-1/3 flex items-center justify-between lg:justify-end gap-10 mt-8 lg:mt-0 lg:pl-10 lg:border-l border-slate-200 dark:border-darkmode-400 z-10"
      >
        <div class="text-left">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Days Left
          </div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {{ stats.daysLeft }}
          </div>
        </div>
        <div class="text-left">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Est. Cost
          </div>
          <div class="text-2xl font-bold text-primary">{{ stats.estCost }}</div>
        </div>
      </div>
    </div>
    <!-- Sort -->
    <div
      class="flex flex-wrap items-center gap-4 mt-4 p-2 relative z-[50] px-2"
    >
      <div class="w-44">
        <TomSelect
          v-model="sortBy"
          :options="{
            placeholder: 'Sort By',
          }"
        >
          <option value="">Default Sort</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
          <option value="due_date">Date Asc</option>
          <option value="-due_date">Date Desc</option>
          <option value="priority">Priority Asc</option>
          <option value="-priority">Priority Desc</option>
          <option value="status">Status Asc</option>
          <option value="-status">Status Desc</option>
        </TomSelect>
      </div>

      <!-- Filter Status -->
      <div class="w-44">
        <TomSelect
          v-model="filterStatus"
          :options="{
            placeholder: 'All Status',
          }"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </TomSelect>
      </div>

      <!-- Filter Priority -->
      <div class="w-44">
        <TomSelect
          v-model="filterPriority"
          :options="{
            placeholder: 'All Priority',
          }"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </TomSelect>
      </div>
    </div>
    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="mt-4">
      <TimelineCalendarView
        :tasks="allTasks"
        :wedding-date="activeWeddingDate"
        @task-click="toggleTask"
      />
    </div>

    <!-- Timeline Phases / Plain List -->
    <div v-else class="mt-4">
      <!-- Plain List (Filter/Sort Active) -->
      <div v-if="isFilteredOrSorted" class="flex flex-col gap-4">
        <div
          v-for="(task, tIndex) in plainTasks"
          :key="task.id"
          class="box p-5 flex items-center intro-y hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden relative group"
          :style="{ animationDelay: `${tIndex * 50}ms` }"
          @click="toggleTask(task)"
        >
          <div
            class="absolute inset-0 bg-slate-50 dark:bg-darkmode-600 opacity-0 group-hover:opacity-100 transition-opacity z-0"
          ></div>
          <div
            class="flex items-center justify-center w-[22px] h-[22px] rounded border-[2px] mr-5 transition-colors z-10 shrink-0"
            :class="
              task.completed
                ? 'bg-primary border-primary'
                : 'border-slate-300 group-hover:border-primary'
            "
          >
            <Lucide
              v-if="task.completed"
              icon="Check"
              class="w-3.5 h-3.5 text-white"
            />
          </div>
          <div class="flex-1 z-10">
            <div
              class="font-bold text-[15px] transition-colors duration-200"
              :class="
                task.completed
                  ? 'text-slate-400 line-through dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-primary'
              "
            >
              {{ task.title }}
            </div>
            <div
              class="flex flex-wrap items-center mt-2 gap-4 text-xs font-medium"
            >
              <div class="flex items-center text-slate-500 dark:text-slate-400">
                <Lucide icon="Calendar" class="w-3.5 h-3.5 mr-1.5" /> Due
                {{ task.dueDate }}
              </div>
              <div
                v-for="(tag, tgIdx) in task.tags"
                :key="tgIdx"
                class="flex items-center rounded-md px-2 py-1"
                :class="tag.class"
              >
                <Lucide
                  v-if="tag.icon"
                  :icon="tag.icon"
                  class="w-3.5 h-3.5 mr-1"
                />
                <span
                  :class="{ 'px-2.5 py-1 rounded-full text-[11px]': !tag.icon }"
                >
                  {{ tag.label }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center -space-x-2.5 z-10 ml-4 shrink-0">
            <template v-if="task.avatars && task.avatars.length > 0">
              <img
                v-for="(av, aIdx) in task.avatars"
                :key="aIdx"
                :src="av"
                class="w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm"
              />
            </template>
            <template v-if="task.initials && task.initials.length > 0">
              <div
                v-for="(init, iIdx) in task.initials"
                :key="iIdx"
                class="flex items-center justify-center w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm bg-orange-100 text-orange-600 font-bold text-xs ring-1 ring-orange-200/50"
              >
                {{ init }}
              </div>
            </template>
          </div>
        </div>
        <div
          v-if="plainTasks.length === 0"
          class="box p-12 text-center text-slate-500 italic intro-y"
        >
          No tasks found matching your criteria.
        </div>
      </div>

      <!-- Phase View (Default) -->
      <div
        v-else
        v-for="(phase, index) in phases"
        :key="phase.id"
        class="mb-10"
      >
        <!-- Phase Header -->
        <div
          class="flex items-center justify-between mb-6 intro-y cursor-pointer group"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="phase.isMinimized = !phase.isMinimized"
        >
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-8 h-8 rounded-md bg-white dark:bg-darkmode-600 shadow-sm text-slate-600 dark:text-white mr-4 border border-slate-200 dark:border-darkmode-400"
            >
              <span class="font-bold text-sm">
                <Lucide icon="Gem" class="w-4 h-4 text-wedding-primary"
              /></span>
            </div>
            <h3
              class="text-xl font-bold text-slate-800 dark:text-slate-200 mr-4 group-hover:text-primary transition-colors"
            >
              {{ phase.title }}
            </h3>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold hidden sm:inline-block"
              :class="phase.badge.class"
              >{{ phase.badge.label }}</span
            >
          </div>
          <div
            class="p-2 rounded-full group-hover:bg-slate-100 dark:group-hover:bg-darkmode-400 transition-colors"
          >
            <Lucide
              icon="ChevronDown"
              class="w-5 h-5 text-slate-400 transition-transform duration-300"
              :class="{ '-rotate-90': phase.isMinimized }"
            />
          </div>
        </div>

        <!-- Task List -->
        <div v-show="!phase.isMinimized" class="flex flex-col gap-4">
          <div
            v-for="(task, tIndex) in phase.tasks"
            :key="task.id"
            class="box p-5 flex items-center intro-y hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden relative group"
            :style="{ animationDelay: `${index * 100 + tIndex * 50}ms` }"
            @click="toggleTask(task)"
          >
            <!-- Subtle background highlight on hover -->
            <div
              class="absolute inset-0 bg-slate-50 dark:bg-darkmode-600 opacity-0 group-hover:opacity-100 transition-opacity z-0"
            ></div>

            <!-- Checkbox -->
            <div
              class="flex items-center justify-center w-[22px] h-[22px] rounded border-[2px] mr-5 transition-colors z-10 shrink-0"
              :class="
                task.completed
                  ? 'bg-primary border-primary'
                  : 'border-slate-300 group-hover:border-primary'
              "
            >
              <Lucide
                v-if="task.completed"
                icon="Check"
                class="w-3.5 h-3.5 text-white"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 z-10">
              <div
                class="font-bold text-[15px] transition-colors duration-200"
                :class="
                  task.completed
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-primary'
                "
              >
                {{ task.title }}
              </div>

              <div
                class="flex flex-wrap items-center mt-2 gap-4 text-xs font-medium"
              >
                <div
                  class="flex items-center text-slate-500 dark:text-slate-400"
                >
                  <Lucide icon="Calendar" class="w-3.5 h-3.5 mr-1.5" /> Due
                  {{ task.dueDate }}
                </div>

                <div
                  v-for="(tag, tgIdx) in task.tags"
                  :key="tgIdx"
                  class="flex items-center rounded-md px-2 py-1"
                  :class="tag.class"
                >
                  <Lucide
                    v-if="tag.icon"
                    :icon="tag.icon"
                    class="w-3.5 h-3.5 mr-1"
                  />
                  <span
                    :class="{
                      'px-2.5  py-1 rounded-full text-[11px]': !tag.icon,
                    }"
                    >{{ tag.label }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Avatars / Initials on the Right -->
            <div class="flex items-center -space-x-2.5 z-10 ml-4 shrink-0">
              <template v-if="task.avatars && task.avatars.length > 0">
                <img
                  v-for="(av, aIdx) in task.avatars"
                  :key="aIdx"
                  :src="av"
                  class="w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm"
                />
              </template>
              <template v-if="task.initials && task.initials.length > 0">
                <div
                  v-for="(init, iIdx) in task.initials"
                  :key="iIdx"
                  class="flex items-center justify-center w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm bg-orange-100 text-orange-600 font-bold text-xs ring-1 ring-orange-200/50"
                >
                  {{ init }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BEGIN: Add Task Modal Component -->
    <AddTaskModal
      :open="isAddTaskModalOpen"
      :project-code="activeProjectCode"
      :wedding-date="activeWeddingDate"
      :project-users="projectUsers"
      @close="closeAddTaskModal"
      @success="onTaskAdded"
    />
    <!-- END: Add Task Modal Component -->

    <!-- BEGIN: Task Detail Modal Component -->
    <TaskDetailModal
      :open="isTaskDetailModalOpen"
      :project-code="activeProjectCode"
      :wedding-date="activeWeddingDate"
      :project-users="projectUsers"
      :task="selectedTask"
      @close="closeTaskDetailModal"
      @success="fetchTimelineData"
    />
    <!-- END: Task Detail Modal Component -->
  </div>
</template>

<!-- <style scoped>
.task-filters :deep(.ts-dropdown) {
  z-index: 9999 !important;
}
</style> -->
