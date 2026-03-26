<script setup lang="ts">
import {inject,  type Ref} from "vue";
import type {FormOnboarding, FormError} from "@/api/client/OnboardingApi";
import {FormInput, FormLabel, InputGroup} from "@/components/Base/Form";
import type {ResponseError} from "@/types/response";
import {getFormErrorMessages, isFormError} from "@/composable/formError";
import RequiredField from "@/components/Base/RequiredField.vue";
import {useI18n} from "vue-i18n";


const form = inject<Ref<FormOnboarding>>("form")
const formError = inject<Ref<FormError>>("formError")
const responseError = inject<Ref<ResponseError | null>>("responseError")
if (!form) {
  throw Error("Form is required on step budget")
}
if (!formError) {
  throw Error("Form Error is required on step budget")
}
if (!responseError) {
  throw Error("Response Error is required on step budget")
}
const i18n = useI18n()
</script>

<template>
  <div class="grid grid-cols-12 gap-6">

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Total Budget')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.total_budget" :placeholder="i18n.t('Please enter your total budget')"
                 :class="{'border-danger': isFormError(responseError, 'total_budget') || formError.total_budget}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.total_budget">
        {{ formError.total_budget }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'total_budget')"
           v-html="getFormErrorMessages(responseError, 'total_budget')">
      </div>
    </div>


  </div>
</template>

<style scoped>
</style>