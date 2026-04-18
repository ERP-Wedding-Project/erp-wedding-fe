<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useClientOnboardingApi from "@/api/client/OnboardingApi";

const router = useRouter();
const { onboarding } = useClientOnboardingApi();

const step = ref(1);
const stepTitles = [
  "Couple Details",
  "Wedding Details",
  "Budget Estimation",
  "Checklist Setup",
];
const displayBudget = ref("");
const useTemplate = ref(true);
const loading = ref(false);

const form = reactive({
  wedding_date: "",
  groom_name: "",
  bride_name: "",
  city: "",
  creator_role: "Bride",
  total_budget: 0,
  template_id: "",
  venue: [{ place_name: "", address: "", description: "" }],
  partner_email: "",
  avatar: null,
});

const onBudgetInput = (e: any) => {
  let value = e.target.value.replace(/\D/g, "");
  form.total_budget = Number(value);
  displayBudget.value = value
    ? parseInt(value, 10).toLocaleString("id-ID")
    : "";
};

const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isCurrentStepValid = computed(() => {
  if (step.value === 1) {
    return (
      form.bride_name.trim().length > 0 &&
      form.groom_name.trim().length > 0 &&
      isEmailValid(form.partner_email) &&
      form.creator_role.trim().length > 0
    );
  }
  if (step.value === 2) {
    if (!form.wedding_date || form.city.trim().length === 0) return false;
    if (form.venue.length === 0) return false;
    // Ensure every venue has a name and address
    return form.venue.every(
      (v) => v.place_name.trim().length > 0 && v.address.trim().length > 0,
    );
  }
  if (step.value === 3) {
    return form.total_budget > 0;
  }
  return true; // Step 4 always valid as it's just a toggle checkbox
});

const addVenue = () => {
  form.venue.push({ place_name: "", address: "", description: "" });
};

const removeVenue = (index: number) => {
  if (form.venue.length > 1) {
    form.venue.splice(index, 1);
  }
};

