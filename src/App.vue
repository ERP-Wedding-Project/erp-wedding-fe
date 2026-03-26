<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useColorSchemeStore } from "@/stores/color-scheme";
import { useDarkModeStore } from "@/stores/dark-mode";

const colorSchemeStore = useColorSchemeStore();
const darkModeStore = useDarkModeStore();

const applyThemeClasses = () => {
  const el = document.documentElement;
  
  // Apply Color Scheme
  el.setAttribute("class", colorSchemeStore.colorSchemeValue);
  
  // Apply Dark Mode
  if (darkModeStore.darkModeValue) {
    el.classList.add("dark");
  } else {
    el.classList.remove("dark");
  }
};

// Sync on store changes
watch([() => colorSchemeStore.colorSchemeValue, () => darkModeStore.darkModeValue], () => {
  applyThemeClasses();
});

// Sync on initial load
onMounted(() => {
  applyThemeClasses();
});
</script>

<template>
  <RouterView />
</template>

