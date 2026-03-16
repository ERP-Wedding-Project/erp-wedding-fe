<script lang="ts" setup>
import { ref } from "vue";
import logoUrl from "@/assets/images/logo.svg";
import weddingTable from "@/assets/images/wedding-table.jpg";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import useAuthApi from "@/api/auth/AuthApi";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const email = ref("");
const isSubmitted = ref(false);

const { forgotPassword } = useAuthApi();

const onSubmitForgotPassword = async () => {
  if (!email.value) return;
  await forgotPassword(email.value);
  isSubmitted.value = true;
};
</script>

<template>
  <ThemeSwitcher />
  <div class="flex h-screen w-full overflow-hidden font-sans">
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- Panel Kiri — Foto + Hero Text                                       -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div
      class="hidden xl:flex xl:w-6/12 relative flex-col justify-between p-10 flex-shrink-0"
      :style="{
        backgroundImage: `url(${weddingTable})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"
      ></div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-2">
        <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
        <span class="text-white font-semibold text-lg tracking-wide"
          >WedHub</span
        >
      </div>

      <!-- Hero Text -->
      <div class="relative z-10 mb-6">
        <h1 class="text-5xl font-extrabold leading-tight text-white mb-3">
          Recover,<br />
          <span class="text-primary">your account.</span><br />
          Regain,<br />
          <span class="text-primary">access.</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Don't worry, it happens to the best of us. Let's get you back on track
          to planning your dream wedding.
        </p>

        <!-- Social Proof -->
        <div class="flex items-center gap-3 mt-8">
          <div class="flex -space-x-2">
            <div
              class="w-9 h-9 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=1" class="rounded-full" />
            </div>
            <div
              class="w-9 h-9 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=2" class="rounded-full" />
            </div>
            <div
              class="w-9 h-9 rounded-full bg-slate-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=3" class="rounded-full" />
            </div>
          </div>
          <div>
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-white/80 text-xs">Loved by 10,000+ couples</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="relative z-10">
        <p class="text-white/40 text-xs">© 2026 WedHub Indonesia.</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- Panel Kanan — Form                                                  -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <div
      class="flex-1 flex items-center justify-center bg-light dark:bg-darkmode-600 px-6 sm:px-12 overflow-y-auto py-10 relative"
    >
      <!-- Heart background element -->
      <Lucide
        icon="Heart"
        class="absolute bottom-10 right-10 w-32 h-32 text-primary/5 -rotate-12 pointer-events-none"
      />

      <div class="w-full max-w-md relative z-10" v-if="!isSubmitted">
        <!-- Logo (mobile only) -->
        <div class="flex items-center gap-2 mb-8 xl:hidden">
          <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
          <span class="text-lg font-semibold text-primary">WedHub</span>
        </div>

        <!-- Heading -->
        <h2
          class="text-3xl font-bold text-slate-800 dark:text-white text-center xl:text-left"
        >
          Forgot Password
        </h2>
        <p
          class="text-slate-500 dark:text-slate-400 mt-1 mb-8 text-center xl:text-left"
        >
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </p>

        <form @submit.prevent="onSubmitForgotPassword" class="space-y-5">
          <!-- Email -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email address
            </label>
            <div class="relative">
              <FormInput
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                required
              />
            </div>
          </div>

          <!-- Send Reset Link Button -->
          <Button
            type="submit"
            variant="primary"
            class="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg border-none mt-2"
          >
            Send Reset Link
          </Button>

          <!-- Back to login Link -->
          <p
            class="text-center text-sm text-slate-500 dark:text-slate-400 mt-8"
          >
            Remember your password?
            <RouterLink
              :to="{ name: 'login' }"
              class="text-primary font-medium hover:underline ml-1"
            >
              Back to Sign in
            </RouterLink>
          </p>
        </form>
      </div>

      <div class="w-full max-w-md relative z-10 text-center" v-else>
        <div
          class="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-6"
        >
          <Lucide icon="Check" class="w-8 h-8" />
        </div>
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Check your email
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">
          We've sent a password reset link to
          <span class="font-medium text-slate-700 dark:text-slate-300">{{
            email
          }}</span
          >. Please check your inbox and spam folder.
        </p>
        <Button
          variant="primary"
          class="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg border-none"
          @click="isSubmitted = false"
        >
          Try another email
        </Button>
        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          <RouterLink
            :to="{ name: 'login' }"
            class="text-primary font-medium hover:underline"
          >
            Back to Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
