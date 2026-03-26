<script setup lang="ts">

import Button from "@/components/Base/Button";
import {inject, type Ref, ref, watch} from "vue";
import type { FormOnboarding } from "@/api/client/OnboardingApi";
import {useI18n} from "vue-i18n";
import {toast} from "vue3-toastify";

export type Step = {
  title: string
  description: string
  number: number
  isShow: boolean
}
const defaultSteps = ref<Step[]>([
  {
    title: "Couple Detail",
    description: "Masukkan Detail Catin",
    number: 1,
    isShow: false,
  },
  {
    title: "Wedding Detail",
    description: "Masukkan Detail Acara",
    number: 2,
    isShow: false,
  },
  {
    title: "Budget",
    description: "Masukkan Budget Acara",
    number: 3,
    isShow: false,
  },
  {
    title: "Checklist",
    description: "Masukkan Checklist Acara",
    number: 4,
    isShow: false,
  },
  {
    title: "Preview",
    description: "Preview all information detail before submit",
    number: 5,
    isShow: false,
  },
])
const steps = ref<Step[]>([]);
const form = inject<Ref<FormOnboarding>>("form")
if (!form) {
  throw Error("Form is required")
}
const updateSteps = () => {
  let currentStepCounter = 1
  steps.value = defaultSteps.value.map((item: Step, i: number) => {
    if (i !== 0) {
      item.isShow = true
    }

    if (item.isShow) {
      item.number = currentStepCounter
      currentStepCounter++
    }

    return item
  }).filter(item => {
    return item.isShow
  })
}

const currentStep = ref<number>(1)
const highestStep = ref<number>(1)
const selectStep = (number: number) => {
  if (number > highestStep.value){
    toast.warning(i18n.t("Cannot jump to further step. Fill the form and click next"))
    return;
  }
  currentStep.value = number
}

const onNextStep = () => {
  currentStep.value += 1;
  if (currentStep.value > highestStep.value) {
    highestStep.value = currentStep.value
  }
}

const onPreviousStep = () => {
  currentStep.value -= 1;
}

watch(
    () => form.value,
    (newVal, oldVal) => {
      updateSteps()
    },
    {deep: true, immediate: true} // karena ini array of object
)

defineExpose({
  currentStep,
  steps,
  onNextStep,
  onPreviousStep,
})

const i18n = useI18n()
</script>

<template>
  <!--  Side Menu Step  -->
  <div class="col-span-12 xl:col-span-3 box mt-4 py-12">
    <div class="relative flex flex-col justify-center px-5 sm:px-20">
      <div class="relative flex items-center intro-x mt-10" v-for="step in steps" :key="step.title">
        <div class="relative flex flex-col items-center">
          <Button class="w-10 h-10 rounded-full text-slate-500 bg-slate-100 hover:bg-primary hover:text-white"
                  @click="selectStep(step.number)"
                  :class="{'bg-primary text-white':currentStep===step.number}">{{ step.number }}
          </Button>
          <div
              class="after:content-[''] after:absolute after:top-10 after:left-1/2 after:-translate-x-1/2 after:w-px after:h-10 after:bg-slate-300"></div>
        </div>
        <div class="ml-3">
          <div class="text-base font-medium">{{ i18n.t(step.title) }}</div>
          <div class="text-xs">{{ i18n.t(step.description) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>