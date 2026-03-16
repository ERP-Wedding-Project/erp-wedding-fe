<script lang="ts" setup>
import { GoogleSignInButton, type CredentialResponse } from "vue3-google-signin";
import useAuthApi from "@/api/auth/AuthApi";
import Lucide from "@/components/Base/Lucide";
import googleIcon from "@/assets/images/google.svg";

const { loginWithGoogle } = useAuthApi();

const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  if (credential) {
    loginWithGoogle(credential);
  }
};

const handleLoginError = () => {
  console.error("Google Login failed");
};
</script>

<template>
  <div class="relative w-full h-[48px] rounded-xl overflow-hidden group">
    <!-- Custom UI Button -->
    <button
      type="button"
      class="absolute inset-0 w-full h-full flex items-center justify-center gap-3 bg-white dark:bg-darkmode-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm transition-all shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-darkmode-700 pointer-events-none"
    >
      <img v-if="googleIcon" :src="googleIcon" alt="Google" class="w-5 h-5" />
      <Lucide v-else icon="Chrome" class="w-5 h-5 text-red-500" />
      <span>Continue with Google</span>
    </button>
    
    <!-- Transparent Google Button overlay to handle click and iframe securely -->
    <GoogleSignInButton
      @success="handleLoginSuccess"
      @error="handleLoginError"
      width="400"
      class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
    ></GoogleSignInButton>
  </div>
</template>

<style scoped>
/* Ensure the Google iframe stretches to cover our button */
:deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  cursor: pointer !important;
}
</style>
