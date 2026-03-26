<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/components/Base/Lucide";

// Mock Data
const summary = ref({
  totalSavings: "Rp 225.000.000",
  totalSavingsTrend: "+12%",
  totalAllocated: "Rp 187.500.000",
  totalAllocatedTrend: "+5%",
  unallocated: "Rp 37.500.000"
});

const activeTab = ref('All Transactions');
const tabs = ['All Transactions', 'Deposits', 'Allocations'];

const transactions = ref([
  { id: 1, type: 'in', date: 'Oct 24, 2023', desc: 'Monthly Deposit', category: 'Joint Account', amount: '+Rp 18.000.000', status: 'Completed', catColor: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-darkmode-400 dark:border-darkmode-300' },
  { id: 2, type: 'out', date: 'Oct 20, 2023', desc: 'Venue Deposit', category: 'Grand Hotel', amount: '-Rp 37.500.000', status: 'Allocated', catColor: 'bg-primary/5 border-primary/10 text-primary' },
  { id: 3, type: 'in', date: 'Oct 15, 2023', desc: 'Gift from Parents', category: 'External Transfer', amount: '+Rp 75.000.000', status: 'Completed', catColor: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10' },
  { id: 4, type: 'in', date: 'Oct 01, 2023', desc: 'Monthly Deposit', category: 'Joint Account', amount: '+Rp 18.000.000', status: 'Completed', catColor: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-darkmode-400 dark:border-darkmode-300' },
  { id: 5, type: 'out', date: 'Sep 24, 2023', desc: 'Catering Downpayment', category: 'Tasty Bites Co.', amount: '-Rp 27.000.000', status: 'Allocated', catColor: 'bg-primary/5 border-primary/10 text-primary' },
]);
</script>

<template>
  <div class="py-5">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-end justify-between intro-y mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Savings Tracker</h2>
        <div class="mt-2 text-[14px] font-bold text-slate-400 tracking-wide">Manage your wedding funds and allocations.</div>
      </div>
      <div class="flex items-center gap-4 mt-5 sm:mt-0">
        <button class="px-5 py-2.5 h-11 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center border border-primary/20">
          <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Allocate Funds
        </button>
      </div>
    </div>

    <!-- 3 Summary Cards -->
    <div class="grid grid-cols-12 gap-6 mt-8">
      <!-- Total Savings -->
      <div class="col-span-12 lg:col-span-4 intro-y">
        <div class="p-7 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
          <!-- Background decoration -->
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
          <Lucide icon="PiggyBank" class="absolute -right-4 -top-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none" />
          
          <div class="relative z-10">
            <div class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Savings</div>
            <div class="mt-4 text-[32px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight">{{ summary.totalSavings }}</div>
            
            <div class="mt-6 flex items-center gap-4">
              <div class="flex items-center text-[11px] font-extrabold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                <Lucide icon="TrendingUp" class="w-3.5 h-3.5 mr-1 text-success" /> {{ summary.totalSavingsTrend }}
              </div>
              <span class="text-[12px] font-bold text-slate-400">from last month</span>
            </div>
            
            <div class="w-full h-1.5 bg-slate-200/60 dark:bg-darkmode-400 rounded-full mt-7 overflow-hidden">
              <div class="h-full bg-primary w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Total Allocated -->
      <div class="col-span-12 lg:col-span-4 intro-y">
        <div class="p-7 box zoom-in bg-primary/15 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
          <Lucide icon="PieChart" class="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none" />
          
          <div class="relative z-10">
            <div class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Allocated</div>
            <div class="mt-4 text-[32px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight">{{ summary.totalAllocated }}</div>
            
            <div class="mt-6 flex items-center gap-4">
              <div class="flex items-center text-[11px] font-extrabold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                <Lucide icon="TrendingUp" class="w-3.5 h-3.5 mr-1 text-success" /> {{ summary.totalAllocatedTrend }}
              </div>
              <span class="text-[12px] font-bold text-slate-400">from last month</span>
            </div>
            
            <div class="w-full h-1.5 bg-slate-200/60 dark:bg-darkmode-400 rounded-full mt-7 overflow-hidden">
              <div class="h-full bg-slate-400 w-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unallocated Balance -->
      <div class="col-span-12 lg:col-span-4 intro-y">
        <div class="p-7 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
          <Lucide icon="Landmark" class="absolute -right-2 top-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors duration-700 pointer-events-none" />
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Unallocated Balance</div>
            <div class="mt-4 text-[36px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight break-words" v-html="summary.unallocated.replace(' ', '<br/>')"></div>
            
            <div class="mt-auto pt-6 text-[12px] font-bold text-slate-400">Available to assign to vendors.</div>
            <a href="#" class="inline-flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors mt-2 group-hover:translate-x-1 duration-300">
              Allocate Now <Lucide icon="ArrowRight" class="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Area -->
    <div class="mt-12 intro-y box border border-slate-100 dark:border-darkmode-400 overflow-hidden shadow-sm">
      <!-- Tabs -->
      <div class="flex border-b border-slate-200/60 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/50 px-6 pt-5">
        <button v-for="tab in tabs" :key="tab" 
                class="pb-4 px-4 font-bold text-[14px] transition-all relative"
                :class="activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
                @click="activeTab = tab">
          {{ tab }}
          <div v-show="activeTab === tab" class="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-lg"></div>
        </button>
      </div>
      
      <!-- Toolbar -->
      <div class="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-darkmode-600 border-b border-slate-100 dark:border-darkmode-400">
        <div class="relative w-full sm:w-80 group">
          <Lucide icon="Search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
          <input type="text" placeholder="Search transactions..." class="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 dark:bg-darkmode-800 dark:border-darkmode-400 text-sm focus:ring-primary focus:border-primary transition-colors outline-none" />
        </div>
        
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button class="px-5 py-2.5 bg-white text-slate-700 font-bold text-[13px] rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center flex-1 sm:flex-none dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400">
            <Lucide icon="Filter" class="w-4 h-4 mr-2" /> Filter
          </button>
          <button class="px-5 py-2.5 bg-white text-slate-700 font-bold text-[13px] rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center flex-1 sm:flex-none dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400">
            <Lucide icon="Download" class="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>
      
      <!-- Data Table -->
      <div class="overflow-x-auto bg-white dark:bg-darkmode-600">
        <table class="w-full text-left whitespace-nowrap">
          <thead class="text-[11px] text-slate-400 uppercase font-extrabold tracking-widest border-b border-slate-200/60 dark:border-darkmode-400">
            <tr>
              <th class="px-7 py-5 w-48">Date</th>
              <th class="px-3 py-5 min-w-[200px]">Description</th>
              <th class="px-3 py-5 min-w-[150px]">Category</th>
              <th class="px-3 py-5 text-right w-48">Amount</th>
              <th class="px-7 py-5 w-40">Status</th>
              <th class="px-4 py-5 w-16"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id" 
                class="border-b border-slate-100 last:border-0 dark:border-darkmode-400/60 hover:bg-slate-50 dark:hover:bg-darkmode-400/50 transition-colors group cursor-pointer">
              
              <td class="px-7 py-5 text-slate-500 text-[13px] font-bold tracking-wide">{{ tx.date }}</td>
              
              <td class="px-3 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border transition-transform duration-300 group-hover:scale-110"
                       :class="tx.type === 'in' ? 'bg-success/10 text-success border-success/20' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-darkmode-400 dark:border-darkmode-300 dark:text-slate-400'">
                    <Lucide :icon="tx.type === 'in' ? 'ArrowDown' : 'ArrowUp'" class="w-4 h-4" />
                  </div>
                  <div class="font-bold text-[14px] text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {{ tx.desc }}
                  </div>
                </div>
              </td>
              
              <td class="px-3 py-5">
                <span class="inline-flex px-3.5 py-1 text-[11px] font-bold rounded-full border shadow-sm transition-colors group-hover:shadow-md"
                      :class="tx.catColor">
                  {{ tx.category }}
                </span>
              </td>
              
              <td class="px-3 py-5 text-right">
                <div class="font-extrabold text-[15px]" :class="tx.type === 'in' ? 'text-primary' : 'text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors'">{{ tx.amount }}</div>
              </td>
              
              <td class="px-7 py-5">
                <div class="flex items-center gap-2 px-3 py-1 rounded-full w-max border"
                     :class="tx.status === 'Completed' ? 'bg-success/5 border-success/10' : 'bg-slate-50 border-slate-100 dark:bg-darkmode-400 dark:border-darkmode-300'">
                  <div class="w-1.5 h-1.5 rounded-full" :class="tx.status === 'Completed' ? 'bg-success' : 'bg-slate-400'"></div>
                  <span class="font-bold text-[11px] uppercase tracking-wider" :class="tx.status === 'Completed' ? 'text-success' : 'text-slate-500'">{{ tx.status }}</span>
                </div>
              </td>
              
              <td class="px-4 py-5 text-center">
                <button class="w-8 h-8 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors float-right mr-2">
                  <Lucide icon="MoreVertical" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer pagination -->
      <div class="p-6 border-t border-slate-200/60 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-[13px] font-bold text-slate-400">
          Showing <span class="text-slate-700 dark:text-slate-300">1-5</span> of <span class="text-slate-700 dark:text-slate-300">24</span> transactions
        </div>
        <div class="flex items-center gap-2">
          <button class="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 shadow-sm transition-colors dark:border-darkmode-400 dark:hover:bg-darkmode-400">
            <Lucide icon="ChevronLeft" class="w-4 h-4" />
          </button>
          <button class="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 shadow-sm transition-colors dark:border-darkmode-400 dark:hover:bg-darkmode-400">
            <Lucide icon="ChevronRight" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
