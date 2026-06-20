<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormLabel } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import { formatCurrency, formattedDate } from "@/core/helpers/utils";
import useProfileApi from "@/api/client/ProfileApi";
import useProjectApi from "@/api/client/ProjectApi";
import { useAuthStore } from "@/stores/auth";
import useActiveProject from "@/composable/useActiveProject";
import PageHeader from "@/components/Base/PageHeader/PageHeader.vue";
import InviteCollaboratorModal from "@/components/Collaborator/InviteCollaboratorModal.vue";

const { activeProject: projectData } = useActiveProject();

const authStore = useAuthStore();
const currentUser = ref<any>(authStore.getUser());

const { updateProfile, updatePassword } = useProfileApi();
const { inviteCollaborator, getDetailProject } = useProjectApi();

const isPasswordModalOpen = ref(false);
const passwordForm = ref({
  current_password: "",
  password: "",
  password_confirmation: ""
});

const isInviteModalOpen = ref(false);

const submitInvite = async (data: { role: string; identifiers: string[] }) => {
  if (!projectData.value?.code) return;
  try {
    for (const email of data.identifiers) {
      await inviteCollaborator(projectData.value.code, { email });
    }
    isInviteModalOpen.value = false;
    const response = await getDetailProject(projectData.value.code);
    const freshProject = response?.payload?.data;
    if (freshProject) {
      projectData.value = freshProject;
      localStorage.setItem("activeProject", JSON.stringify(freshProject));
    }
  } catch (error) {
  }
};

const isProfileModalOpen = ref(false);
const profileForm = ref({
  name: currentUser.value?.name || "",
  email: currentUser.value?.email || "",
  avatar: null as File | null
});
const avatarPreview = ref<string | null>(null);

const handleAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    profileForm.value.avatar = target.files[0];
    avatarPreview.value = URL.createObjectURL(target.files[0]);
  }
};

const submitUpdatePassword = async () => {
  try {
    await updatePassword({
      current_password: passwordForm.value.current_password,
      password: passwordForm.value.password,
      password_confirmation: passwordForm.value.password_confirmation
    });
    isPasswordModalOpen.value = false;
    passwordForm.value = {
      current_password: "",
      password: "",
      password_confirmation: ""
    };
  } catch (error) {
    // handled
  }
};

const submitUpdateProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("name", profileForm.value.name);
    formData.append("email", profileForm.value.email);
    if (profileForm.value.avatar) {
      formData.append("avatar", profileForm.value.avatar);
    }
    await updateProfile(formData);
    isProfileModalOpen.value = false;
    window.location.reload(); 
  } catch (error) {
    // handled
  }
};
</script>

