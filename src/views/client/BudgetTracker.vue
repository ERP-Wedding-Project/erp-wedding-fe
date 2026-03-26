<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/components/Base/Lucide";

// Mock Data
const overview = {
  estimated: "Rp 525.000.000",
  paid: "Rp 186.750.000",
  remaining: "Rp 338.250.000",
  status: "On Track"
};

const categories = ref([
  {
    id: 1,
    name: "Venue & Location",
    icon: "Church",
    budget: "Rp 225.000.000",
    paidStr: "Rp 90.000.000",
    progress: 40,
    isOpen: true,
    items: [
      { id: 101, name: "Venue Deposit", date: "Jan 15, 2024", estimated: "Rp 75.000.000", actual: "Rp 75.000.000", paid: "Rp 75.000.000", status: "Paid" },
      { id: 102, name: "Security Fee", date: "Jan 15, 2024", estimated: "Rp 15.000.000", actual: "Rp 15.000.000", paid: "Rp 15.000.000", status: "Paid" },
      { id: 103, name: "Final Payment", date: "Oct 01, 2024", estimated: "Rp 135.000.000", actual: "-", paid: "Rp 0", status: "Pending" },
    ]
  },
  {
    id: 2,
    name: "Catering & Food",
    icon: "Utensils",
    budget: "Rp 150.000.000",
    paidStr: "Rp 15.000.000",
    progress: 10,
    isOpen: false,
    items: []
  }
]);

const toggleCategory = (cat: any) => {
  cat.isOpen = !cat.isOpen;
};
</script>

