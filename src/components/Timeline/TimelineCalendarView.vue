<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Lucide from "@/components/Base/Lucide";
import type ITask from "@/types/entities/Task";

interface Props {
  tasks: any[];
  weddingDate: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "taskClick", task: any): void;
}>();

const currentDate = ref(new Date());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const calendarDays = computed(() => {
  const days = [];
  const totalDays = daysInMonth.value;
  const firstDay = firstDayOfMonth.value;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, tasks: [] });
  }

  // Add days of the month with their tasks
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const tasksForDay = props.tasks.filter((task) => {
      const taskDate = new Date(task.rawTask.due_date);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentMonth.value &&
        taskDate.getFullYear() === currentYear.value
      );
    });

    days.push({ day, date: dateStr, tasks: tasksForDay });
  }

  return days;
});

const goToPreviousMonth = () => {
  if (currentMonth.value === 0) {
    currentDate.value = new Date(currentYear.value - 1, 11, 1);
  } else {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  }
};

const goToNextMonth = () => {
  if (currentMonth.value === 11) {
    currentDate.value = new Date(currentYear.value + 1, 0, 1);
  } else {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  }
};

const goToToday = () => {
  currentDate.value = new Date();
};

const changeMonth = (monthIndex: number) => {
  currentDate.value = new Date(currentYear.value, monthIndex, 1);
};

const changeYear = (year: number) => {
  currentDate.value = new Date(year, currentMonth.value, 1);
};

// Generate year options (current year ± 2 years)
const yearOptions = computed(() => {
  const currentYearValue = new Date().getFullYear();
  const years = [];
  for (let i = currentYearValue - 2; i <= currentYearValue + 2; i++) {
    years.push(i);
  }
  return years;
});

const isToday = (day: number | null) => {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

const isWeddingDay = (day: number | null) => {
  if (!day || !props.weddingDate) return false;
  const wedding = new Date(props.weddingDate);
  return (
    day === wedding.getDate() &&
    currentMonth.value === wedding.getMonth() &&
    currentYear.value === wedding.getFullYear()
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-orange-500";
    case "MEDIUM":
      return "bg-blue-500";
    case "LOW":
      return "bg-green-500";
    default:
      return "bg-slate-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "CheckCircle";
    case "IN_PROGRESS":
      return "Clock";
    case "PENDING":
      return "Clock";
    default:
      return "Circle";
  }
};
</script>

<template>
  <div class="box p-6">
    <!-- Calendar Header -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
    >
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Month Selector -->
        <select
          :value="currentMonth"
          @change="
            changeMonth(parseInt(($event.target as HTMLSelectElement).value))
          "
          class="px-4 pr-8 py-2 text-lg font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-darkmode-600 border border-slate-200 dark:border-darkmode-400 rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option
            v-for="(month, index) in monthNames"
            :key="index"
            :value="index"
          >
            {{ month }}
          </option>
        </select>

        <!-- Year Selector -->
        <select
          :value="currentYear"
          @change="
            changeYear(parseInt(($event.target as HTMLSelectElement).value))
          "
          class="px-4 pr-8 py-2 text-lg font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-darkmode-600 border border-slate-200 dark:border-darkmode-400 rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <button
          @click="goToToday"
          class="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPreviousMonth"
          class="p-2 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-lg transition-colors"
        >
          <Lucide icon="ChevronLeft" class="w-5 h-5" />
        </button>
        <button
          @click="goToNextMonth"
          class="p-2 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-lg transition-colors"
        >
          <Lucide icon="ChevronRight" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div
      class="grid grid-cols-7 gap-px bg-slate-200 dark:bg-darkmode-400 border border-slate-200 dark:border-darkmode-400 rounded-lg overflow-hidden"
    >
      <!-- Day Headers -->
      <div
        v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
        :key="day"
        class="bg-slate-50 dark:bg-darkmode-600 p-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
      >
        {{ day }}
      </div>

      <!-- Calendar Days -->
      <div
        v-for="(dayData, index) in calendarDays"
        :key="index"
        class="bg-white dark:bg-darkmode-700 min-h-[120px] p-2 relative group hover:bg-slate-50 dark:hover:bg-darkmode-600 transition-colors"
        :class="{
          'bg-slate-50 dark:bg-darkmode-800': !dayData.day,
          'ring-2 ring-primary ring-inset': isToday(dayData.day),
          'bg-rose-50 dark:bg-rose-900/20': isWeddingDay(dayData.day),
        }"
      >
        <!-- Day Number -->
        <div v-if="dayData.day" class="flex items-center justify-between mb-2">
          <span
            class="text-sm font-semibold"
            :class="{
              'text-primary': isToday(dayData.day),
              'text-rose-600 dark:text-rose-400': isWeddingDay(dayData.day),
              'text-slate-700 dark:text-slate-300':
                !isToday(dayData.day) && !isWeddingDay(dayData.day),
            }"
          >
            {{ dayData.day }}
          </span>
          <span
            v-if="isWeddingDay(dayData.day)"
            class="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded-full"
          >
            Wedding Day
          </span>
        </div>

        <!-- Tasks for this day -->
        <div class="space-y-1">
          <div
            v-for="(task, taskIndex) in dayData.tasks.slice(0, 3)"
            :key="task.id"
            @click="emit('taskClick', task)"
            class="group/task cursor-pointer p-1.5 rounded hover:bg-white dark:hover:bg-darkmode-700 hover:shadow-sm transition-all border border-transparent hover:border-primary/20"
          >
            <div class="flex items-start gap-1.5">
              <div
                class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                :class="getPriorityColor(task.rawTask.priority)"
              ></div>
              <div class="flex-1 min-w-0">
                <div
                  class="text-xs font-medium truncate"
                  :class="{
                    'text-slate-400 line-through': task.completed,
                    'text-slate-700 dark:text-slate-300 group-hover/task:text-primary':
                      !task.completed,
                  }"
                >
                  {{ task.title }}
                </div>
                <div class="flex items-center gap-1 mt-0.5">
                  <Lucide
                    :icon="getStatusIcon(task.rawTask.status)"
                    class="w-2.5 h-2.5"
                    :class="{
                      'text-success': task.rawTask.status === 'COMPLETED',
                      'text-orange-500': task.rawTask.status === 'PENDING',
                      'text-blue-500': task.rawTask.status === 'IN_PROGRESS',
                    }"
                  />
                  <span
                    v-if="task.rawTask.task_category"
                    class="text-[10px] text-slate-500 dark:text-slate-400 truncate"
                  >
                    {{ task.rawTask.task_category.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Show more indicator -->
          <div
            v-if="dayData.tasks.length > 3"
            class="text-[10px] text-slate-500 dark:text-slate-400 font-medium pl-3 pt-1"
          >
            +{{ dayData.tasks.length - 3 }} more
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center gap-4 mt-4 text-xs">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
        <span class="text-slate-600 dark:text-slate-400">High Priority</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <span class="text-slate-600 dark:text-slate-400">Medium Priority</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-slate-600 dark:text-slate-400">Low Priority</span>
      </div>
    </div>
  </div>
</template>