<template>
  <div class="py-5 relative">
    <!-- Breadcrumb & Header -->
    <PageHeader
      :breadcrumbs="[{ label: 'Home', url: '#' }, { label: 'Settings', url: '#' }, { label: 'Profile' }]"
    >
      <template #title>Profile<br/>Settings</template>
      <template #actions>
        <button class="flex items-center font-bold text-[13px] text-slate-600 dark:text-slate-300 hover:text-primary transition-colors bg-white border border-slate-200 shadow-sm px-4 py-2.5 rounded-full">
          <Lucide icon="HelpCircle" class="w-4 h-4 mr-1.5" /> Support
        </button>
      </template>
    </PageHeader>

    <!-- Top Profile Banner -->
    <div class="box p-6 intro-y bg-primary/10 border-primary/10 dark:bg-darkmode-600 mb-8 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div class="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
      
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between relative z-10 gap-6">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div class="w-[100px] h-[100px] rounded-full border-[5px] border-white dark:border-darkmode-400 shadow-sm overflow-hidden shrink-0 bg-primary/20 transition-transform duration-300 group-hover:scale-[1.03]">
            <img :src="currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf'" alt="Profile Image" class="w-full h-full object-cover" />
          </div>
          <div class="mt-2 md:mt-2">
            <h3 class="text-[26px] font-extrabold text-slate-800 dark:text-slate-100">{{ currentUser?.name || 'User' }}</h3>
            <div class="text-slate-500 font-bold text-[13px] mt-1">{{ currentUser?.list_roles?.join(', ') || 'Member' }}</div>
            <div class="flex items-center justify-center md:justify-start gap-2.5 mt-4">
              <span class="px-3.5 py-1 bg-orange-100 text-orange-600 text-[11px] font-extrabold rounded-full border border-orange-200 shadow-sm">Pro Plan</span>
              <span class="px-3.5 py-1 bg-success/10 text-success text-[11px] font-extrabold rounded-full border border-success/20 shadow-sm">Verified</span>
            </div>
          </div>
        </div>
        
        <div class="flex-shrink-0 mt-3 md:mt-6">
          <button @click="isProfileModalOpen = true" class="px-6 py-2.5 bg-white/90 dark:bg-darkmode-400 text-slate-700 dark:text-slate-200 font-bold text-[13px] rounded-full shadow-sm hover:bg-white hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-200/50">
            Edit Profile
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
              <input type="text" readonly :value="projectData?.name || ''" class="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md" />
            </div>
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Date</label>
              <div class="relative group">
                <input type="text" readonly :value="projectData?.wedding_date ? formattedDate(projectData.wedding_date) : ''" class="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md" />
                <Lucide icon="Calendar" class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Venue Location (City)</label>
              <div class="relative group">
                <Lucide icon="MapPin" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <input type="text" readonly :value="projectData?.city || ''" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 font-bold text-[14px] text-slate-800 dark:text-slate-200 transition-all shadow-sm focus:shadow-md relative" />
              </div>
            </div>
            <!-- <div>
              <label class="block text-[13px] font-bold text-slate-800 dark:text-slate-300 mb-2">Estimated Guest Count</label>
              <div class="relative group">
                <Lucide icon="Users" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <input type="text" readonly placeholder="N/A" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 font-bold text-[14px] text-slate-400 dark:text-slate-500 transition-all shadow-sm relative" />
              </div>
            </div> -->
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
            <button @click="isInviteModalOpen = true" class="text-[13px] font-bold text-primary hover:text-primary/80 transition-all bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl whitespace-nowrap hidden sm:flex items-center">
              <Lucide icon="Plus" class="w-4 h-4 mr-1.5" /> Invite New
            </button>
          </div>
          
          <div class="flex flex-col gap-4">
            <template v-if="projectData?.users && projectData.users.length > 0">
              <div v-for="user in projectData.users" :key="user.id" class="p-4 rounded-xl bg-white/70 dark:bg-darkmode-800 border border-slate-200/60 flex items-center gap-4 hover:shadow-sm hover:border-primary/20 transition-all duration-300 group">
                <div class="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-100 dark:bg-darkmode-400 flex items-center justify-center text-slate-400">
                   <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                   <Lucide v-else icon="User" class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <div class="font-bold text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{{ user.name }} <span v-if="user.id === currentUser?.id">(You)</span></div>
                  <div class="text-[13px] font-bold text-slate-500 mt-0.5">{{ user.list_roles?.join(', ') || 'User' }}</div>
                </div>
                <div class="shrink-0">
                  <span class="px-4 py-2 bg-white dark:bg-darkmode-600 shadow-sm border border-slate-200/80 rounded-lg text-[11px] uppercase tracking-wider font-extrabold text-slate-500">{{ user.list_roles?.includes('Owner') ? 'Owner' : 'Member' }}</span>
                </div>
              </div>
            </template>
            <div v-else class="text-center text-slate-500 text-sm font-medium py-4">
              No collaborators found
            </div>
          </div>
          
          <!-- Mobile invite button -->
          <button @click="isInviteModalOpen = true" class="w-full mt-6 text-[13px] font-extrabold text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors bg-primary/5 shadow-sm px-4 py-3.5 rounded-xl sm:hidden flex items-center justify-center border border-primary/20">
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
                <input type="text" readonly :value="formatCurrency(projectData?.total_budget || 0)" class="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white/70 dark:bg-darkmode-800 font-extrabold text-slate-800 dark:text-slate-100 transition-all text-lg shadow-sm relative" />
                <div class="absolute right-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-extrabold text-slate-500 shadow-sm z-10 uppercase tracking-widest">IDR</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security -->
        <div class="box p-8 intro-y bg-primary/5 dark:bg-darkmode-600 border-primary/10 hover:shadow-md transition-shadow duration-300">
          <div class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">Security</div>
          
          <div class="flex flex-col gap-4">
            <button @click="isPasswordModalOpen = true" class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/70 bg-white/70 dark:bg-darkmode-800 hover:border-primary/40 hover:bg-white hover:shadow-sm transition-all group">
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

  <!-- Update Profile Modal -->
  <Dialog :open="isProfileModalOpen" @close="isProfileModalOpen = false">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Profile</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-name">Name</FormLabel>
          <FormInput id="modal-name" type="text" v-model="profileForm.name" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-email">Email</FormLabel>
          <FormInput id="modal-email" type="email" v-model="profileForm.email" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-avatar">Avatar</FormLabel>
          <FormInput id="modal-avatar" type="file" accept="image/*" @change="handleAvatarChange" />
          <div v-if="avatarPreview" class="mt-2 w-16 h-16 rounded-full overflow-hidden border">
            <img :src="avatarPreview" alt="Preview" class="w-full h-full object-cover" />
          </div>
        </div>
      </Dialog.Description>
      <div class="px-5 py-3 text-right border-t border-slate-200/60 dark:border-darkmode-400 mt-4">
        <Button type="button" variant="outline-secondary" @click="isProfileModalOpen = false" class="w-24 mr-1">
          Cancel
        </Button>
        <Button type="button" variant="primary" class="w-24" @click="submitUpdateProfile">
          Update
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Change Password Modal -->
  <Dialog :open="isPasswordModalOpen" @close="isPasswordModalOpen = false">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Change Password</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-current-password">Current Password</FormLabel>
          <FormInput id="modal-current-password" type="password" v-model="passwordForm.current_password" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-new-password">New Password</FormLabel>
          <FormInput id="modal-new-password" type="password" v-model="passwordForm.password" />
        </div>
        <div class="col-span-12 sm:col-span-12">
          <FormLabel htmlFor="modal-confirm-password">Confirm Password</FormLabel>
          <FormInput id="modal-confirm-password" type="password" v-model="passwordForm.password_confirmation" />
        </div>
      </Dialog.Description>
      <div class="px-5 py-3 text-right border-t border-slate-200/60 dark:border-darkmode-400 mt-4">
        <Button type="button" variant="outline-secondary" @click="isPasswordModalOpen = false" class="w-24 mr-1">
          Cancel
        </Button>
        <Button type="button" variant="primary" class="w-24" @click="submitUpdatePassword">
          Save
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Invite Collaborator Modal -->
  <InviteCollaboratorModal
    :open="isInviteModalOpen"
    @close="isInviteModalOpen = false"
    @submit="submitInvite"
  />
</template>
