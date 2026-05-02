<script setup lang="ts">
import { ref, onMounted } from "vue";
import Lucide from "@/components/Base/Lucide";
import AddExpenseModal from "@/components/BudgetTracker/AddExpenseModal.vue";
import useExpenseApi from "@/api/client/ExpenseApi";
import useExpenseCategoryApi from "@/api/client/ExpenseCategoryApi";
import useProjectApi from "@/api/client/ProjectApi";
import { formatCurrency } from "@/core/helpers/utils";
import dayjs from "dayjs";
import { Dialog } from "@/components/Base/Headless";
import * as XLSX from "xlsx";
import type IProject from "@/types/entities/Project";

const { getListExpenseCategory } = useExpenseCategoryApi();
// const { getDetailProject } = useProjectApi();

const activeProject = ref<IProject | null>(null);
const weddingDate = ref("");
const weddingDateFormatted = ref("");
const totalProjectBudget = ref(0);
const isModalOpen = ref(false);
const isDeleteConfirmOpen = ref(false);
const isSubmitting = ref(false);
const isLoading = ref(true);
const selectedCategoryId = ref<number | null>(null);
const selectedExpense = ref<any | null>(null);

const { deleteExpense } = useExpenseApi();

const overview = ref({
  estimated: 0,
  paid: 0,
  remaining: 0,
  status: "Loading...",
});

const categories = ref<any[]>([]);

const fetchExpenseData = async () => {
  isLoading.value = true;
  try {
    const savedProject = localStorage.getItem("activeProject");
    if (!savedProject) return;
    activeProject.value = JSON.parse(savedProject);

    const catRes = await getListExpenseCategory({ include: "expenses" });

    if (activeProject.value) {
      weddingDate.value = activeProject.value.wedding_date;
      weddingDateFormatted.value = dayjs(
        activeProject.value.wedding_date,
      ).format("MMMM D, YYYY");
      totalProjectBudget.value = activeProject.value.total_budget || 0;
    }

    // Process categories
    if (catRes?.payload?.data) {
      categories.value = catRes.payload.data.map((cat: any) => {
        const catPaid =
          cat.expenses?.reduce(
            (sum: number, exp: any) => sum + (exp.allocated_amount || 0),
            0,
          ) || 0;
        const catExpenses =
          cat.expenses?.reduce(
            (sum: number, exp: any) => sum + (exp.amount || 0),
            0,
          ) || 0;

        const shortfall =
          overview.value.estimated +
          catExpenses -
          (overview.value.paid + catPaid);

        overview.value = {
          estimated: overview.value.estimated + catExpenses,
          paid: overview.value.paid + catPaid,
          remaining:
            overview.value.estimated +
            catExpenses -
            (overview.value.paid + catPaid),
          status:
            shortfall > activeProject.value.total_budget
              ? "Over Budget"
              : "On Track",
        };

        return {
          ...cat,
          budget: formatCurrency(catExpenses),
          paidStr: formatCurrency(catPaid),
          progress: catPaid > 0 ? Math.round((catPaid / catExpenses) * 100) : 0,
          isOpen:
            categories.value.find((c) => c.id === cat.id)?.isOpen ?? false,
          items: (cat.expenses || []).map((exp: any) => ({
            id: exp.id,
            raw: exp,
            name: exp.description || "No description",
            date: dayjs(exp.created_at).format("MMM D, YYYY"),
            estimated: formatCurrency(exp.allocated_amount || 0),
            actual: formatCurrency(exp.amount || 0),
            paid: formatCurrency(exp.amount || 0),
            status: "Recorded", // Generic status since backend field is unclear
          })),
        };
      });
    }
  } catch (e) {
    console.error("Error fetching budget data:", e);
  } finally {
    isLoading.value = false;
  }
};

const toggleCategory = (cat: any) => {
  cat.isOpen = !cat.isOpen;
};

const openAddModal = (
  categoryId: number | null = null,
  expense: any = null,
) => {
  selectedCategoryId.value = categoryId;
  selectedExpense.value = expense;
  isModalOpen.value = true;
};

const openDeleteConfirm = (expense: any) => {
  selectedExpense.value = expense;
  isDeleteConfirmOpen.value = true;
};

const handleDeleteExpense = async (expenseId: number) => {
  if (!expenseId) return;

  try {
    isSubmitting.value = true;
    await deleteExpense({
      projectCode: activeProject.value?.code,
      expenseId,
    });
    isDeleteConfirmOpen.value = false;
    fetchExpenseData();
  } catch (e) {
    console.error("Error deleting expense:", e);
  } finally {
    isSubmitting.value = false;
  }
};

