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
  throw Error("Form is required on step couple")
}
if (!formError) {
  throw Error("Form Error is required on step couple")
}
if (!responseError) {
  throw Error("Response Error is required on step couple")
}
const i18n = useI18n()
</script>

<template>
  <div class="grid grid-cols-12 gap-6">

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Groom Name')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.groom_name" :placeholder="i18n.t('Please enter your groom name')"
                 :class="{'border-danger': isFormError(responseError, 'groom_name') || formError.groom_name}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.groom_name">
        {{ formError.groom_name }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'groom_name')"
           v-html="getFormErrorMessages(responseError, 'groom_name')">
      </div>
    </div>

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Bride Name')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.bride_name" :placeholder="i18n.t('Please enter your bride name')"
                 :class="{'border-danger': isFormError(responseError, 'bride_name') || formError.bride_name}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.bride_name">
        {{ formError.bride_name }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'bride_name')"
           v-html="getFormErrorMessages(responseError, 'bride_name')">
      </div>
    </div>


  </div>
</template>

<style scoped>
</style>