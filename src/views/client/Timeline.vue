<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/components/Base/Lucide";
import AddTaskModal from "./components/AddTaskModal.vue";

// Modal
const isAddTaskModalOpen = ref(false);

const openAddTaskModal = () => {
  isAddTaskModalOpen.value = true;
};

const closeAddTaskModal = () => {
  isAddTaskModalOpen.value = false;
};

const onTaskAdded = () => {
  // Callback when a task is successfully added
  // You can reload the task list here if needed
  console.log("Task successfully added!");
};

// Mock Data
const stats = ref({
  percentage: 35,
  completedTasks: 12,
  totalTasks: 48,
  daysLeft: 245,
  estCost: "Rp 45.000.000",
});

const phases = ref([
  {
    id: 1,
    title: "Phase 1: 12+ Months Before",
    badge: { label: "On Track", class: "bg-success/20 text-success" },
    tasks: [
      {
        id: 1,
        title: "Draft initial guest list",
        completed: true,
        dueDate: "Oct 24",
        tags: [{ label: "Completed", icon: "CheckCircle", class: "text-success" }],
        avatars: [
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=c0aede", 
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=b6e3f4"
        ],
      },
      {
        id: 2,
        title: "Research potential venues",
        completed: false,
        dueDate: "Nov 01",
        tags: [
          { label: "Jakarta, ID", icon: "MapPin", class: "text-slate-500 dark:text-slate-400" },
          { label: "Rp 500.000", icon: "Banknote", class: "text-slate-500 dark:text-slate-400" },
        ],
        initials: "SJ",
      },
      {
        id: 3,
        title: "Set budget parameters",
        completed: false,
        dueDate: "Nov 15",
        tags: [{ label: "High Priority", class: "bg-orange-100 text-orange-600 dark:bg-orange-500/20" }],
        avatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Nala&backgroundColor=ffdfbf"],
      },
    ],
  },
  {
    id: 2,
    title: "Phase 2: 9-6 Months Before",
    badge: { label: "Upcoming", class: "bg-slate-100 text-slate-500 dark:bg-darkmode-400 dark:text-slate-400" },
    tasks: [
      {
        id: 4,
        title: "Book Photographer & Videographer",
        completed: false,
        dueDate: "Jan 15",
        tags: [{ label: "Rp 15.000.000", icon: "Banknote", class: "text-slate-500 dark:text-slate-400" }],
        initials: "+2",
      },
      {
        id: 5,
        title: "Send Save the Dates",
        completed: false,
        dueDate: "Feb 01",
        tags: [{ label: "Rp 2.500.000", icon: "Banknote", class: "text-slate-500 dark:text-slate-400" }],
        avatars: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede"],
      },
    ],
  },
]);

const toggleTask = (task: any) => {
  task.completed = !task.completed;
};
</script>