<template>
  <div class="py-5">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-end justify-between intro-y mb-10">
      <div>
        <div class="text-sm font-bold text-slate-400 mb-1.5 ml-0.5">Wedding Date: October 12, 2024</div>
        <h2 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Financial<br/>Overview</h2>
      </div>
      <div class="flex items-center gap-3 mt-5 sm:mt-0">
        <button class="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400">
          <Lucide icon="Download" class="w-4 h-4 mr-2" /> Export Report
        </button>
        <button class="px-5 py-2.5 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center border border-primary/20">
          <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Expense
        </button>
      </div>
    </div>

    <!-- 4 Overview Cards -->
    <div class="grid grid-cols-12 gap-6 mt-8">
      <!-- Card 1: Total Estimated -->
      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div class="p-6 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-darkmode-400 border border-white/50 text-slate-600 dark:text-slate-300 shadow-sm shrink-0">
              <Lucide icon="Landmark" class="w-5 h-5" />
            </div>
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Estimated</div>
          </div>
          <div class="mt-7 text-[28px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight" v-html="overview.estimated.replace(' ', '<br/>')"></div>
          <div class="mt-5 text-[11px] font-bold text-slate-500 dark:text-slate-400">Based on 12 categories</div>
        </div>
      </div>
      
      <!-- Card 2: Total Paid -->
      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div class="p-6 box zoom-in bg-primary/20 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-darkmode-400 border border-white/50 text-slate-600 dark:text-slate-300 shadow-sm shrink-0">
              <Lucide icon="CheckCircle" class="w-5 h-5" />
            </div>
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Paid</div>
          </div>
          <div class="mt-7 text-[28px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight" v-html="overview.paid.replace(' ', '<br/>')"></div>
          <div class="mt-5 flex items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-wide">
            <Lucide icon="TrendingUp" class="w-3.5 h-3.5 mr-1.5 text-primary" /> 35% of budget
          </div>
        </div>
      </div>
      
      <!-- Card 3: Remaining -->
      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div class="p-6 box zoom-in bg-primary/15 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-darkmode-400 border border-white/50 text-slate-600 dark:text-slate-300 shadow-sm shrink-0">
              <Lucide icon="PiggyBank" class="w-5 h-5" />
            </div>
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Remaining</div>
          </div>
          <div class="mt-7 text-[28px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight" v-html="overview.remaining.replace(' ', '<br/>')"></div>
          <div class="mt-5 text-[11px] font-bold text-slate-500 dark:text-slate-400">Available to spend</div>
        </div>
      </div>
      
      <!-- Card 4: Status -->
      <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div class="p-6 box zoom-in bg-primary/10 dark:bg-darkmode-600 h-full border border-primary/10 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 dark:bg-darkmode-400 border border-white/50 text-slate-600 dark:text-slate-300 shadow-sm shrink-0">
              <Lucide icon="BarChart3" class="w-5 h-5" />
            </div>
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</div>
          </div>
          <div class="mt-7 text-[32px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight">{{ overview.status }}</div>
          <div class="mt-5 text-[11px] font-bold text-slate-500 dark:text-slate-400">No overages detected</div>
        </div>
      </div>
    </div>

    <!-- Expense Categories List -->
    <div class="mt-14 intro-y">
      <h3 class="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">Expense Categories</h3>
      
      <div class="flex flex-col gap-5">
        <div v-for="(cat, idx) in categories" :key="cat.id" 
             class="box transition-all duration-300 border overflow-hidden"
             :class="cat.isOpen ? 'border-primary/20 shadow-md ring-4 ring-primary/5' : 'border-slate-100 dark:border-darkmode-400 hover:border-primary/20 hover:shadow-sm'">
          
          <!-- Accordion Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer select-none group"
               @click="toggleCategory(cat)">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <Lucide :icon="cat.icon" class="w-6 h-6" />
              </div>
              <div class="mt-1">
                <div class="text-[17px] font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{{ cat.name }}</div>
                <div class="text-[13px] text-slate-500 font-bold mt-1 tracking-wide">Budget: {{ cat.budget }}</div>
              </div>
            </div>
            
            <div class="flex items-center mt-6 md:mt-0 lg:w-[40%] ml-auto mr-4 md:mr-10 gap-6 w-full md:w-auto">
              <!-- Progress block -->
              <div class="flex-1 w-full">
                <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5">
                  <span class="tracking-wide">{{ cat.paidStr }} Paid</span>
                  <span>{{ cat.progress }}%</span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full dark:bg-darkmode-400 overflow-hidden shadow-inner">
                  <div class="h-full bg-primary rounded-full transition-all duration-1000 ease-out" :style="{ width: cat.progress + '%' }"></div>
                </div>
              </div>
              <!-- Expand Icon -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-100 text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600 transition-colors shrink-0 absolute right-6 top-[28px] md:relative md:top-auto md:right-auto dark:border-darkmode-400 dark:group-hover:bg-darkmode-300">
                <Lucide icon="ChevronDown" class="w-4 h-4 transition-transform duration-300" :class="{'rotate-180': cat.isOpen}"/>
              </div>
            </div>
          </div>
          
          <!-- Accordion Body (Table) -->
          <div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out" :class="{'grid-rows-[1fr]': cat.isOpen}">
            <div class="overflow-hidden">
              <div class="border-t border-slate-100 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-600/30">
                <div class="overflow-x-auto p-6 pt-2">
                  <table class="w-full text-left whitespace-nowrap mt-2">
                    <thead class="text-[11px] text-slate-400 uppercase font-extrabold tracking-widest border-b border-slate-200/60 dark:border-darkmode-400/60">
                      <tr>
                        <th class="px-3 py-4">Item Name</th>
                        <th class="px-3 py-4">Due Date</th>
                        <th class="px-3 py-4">Estimated</th>
                        <th class="px-3 py-4">Actual</th>
                        <th class="px-3 py-4">Paid</th>
                        <th class="px-3 py-4">Status</th>
                        <th class="px-3 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cat.items" :key="item.id" 
                          class="border-b border-slate-100 last:border-0 dark:border-darkmode-400/60 hover:bg-white dark:hover:bg-darkmode-400 transition-colors">
                        <td class="px-3 py-4.5 text-[14px] font-bold text-slate-700 dark:text-slate-300">{{ item.name }}</td>
                        <td class="px-3 py-4.5 text-slate-500 text-sm font-bold tracking-wide">{{ item.date }}</td>
                        <td class="px-3 py-4.5 text-slate-500 text-sm font-bold tracking-wide">{{ item.estimated }}</td>
                        <td class="px-3 py-4.5 text-slate-800 dark:text-slate-300 font-extrabold">{{ item.actual }}</td>
                        <td class="px-3 py-4.5 text-primary font-extrabold">{{ item.paid }}</td>
                        <td class="px-3 py-4.5">
                          <span class="px-3.5 py-1.5 text-[11px] font-extrabold rounded-md shadow-sm border"
                                :class="item.status === 'Paid' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-500 dark:bg-darkmode-400 dark:border-darkmode-300 dark:text-slate-300 border-slate-200/60'">
                            {{ item.status }}
                          </span>
                        </td>
                        <td class="px-3 py-4.5">
                          <div class="flex justify-center">
                            <button class="w-8 h-8 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors">
                              <Lucide icon="Edit2" class="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div class="mt-3 pt-5 border-t border-slate-100 border-dashed dark:border-darkmode-400/70">
                    <button class="flex items-center text-[13px] font-bold text-primary hover:text-primary/80 transition-colors group">
                      <div class="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center mr-2 group-hover:bg-primary/10 transition-colors">
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
      </div>
    </div>
  </div>
</template>
