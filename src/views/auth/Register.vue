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
  GoogleSignInButton,
} from "vue3-google-signin";

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

const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  console.log("Access Token", credential);
  loginWithGoogle(credential as string);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

const onSubmitRegister = async () => {
  await register(registerData.value);
};
</script>

<template>
  <div class="theme-wedding flex h-screen w-full overflow-hidden font-sans">
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
          <span class="text-wedding-primary">simplified.</span><br />
          Weddings,<br />
          <span class="text-wedding-primary">amplified.</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Join thousands of couples planning their dream day. Invite your
          partner and start planning together today.
        </p>

        <!-- Social Proof -->
        <div class="flex items-center gap-3 mt-8">
          <div class="flex -space-x-2">
            <div
              class="w-9 h-9 rounded-full bg-rose-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
            >
              A
            </div>
            <div
              class="w-9 h-9 rounded-full bg-amber-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
            >
              B
            </div>
            <div
              class="w-9 h-9 rounded-full bg-teal-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
            >
              C
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
      class="flex-1 flex items-center justify-center bg-wedding-light dark:bg-darkmode-600 px-6 sm:px-12 overflow-y-auto py-10"
    >
      <div class="w-full max-w-md">
        <!-- Logo (mobile only) -->
        <div class="flex items-center gap-2 mb-8 xl:hidden">
          <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
          <span class="text-lg font-semibold text-wedding-primary">WedHub</span>
        </div>

        <!-- Heading -->
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white">
          Create your account
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
          Start planning your stress-free wedding today.
        </p>

        <form @submit.prevent="onSubmitRegister" class="space-y-2">
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
                class="w-full px-4 py-3 pr-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wedding-primary/40 focus:border-wedding-primary transition"
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
                class="w-full px-4 py-3 pr-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wedding-primary/40 focus:border-wedding-primary transition"
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
                class="w-full px-4 py-3 pr-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wedding-primary/40 focus:border-wedding-primary transition"
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
                class="w-full px-4 py-3 pr-11 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wedding-primary/40 focus:border-wedding-primary transition"
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
              class="mt-0.5 w-4 h-4 rounded border-slate-300 accent-wedding-primary cursor-pointer"
            />
            <label
              for="agree-terms"
              class="text-sm text-slate-500 dark:text-slate-400 cursor-pointer leading-snug"
            >
              I agree to the
              <a
                href="#"
                class="text-wedding-primary font-medium hover:underline"
                >Terms</a
              >
              and
              <a
                href="#"
                class="text-wedding-primary font-medium hover:underline"
                >Privacy Policy</a
              >.
            </label>
          </div>

          <!-- Create Account Button -->
          <button
            type="submit"
            class="w-full py-3.5 rounded-full bg-wedding-primary hover:bg-wedding-secondary active:bg-wedding-dark text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-1">
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
            <span class="text-xs text-slate-400">Or continue with</span>
            <div class="flex-1 h-px bg-slate-200 dark:bg-slate-600"></div>
          </div>

          <!-- Google Login Button -->
          <!-- <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="!isReady"
            class="w-full flex items-center justify-center gap-3 py-3 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-darkmode-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-darkmode-700 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              class="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button> -->
          <div class="w-full text-center">
            <GoogleSignInButton
              @success="handleLoginSuccess"
              @error="handleLoginError"
            ></GoogleSignInButton>
          </div>

          <!-- Sign in Link -->
          <p class="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?
            <RouterLink
              :to="{ name: 'login' }"
              class="text-wedding-primary font-medium hover:underline ml-1"
            >
              Log in instead
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