<template>
  <div class="py-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center justify-between intro-y">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Wedding Timeline</h2>
        <div class="mt-1 text-slate-500 dark:text-slate-400">Manage your tasks and stay on track for your big day.</div>
      </div>
      <div class="flex items-center gap-4 mt-4 sm:mt-0">
        <button
          @click="openAddTaskModal"
          class="px-5 py-2.5 bg-primary text-white font-medium rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center"
        >
          <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Task
        </button>
      </div>
    </div>

    <!-- Planning Progress -->
    <div class="box p-8 mt-8 intro-y flex flex-col lg:flex-row items-center justify-between border border-slate-100/50 dark:border-darkmode-400 shadow-sm relative overflow-hidden group">
      <!-- Decorator blur effect -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700"></div>

      <div class="w-full lg:w-2/3 pr-0 lg:pr-10 z-10">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Planning Progress</div>
        <div class="flex items-end gap-3 mb-5">
          <div class="text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{{ stats.percentage }}%</div>
          <div class="text-slate-500 font-medium pb-1">{{ stats.completedTasks }} of {{ stats.totalTasks }} tasks completed</div>
        </div>
        <div class="w-full h-3 bg-slate-100 dark:bg-darkmode-400 rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{ width: stats.percentage + '%' }"></div>
        </div>
      </div>
      
      <!-- Dividers and stats -->
      <div class="w-full lg:w-1/3 flex items-center justify-between lg:justify-end gap-10 mt-8 lg:mt-0 lg:pl-10 lg:border-l border-slate-200 dark:border-darkmode-400 z-10">
        <div class="text-left">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Days Left</div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ stats.daysLeft }}</div>
        </div>
        <div class="text-left">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Est. Cost</div>
          <div class="text-2xl font-bold text-primary">{{ stats.estCost }}</div>
        </div>
      </div>
    </div>

    <!-- Timeline Phases -->
    <div class="mt-12">
      <div v-for="(phase, index) in phases" :key="phase.id" class="mb-10">
        <!-- Phase Header -->
        <div class="flex items-center mb-6 intro-y" :style="{ animationDelay: `${index * 100}ms` }">
          <div class="flex items-center justify-center w-8 h-8 rounded-md bg-white dark:bg-darkmode-600 shadow-sm text-slate-600 dark:text-white mr-4 border border-slate-200 dark:border-darkmode-400">
            <span class="font-bold text-sm">{{ phase.id }}</span>
          </div>
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mr-4">{{ phase.title }}</h3>
          <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="phase.badge.class">{{ phase.badge.label }}</span>
        </div>

        <!-- Task List -->
        <div class="flex flex-col gap-4">
          <div v-for="(task, tIndex) in phase.tasks" :key="task.id" 
               class="box p-5 flex items-center intro-y hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden relative group"
               :style="{ animationDelay: `${(index * 100) + (tIndex * 50)}ms` }"
               @click="toggleTask(task)">
               
            <!-- Subtle background highlight on hover -->
            <div class="absolute inset-0 bg-slate-50 dark:bg-darkmode-600 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>

            <!-- Checkbox -->
            <div class="flex items-center justify-center w-[22px] h-[22px] rounded border-[2px] mr-5 transition-colors z-10 shrink-0"
                 :class="task.completed ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'">
              <Lucide v-if="task.completed" icon="Check" class="w-3.5 h-3.5 text-white" />
            </div>

            <!-- Content -->
            <div class="flex-1 z-10">
              <div class="font-bold text-[15px] transition-colors duration-200" 
                   :class="task.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 group-hover:text-primary'">
                {{ task.title }}
              </div>
              
              <div class="flex flex-wrap items-center mt-2 gap-4 text-xs font-medium">
                <div class="flex items-center text-slate-500 dark:text-slate-400">
                  <Lucide icon="Calendar" class="w-3.5 h-3.5 mr-1.5" /> Due {{ task.dueDate }}
                </div>
                
                <div v-for="(tag, tgIdx) in task.tags" :key="tgIdx" class="flex items-center" :class="tag.class">
                  <Lucide v-if="tag.icon" :icon="tag.icon" class="w-3.5 h-3.5 mr-1" />
                  <span :class="{'px-2.5 py-1 rounded-full text-[11px]': !tag.icon}">{{ tag.label }}</span>
                </div>
              </div>
            </div>

            <!-- Avatars / Initials on the Right -->
            <div class="flex items-center -space-x-2.5 z-10 ml-4 shrink-0">
              <template v-if="task.avatars">
                <img v-for="(av, aIdx) in task.avatars" :key="aIdx" 
                     :src="av" class="w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm" />
              </template>
              <div v-if="task.initials" 
                   class="flex items-center justify-center w-9 h-9 rounded-full border-[2.5px] border-white dark:border-darkmode-600 shadow-sm bg-orange-100 text-orange-600 font-bold text-xs ring-1 ring-orange-200/50">
                {{ task.initials }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BEGIN: Add Task Modal Component -->
    <AddTaskModal 
      :open="isAddTaskModalOpen"
      project-code="your-project-code"
      @close="closeAddTaskModal"
      @success="onTaskAdded"
    />
    <!-- END: Add Task Modal Component -->
  </div>
</template>
