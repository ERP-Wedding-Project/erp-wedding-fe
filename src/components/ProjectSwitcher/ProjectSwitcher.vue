<script setup lang="ts">
import { onMounted, ref } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import useProjectApi from "@/api/client/ProjectApi";
import type IProject from "@/types/entities/Project";

const { getListProject } = useProjectApi();

const activeProject = ref<IProject | null>(null);
const projects = ref<IProject[]>([]);

const fetchListProject = async () => {
  try {
    const data = await getListProject();

    projects.value = data?.payload?.data ?? [];
    
    const savedProject = localStorage.getItem("activeProject");
    if (savedProject) {
      const parsed = JSON.parse(savedProject);
      const found = projects.value.find(p => p.id === parsed.id);
      activeProject.value = found || projects.value[0];
    } else {
      activeProject.value = projects.value[0];
    }

    if (activeProject.value) {
      localStorage.setItem("activeProject", JSON.stringify(activeProject.value));
    }
  } catch (_) {
    // error handled by useTaskCategoryApi
  }
};

const selectProject = (project: any) => {
  activeProject.value = project;
  localStorage.setItem("activeProject", JSON.stringify(project));
  // Refresh page so other components use the newly selected project
  window.location.reload();
};
onMounted(() => {
  fetchListProject();
});
</script>

<template>
  <Menu class="relative block w-full">
    <Menu.Button
      v-if="activeProject"
      class="flex items-center w-full px-2 py-2 border rounded bg-white/10 dark:bg-darkmode-600 border-white/20 dark:border-darkmode-500 hover:bg-white/20 dark:hover:bg-darkmode-500 transition-colors"
    >
      <div class="flex-1 text-left overflow-hidden">
        <div class="text-sm font-medium text-white truncate">
          {{ activeProject.name }}
        </div>
        <!-- <div class="text-[10px] text-white/70 mt-0.5 truncate">
          Role: {{ activeProject.role }}
        </div> -->
      </div>
      <Lucide icon="ChevronDown" class="w-3 h-3 ml-2 text-white/70" />
    </Menu.Button>
    <Menu.Items
      class="absolute left-0 mt-1 min-w-full w-max rounded bg-white px-1 py-1 shadow-md dark:bg-darkmode-600 z-50"
      placement="bottom-start"
    >
      <div
        class="text-[10px] text-slate-400 px-2 pt-2 pb-1 uppercase tracking-widest font-semibold"
      >
        Projects
      </div>

      <Menu.Item
        v-for="project in projects"
        :key="project.id"
        @click="selectProject(project)"
        class="flex items-center w-full px-2 py-1.5 cursor-pointer rounded text-xs hover:bg-slate-50 dark:hover:bg-darkmode-500 whitespace-nowrap"
      >
        <div class="flex-1 pr-4">
          <div
            :class="
              activeProject.id === project.id
                ? 'font-medium text-primary dark:text-primary'
                : 'text-slate-600 dark:text-slate-300'
            "
          >
            {{ project.name }}
          </div>
        </div>
        <span
          v-if="activeProject.id === project.id"
          class="text-primary text-xs ml-auto"
          >✓</span
        >
      </Menu.Item>

      <!-- <div
        class="my-1 border-t border-slate-100 dark:border-darkmode-500"
      ></div> -->
      <!-- <Menu.Item
        class="text-primary font-medium text-xs px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded"
      >
        + Buat Project Baru
      </Menu.Item> -->
    </Menu.Items>
  </Menu>
</template>
