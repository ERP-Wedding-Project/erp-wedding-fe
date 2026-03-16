<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import logoUrl from "@/assets/images/logo.svg";
import weddingTable from "@/assets/images/wedding-table.jpg";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import useAuthApi, { type FormResetPassword } from "@/api/auth/AuthApi";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const route = useRoute();
const router = useRouter();
const { resetPassword } = useAuthApi();

const resetData = ref<FormResetPassword>({
  email: "",
  password: "",
  password_confirmation: "",
  token: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref("");

onMounted(() => {
  resetData.value.email = (route.query.email as string) || "";
  resetData.value.token = (route.params.token as string) || (route.query.token as string) || "";
});

const onSubmitResetPassword = async () => {
  errorMessage.value = "";
  if (resetData.value.password !== resetData.value.password_confirmation) {
    errorMessage.value = "Passwords do not match.";
    return;
  }
  
  if (!resetData.value.password) {
    errorMessage.value = "Password cannot be empty.";
    return;
  }
  
  if (!resetData.value.token) {
    errorMessage.value = "Invalid or missing token.";
    return;
  }
  
  try {
    await resetPassword(resetData.value);
    isSubmitted.value = true;
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to reset password. Please try again.";
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
          Secure,<br />
          <span class="text-primary">your account.</span><br />
          Plan,<br />
          <span class="text-primary">with confidence.</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Create a new, strong password to get back to planning your perfect day with peace of mind.
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
          Create New Password
        </h2>
        <p
          class="text-slate-500 dark:text-slate-400 mt-1 mb-8 text-center xl:text-left"
        >
          Your new password must be different from previous used passwords.
        </p>

        <form @submit.prevent="onSubmitResetPassword" class="space-y-5">
          <div v-if="errorMessage" class="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm mb-4">
            {{ errorMessage }}
          </div>
          
          <input type="hidden" v-model="resetData.token" />
          
          <!-- Email (readonly) -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email address
            </label>
            <div class="relative">
              <FormInput
                v-model="resetData.email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-0 opacity-70 cursor-not-allowed"
                readonly
              />
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              New Password
            </label>
            <div class="relative">
              <FormInput
                v-model="resetData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                required
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

          <!-- Confirm Password -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Confirm Password
            </label>
            <div class="relative">
              <FormInput
                v-model="resetData.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                required
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                @click="showConfirmPassword = !showConfirmPassword"
                tabindex="-1"
              >
                <Lucide
                  :icon="showConfirmPassword ? 'Eye' : 'EyeOff'"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Reset Password Button -->
          <Button
            type="submit"
            variant="primary"
            class="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg border-none mt-4"
          >
            Reset Password
          </Button>

          <!-- Back to login Link -->
          <p
            class="text-center text-sm text-slate-500 dark:text-slate-400 mt-8"
          >
            <RouterLink
              :to="{ name: 'login' }"
              class="text-primary font-medium hover:underline"
            >
              Back to Sign in
            </RouterLink>
          </p>
        </form>
      </div>

      <div class="w-full max-w-md relative z-10 text-center" v-else>
        <div class="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
          <Lucide icon="Check" class="w-8 h-8" />
        </div>
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-2">Password Reset Successful!</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">
          Your password has been successfully reset. You can now use your new password to sign in to your account.
        </p>
        <Button
          variant="primary"
          class="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg border-none"
          @click="router.push({ name: 'login' })"
        >
          Go to Sign in
        </Button>
      </div>
    </div>
  </div>
</template>