const onExpenseAdded = () => {
  fetchExpenseData();
};

const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  const exportData = [
    ["Financial Overview Report"],
    ["Wedding Date", weddingDateFormatted.value],
    ["Estimasi Budget", totalProjectBudget.value],
    [],
    ["Overview"],
    ["Total Allocated Budget", overview.value.estimated],
    ["Total Spent", overview.value.paid],
    ["Remaining", overview.value.remaining],
    ["Status", overview.value.status],
    [],
    ["Detailed Expenses"],
    ["Category", "Item Name", "Date", "Allocated Budget", "Amount Paid"],
  ];

  categories.value.forEach((cat: any) => {
    if (cat.items && cat.items.length > 0) {
      cat.items.forEach((item: any) => {
        exportData.push([
          cat.name,
          item.name,
          item.date,
          item.raw.allocated_amount || 0,
          item.raw.amount || 0,
        ]);
      });
    } else {
      exportData.push([cat.name, "No expenses recorded", "", "", ""]);
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, "Budget Report");
  XLSX.writeFile(wb, `Budget_Report_${dayjs().format("YYYYMMDD")}.xlsx`);
};

onMounted(() => {
  fetchExpenseData();
});
</script>

<template>
  <div class="py-5">
    <!-- Header Area -->
    <div
      class="flex flex-col sm:flex-row items-end justify-between intro-y mb-10"
    >
      <div>
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 ml-0.5"
        >
          <div
            v-if="weddingDateFormatted"
            class="text-sm font-bold text-slate-400"
          >
            Wedding Date: {{ weddingDateFormatted }}
          </div>
          <div
            v-if="totalProjectBudget"
            class="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-extrabold border border-primary/20 w-max"
          >
            Budget Estimation: {{ formatCurrency(totalProjectBudget) }}
          </div>
        </div>
        <h2
          class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight"
        >
          Expenses Overview
        </h2>
      </div>
      <div class="flex items-center gap-3 mt-5 sm:mt-0">
        <button
          @click="exportToExcel"
          class="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400"
        >
          <Lucide icon="Download" class="w-4 h-4 mr-2" /> Export Report
        </button>
        <button
          @click="openAddModal()"
          class="px-5 py-2.5 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center border border-primary/20"
        >
          <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Expense
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-32 text-slate-400"
    >
      <Lucide icon="Loader" class="w-10 h-10 animate-spin text-primary mb-4" />
      <div class="text-sm font-bold tracking-wide">
        Loading expenses data...
      </div>
    </div>

    <template v-else>
      <!-- 4 Overview Cards -->
      <div class="grid grid-cols-12 gap-6 mt-8">
        <!-- Card 1: Total Expenses -->
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            class="p-6 box bg-white dark:bg-darkmode-600 h-full border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div
              class="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-primary"
            >
              <Lucide icon="Landmark" class="w-24 h-24" />
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shadow-sm shrink-0"
              >
                <Lucide icon="Landmark" class="w-5 h-5" />
              </div>
              <div
                class="text-[11px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Total Expenses
              </div>
            </div>
            <div
              class="mt-7 text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight"
            >
              {{ formatCurrency(overview.estimated) }}
            </div>
            <div
              class="mt-5 text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
              Fixed target budget
            </div>
          </div>
        </div>

        <!-- Card 2: Total Spent -->
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            class="p-6 box bg-white dark:bg-darkmode-600 h-full border-l-4 border-l-warning hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div
              class="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-warning"
            >
              <Lucide icon="CheckCircle" class="w-24 h-24" />
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10 text-warning shadow-sm shrink-0"
              >
                <Lucide icon="CheckCircle" class="w-5 h-5" />
              </div>
              <div
                class="text-[11px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Total Spent
              </div>
            </div>
            <div
              class="mt-7 text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight"
            >
              {{ formatCurrency(overview.paid) }}
            </div>
            <div
              class="mt-5 flex items-center text-[11px] font-bold text-warning tracking-wide"
            >
              <Lucide icon="TrendingUp" class="w-3.5 h-3.5 mr-1.5" />
              {{
                overview.estimated > 0
                  ? Math.round((overview.paid / overview.estimated) * 100)
                  : 0
              }}% of budget used
            </div>
          </div>
        </div>

        <!-- Card 3: Remaining -->
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            class="p-6 box bg-white dark:bg-darkmode-600 h-full border-l-4 border-l-success hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div
              class="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-success"
            >
              <Lucide icon="PiggyBank" class="w-24 h-24" />
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success shadow-sm shrink-0"
              >
                <Lucide icon="PiggyBank" class="w-5 h-5" />
              </div>
              <div
                class="text-[11px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Remaining
              </div>
            </div>
            <div
              class="mt-7 text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight"
            >
              {{ formatCurrency(overview.remaining) }}
            </div>
            <div
              class="mt-5 text-[11px] font-bold text-success flex items-center"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-success mr-2"></div>
              Available to spend
            </div>
          </div>
        </div>

        <!-- Card 4: Status -->
        <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            class="p-6 box h-full border-l-4 transition-all duration-300 relative overflow-hidden group"
            :class="[
              overview.status === 'On Track'
                ? 'bg-white border-l-success dark:bg-darkmode-600'
                : overview.status === 'Over Budget'
                  ? 'bg-white border-l-danger dark:bg-darkmode-600'
                  : 'bg-white border-l-slate-300 dark:bg-darkmode-600',
              'hover:shadow-xl',
            ]"
          >
            <div
              class="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"
              :class="
                overview.status === 'On Track' ? 'text-success' : 'text-danger'
              "
            >
              <Lucide icon="BarChart3" class="w-24 h-24" />
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-xl shadow-sm shrink-0"
                :class="
                  overview.status === 'On Track'
                    ? 'bg-success/10 text-success'
                    : overview.status === 'Over Budget'
                      ? 'bg-danger/10 text-danger'
                      : 'bg-slate-100 text-slate-400'
                "
              >
                <Lucide icon="BarChart3" class="w-5 h-5" />
              </div>
              <div
                class="text-[11px] font-bold text-slate-500 uppercase tracking-widest"
              >
                Status
              </div>
            </div>
            <div
              class="mt-7 text-2xl font-extrabold leading-tight tracking-tight"
              :class="
                overview.status === 'On Track'
                  ? 'text-success'
                  : overview.status === 'Over Budget'
                    ? 'text-danger'
                    : 'text-slate-400'
              "
            >
              {{ overview.status }}
            </div>
            <div
              class="mt-5 text-[11px] font-bold"
              :class="
                overview.status === 'On Track'
                  ? 'text-success'
                  : overview.status === 'Over Budget'
                    ? 'text-danger'
                    : 'text-slate-400'
              "
            >
              {{
                overview.status === "On Track"
                  ? "Safe & Under Budget"
                  : overview.status === "Over Budget"
                    ? "Spending exceeds limit"
                    : "Analyzing data..."
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Categories List -->
      <div class="mt-14 intro-y">
        <h3
          class="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-6"
        >
          Expense Categories
        </h3>

        <div class="flex flex-col gap-5">
          <div
            v-for="(cat, idx) in categories"
            :key="cat.id"
            class="box transition-all duration-300 border overflow-hidden"
            :class="
              cat.isOpen
                ? 'border-primary/20 shadow-md ring-4 ring-primary/5'
                : 'border-slate-100 dark:border-darkmode-400 hover:border-primary/20 hover:shadow-sm'
            "
          >
            <!-- Accordion Header -->
            <div
              class="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer select-none group"
              @click="toggleCategory(cat)"
            >
              <div class="flex items-center gap-5">
                <div
                  class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm"
                >
                  <Lucide :icon="cat.icon || 'Package'" class="w-6 h-6" />
                </div>
                <div class="mt-1">
                  <div
                    class="text-[17px] font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors"
                  >
                    {{ cat.name }}
                  </div>
                  <div
                    class="text-[13px] text-slate-500 font-bold mt-1 tracking-wide"
                  >
                    Expenses: {{ cat.budget }}
                  </div>
                </div>
              </div>

              <div
                class="flex items-center mt-6 md:mt-0 lg:w-[40%] ml-auto mr-4 md:mr-10 gap-6 w-full md:w-auto"
              >
                <!-- Progress block -->
                <div class="flex-1 w-full">
                  <div
                    class="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5"
                  >
                    <!-- <span class="tracking-wide">{{ cat.paidStr }} Paid</span> -->
                    <span>{{ cat.progress }}%</span>
                  </div>
                  <div
                    class="w-full h-2.5 bg-slate-100 rounded-full dark:bg-darkmode-400 overflow-hidden shadow-inner"
                  >
                    <div
                      class="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      :style="{ width: cat.progress + '%' }"
                    ></div>
                  </div>
                </div>
                <!-- Expand Icon -->
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-100 text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600 transition-colors shrink-0 absolute right-6 top-[28px] md:relative md:top-auto md:right-auto dark:border-darkmode-400 dark:group-hover:bg-darkmode-300"
                >
                  <Lucide
                    icon="ChevronDown"
                    class="w-4 h-4 transition-transform duration-300"
                    :class="{ 'rotate-180': cat.isOpen }"
                  />
                </div>
              </div>
            </div>

            <!-- Accordion Body (Table) -->
            <div
              v-show="cat.isOpen"
              class="border-t border-slate-100 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/30"
            >
              <div class="overflow-x-auto p-6 pt-2">
                <table class="w-full text-left whitespace-nowrap mt-2">
                  <thead
                    class="text-[11px] text-slate-400 uppercase font-extrabold tracking-widest border-b border-slate-200/60 dark:border-darkmode-400/60"
                  >
                    <tr>
                      <th class="px-3 py-4">Item Name</th>
                      <th class="px-3 py-4">Created Date</th>
                      <th class="px-3 py-4">Allocated</th>
                      <th class="px-3 py-4">Amount</th>
                      <th class="px-3 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in cat.items"
                      :key="item.id"
                      class="border-b border-slate-100 last:border-0 dark:border-darkmode-400/60 hover:bg-white dark:hover:bg-darkmode-400 transition-colors"
                    >
                      <td
                        class="px-3 py-4.5 text-[14px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        {{ item.name }}
                      </td>
                      <td
                        class="px-3 py-4.5 text-slate-500 text-sm font-bold tracking-wide"
                      >
                        {{ item.date }}
                      </td>
                      <td
                        class="px-3 py-4.5 text-slate-500 text-sm font-bold tracking-wide"
                      >
                        {{ item.estimated }}
                      </td>
                      <td class="px-3 py-4.5 text-primary font-extrabold">
                        {{ item.paid }}
                      </td>
                      <td class="px-3 py-4.5">
                        <div class="flex justify-center gap-2">
                          <button
                            @click="openAddModal(cat.id, item.raw)"
                            class="w-8 h-8 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                          >
                            <Lucide icon="Edit2" class="w-4 h-4" />
                          </button>
                          <button
                            @click="openDeleteConfirm(item.raw)"
                            class="w-8 h-8 rounded-full text-slate-400 hover:text-danger hover:bg-danger/10 flex items-center justify-center transition-colors"
                          >
                            <Lucide icon="Trash2" class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  class="mt-3 pt-5 border-t border-slate-100 border-dashed dark:border-darkmode-400/70"
                >
                  <button
                    @click.stop="openAddModal(cat.id)"
                    class="flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors group"
                  >
                    <div
                      class="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center mr-2 group-hover:bg-primary/10 transition-colors"
                    >
                      <Lucide icon="Plus" class="w-3.5 h-3.5" />
                    </div>
                    Add Item to {{ cat.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Component -->
    <AddExpenseModal
      :open="isModalOpen"
      :project-code="activeProject?.code"
      :initial-category-id="selectedCategoryId"
      :expense="selectedExpense"
      @close="isModalOpen = false"
      @success="onExpenseAdded"
    />

    <!-- Delete Confirmation Modal -->
    <Dialog :open="isDeleteConfirmOpen" @close="isDeleteConfirmOpen = false">
      <Dialog.Panel>
        <div class="px-6 py-5 text-center">
          <Lucide
            icon="AlertCircle"
            class="w-16 h-16 text-danger mx-auto mt-3 mb-4"
          />
          <h3 class="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
          <p class="text-slate-500 mb-6 font-medium">
            Do you really want to delete this expense? This process cannot be
            undone.
          </p>
          <div class="flex justify-center gap-3 pb-3">
            <button
              type="button"
              @click="isDeleteConfirmOpen = false"
              class="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border-none"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleDeleteExpense(selectedExpense?.id)"
              :disabled="isSubmitting"
              class="px-5 py-2.5 text-sm font-medium text-white bg-danger hover:bg-danger/80 rounded-lg transition-colors border-none flex items-center shadow-sm"
            >
              <Lucide
                v-if="isSubmitting"
                icon="Loader"
                class="w-4 h-4 animate-spin mr-2"
              />
              {{ isSubmitting ? "Deleting..." : "Yes, delete expense!" }}
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  </div>
</template>
