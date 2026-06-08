<script setup lang="ts">
import { ref, onMounted } from "vue";
import Lucide from "@/components/Base/Lucide";
import useProjectApi from "@/api/client/ProjectApi";

const upcomingDays = ref(142);
const { getProjectActivities } = useProjectApi();
const totalBudget = ref("Rp 525.000.000");
const totalPaid = ref("Rp 186.750.000");
const totalSavings = ref("Rp 225.000.000");
const unallocated = ref("Rp 113.250.000");

const steps = [
  { id: 1, title: "Inspiration", status: "completed" },
  { id: 2, title: "Vendors", status: "current" },
  { id: 3, title: "Guest List", status: "pending" },
  { id: 4, title: "Invites", status: "pending" },
  { id: 5, title: "Details", status: "pending" },
];

const fundingStatus = [
  {
    category: "Venue & Rentals",
    status: "Partially Paid",
    statusColor: "bg-warning/20 text-warning",
    paid: "Rp 75.000k",
    total: "150.000k",
    progress: 50,
    color: "bg-warning",
    icon: "MapPin",
  },
  {
    category: "Photography",
    status: "Fully Funded",
    statusColor: "bg-success/20 text-success",
    paid: "Rp 45.000k",
    total: "45.000k",
    progress: 100,
    color: "bg-success",
    icon: "Camera",
  },
  {
    category: "Florals",
    status: "Pending",
    statusColor: "bg-slate-100 text-slate-500",
    paid: "Rp 0",
    total: "37.500k",
    progress: 0,
    color: "bg-slate-200",
    icon: "Flower2",
  },
  {
    category: "Catering & Bar",
    status: "Deposit Paid",
    statusColor: "bg-warning/20 text-warning",
    paid: "Rp 30.000k",
    total: "127.500k",
    progress: 25,
    color: "bg-warning",
    icon: "Utensils",
  },
];

const recentUpdates = ref<any[]>([]);

const getIconForActivity = (type: string) => {
  switch (type) {
    case "Task":
      return "CheckSquare";
    case "PartnerInvitation":
      return "Mail";
    case "Project":
      return "Folder";
    case "Collaborator":
      return "Users";
    case "Expense":
      return "DollarSign";
    default:
      return "Bell";
  }
};

const getColorForActivity = (type: string) => {
  switch (type) {
    case "Task":
      return "bg-primary/20 text-primary";
    case "PartnerInvitation":
      return "bg-warning/20 text-warning";
    case "Project":
      return "bg-success/20 text-success";
    case "Collaborator":
      return "bg-danger/20 text-danger";
    case "Expense":
      return "bg-success/20 text-success";
    default:
      return "bg-slate-100 text-slate-500";
  }
};

const quickTasks = ref([
  { id: 1, title: "Call the caterer", completed: false },
  { id: 2, title: "Send deposit to DJ", completed: true },
  { id: 3, title: "Finalize seating chart", completed: false },
]);