const nextStep = () => {
  if (isCurrentStepValid.value && step.value < 4) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const finishSetup = async () => {
  try {
    loading.value = true;
    if (useTemplate.value) {
      form.template_id = "1"; // Using generic template ID 1
    } else {
      form.template_id = "";
    }
    await onboarding(form);

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.complete_onboarding = true;
      localStorage.setItem("user", JSON.stringify(user));
    }

    router.push({ name: "dashboard-client" });
  } catch (e) {
    console.error("Onboarding failed:", e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden font-sans bg-[#E7D2CB]"
  >
    <!-- Left Form Section -->
    <div
      class="w-full md:w-1/2 p-6 md:px-12 md:py-8 bg-[#E7D2CB] text-[#3e3a35] flex flex-col md:h-screen md:overflow-hidden"
    >
      <div class="flex items-center gap-2 mb-8">
        <span class="text-xl font-bold">WedPlan</span>
      </div>

      <div class="w-full max-w-lg mx-auto flex-1 flex flex-col min-h-0">
        <!-- Progress -->
        <div
          class="mb-10 text-xs font-semibold tracking-widest text-[#7a6b63] uppercase"
        >
          <div class="flex justify-between mb-2">
            <span>Step {{ step }} of 4</span>
          </div>
          <div
            class="flex justify-between font-bold text-sm text-[#3e3a35] mb-2"
          >
            <span>{{ stepTitles[step - 1] }}</span>
            <span>{{ step * 25 }}%</span>
          </div>
          <div class="w-full h-1 bg-[#D8C2BB] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#A27A68] transition-all duration-300"
              :style="{ width: `${step * 25}%` }"
            ></div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-6 custom-scrollbar pr-2">
          <!-- Step 1 -->
          <div v-if="step === 1" class="animate-fade-in pl-2">
            <h1 class="text-3xl lg:text-4xl font-serif mb-2 leading-tight">
              Let's start with<br />your names.
            </h1>
            <p class="text-[#6c615a] mb-8 text-sm">
              We're excited to help you plan your big day! Who is tying the
              knot?
            </p>

            <div class="mb-4">
              <label class="block text-xs font-bold uppercase mb-2"
                >Your Role</label
              >
              <select
                v-model="form.creator_role"
                class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
              >
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-xs font-bold uppercase mb-2"
                >Bride's Name</label
              >
              <input
                v-model="form.bride_name"
                type="text"
                placeholder="Enter full name"
                class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
              />
            </div>
            <div class="mb-4">
              <label class="block text-xs font-bold uppercase mb-2"
                >Groom's Name</label
              >
              <input
                v-model="form.groom_name"
                type="text"
                placeholder="Enter full name"
                class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
              />
            </div>
            <div class="mb-8">
              <label class="block text-xs font-bold uppercase mb-2"
                >Partner's Email</label
              >
              <input
                v-model="form.partner_email"
                type="email"
                placeholder="Enter partner's email"
                class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
              />
            </div>
          </div>

          <!-- Step 2 -->
          <div v-if="step === 2" class="animate-fade-in pl-2">
            <h1 class="text-4xl font-serif mb-2">Tell us the details</h1>
            <p class="text-[#6c615a] mb-8 text-sm">
              Where and when the magic is happen?
            </p>

            <div class="flex gap-4 mb-4">
              <div class="w-1/2">
                <label class="block text-xs font-bold uppercase mb-2"
                  >Wedding Date</label
                >
                <input
                  v-model="form.wedding_date"
                  type="date"
                  class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
                />
              </div>
              <div class="w-1/2">
                <label class="block text-xs font-bold uppercase mb-2"
                  >City</label
                >
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="e.g. Bali, Indonesia"
                  class="w-full p-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
                />
              </div>
            </div>

            <div class="flex items-center justify-between mt-6 mb-2">
              <label class="block text-xs font-bold uppercase">Venue</label>
              <span class="text-[10px] bg-[#D8C2BB] px-2 py-1 rounded"
                >Multiple venue supported</span
              >
            </div>

            <div
              v-for="(v, idx) in form.venue"
              :key="idx"
              class="bg-[#F2E5DD]/50 rounded-xl p-4 mb-4 border border-[#D8C2BB] border-dashed relative"
            >
              <button
                v-if="form.venue.length > 1"
                @click="removeVenue(idx)"
                class="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              <div class="mb-3">
                <label class="block text-[10px] font-bold uppercase mb-1"
                  >Venue Name</label
                >
                <input
                  v-model="v.place_name"
                  type="text"
                  placeholder="e.g. Grand Plaza Hotel"
                  class="w-full p-3 rounded shadow-sm border-none text-sm bg-white outline-none focus:ring-2 focus:ring-[#A27A68]"
                />
              </div>
              <div class="mb-3">
                <label class="block text-[10px] font-bold uppercase mb-1"
                  >Address</label
                >
                <input
                  v-model="v.address"
                  type="text"
                  placeholder="123 Wedding Lane"
                  class="w-full p-3 rounded shadow-sm border-none text-sm bg-white outline-none focus:ring-2 focus:ring-[#A27A68]"
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase mb-1"
                  >Description (Optional)</label
                >
                <input
                  v-model="v.description"
                  type="text"
                  placeholder="e.g. For the ceremony and cocktail hour"
                  class="w-full p-3 rounded shadow-sm border-none text-sm bg-white outline-none focus:ring-2 focus:ring-[#A27A68]"
                />
              </div>
            </div>

            <button
              @click="addVenue"
              class="w-full py-4 rounded-xl border border-[#A27A68] text-[#A27A68] border-dashed flex justify-center items-center gap-2 hover:bg-[#D8C2BB]/30 transition mb-8 text-sm font-semibold"
            >
              <span>+ Add Another Venue</span>
            </button>
          </div>

          <!-- Step 3 -->
          <div v-if="step === 3" class="animate-fade-in pl-2">
            <h1 class="text-4xl font-serif mb-2">Set your budget goal</h1>
            <p class="text-[#6c615a] mb-8 text-sm">
              Establishing a clear budget is the first step to a stress-free
              wedding. We'll help you stick to it.
            </p>

            <div class="mb-8 relative">
              <label class="block text-xs font-bold uppercase mb-2"
                >Estimated Total Budget</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#A27A68]"
                  >Rp</span
                >
                <input
                  v-model="displayBudget"
                  @input="onBudgetInput"
                  type="text"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-5 font-bold text-2xl rounded-xl shadow-sm border-none focus:ring-2 focus:ring-[#A27A68] bg-white outline-none"
                />
              </div>
              <p class="text-[10px] text-[#6c615a] mt-2">
                Don't worry you can always change this later in your settings
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div v-if="step === 4" class="animate-fade-in pl-2">
            <div class="flex flex-col items-center mb-8">
              <div
                class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4"
              >
                <svg
                  class="w-8 h-8 text-[#A27A68]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-center">
                Use our expert wedding<br />checklist template?
              </h2>

              <label class="flex items-center cursor-pointer mt-4">
                <div class="relative">
                  <input
                    type="checkbox"
                    class="sr-only"
                    v-model="useTemplate"
                  />
                  <div
                    class="block w-14 h-8 rounded-full shadow-inner"
                    :class="useTemplate ? 'bg-[#A27A68]' : 'bg-gray-200'"
                  ></div>
                  <div
                    class="dot w-6 h-6 rounded-full absolute top-1 left-1 transition"
                    :class="
                      useTemplate
                        ? 'transform translate-x-6 bg-white'
                        : 'bg-[#A27A68]'
                    "
                  ></div>
                </div>
              </label>
            </div>

            <div
              v-if="useTemplate"
              class="bg-white/80 p-6 rounded-2xl shadow-sm mb-8 space-y-4 font-medium text-sm text-[#6c615a]"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-[#A27A68] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  /></svg
                >Book Venue
              </div>
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-[#A27A68] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  /></svg
                >Hire Photographer
              </div>
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-[#A27A68] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  /></svg
                >Draft Guest List
              </div>
              <div class="flex items-center gap-3 opacity-50">
                <svg
                  class="w-5 h-5 text-[#A27A68] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  /></svg
                >Send Save-the-Dates
              </div>
              <div class="flex items-center gap-3 opacity-50">
                <svg
                  class="w-5 h-5 text-[#A27A68] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  /></svg
                >Select Attire
              </div>
            </div>
          </div>
        </div>

        <!-- Footers -->
        <div class="pt-6 border-t border-[#D8C2BB]">
          <button
            v-if="step < 4"
            :disabled="!isCurrentStepValid"
            @click="nextStep"
            :class="
              isCurrentStepValid
                ? 'bg-[#A27A68] hover:bg-[#8e6b5a]'
                : 'bg-[#D8C2BB] text-[#7a6b63] opacity-60 cursor-not-allowed'
            "
            class="w-full py-4 rounded-xl text-white font-bold transition mb-4 shadow-md flex justify-center items-center gap-2"
          >
            Continue <span>→</span>
          </button>
          <button
            v-else
            :disabled="loading || !isCurrentStepValid"
            @click="finishSetup"
            :class="
              !loading && isCurrentStepValid
                ? 'bg-[#A27A68] hover:bg-[#8e6b5a]'
                : 'bg-[#D8C2BB] text-[#7a6b63] opacity-60 cursor-not-allowed'
            "
            class="w-full py-4 rounded-xl text-white font-bold transition mb-4 shadow-md flex justify-center items-center gap-2"
          >
            Finish Setup
            <span v-if="loading" class="animate-spin ml-2">...</span>
          </button>

          <button
            v-if="step > 1"
            @click="prevStep"
            class="w-full py-2 text-sm text-[#6c615a] hover:text-[#3e3a35] transition"
          >
            ← Previous Step
          </button>
        </div>
      </div>
    </div>

    <!-- Right Illustration Section -->
    <div
      class="hidden md:flex md:w-1/2 md:h-screen bg-[#FCF3ED] items-center justify-center p-12 relative overflow-hidden"
    >
      <!-- Kept empty as per user request to give space updatable manually later. Just subtle background shapes -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-[#F5E6DC] rounded-full -translate-y-1/3 translate-x-1/3"
      ></div>
      <div
        class="absolute bottom-20 left-20 w-32 h-32 bg-[#F5E6DC] rounded-full"
      ></div>

      <div class="z-10 text-center text-[#8e6b5a]">
        <!-- Placeholder for Future Graphics -->
        <div
          class="h-64 w-64 rounded-3xl mb-8 flex border-2 border-dashed border-[#d8c2bb] items-center justify-center m-auto relative bg-[#FCF3ED]/50 overflow-hidden"
        >
          <span class="text-sm font-semibold opacity-60 z-10"
            >Illustration Space</span
          >
          <!-- You can replace this div with an actual image tag like:
               <img v-if="step === 1" src="@/assets/images/step1.png" class="absolute inset-0 w-full h-full object-cover" /> -->
        </div>

        <p v-if="step === 1" class="font-serif italic text-3xl opacity-80">
          "Together is a beautiful place<br />to be."
        </p>
        <p v-if="step === 2" class="font-serif italic text-3xl mb-2 opacity-80">
          Save the Date
        </p>
        <p v-if="step === 2" class="text-sm px-12 opacity-70 font-medium">
          Let's lock in the details so we can start building your perfect
          timeline.
        </p>
        <p v-if="step === 3" class="font-serif italic text-3xl mb-2 opacity-80">
          Smart Allocation
        </p>
        <p v-if="step === 3" class="text-sm px-12 opacity-70 font-medium">
          We'll help you break down this amount into vendor categories.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #a27a68 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #a27a68;
  border-radius: 10px;
  opacity: 0.5;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #8e6b5a;
}
</style>
