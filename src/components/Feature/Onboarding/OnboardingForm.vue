<script setup lang="ts">

import Button from "@/components/Base/Button";
import {computed, inject, type PropType, provide, type Ref, ref} from "vue";
import type {Step} from "@/components/Feature/Onboarding/OnboardingStep.vue";
import useClientOnboardingApi, { type FormOnboarding, type FormError } from "@/api/client/OnboardingApi";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import { useOnboardingClientSideValidation } from "@/composable/useOnboardingClientSideValidation";
import StepWedding from "./Steps/StepWedding.vue";
import StepChecklist from "./Steps/StepChecklist.vue";
import StepBudget from "./Steps/StepBudget.vue";

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'previous'): void
}>()
const router = useRouter()

const {onboarding, responseError} = useClientOnboardingApi()
const props = defineProps({
  currentStep: {
    required: true,
    type: Number,
  },
  steps: {
    required: true,
    type: Object as PropType<Step[]>
  }
})
const currentStepItem = computed((): Step | null => {
  return props.steps?.find((step: Step) => {
    return step.number === props.currentStep;
  }) ?? null
})
const form = inject<Ref<FormOnboarding>>("form")
if (!form) {
  throw Error("Form is required on step term and condition")
}
const onSubmit = async () => {
  await onboarding(form.value).then((result) => {
    router.push({
      name: "thank-you-after-register"
    })
  })
}

const formError = ref<FormError>({
  wedding_date: null,
  groom_name: null,
  bride_name: null,
  city: null,
  creator_role: null,
  total_budget: null,
  template_id: null,
  venue: {
    place_name: null,
    address: null,
    description: null,
  },
  partner_email: null,
  avatar: null,
})
provide("responseError", responseError)
provide("formError", formError)

const {validate} = useOnboardingClientSideValidation()

const nextStep = async () => {
  if (validate(props.currentStep, form, formError)){
    emit('next')
  }
}

const i18n = useI18n()
</script>

<template>
  <div class="col-span-12 xl:col-span-9 box mt-4 py-12 px-10">
    <h2 class="font-bold text-xl intro-x">{{ i18n.t(currentStepItem?.title ?? "-") }}</h2>
    <p class="text-xs text-gray-400 intro-x">{{ i18n.t(currentStepItem?.description ?? "-") }}</p>

    <!--STEP CONTENT CONTAINER-->
    <div class="px-5 my-5">
      <KeepAlive>
        <StepCouple
            v-if="currentStep === 1 "/>
      </KeepAlive>

      <KeepAlive>
        <StepWedding
            v-if="currentStep === 2 "/>
      </KeepAlive>

      <KeepAlive>
        <StepBudget
            v-if="currentStep === 3 "/>
      </KeepAlive>

      <KeepAlive>
        <StepChecklist
            v-if="currentStep === 4 "/>
      </KeepAlive>

      <KeepAlive>
        <StepPreview
            v-if="currentStep === 5 "/>
      </KeepAlive>

    </div>


    <!--NAVIGATION-->
    <div class="flex mt-10" :class="currentStep === 1 ? 'justify-end' : 'justify-between'">
      <Button variant="secondary" @click="emit('previous')" v-if="currentStep !== 1">{{ i18n.t("Previous") }}</Button>
      <Button variant="primary" @click="nextStep" v-if="currentStep !== steps.length">{{ i18n.t("Next") }}</Button>
      <Button @click="onSubmit" variant="primary" v-else>{{ i18n.t("Submit") }}</Button>
    </div>
  </div>
</template>

<style scoped>

</style>