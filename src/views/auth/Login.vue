<script lang="ts" setup>
import { ref } from "vue";
import logoUrl from "@/assets/images/logo.svg";
import weddingTable from "@/assets/images/wedding-table.jpg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import type { FormAuthentication } from "@/api/auth/AuthApi";
import useAuthApi from "@/api/auth/AuthApi";
import GoogleLoginButton from "@/components/Auth/GoogleLoginButton.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const loginData = ref<FormAuthentication>({
  email: "",
  password: "",
});

const showPassword = ref(false);
const isLoading = ref(false);

const { authenticate } = useAuthApi();

const onSubmitLogin = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await authenticate(loginData.value);
  } finally {
    isLoading.value = false;
  }
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
          Finances,<br />
          <span class="text-primary">simplified.</span><br />
          Weddings,<br />
          <span class="text-primary">amplified.</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Join thousands of couples planning their dream day without the
          financial stress. Invite your partner and start budgeting together
          today.
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

      <div class="w-full max-w-md relative z-10">
        <!-- Logo (mobile only) -->
        <div class="flex items-center gap-2 mb-8 xl:hidden">
          <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
          <span class="text-lg font-semibold text-primary">WedHub</span>
        </div>

        <!-- Heading -->
        <h2
          class="text-3xl font-bold text-slate-800 dark:text-white text-center xl:text-left"
        >
          Welcome Back
        </h2>
        <p
          class="text-slate-500 dark:text-slate-400 mt-1 mb-8 text-center xl:text-left"
        >
          Please enter your details to sign in.
        </p>

        <form @submit.prevent="onSubmitLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email address
            </label>
            <div class="relative">
              <FormInput
                v-model="loginData.email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Password
            </label>
            <div class="relative">
              <FormInput
                v-model="loginData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <Lucide
                  :icon="showPassword ? 'Eye' : 'EyeOff'"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <FormCheck.Input
                id="remember-me"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer"
              />
              <label
                for="remember-me"
                class="text-slate-500 dark:text-slate-400 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-primary font-medium hover:underline"
            >
              Forgot password?
            </RouterLink>
          </div>

          <!-- Sign In Button -->
          <Button
            type="submit"
            variant="primary"
            :disabled="isLoading"
            class="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg border-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <Lucide icon="Loader" class="w-4 h-4 animate-spin" />
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </Button>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-slate-300"></div>
            <span
              class="text-xs text-slate-400 font-medium uppercase tracking-wider"
              >Or
            </span>
            <div class="flex-1 h-px bg-slate-300"></div>
          </div>

          <!-- Google Login -->
          <div class="w-full flex justify-center mt-6">
            <GoogleLoginButton />
          </div>

          <!-- Sign Up Link -->
          <p
            class="text-center text-sm text-slate-500 dark:text-slate-400 mt-8"
          >
            Don't have an account yet?
            <RouterLink
              :to="{ name: 'register' }"
              class="text-primary font-medium hover:underline ml-1"
            >
              Sign up for free
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
