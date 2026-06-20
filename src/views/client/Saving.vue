<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import Lucide from "@/components/Base/Lucide";
import AddSavingModal from "@/components/BudgetTracker/AddSavingModal.vue";
import AllocateFundsModal from "@/components/BudgetTracker/AllocateFundsModal.vue";
import UnallocateFundsModal from "@/components/BudgetTracker/UnallocateFundsModal.vue";
import TransactionDetailModal from "@/components/BudgetTracker/TransactionDetailModal.vue";
import type IProject from "@/types/entities/Project";
import { formatCurrency } from "@/core/helpers/utils";
import useSavingApi from "@/api/client/SavingApi";
import useActiveProject from "@/composable/useActiveProject";
import PageHeader from "@/components/Base/PageHeader/PageHeader.vue";

const activeTab = ref("All Transactions");
const tabs = ["All Transactions", "Deposits", "Allocations"];

const transactions = ref<any[]>([]);

const { activeProject } = useActiveProject();
const isSavingModalOpen = ref(false);
const isAllocateModalOpen = ref(false);
const isUnallocateModalOpen = ref(false);
const isActionsDropdownOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedTransaction = ref<any>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const { getListSaving } = useSavingApi();

const filteredTransactions = computed(() => {
  if (activeTab.value === "Deposits") {
    return transactions.value.filter((tx: any) => tx.type === "SAVING");
  }
  if (activeTab.value === "Allocations") {
    return transactions.value.filter(
      (tx: any) => tx.type === "ALLOCATE" || tx.type === "UNALLOCATE",
    );
  }
  return transactions.value;
});

const formatTxDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const budgetSummary = computed(() => activeProject.value?.budget_summary);

const summary = computed(() => ({
  totalSavings: formatCurrency(budgetSummary.value?.total_saved ?? 0),
  totalAllocated: formatCurrency(budgetSummary.value?.total_allocated ?? 0),
  unallocated: formatCurrency(budgetSummary.value?.total_unallocated ?? 0),
}));

// Trend calculation
const savingsTrend = ref({ value: "0%", isUp: true });
const allocatedTrend = ref({ value: "0%", isUp: true });

const calcTrend = (current: number, previous: number) => {
  if (previous === 0) {
    return { value: current > 0 ? "+100%" : "0%", isUp: current >= 0 };
  }
  const pct = Math.round(((current - previous) / Math.abs(previous)) * 100);
  return {
    value: `${pct >= 0 ? "+" : ""}${pct}%`,
    isUp: pct >= 0,
  };
};

const computeTrends = (records: any[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }

  let curSaving = 0,
    prevSaving = 0;
  let curAllocated = 0,
    prevAllocated = 0;

  for (const r of records) {
    const d = new Date(r.transacted_at || r.created_at);
    const m = d.getMonth();
    const y = d.getFullYear();
    const amount = Math.abs(r.amount ?? 0);

    if (r.type === "SAVING") {
      if (m === currentMonth && y === currentYear) curSaving += amount;
      if (m === prevMonth && y === prevYear) prevSaving += amount;
    } else if (r.type === "ALLOCATE" || r.type === "UNALLOCATE") {
      if (m === currentMonth && y === currentYear) curAllocated += amount;
      if (m === prevMonth && y === prevYear) prevAllocated += amount;
    }
  }

  savingsTrend.value = calcTrend(curSaving, prevSaving);
  allocatedTrend.value = calcTrend(curAllocated, prevAllocated);
};

const fetchSavings = async () => {
  if (!activeProject.value?.code) return;
  try {
    const res = await getListSaving(activeProject.value.code, { show_all: 1 });
    const records = res?.payload?.data ?? [];
    console.log("record", records);

    // Transform ALLOCATE with negative amount to UNALLOCATE
    transactions.value = records.map((record: any) => {
      if (record.expense) {
        record.title = record.expense.description;
        record.description = record.note;
      } else {
        record.title = record.note ?? "-";
        record.description = "-";
      }
      if (record.type === "ALLOCATE" && record.amount < 0) {
        return { ...record, type: "UNALLOCATE" };
      }
      return record;
    });
    console.log("transactions.value", transactions.value);

    computeTrends(transactions.value);
  } catch (_) {
    // handled
  }
};

const openSavingModal = () => {
  isSavingModalOpen.value = true;
};

const openAllocateModal = () => {
  isAllocateModalOpen.value = true;
};

