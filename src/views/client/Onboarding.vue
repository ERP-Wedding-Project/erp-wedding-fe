<script setup lang="ts">
import OnboardingStep from "@/components/Feature/Onboarding/OnboardingStep.vue";
import OnboardingForm from "@/components/Feature/Onboarding/OnboardingForm.vue";
import {onMounted, provide, ref, useTemplateRef, watch} from "vue";
import type {FormOnboarding} from "@/api/client/OnboardingApi";
import {useI18n} from "vue-i18n";

onMounted(async () => {
// Load select option, request grandong
 
});
const form = ref<FormOnboarding>({
wedding_date: "",
groom_name: "",
bride_name: "",
city: "",
creator_role: "",
total_budget: 0,
template_id: "",
venue: {
    place_name: "",
    address: "",
    description: ""
},
partner_email: "",
avatar: null,
});
provide("form", form);


const onboardingStepRef = useTemplateRef<InstanceType<typeof OnboardingStep> | null>("onboardingStepRef");
const onboardingFormRef = useTemplateRef<InstanceType<typeof OnboardingForm> | null>("onboardingFormRef");

const i18n = useI18n()
</script>

<template>
  <div class="grid grid-cols-12 mt-16 gap-4">
    <div class="col-span-12 font-bold text-2xl">
      <h1>{{ i18n.t('Onboarding') }}</h1>
    </div>

    <template>
      <OnboardingStep ref="onboardingStepRef"/>

      <OnboardingForm
          v-if="onboardingStepRef"
          :steps="onboardingStepRef?.steps"
          :current-step="onboardingStepRef?.currentStep"
          @next="onboardingStepRef?.onNextStep"
          @previous="onboardingStepRef?.onPreviousStep"
          ref="onboardingFormRef"
      />
    </template>
  </div>
</template>

<style scoped>
</style>