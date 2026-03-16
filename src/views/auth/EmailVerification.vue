<script lang="ts" setup>
import logoUrl from "@/assets/images/logo.svg";
import weddingTable from "@/assets/images/wedding-table.jpg";
import Lucide from "@/components/Base/Lucide";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAuthApi from "@/api/auth/AuthApi.ts";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();

const { resendVerificationEmail, unauthenticate, verifyEmail } = useAuthApi();
const { getUser } = useAuthStore();
console.log(getUser, "getUser");

const isVerifying = ref(false);

onMounted(async () => {
  const { id, hash, expires, signature } = route.query;
  
  if (id && hash && expires && signature) {
    isVerifying.value = true;
    try {
      await verifyEmail({
        id: id as string,
        hash: hash as string,
        expires: expires as string,
        signature: signature as string
      });
      router.push({ name: 'dashboard-overview-1' });
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      isVerifying.value = false;
    }
  }
});

// ─── Countdown Timer ─────────────────────────────────────────────────────────
const COOLDOWN = 60;
const countdown = ref(0);
const canResend = ref(true);
const isResending = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = COOLDOWN;
  canResend.value = false;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer!);
      timer = null;
      canResend.value = true;
    }
  }, 1000);
};

// ─── Resend Handler ───────────────────────────────────────────────────────────
const onResend = async () => {
  if (!canResend.value || isResending.value) return;
  try {
    isResending.value = true;
    await resendVerificationEmail();
    startCountdown();
  } catch {
    // error sudah ditangani di service
  } finally {
    isResending.value = false;
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const onLogout = async () => {
  await unauthenticate();
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="theme-wedding flex h-screen w-full overflow-hidden font-sans">
    <!-- ─── Panel Kiri — Foto ───────────────────────────────────────────────── -->
    <div
      class="hidden xl:flex xl:w-5/12 relative flex-col justify-between p-10 flex-shrink-0"
      :style="{
        backgroundImage: `url(${weddingTable})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
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
          Almost<br />
          <span class="text-wedding-primary">there!</span>
        </h1>
        <p class="text-white/70 text-base leading-relaxed max-w-xs mt-4">
          Just one more step — verify your email to unlock all WedHub features
          and start planning your perfect day.
        </p>
      </div>

      <div class="relative z-10">
        <p class="text-white/40 text-xs">© 2025 WedHub Inc.</p>
      </div>
    </div>

    <!-- ─── Panel Kanan — Verifikasi ──────────────────────────────────────────── -->
    <div
      class="flex-1 flex items-center justify-center bg-wedding-light dark:bg-darkmode-600 px-6 sm:px-12 overflow-y-auto py-10"
    >
      <div class="w-full max-w-md text-center">
        <!-- Logo (mobile only) -->
        <div class="flex items-center justify-center gap-2 mb-8 xl:hidden">
          <img :src="logoUrl" alt="WedHub" class="w-7 h-7" />
          <span class="text-lg font-semibold text-wedding-primary">WedHub</span>
        </div>

        <!-- Icon Envelope Animasi -->
        <div class="relative inline-flex items-center justify-center mb-8">
          <!-- Lingkaran luar pulse -->
          <span
            class="absolute inline-flex h-28 w-28 rounded-full bg-wedding-primary/10 animate-ping opacity-40"
          ></span>
          <div
            class="relative flex items-center justify-center w-24 h-24 rounded-full bg-wedding-primary/15 border-2 border-wedding-primary/30"
          >
            <Lucide icon="MailCheck" class="w-11 h-11 text-wedding-primary" />
          </div>
        </div>

        <!-- Judul -->
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Check your inbox
        </h2>
        <p
          class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-1"
        >
          We've sent a verification link to
        </p>
        <p class="text-wedding-primary font-semibold text-base mb-8">
          <!-- {{ (user as any)?.email ?? "your email address" }} -->
        </p>

        <!-- Steps -->
        <div
          class="bg-white dark:bg-darkmode-800 rounded-2xl p-5 mb-8 text-left shadow-sm border border-slate-100 dark:border-darkmode-700 space-y-4"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-primary/15 flex items-center justify-center mt-0.5"
            >
              <span class="text-wedding-primary text-xs font-bold">1</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Open the email from
              <span class="font-medium text-slate-800 dark:text-white"
                >WedHub</span
              >
            </p>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-primary/15 flex items-center justify-center mt-0.5"
            >
              <span class="text-wedding-primary text-xs font-bold">2</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Click the
              <span class="font-medium text-slate-800 dark:text-white"
                >"Verify Email"</span
              >
              button inside
            </p>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-primary/15 flex items-center justify-center mt-0.5"
            >
              <span class="text-wedding-primary text-xs font-bold">3</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              You'll be redirected back to your dashboard automatically
            </p>
          </div>
        </div>

        <!-- Resend Button -->
        <button
          type="button"
          :disabled="!canResend || isResending"
          @click="onResend"
          class="w-full py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 shadow-md mb-3"
          :class="
            canResend && !isResending
              ? 'bg-wedding-primary hover:bg-wedding-secondary text-white hover:shadow-lg cursor-pointer'
              : 'bg-slate-200 dark:bg-darkmode-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
          "
        >
          <span
            v-if="isResending"
            class="flex items-center justify-center gap-2"
          >
            <Lucide icon="Loader" class="w-4 h-4 animate-spin" />
            Sending...
          </span>
          <span v-else-if="!canResend"> Resend in {{ countdown }}s </span>
          <span v-else> Resend verification email </span>
        </button>

        <p
          class="mt-2 text-xs text-slate-400 dark:text-slate-500 leading-relaxed"
        >
          Didn't receive the email? Check your spam folder, or
          <button
            @click="onResend"
            :disabled="!canResend"
            class="text-wedding-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            try again</button
          >.
        </p>
      </div>
    </div>
  </div>
</template>
