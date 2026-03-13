<script setup lang="ts">
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
</script>

<template>
  <div
    :class="[
      'p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary lg:bg-white dark:bg-darkmode-800 lg:dark:bg-darkmode-600',
      'before:hidden before:lg:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:lg:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"
  >
    <ThemeSwitcher />
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 lg:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen lg:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img
              alt="WedHub"
              class="w-6"
              :src="logoUrl"
            />
            <span class="ml-3 text-lg text-white"> WedHub </span>
          </a>
          <div class="my-auto">
            <img
              alt="WedHub"
              class="w-1/2 -mt-16 -intro-x"
              :src="illustrationUrl"
            />
            <div
              class="mt-10 text-4xl font-medium leading-tight text-white -intro-x"
            >
              A few more clicks to <br />
              sign in to your account.
            </div>
            <div
              class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400"
            >
              Manage all your e-commerce accounts in one place
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 lg:h-auto lg:py-0 lg:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md lg:ml-20 dark:bg-darkmode-600 lg:bg-transparent sm:px-8 lg:p-0 lg:shadow-none sm:w-3/4 lg:w-2/4 lg:w-auto"
          >
            <h2
              class="text-2xl font-bold text-center intro-x lg:text-3xl lg:text-left"
            >
              Welcome Back
            </h2>
            <div class="mt-2 text-center  intro-x text-slate-400 lg:text-left">
              Please enter your details to sign in to your account.
            </div>
            <div class="mt-8 intro-x">
              <FormInput
                type="text"
                class="block px-4 py-3 intro-x login__input min-w-full lg:min-w-[350px]"
                placeholder="Email"
              />
              <FormInput
                type="password"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full lg:min-w-[350px]"
                placeholder="Password"
              />
            </div>
            <div
              class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
            >
              <div class="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border"
                />
                <label class="cursor-pointer select-none" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <a href="">Forgot Password?</a>
            </div>
            <div class="mt-5 text-center intro-x lg:mt-8 lg:text-left">
              <Button
                variant="primary"
                class="w-full px-4 py-3 align-top lg:w-32 lg:mr-3"
              >
                Login
              </Button>
              <Button
                variant="outline-secondary"
                class="w-full px-4 py-3 mt-3 align-top lg:w-32 lg:mt-0"
              >
                Register
              </Button>
            </div>
            <div
              class="mt-10 text-center intro-x lg:mt-24 text-slate-600 dark:text-slate-500 lg:text-left"
            >
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href="">
                Terms and Conditions
              </a>
              &
              <a class="text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