const openUnallocateModal = () => {
  isUnallocateModalOpen.value = true;
  isActionsDropdownOpen.value = false;
};

const openDetailModal = (tx: any) => {
  selectedTransaction.value = tx;
  isDetailModalOpen.value = true;
};

const toggleActionsDropdown = () => {
  isActionsDropdownOpen.value = !isActionsDropdownOpen.value;
};

const handleActionClick = (action: "saving" | "allocate" | "unallocate") => {
  if (action === "saving") {
    openSavingModal();
  } else if (action === "allocate") {
    openAllocateModal();
  } else if (action === "unallocate") {
    openUnallocateModal();
  }
  isActionsDropdownOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isActionsDropdownOpen.value = false;
  }
};

const refreshData = async () => {
  await fetchSavings();
};

const onSavingSuccess = async () => {
  await refreshData();
};

const onAllocateSuccess = async () => {
  await refreshData();
};

const onUnallocateSuccess = async () => {
  await refreshData();
};

watch(activeProject, () => {
  fetchSavings();
});

onMounted(async () => {
  await fetchSavings();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="py-5 relative">
    <!-- Header Area -->
    <PageHeader
      :breadcrumbs="[{ label: 'Home', url: '#' }, { label: 'Savings' }]"
    >
      <template #title>Savings Tracker</template>
      <template #subtitle>Manage your wedding funds and allocations.</template>
      <template #actions>
        <!-- Main Actions Button with Dropdown -->
        <div class="relative" ref="dropdownRef" style="z-index: 100">
          <button
            @click="toggleActionsDropdown"
            class="px-5 py-2.5 h-11 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center border border-primary/20"
          >
            <Lucide icon="Wallet" class="w-4 h-4 mr-2" />
            Manage Funds
            <Lucide
              icon="ChevronDown"
              class="w-4 h-4 ml-2 transition-transform duration-200"
              :class="{ 'rotate-180': isActionsDropdownOpen }"
            />
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div
              v-show="isActionsDropdownOpen"
              class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-darkmode-600 rounded-2xl shadow-xl border border-slate-200 dark:border-darkmode-400 overflow-hidden"
              style="z-index: 9999"
            >
              <div class="py-2">
                <button
                  @click="handleActionClick('saving')"
                  class="w-full px-5 py-3 text-left hover:bg-success/5 dark:hover:bg-success/10 transition-colors flex items-center group"
                >
                  <div
                    class="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center mr-3 group-hover:bg-success/20 transition-colors"
                  >
                    <Lucide icon="PiggyBank" class="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <div
                      class="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-success transition-colors"
                    >
                      Add Saving
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      Deposit funds to savings
                    </div>
                  </div>
                </button>

                <button
                  @click="handleActionClick('allocate')"
                  class="w-full px-5 py-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center group"
                >
                  <div
                    class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors"
                  >
                    <Lucide
                      icon="ArrowDownCircle"
                      class="w-4 h-4 text-primary"
                    />
                  </div>
                  <div>
                    <div
                      class="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors"
                    >
                      Allocate Funds
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      Assign funds to vendors
                    </div>
                  </div>
                </button>

                <button
                  @click="handleActionClick('unallocate')"
                  class="w-full px-5 py-3 text-left hover:bg-warning/5 dark:hover:bg-warning/10 transition-colors flex items-center group"
                >
                  <div
                    class="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center mr-3 group-hover:bg-warning/20 transition-colors"
                  >
                    <Lucide icon="ArrowUpCircle" class="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <div
                      class="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-warning transition-colors"
                    >
                      Unallocate Funds
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      Return funds to savings
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </PageHeader>

    <!-- 3 Summary Cards -->
    <div class="grid grid-cols-12 gap-6 mt-8">
      <!-- Total Savings -->
      <div class="col-span-12 lg:col-span-4 lg:intro-y">
        <div
          class="p-7 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
        >
          <!-- Background decoration -->
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"
          ></div>
          <Lucide
            icon="PiggyBank"
            class="absolute -right-4 -top-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none"
          />

          <div class="relative z-10">
            <div
              class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
            >
              Total Savings
            </div>
            <div
              class="mt-4 text-[30px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight"
            >
              {{ summary.totalSavings }}
            </div>

            <div class="mt-6 flex items-center gap-4">
              <div
                class="flex items-center text-[11px] font-extrabold px-2.5 py-1 rounded-full border"
                :class="
                  savingsTrend.isUp
                    ? 'text-success bg-success/10 border-success/20'
                    : 'text-danger bg-danger/10 border-danger/20'
                "
              >
                <Lucide
                  :icon="savingsTrend.isUp ? 'TrendingUp' : 'TrendingDown'"
                  class="w-3.5 h-3.5 mr-1"
                />
                {{ savingsTrend.value }}
              </div>
              <span class="text-[12px] font-bold text-slate-400"
                >from last month</span
              >
            </div>

            <div
              class="w-full h-1.5 bg-slate-200/60 dark:bg-darkmode-400 rounded-full mt-7 overflow-hidden"
            >
              <div class="h-full bg-primary w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Allocated -->
      <div class="col-span-12 lg:col-span-4 intro-y">
        <div
          class="p-7 box zoom-in bg-primary/15 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
        >
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"
          ></div>
          <Lucide
            icon="PieChart"
            class="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none"
          />

          <div class="relative z-10">
            <div
              class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
            >
              Total Allocated
            </div>
            <div
              class="mt-4 text-[30px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight"
            >
              {{ summary.totalAllocated }}
            </div>

            <div class="mt-6 flex items-center gap-4">
              <div
                class="flex items-center text-[11px] font-extrabold px-2.5 py-1 rounded-full border"
                :class="
                  allocatedTrend.isUp
                    ? 'text-success bg-success/10 border-success/20'
                    : 'text-danger bg-danger/10 border-danger/20'
                "
              >
                <Lucide
                  :icon="allocatedTrend.isUp ? 'TrendingUp' : 'TrendingDown'"
                  class="w-3.5 h-3.5 mr-1"
                />
                {{ allocatedTrend.value }}
              </div>
              <span class="text-[12px] font-bold text-slate-400"
                >from last month</span
              >
            </div>

            <div
              class="w-full h-1.5 bg-slate-200/60 dark:bg-darkmode-400 rounded-full mt-7 overflow-hidden"
            >
              <div class="h-full bg-slate-400 w-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unallocated Balance -->
      <div class="col-span-12 lg:col-span-4 intro-y">
        <div
          class="p-7 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
        >
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"
          ></div>
          <Lucide
            icon="Landmark"
            class="absolute -right-2 top-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none"
          />

          <div class="relative z-10 flex flex-col h-full">
            <div
              class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
            >
              Unallocated Balance
            </div>
            <div
              class="mt-4 text-[30px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight break-words"
              v-html="summary.unallocated"
            ></div>

            <!-- <div class="mt-auto pt-6 text-[12px] font-bold text-slate-400">Available to assign to vendors.</div>
            <a href="#" class="inline-flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors mt-2 group-hover:translate-x-1 duration-300">
              Allocate Now <Lucide icon="ArrowRight" class="w-4 h-4 ml-1.5" />
            </a> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Area -->
    <div
      class="mt-12 intro-y box border border-slate-100 dark:border-darkmode-400 overflow-hidden shadow-sm"
    >
      <!-- Tabs -->
      <div
        class="flex border-b border-slate-200/60 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/50 px-6 pt-5"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          class="pb-4 px-4 font-bold text-[14px] transition-all relative"
          :class="
            activeTab === tab
              ? 'text-primary'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          "
          @click="activeTab = tab"
        >
          {{ tab }}
          <div
            v-show="activeTab === tab"
            class="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-lg"
          ></div>
        </button>
      </div>

      <!-- Toolbar -->
      <div
        class="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-darkmode-600 border-b border-slate-100 dark:border-darkmode-400"
      >
        <div class="relative w-full sm:w-80 group">
          <Lucide
            icon="Search"
            class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            class="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 dark:bg-darkmode-800 dark:border-darkmode-400 text-sm focus:ring-primary focus:border-primary transition-colors outline-none"
          />
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            class="px-5 py-2.5 bg-white text-slate-700 font-bold text-[13px] rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center flex-1 sm:flex-none dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400"
          >
            <Lucide icon="Filter" class="w-4 h-4 mr-2" /> Filter
          </button>
          <button
            class="px-5 py-2.5 bg-white text-slate-700 font-bold text-[13px] rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center flex-1 sm:flex-none dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400"
          >
            <Lucide icon="Download" class="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto bg-white dark:bg-darkmode-600">
        <table class="w-full text-left whitespace-nowrap">
          <thead
            class="text-[11px] text-slate-400 uppercase font-extrabold tracking-widest border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <tr>
              <th class="px-7 py-5 w-48">Date</th>
              <th class="px-3 py-5 min-w-[200px]">Title</th>
              <th class="px-3 py-5 min-w-[200px]">Description</th>
              <th class="px-3 py-5 min-w-[150px]">Type</th>
              <th class="px-3 py-5 text-right w-48">Amount</th>
              <th class="px-4 py-5 w-16"></th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="5" class="px-7 py-16 text-center">
                <Lucide
                  icon="Inbox"
                  class="w-12 h-12 mx-auto text-slate-300 mb-3"
                />
                <div class="text-slate-400 font-bold text-sm">
                  No transactions found
                </div>
              </td>
            </tr>

            <tr
              v-for="tx in filteredTransactions"
              :key="tx.id"
              class="border-b border-slate-100 last:border-0 dark:border-darkmode-400/60 hover:bg-slate-50 dark:hover:bg-darkmode-400/50 transition-colors group cursor-pointer"
              @click="openDetailModal(tx)"
            >
              <td
                class="px-7 py-5 text-slate-500 text-[13px] font-bold tracking-wide"
              >
                {{ formatTxDate(tx.transacted_at || tx.created_at) }}
              </td>

              <td class="px-3 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border transition-transform duration-300 group-hover:scale-110"
                    :class="
                      tx.type === 'ALLOCATE'
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : ' bg-success/10 text-success border-success/20'
                    "
                  >
                    <Lucide
                      :icon="tx.type === 'ALLOCATE' ? 'ArrowDown' : 'ArrowUp'"
                      class="w-4 h-4"
                    />
                  </div>
                  <div>
                    <div
                      class="font-bold text-[14px] text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors"
                    >
                      {{ tx.title || "-" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-5">
                <div class="flex items-center gap-4">
                  <div>
                    <div
                      class="font-bold text-[14px] text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors"
                    >
                      {{ tx.description || "-" }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-3 py-5">
                <span
                  class="inline-flex px-3.5 py-1 text-[11px] font-bold rounded-full border shadow-sm"
                  :class="
                    tx.type === 'SAVING'
                      ? 'bg-success/5 text-success border-success/10'
                      : tx.type === 'ALLOCATE'
                        ? 'bg-primary/5 text-primary border-primary/10'
                        : 'bg-warning/5 text-warning border-warning/10'
                  "
                >
                  {{ tx.type }}
                </span>
              </td>

              <td class="px-3 py-5 text-right">
                <div
                  class="font-extrabold text-[15px]"
                  :class="
                    tx.type === 'SAVING'
                      ? 'text-success'
                      : tx.type === 'UNALLOCATE'
                        ? 'text-success'
                        : 'text-red-800 dark:text-red-200'
                  "
                >
                  {{
                    tx.type === "SAVING" || tx.type === "UNALLOCATE"
                      ? "+"
                      : "-"
                  }}{{ formatCurrency(Math.abs(tx.amount)) }}
                </div>
              </td>

              <td class="px-4 py-5 text-center">
                <button
                  class="w-8 h-8 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors float-right mr-2"
                >
                  <Lucide icon="MoreVertical" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer pagination -->
      <div
        class="p-6 border-t border-slate-200/60 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/50 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="text-[13px] font-bold text-slate-400">
          Showing
          <span class="text-slate-700 dark:text-slate-300">{{
            filteredTransactions.length
          }}</span>
          transactions
        </div>
      </div>
    </div>

    <AddSavingModal
      :open="isSavingModalOpen"
      :project-code="activeProject?.code || ''"
      @close="isSavingModalOpen = false"
      @success="onSavingSuccess"
    />

    <AllocateFundsModal
      :open="isAllocateModalOpen"
      :project-code="activeProject?.code || ''"
      @close="isAllocateModalOpen = false"
      @success="onAllocateSuccess"
    />

    <UnallocateFundsModal
      :open="isUnallocateModalOpen"
      :project-code="activeProject?.code || ''"
      @close="isUnallocateModalOpen = false"
      @success="onUnallocateSuccess"
    />

    <TransactionDetailModal
      :open="isDetailModalOpen"
      :transaction="selectedTransaction"
      @close="isDetailModalOpen = false"
    />
  </div>
</template>
