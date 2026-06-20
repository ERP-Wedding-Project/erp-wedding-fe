import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { getActiveProject } from "@/core/helpers/utils";

export default function useActiveProject() {
  const activeProject = ref<any>(getActiveProject());

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "activeProject") {
      activeProject.value = getActiveProject();
    }
  };

  onMounted(() => {
    window.addEventListener("storage", handleStorageChange);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("storage", handleStorageChange);
  });

  const refreshActiveProjectState = () => {
    activeProject.value = getActiveProject();
  };

  const setActiveProject = (project: any) => {
    activeProject.value = project;
    localStorage.setItem("activeProject", JSON.stringify(project));
  };

  const projectCode = computed(() => activeProject.value?.code || "");
  const projectName = computed(() => activeProject.value?.name || "");

  return {
    activeProject,
    projectCode,
    projectName,
    refreshActiveProjectState,
    setActiveProject,
  };
}
