<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/components/Base/Lucide";
import { FormSwitch } from "@/components/Base/Form";

const weddingDate = ref("09 / 15 / 2024");
const strictlyBudget = ref(true);
</script>

<template>
  <div class="py-5 relative">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between intro-y mb-8">
      <div>
        <div class="text-slate-500 text-[13px] mb-2 font-bold flex items-center">
          <a href="#" class="hover:text-primary transition-colors">Home</a>
          <Lucide icon="ChevronRight" class="w-3.5 h-3.5 mx-1" />
          <a href="#" class="hover:text-primary transition-colors">Settings</a>
          <Lucide icon="ChevronRight" class="w-3.5 h-3.5 mx-1" />
          <span class="text-slate-700 dark:text-slate-300">Profile</span>
        </div>
        <h2 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Profile<br/>Settings</h2>
      </div>
      <div class="flex items-center gap-4 mt-5 sm:mt-0">
        <button class="flex items-center font-bold text-[13px] text-slate-600 dark:text-slate-300 hover:text-primary transition-colors bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-full">
          <Lucide icon="HelpCircle" class="w-4 h-4 mr-1.5" /> Support
        </button>
      </div>
    </div>

    <!-- Top Profile Banner -->
    <div class="box p-6 intro-y bg-primary/10 border-primary/10 dark:bg-darkmode-600 mb-8 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div class="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
      
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between relative z-10 gap-6">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div class="w-[100px] h-[100px] rounded-full border-[5px] border-white dark:border-darkmode-400 shadow-sm overflow-hidden shrink-0 bg-primary/20 transition-transform duration-300 group-hover:scale-[1.03]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf" alt="Sarah Smith" class="w-full h-full object-cover" />
          </div>
          <div class="mt-2 md:mt-2">
            <h3 class="text-[26px] font-extrabold text-slate-800 dark:text-slate-100">Sarah Smith</h3>
            <div class="text-slate-500 font-bold text-[13px] mt-1">Bride & Administrator &bull; Member since 2023</div>
            <div class="flex items-center justify-center md:justify-start gap-2.5 mt-4">
              <span class="px-3.5 py-1 bg-orange-100 text-orange-600 text-[11px] font-extrabold rounded-full border border-orange-200 shadow-sm">Pro Plan</span>
              <span class="px-3.5 py-1 bg-success/10 text-success text-[11px] font-extrabold rounded-full border border-success/20 shadow-sm">Verified</span>
            </div>
          </div>
        </div>
        
        <div class="flex-shrink-0 mt-3 md:mt-6">
          <button class="px-6 py-2.5 bg-white/90 dark:bg-darkmode-400 text-slate-700 dark:text-slate-200 font-bold text-[13px] rounded-full shadow-sm hover:bg-white hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-200/50">
            View Public Profile
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Left Column -->
      <div class="col-span-12 xl:col-span-7 flex flex-col gap-8">
        
        <!-- Wedding Details -->
        <div class="box p-8 intro-y bg-primary/5 dark:bg-darkmode-600 border-primary/10 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-darkmode-400 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-darkmode-300 text-pink-500 transition-transform hover:scale-110 duration-300">
              <Lucide icon="Heart" class="w-5 h-5 fill-pink-500/20" />
            </div>
            <div>
              <h3 class="text-[19px] font-extrabold text-slate-800 dark:text-slate-100">Wedding Details</h3>
              <div class="text-[13px] font-bold text-slate-500 mt-1">Basic information about your big day</div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Wedding Name</label>
              <input type="text" value="Smith-Jones Wedding" class="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md" />
            </div>
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Date</label>
              <div class="relative group">
                <input type="text" v-model="weddingDate" class="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md" />
                <Lucide icon="Calendar" class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Venue Location</label>
              <div class="relative group">
                <Lucide icon="MapPin" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-primary transition-colors z-10" />
                <input type="text" value="Napa Valley, CA" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md relative" />
              </div>
            </div>
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Estimated Guest Count</label>
              <div class="relative group">
                <Lucide icon="Users" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-primary transition-colors z-10" />
                <input type="number" value="150" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md relative" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Collaborators -->
        <div class="box p-8 intro-y bg-primary/5 dark:bg-darkmode-600 border-primary/10 hover:shadow-md transition-shadow duration-300">
          <div class="flex items-start sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white dark:bg-darkmode-400 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-darkmode-300 text-primary transition-transform hover:scale-110 duration-300">
                <Lucide icon="Users" class="w-5 h-5 fill-primary/10" />
              </div>
              <div>
                <h3 class="text-[19px] font-extrabold text-slate-800 dark:text-slate-100">Collaborators</h3>
                <div class="text-[13px] font-bold text-slate-500 mt-1">Manage who can access your wedding plan</div>
              </div>
            </div>
            <button class="text-[13px] font-bold text-primary hover:text-primary/80 transition-all bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl whitespace-nowrap hidden sm:flex items-center">
              <Lucide icon="Plus" class="w-4 h-4 mr-1.5" /> Invite New
            </button>
          </div>
          
          <div class="flex flex-col gap-4">
            <!-- Collab 1 -->
            <div class="p-4 rounded-xl bg-white/70 dark:bg-darkmode-800 border border-slate-200/60 flex items-center gap-4 hover:shadow-sm hover:border-primary/20 transition-all duration-300 group">
              <div class="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf" alt="Sarah" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">Sarah Smith (You)</div>
                <div class="text-[13px] font-bold text-slate-500 mt-0.5">Admin &bull; Bride</div>
              </div>
              <div class="shrink-0">
                <span class="px-4 py-2 bg-white dark:bg-darkmode-600 shadow-sm border border-slate-200/80 rounded-lg text-[11px] uppercase tracking-wider font-extrabold text-slate-500">Owner</span>
              </div>
            </div>
            <!-- Collab 2 -->
            <div class="p-4 rounded-xl bg-white/70 dark:bg-darkmode-800 border border-slate-200/60 flex items-center gap-4 hover:shadow-sm hover:border-primary/20 transition-all duration-300 group cursor-pointer">
              <div class="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-100 dark:bg-darkmode-400 flex items-center justify-center text-slate-400">
                 <Lucide icon="User" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <div class="font-bold text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">Mike Jones</div>
                <div class="text-[13px] font-bold text-slate-500 mt-0.5">Editor &bull; Partner</div>
              </div>
              <div class="shrink-0">
                <button class="px-4 py-2 bg-transparent border-0 flex items-center text-[13px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  Editor <Lucide icon="ChevronDown" class="w-3 h-3 ml-2" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile invite button -->
          <button class="w-full mt-6 text-[13px] font-extrabold text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors bg-primary/5 shadow-sm px-4 py-3.5 rounded-xl sm:hidden flex items-center justify-center border border-primary/20">
            <Lucide icon="Plus" class="w-4 h-4 mr-1.5" /> Invite New Collaborator
          </button>
        </div>
      </div>
      
      <!-- Right Column -->
      <div class="col-span-12 xl:col-span-5 flex flex-col gap-8">
        
        <!-- Budget Settings -->
        <div class="box p-8 intro-y bg-primary/10 dark:bg-darkmode-600 border-primary/10 hover:shadow-md transition-shadow duration-300">
           <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-darkmode-400 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-darkmode-300 text-success transition-transform hover:scale-110 duration-300">
              <Lucide icon="Banknote" class="w-5 h-5 fill-success/20" />
            </div>
            <div>
              <h3 class="text-[19px] font-extrabold text-slate-800 dark:text-slate-100">Budget Settings</h3>
            </div>
          </div>
          
          <div class="flex flex-col gap-7">
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2.5">Total Budget Goal</label>
              <div class="relative flex items-center group">
                <div class="absolute left-4 font-bold text-slate-400 z-10 transition-colors">Rp</div>
                <input type="text" value="500.000.000" class="w-full pl-12 pr-16 py-3.5 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-extrabold text-slate-800 dark:text-slate-100 transition-all text-lg shadow-sm focus:shadow-md relative" />
                <div class="absolute right-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-extrabold text-slate-500 shadow-sm z-10 uppercase tracking-widest">IDR</div>
              </div>
            </div>
            
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2.5">Monthly Saving Goal</label>
              <div class="relative flex items-center group">
                <div class="absolute left-4 font-bold text-slate-400 z-10 transition-colors">Rp</div>
                <input type="text" value="15.000.000" class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 focus:ring-primary focus:border-primary font-extrabold text-slate-800 dark:text-slate-100 transition-all text-lg shadow-sm focus:shadow-md relative" />
              </div>
              <div class="text-[12px] font-bold text-slate-500 mt-2.5 leading-relaxed">Recommended: Rp 18.000.000/mo to hit goal.</div>
            </div>
            
            <div class="pt-7 mt-2 border-t border-slate-200/60 dark:border-darkmode-400 flex items-center justify-between">
              <div>
                <div class="font-extrabold text-[14px] text-slate-800 dark:text-slate-100">Strict Budget Mode</div>
                <div class="text-[12px] font-bold text-slate-500 mt-0.5">Alert when over category limit</div>
              </div>
              <FormSwitch class="">
                <FormSwitch.Input type="checkbox" v-model="strictlyBudget" class="shadow-sm" />
              </FormSwitch>
            </div>
          </div>
        </div>
        
        <!-- Security -->
        <div class="box p-8 intro-y bg-primary/5 dark:bg-darkmode-600 border-primary/10 hover:shadow-md transition-shadow duration-300">
          <div class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">Security</div>
          
          <div class="flex flex-col gap-4">
            <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/70 bg-white/70 dark:bg-darkmode-800 hover:border-primary/40 hover:bg-white hover:shadow-sm transition-all group">
              <div class="flex items-center gap-3.5">
                <Lucide icon="Lock" class="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                <span class="font-bold text-[14px] text-slate-700 group-hover:text-slate-800 dark:text-slate-300 transition-colors">Change Password</span>
              </div>
              <Lucide icon="ChevronRight" class="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
            </button>
            
            <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/70 bg-white/70 dark:bg-darkmode-800 hover:border-danger/40 hover:bg-danger/5 hover:shadow-sm transition-all group">
              <div class="flex items-center gap-3.5">
                <Lucide icon="Trash2" class="w-4 h-4 text-slate-400 group-hover:text-danger transition-colors" />
                <span class="font-bold text-[14px] text-slate-700 group-hover:text-danger dark:text-slate-300 transition-colors">Delete Account</span>
              </div>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  
  <!-- Sticky Footer -->
  <div class="sticky bottom-0 -mx-6 -mb-6 mt-12 px-8 py-5 bg-white/80 backdrop-blur-lg dark:bg-darkmode-700/80 border-t border-slate-200/80 dark:border-darkmode-400 z-40 flex items-center justify-between shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.1)] transition-all">
    <div class="text-[13px] font-bold text-slate-500 hidden sm:block">
      Last saved: <span class="font-extrabold text-slate-800 dark:text-slate-200">Just now</span>
    </div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button class="flex-1 sm:flex-none px-7 py-3 bg-white text-slate-700 font-extrabold text-[13px] rounded-full border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm dark:bg-darkmode-600 dark:text-slate-200 dark:border-darkmode-400">
        Cancel
      </button>
      <button class="flex-1 sm:flex-none px-8 py-3 bg-primary text-white font-extrabold text-[13px] rounded-full shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        Save Changes
      </button>
    </div>
  </div>
</template>
