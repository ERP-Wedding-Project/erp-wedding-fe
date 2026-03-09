<template>
  <div
      :class="[
      'p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"
  >
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Learning Management System" class="w-6" :src="logoUrl"/>
            <span class="ml-3 text-lg text-white">Wedding Hub</span>
          </a>
          <div class="my-auto">
            <img alt="Learning Management System" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl"/>
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              A few more clicks to <br/>
              sign in to your account.
            </div>
            <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              "Platform All in One Wedding Planner"
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
              class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Sign In</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              A few more clicks to sign in to your account.
            </div>

            <form @submit.prevent="onSubmitLogin">
              <Button
                  type="button"
                  class="w-full mt-4 flex gap-2"
                  variant="outline-primary"
              >
                <Lucide icon="LogInIcon"></Lucide>
                Sign In With Google
              </Button>
              <div class="mt-8 intro-x">
                <FormInput v-model="loginData.email" type="email"
                           class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                           placeholder="Email"/>
                <div class="relative mt-4 intro-x">
                  <FormInput
                      v-model="loginData.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="block px-4 py-3 pr-10 login__input min-w-full xl:min-w-[350px]"
                      placeholder="Password"
                  />
                  <Lucide
                      :icon="showPassword ? 'EyeOff' : 'Eye'"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 cursor-pointer"
                      @click="showPassword = !showPassword"
                  />
                </div>
              </div>
              <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                <div class="flex items-center mr-auto">
                  <FormCheck.Input id="remember-me" type="checkbox" class="mr-2 border"/>
                  <label class="cursor-pointer select-none" for="remember-me">
                    Remember me
                  </label>
                </div>
                <a href="">Forgot Password?</a>
              </div>
              <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                <Button variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3" type="submit">
                  Login
                </Button>
                <RouterLink :to="{
                  name: 'register'
                }">
                  <Button
                      class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                      variant="outline-secondary"
                  >
                    Register
                  </Button>
                </RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import {FormInput, FormCheck} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import type {FormAuthentication} from "@/api/auth/AuthApi";
import useAuthApi from "@/api/auth/AuthApi";
import Lucide from "@/components/Base/Lucide";

const loginData = ref<FormAuthentication>({
  email: null,
  password: null,
});

const showPassword = ref(false);

const {authenticate} = useAuthApi()
const onSubmitLogin = async () => {
  await authenticate(loginData.value);
}
</script>
