<script lang="ts" setup>
import logoUrl from "@/assets/images/logo.svg";
import weddingTable from "@/assets/images/wedding-table.jpg";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { ref } from "vue";
import useAuthApi, { type FormRegister } from "@/api/auth/AuthApi.ts";
import {
  useCodeClient,
  useTokenClient,
  type AuthCodeFlowErrorResponse,
  type AuthCodeFlowSuccessResponse,
  type CredentialResponse,
} from "vue3-google-signin";
import GoogleLoginButton from "@/components/Auth/GoogleLoginButton.vue";

const registerData = ref<FormRegister>({
  email: "",
  full_name: "",
  password: "",
  password_confirmation: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeToTerms = ref(false);

const { register, loginWithGoogle } = useAuthApi();

// const handleOnSuccess = (response: AuthCodeFlowSuccessResponse) => {
//   console.log("Access Token: ", response.access_token);
//   loginWithGoogle(response.access_token);
// };

// const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
//   console.log("Error: ", errorResponse);
// };

// const { isReady, login } = useTokenClient({
//   onSuccess: handleOnSuccess,
//   onError: handleOnError,
//   // other options
// });

// const handleGoogleLogin = () => {
//   if (isReady.value) {
//     login();
//   }
// };

const isLoading = ref(false);

const onSubmitRegister = async () => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await register(registerData.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
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
          Planning,<br />
          <span class="text-primary">simplified.</span><br />
          Weddings,<br />
          <span class="text-primary">amplified.</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Join thousands of couples planning their dream day. Invite your
          partner and start planning together today.
        </p>

        <!-- Social Proof -->
        <div class="flex items-center gap-3 mt-8">
          <div class="flex -space-x-2">
            <div
              class="w-9 h-9 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=4" class="rounded-full" />
            </div>
            <div
              class="w-9 h-9 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=5" class="rounded-full" />
            </div>
            <div
              class="w-9 h-9 rounded-full bg-slate-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
            >
              <img src="https://i.pravatar.cc/150?u=6" class="rounded-full" />
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
      class="flex-1 flex items-center justify-center bg-light dark:bg-darkmode-600 px-6 sm:px-12 overflow-y-auto py-10"
    >
      <div class="w-full max-w-md">
        <!-- Logo (mobile only) -->
        <div class="flex items-center gap-2 mb-8 xl:hidden">
          <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
          <span class="text-lg font-semibold text-primary">WedHub</span>
        </div>

        <!-- Heading -->
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white">
          Create your account
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
          Start planning your stress-free wedding today.
        </p>

        <form @submit.prevent="onSubmitRegister" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Full Name
            </label>
            <div class="relative">
              <FormInput
                v-model="registerData.full_name"
                type="text"
                placeholder="e.g. Jane Doe"
                class="w-full px-4 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <Lucide
                icon="User"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email Address
            </label>
            <div class="relative">
              <FormInput
                v-model="registerData.email"
                type="email"
                placeholder="jane@example.com"
                class="w-full px-4 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <Lucide
                icon="Mail"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Create Password
            </label>
            <div class="relative">
              <FormInput
                v-model="registerData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                class="w-full px-4 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
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

          <!-- Password Confirmation -->
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Confirm Password
            </label>
            <div class="relative">
              <FormInput
                v-model="registerData.password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Re-enter your password"
                class="w-full px-4 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
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

          <!-- Terms Checkbox -->
          <div class="flex items-start gap-3 pt-1">
            <input
              id="agree-terms"
              v-model="agreeToTerms"
              type="checkbox"
              class="mt-0.5 w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer"
            />
            <label
              for="agree-terms"
              class="text-sm text-slate-500 dark:text-slate-400 cursor-pointer leading-snug"
            >
              I agree to the
              <a
                href="#"
                class="text-primary font-medium hover:underline"
                >Terms</a
              >
              and
              <a
                href="#"
                class="text-primary font-medium hover:underline"
                >Privacy Policy</a
              >.
            </label>
          </div>

          <!-- Create Account Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 rounded-full bg-primary hover:opacity-90 active:bg-theme-2 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <Lucide icon="Loader" class="w-4 h-4 animate-spin" />
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-2">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
            <span class="text-xs text-slate-400">Or continue with</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
          </div>

          <div class="w-full text-center">
            <GoogleLoginButton />
          </div>

          <!-- Sign in Link -->
          <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account?
            <RouterLink
              :to="{ name: 'login' }"
              class="text-primary font-medium hover:underline ml-1"
            >
              Log in instead
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

