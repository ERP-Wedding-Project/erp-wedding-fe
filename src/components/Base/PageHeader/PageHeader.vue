<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";

interface Breadcrumb {
  label: string;
  url?: string;
}

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

defineProps<PageHeaderProps>();
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between intro-y mb-8 relative z-50">
    <div class="w-full">
      <!-- Breadcrumbs or custom content above title -->
      <slot name="before-title">
        <div v-if="breadcrumbs && breadcrumbs.length > 0" class="text-slate-500 text-[13px] mb-2 font-bold flex items-center">
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <component :is="crumb.url ? 'a' : 'span'" :href="crumb.url" :class="[crumb.url ? 'hover:text-primary transition-colors' : 'text-slate-700 dark:text-slate-300']">
              {{ crumb.label }}
            </component>
            <Lucide v-if="index < breadcrumbs.length - 1" icon="ChevronRight" class="w-3.5 h-3.5 mx-1" />
          </template>
        </div>
      </slot>
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between w-full">
        <!-- Title and Subtitle Block -->
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            <slot name="title">{{ title }}</slot>
          </h2>
          <div v-if="subtitle" class="mt-2 text-[14px] font-bold text-slate-400 tracking-wide">
            {{ subtitle }}
          </div>
          <slot name="subtitle"></slot>
        </div>
        
        <!-- Action Buttons (Right Aligned) -->
        <div class="flex items-center gap-3 mt-5 sm:mt-0 shrink-0">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
