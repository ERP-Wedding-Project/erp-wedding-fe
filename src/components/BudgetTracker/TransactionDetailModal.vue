<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { formatCurrency } from "@/core/helpers/utils";

const props = defineProps<{
  open: boolean;
  transaction: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeModal = () => {
  emit("close");
};

const formatTxDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getIcon = (type: string) => {
  if (type === "ALLOCATE") return "ArrowDown";
  if (type === "SAVING") return "ArrowUp";
  return "RefreshCw"; // for UNALLOCATE
};

const getIconClass = (type: string) => {
  if (type === "ALLOCATE") return "bg-warning/10 text-warning border-warning/20";
  if (type === "SAVING" || type === "UNALLOCATE") return "bg-success/10 text-success border-success/20";
  return "bg-primary/10 text-primary border-primary/20";
};
</script>

<template>
  <Dialog size="md" :open="open" @close="closeModal">
    <Dialog.Panel>
      <div v-if="transaction" class="p-8 relative">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute right-4 top-4 p-2 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 transition-colors z-10"
        >
          <Lucide icon="X" class="w-5 h-5" />
        </button>

        <!-- Header Icon -->
        <div class="flex justify-center mb-6 mt-2">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center border transition-transform duration-300"
            :class="getIconClass(transaction.type)"
          >
            <Lucide :icon="getIcon(transaction.type)" class="w-8 h-8" />
          </div>
        </div>

        <!-- Amount & Title -->
        <div class="text-center mb-8">
          <div
            class="text-4xl font-extrabold tracking-tight mb-2"
            :class="
              transaction.type === 'SAVING' || transaction.type === 'UNALLOCATE'
                ? 'text-success'
                : 'text-red-800 dark:text-red-200'
            "
          >
            {{ transaction.type === "SAVING" || transaction.type === "UNALLOCATE" ? "+" : "-" }}{{ formatCurrency(Math.abs(transaction.amount)) }}
          </div>
          <div class="text-slate-500 font-medium text-lg">
            {{ transaction.title || "-" }}
          </div>
        </div>

        <!-- Details List -->
        <div class="space-y-4 bg-slate-50 dark:bg-darkmode-800 p-5 rounded-2xl border border-slate-100 dark:border-darkmode-400/50">
          <!-- Type -->
          <div class="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-darkmode-400/60">
            <span class="text-slate-500 text-[14px] font-bold">Transaction Type</span>
            <span
              class="px-3.5 py-1.5 rounded-full text-[12px] font-extrabold border uppercase tracking-wide shadow-sm"
              :class="
                transaction.type === 'SAVING'
                  ? 'bg-success/5 text-success border-success/10'
                  : transaction.type === 'ALLOCATE'
                    ? 'bg-primary/5 text-primary border-primary/10'
                    : 'bg-warning/5 text-warning border-warning/10'
              "
            >
              {{ transaction.type }}
            </span>
          </div>

          <!-- Date -->
          <div class="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-darkmode-400/60">
            <span class="text-slate-500 text-[14px] font-bold">Date & Time</span>
            <span class="text-slate-700 dark:text-slate-300 font-extrabold text-[14px]">
              {{ formatTxDate(transaction.transacted_at || transaction.created_at) }}
            </span>
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-2 pt-2">
            <span class="text-slate-500 text-[14px] font-bold">Description / Notes</span>
            <span class="text-slate-700 dark:text-slate-300 font-medium text-[14px] leading-relaxed whitespace-pre-wrap">
              {{ transaction.description || "-" }}
            </span>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