const fetchRecentUpdates = async () => {
  try {
    const savedProject = localStorage.getItem("activeProject");
    if (!savedProject) return;
    const project = JSON.parse(savedProject);

    const response = await getProjectActivities(project.code);
    console.log("res", response);

    if (response?.data) {
      recentUpdates.value = response.data.slice(0, 5).map((activity: any) => ({
        title: activity.title,
        desc: activity.description,
        time: activity.time,
        author: activity.causer?.name || null,
        icon: getIconForActivity(activity.type),
        color: getColorForActivity(activity.type),
      }));
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

onMounted(() => {
  fetchRecentUpdates();
});
</script>

<template>
  <div class="py-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center justify-between intro-y">
      <div>
        <h2 class="text-2xl font-bold text-primary">Dashboard Overview</h2>
        <div class="mt-1 text-slate-500">
          Good morning, let's plan your perfect day.
        </div>
      </div>
      <div class="flex items-center gap-4 mt-4 sm:mt-0">
        <div
          class="flex items-center px-4 py-2 bg-white rounded-full shadow-sm dark:bg-darkmode-600 border border-slate-200"
        >
          <Lucide icon="Clock" class="w-4 h-4 mr-2 text-primary" />
          <span class="font-bold mr-1">{{ upcomingDays }} Days</span>
          <span class="text-slate-500 text-sm">until the Big Day</span>
        </div>
        <!-- <button class="p-2 bg-primary/20 rounded-full dark:bg-darkmode-400 hover:bg-primary/30 transition-colors relative">
          <Lucide icon="Bell" class="w-5 h-5 text-slate-800 dark:text-slate-300" />
          <div class="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger"></div>
        </button> -->
      </div>
    </div>

    <!-- Cards Row -->
    <div class="grid grid-cols-12 gap-6 mt-8">
      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          class="p-5 box zoom-in bg-primary/10 dark:bg-darkmode-600 border border-white/50"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-darkmode-400 shadow-sm text-slate-500"
            >
              <Lucide icon="Wallet" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success"
            >
              +0%
            </div>
          </div>
          <div class="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Total Budget
          </div>
          <div
            class="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200"
          >
            {{ totalBudget }}
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          class="p-5 box zoom-in bg-primary/20 dark:bg-darkmode-600 border border-white/50 relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-darkmode-400 shadow-sm text-slate-500"
            >
              <Lucide icon="Receipt" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success"
            >
              +35%
            </div>
          </div>
          <div class="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Total Paid
          </div>
          <div
            class="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200"
          >
            {{ totalPaid }}
          </div>
          <div
            class="absolute bottom-4 left-5 right-5 h-1.5 bg-white/50 rounded-full overflow-hidden"
          >
            <div class="h-full bg-primary" style="width: 35%"></div>
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          class="p-5 box zoom-in bg-primary/10 dark:bg-darkmode-600 border border-white/50"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-darkmode-400 shadow-sm text-slate-500"
            >
              <Lucide icon="PiggyBank" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success"
            >
              +42%
            </div>
          </div>
          <div class="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Total Savings
          </div>
          <div
            class="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200"
          >
            {{ totalSavings }}
          </div>
        </div>
      </div>

      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          class="p-5 box zoom-in bg-primary/20 dark:bg-darkmode-600 border border-white/50"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-darkmode-400 shadow-sm text-slate-500"
            >
              <Lucide icon="PieChart" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-danger/20 text-danger"
            >
              -20%
            </div>
          </div>
          <div class="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Unallocated
          </div>
          <div
            class="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-200"
          >
            {{ unallocated }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mt-6">
      <!-- Main Left -->
      <div class="col-span-12 lg:col-span-8 grid grid-cols-1 gap-6">
        <!-- Timeline -->
        <div class="col-span-1 box p-6 intro-y">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200">
              Planning Timeline
            </h2>
            <a href="#" class="text-primary hover:underline text-sm font-medium"
              >View Full Plan</a
            >
          </div>

          <div class="relative mb-10 mx-6">
            <div
              class="absolute top-[20px] left-0 w-full h-1 bg-slate-200 dark:bg-darkmode-400 rounded-full z-0"
            >
              <div
                class="h-full bg-primary rounded-full"
                style="width: 35%"
              ></div>
            </div>
            <div class="relative flex justify-between z-10 w-full">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="flex flex-col items-center"
              >
                <div
                  class="flex items-center justify-center w-11 h-11 rounded-full border-[5px] border-white dark:border-darkmode-600 shadow-sm transition"
                  :class="
                    step.status === 'completed' || step.status === 'current'
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-400 border-slate-200 dark:bg-darkmode-400 dark:border-darkmode-400'
                  "
                >
                  <Lucide
                    v-if="step.status === 'completed'"
                    icon="Check"
                    class="w-4 h-4"
                  />
                  <Lucide
                    v-else-if="step.status === 'current'"
                    icon="Store"
                    class="w-4 h-4"
                  />
                  <span v-else class="text-sm font-bold">{{ step.id }}</span>
                </div>
                <div
                  class="mt-3 text-sm font-medium"
                  :class="
                    step.status === 'current' || step.status === 'completed'
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  "
                >
                  {{ step.title }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center p-5 bg-primary/10 dark:bg-darkmode-400 rounded-xl border border-primary/20"
          >
            <div
              class="flex items-center justify-center w-12 h-12 bg-white rounded-full text-primary mr-4 shadow-sm shrink-0"
            >
              <Lucide icon="BellRing" class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-slate-800 dark:text-slate-200 mb-1">
                Action Required: Phase 2 Vendor Selection
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">
                You are currently at 85% completion for this phase. Next up:
                Finalize guest list for invitations.
              </div>
            </div>
          </div>
        </div>

        <!-- Funding Status -->
        <div class="col-span-1 box p-6 intro-y">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200">
              Funding Status
            </h2>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 text-sm font-medium bg-slate-100 rounded-full hover:bg-slate-200 dark:bg-darkmode-400 text-slate-600 transition"
              >
                Filter
              </button>
              <button
                class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/80 transition shadow-sm"
              >
                Add Expense
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead
                class="text-xs text-slate-400 border-b border-slate-200 w-full dark:border-darkmode-400"
              >
                <tr>
                  <th class="px-4 py-4 font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-4 py-4 font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    class="px-4 py-4 font-medium uppercase tracking-wider text-right"
                  >
                    Paid / Total
                  </th>
                  <th
                    class="px-4 py-4 font-medium uppercase tracking-wider text-right"
                  >
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in fundingStatus"
                  :key="idx"
                  class="border-b border-slate-100 dark:border-darkmode-400 last:border-0 hover:bg-slate-50 dark:hover:bg-darkmode-400/50 transition"
                >
                  <td
                    class="px-4 py-5 font-medium flex items-center gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <div
                      class="w-10 h-10 rounded-full bg-[#f8f9fa] dark:bg-darkmode-300 flex items-center justify-center flex-shrink-0 text-slate-500"
                    >
                      <Lucide :icon="(item.icon as any)" class="w-4 h-4" />
                    </div>
                    {{ item.category }}
                  </td>
                  <td class="px-4 py-5">
                    <span
                      class="px-3 py-1.5 text-xs rounded-full font-medium"
                      :class="item.statusColor"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-5 text-right whitespace-nowrap">
                    <span
                      class="font-bold text-slate-800 dark:text-slate-200"
                      >{{ item.paid }}</span
                    >
                    <span class="text-slate-400 text-xs ml-1 font-medium"
                      >/ {{ item.total }}</span
                    >
                  </td>
                  <td class="px-4 py-5 w-32">
                    <div
                      class="w-full h-2.5 bg-slate-100 rounded-full dark:bg-darkmode-400 overflow-hidden"
                    >
                      <div
                        class="h-full rounded-full"
                        :class="item.color"
                        :style="{ width: item.progress + '%' }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Main Right -->
      <div class="col-span-12 lg:col-span-4 grid grid-cols-1 gap-6">
        <!-- Recent Updates -->
        <div class="col-span-1 box p-6 intro-y">
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
            Recent Updates
          </h2>
          <div
            class="relative before:content-[''] before:absolute before:w-[2px] before:h-[80%] before:bg-slate-100 before:left-[19px] before:top-4 dark:before:bg-darkmode-400"
          >
            <div
              v-for="(update, idx) in recentUpdates"
              :key="idx"
              class="relative flex mb-6 last:mb-0"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-white dark:bg-darkmode-600 mr-4 shrink-0 shadow-sm border border-slate-100 dark:border-darkmode-400 text-slate-500"
              >
                <Lucide :icon="(update.icon as any)" class="w-4 h-4" />
              </div>
              <div class="pt-1">
                <div
                  class="font-bold text-slate-800 dark:text-slate-200 text-sm"
                >
                  {{ update.title }}
                </div>
                <div class="text-sm text-slate-500 mt-1">{{ update.desc }}</div>
                <div class="text-xs text-slate-400 mt-2 font-medium flex flex-col gap-0.5">
                  <span>{{ update.time }}</span>
                  <span v-if="update.author">
                    by <span class="font-bold text-slate-500">{{ update.author }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Tasks -->
        <div class="col-span-1 box p-6 intro-y">
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
            Quick Tasks
          </h2>
          <div class="flex flex-col gap-5">
            <div
              v-for="task in quickTasks"
              :key="task.id"
              class="flex items-center cursor-pointer group"
              @click="task.completed = !task.completed"
            >
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors duration-200"
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
              <span
                class="text-sm transition-all duration-200"
                :class="
                  task.completed
                    ? 'text-slate-400 font-normal line-through'
                    : 'font-medium text-slate-600 group-hover:text-slate-800'
                "
              >
                {{ task.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
