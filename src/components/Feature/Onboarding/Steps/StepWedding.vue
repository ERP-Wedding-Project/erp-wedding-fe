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
  throw Error("Form is required on step wedding")
}
if (!formError) {
  throw Error("Form Error is required on step wedding")
}
if (!responseError) {
  throw Error("Response Error is required on step wedding")
}
const i18n = useI18n()
</script>

<template>
  <div class="grid grid-cols-12 gap-6">

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Wedding Date')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.wedding_date" :placeholder="i18n.t('Please enter your wedding date')"
                 :class="{'border-danger': isFormError(responseError, 'wedding_date') || formError.wedding_date}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.wedding_date">
        {{ formError.wedding_date }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'wedding_date')"
           v-html="getFormErrorMessages(responseError, 'wedding_date')">
      </div>
    </div>

    <div class="col-span-12">
      <FormLabel>{{i18n.t('City')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.city" :placeholder="i18n.t('Please enter your city')"
                 :class="{'border-danger': isFormError(responseError, 'city') || formError.city}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.city">
        {{ formError.city }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'city')"
           v-html="getFormErrorMessages(responseError, 'city')">
      </div>
    </div>

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Venue Place Name')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.venue[0].place_name" :placeholder="i18n.t('Please enter your venue place name')"
                 :class="{'border-danger': isFormError(responseError, 'venue.0.place_name') || formError.venue[0].place_name}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.venue[0].place_name">
        {{ formError.venue[0].place_name }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'venue.0.place_name')"
           v-html="getFormErrorMessages(responseError, 'venue.0.place_name')">
      </div>
    </div>

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Venue Address')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.venue[0].address" :placeholder="i18n.t('Please enter your venue address')"
                 :class="{'border-danger': isFormError(responseError, 'venue.0.address') || formError.venue[0].address}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.venue[0].address">
        {{ formError.venue[0].address }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'venue.0.address')"
           v-html="getFormErrorMessages(responseError, 'venue.0.address')">
      </div>
    </div>

    <div class="col-span-12">
      <FormLabel>{{i18n.t('Venue Description')}}
        <RequiredField/>
      </FormLabel>
      <FormInput v-model="form.venue[0].description" :placeholder="i18n.t('Please enter your venue description')"
                 :class="{'border-danger': isFormError(responseError, 'venue.0.description') || formError.venue[0].description}"
      />
      <div class="text-xs text-danger mt-2" v-if="formError.venue[0].description">
        {{ formError.venue[0].description }}
      </div>
      <div class="text-xs text-danger mt-2" v-if="isFormError(responseError, 'venue.0.description')"
           v-html="getFormErrorMessages(responseError, 'venue.0.description')">
      </div>
    </div>


  </div>
</template>

<style scoped>
</style>