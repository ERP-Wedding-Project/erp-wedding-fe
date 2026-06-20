<script setup lang="ts">
import Table from "@/components/Base/Table";
import Lucide from "@/components/Base/Lucide";
import { onMounted, ref, computed, watch } from "vue";
import useProjectApi from "@/api/client/ProjectApi";
import { formattedDate } from "@/core/helpers/utils";
import Pagination from "@/components/Base/Pagination";
import { toast } from "vue3-toastify";
import useActiveProject from "@/composable/useActiveProject";
import PageHeader from "@/components/Base/PageHeader/PageHeader.vue";
import InviteCollaboratorModal from "@/components/Collaborator/InviteCollaboratorModal.vue";

const { getListInvitations, resendInvitation, inviteCollaborator } =
  useProjectApi();
const invitations = ref<any[]>([]);
const searchKey = ref<string>("");

const { activeProject } = useActiveProject();
const isInviteModalOpen = ref(false);
// console.log();

// Pagination state
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(10);

const fetchInvitations = async (page: number = 1) => {
  currentPage.value = page;
  try {
    const response = await getListInvitations({ page });

    if (response?.payload?.data) {
      invitations.value = response.payload.data;
      if (response.payload.meta) {
        currentPage.value = response.payload.meta.current_page || 1;
        totalPages.value = response.payload.meta.last_page || 1;
        totalItems.value = response.payload.meta.total || 0;
        perPage.value = response.payload.meta.per_page || 10;
      }
    }
  } catch (error) {
    // handled by api interceptor
  }
};

const submitInvite = async (data: { role: string; identifiers: string[] }) => {
  if (!activeProject.value?.code) {
    toast.error("No active project selected. Please select a project first.");
    return;
  }
  try {
    for (const email of data.identifiers) {
      await inviteCollaborator(activeProject.value.code, { email });
    }
    isInviteModalOpen.value = false;
    await fetchInvitations(currentPage.value);
  } catch (error) {
    // handled by api interceptor
  }
};

const handleResend = async (invitation: any) => {
  if (!invitation.project?.code) {
    invitation.project = {};
    invitation.project.code = activeProject.value?.code;
  }

  if (!invitation.project?.code || !invitation.id) return;
  try {
    await resendInvitation(invitation.project.code, invitation.id);
    await fetchInvitations(currentPage.value);
  } catch (error) {
    // handled by api interceptor
  }
};

watch(activeProject, () => {
  fetchInvitations(1);
});

onMounted(async () => {
  await fetchInvitations();
});

const filteredData = computed(() => {
  const lowerCaseSearchKey = searchKey.value.toLowerCase();
  if (!searchKey.value) return invitations.value;

  return invitations.value.filter((inv) => {
    return (
      inv.email?.toLowerCase().includes(lowerCaseSearchKey) ||
      inv.project?.name?.toLowerCase().includes(lowerCaseSearchKey) ||
      inv.inviter?.name?.toLowerCase().includes(lowerCaseSearchKey)
    );
  });
});
</script>

<template>
  <div class="py-5 relative">
    <PageHeader
      :breadcrumbs="[{ label: 'Home', url: '#' }, { label: 'Collaborator' }]"
    >
      <template #title>Collaborator<br />Invitations</template>
    </PageHeader>

    <div class="grid grid-cols-12 gap-6 mt-6 box p-5">
      <div
        class="flex flex-wrap items-center justify-between col-span-12 intro-y gap-4"
      >
        <button
          @click="isInviteModalOpen = true"
          class="px-4 py-2.5 bg-primary text-white font-bold text-[13px] rounded-lg shadow-sm hover:bg-primary/90 flex items-center transition-colors"
        >
          <Lucide icon="Plus" class="w-4 h-4 mr-1.5" /> Invite Collaborator
        </button>
        <div
          class="relative w-full sm:w-auto flex-1 sm:flex-initial flex justify-end"
        >
          <Lucide
            icon="Search"
            class="w-4 h-4 absolute my-auto inset-y-0 left-0 ml-3 text-slate-500"
          />
          <input
            type="text"
            v-model="searchKey"
            placeholder="Search email or project..."
            class="form-control w-full sm:w-64 box pl-10 py-2.5 rounded-lg border-slate-200 shadow-sm"
          />
        </div>
      </div>

      <div class="col-span-12 overflow-x-auto intro-y mt-2">
        <Table class="border-spacing-y-[10px] border-separate -mt-2">
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                class="border-b-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300"
                >No</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300"
                >Email</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300"
                >Project</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300"
                >Inviter</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-300"
                >Status</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300"
                >Date</Table.Th
              >
              <Table.Th
                class="border-b-0 whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-300"
                >Action</Table.Th
              >
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="filteredData.length === 0" class="intro-x">
              <Table.Td
                colspan="7"
                class="text-center py-8 text-slate-500 font-medium bg-white dark:bg-darkmode-600 rounded-md shadow-sm"
              >
                No invitations found
              </Table.Td>
            </Table.Tr>
            <Table.Tr
              v-for="(invitation, key) in filteredData"
              :key="invitation.id"
              class="intro-x group hover:bg-slate-50 dark:hover:bg-darkmode-400 transition-colors"
            >
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              >
                <div class="text-slate-500 font-medium">
                  {{ (currentPage - 1) * perPage + key + 1 }}
                </div>
              </Table.Td>
              <Table.Td
                class="bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              >
                <div
                  class="whitespace-nowrap font-bold text-slate-700 dark:text-slate-200"
                >
                  {{ invitation.email || "-" }}
                </div>
              </Table.Td>
              <Table.Td
                class="bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              >
                <div
                  class="whitespace-nowrap font-medium text-slate-600 dark:text-slate-300"
                >
                  {{ invitation.project?.name || "-" }}
                </div>
                <div
                  class="text-xs text-slate-500 mt-0.5 font-bold"
                  v-if="invitation.project?.code"
                >
                  Code : {{ invitation.project.code }}
                </div>
              </Table.Td>
              <Table.Td
                class="bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              >
                <div
                  class="whitespace-nowrap font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2"
                >
                  <div
                    class="w-6 h-6 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200"
                  >
                    <Lucide icon="User" class="w-3 h-3 text-slate-400" />
                  </div>
                  {{ invitation.inviter?.name || "-" }}
                </div>
              </Table.Td>
              <Table.Td
                class="bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-center"
              >
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-[11px] font-extrabold uppercase shadow-sm border',
                    invitation.status === 'PENDING'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : invitation.status === 'ACCEPTED'
                        ? 'bg-success/10 text-success border-success/20'
                        : invitation.status === 'REJECTED'
                          ? 'bg-danger/10 text-danger border-danger/20'
                          : 'bg-slate-100 text-slate-500 border-slate-200',
                  ]"
                >
                  {{ invitation.status || "UNKNOWN" }}
                </span>
              </Table.Td>
              <Table.Td
                class="bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
              >
                <div
                  class="whitespace-nowrap text-slate-500 text-[13px] font-medium flex items-center"
                >
                  <Lucide icon="Calendar" class="w-3.5 h-3.5 mr-1.5" />
                  {{
                    invitation.created_at
                      ? formattedDate(invitation.created_at)
                      : "-"
                  }}
                </div>
              </Table.Td>
              <Table.Td
                class="last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-center w-32"
              >
                <button
                  v-if="invitation.status === 'PENDING'"
                  @click="handleResend(invitation)"
                  class="mx-auto text-primary hover:text-primary/80 text-[12px] font-extrabold flex items-center justify-center gap-1.5 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg"
                >
                  <Lucide icon="Send" class="w-3.5 h-3.5" /> Resend
                </button>
                <span v-else class="text-slate-400 text-xs font-bold">-</span>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      <!-- Footer pagination -->
      <div
        v-if="totalPages > 1"
        class="flex flex-wrap items-center col-span-12 mt-6 intro-y sm:flex-row sm:flex-nowrap justify-between gap-4 w-full"
      >
        <Pagination class="w-full sm:w-auto">
          <Pagination.Link
            :disabled="currentPage === 1"
            @click="currentPage > 1 && fetchInvitations(1)"
          >
            <Lucide icon="ChevronsLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link
            :disabled="currentPage === 1"
            @click="currentPage > 1 && fetchInvitations(currentPage - 1)"
          >
            <Lucide icon="ChevronLeft" class="w-4 h-4" />
          </Pagination.Link>

          <template v-for="page in totalPages" :key="page">
            <Pagination.Link
              v-if="Math.abs(page - currentPage) < 3"
              :active="page === currentPage"
              @click="fetchInvitations(page)"
            >
              {{ page }}
            </Pagination.Link>
          </template>

          <Pagination.Link
            :disabled="currentPage === totalPages"
            @click="
              currentPage < totalPages && fetchInvitations(currentPage + 1)
            "
          >
            <Lucide icon="ChevronRight" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link
            :disabled="currentPage === totalPages"
            @click="currentPage < totalPages && fetchInvitations(totalPages)"
          >
            <Lucide icon="ChevronsRight" class="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
        <div class="text-[13px] font-bold text-slate-400">
          Showing {{ (currentPage - 1) * perPage + 1 }} to
          {{ Math.min(currentPage * perPage, totalItems) }} of
          {{ totalItems }} entries
        </div>
      </div>
      <div
        v-else
        class="flex flex-wrap items-center col-span-12 mt-6 intro-y sm:flex-row sm:flex-nowrap justify-end gap-4 w-full"
      >
        <div class="text-[13px] font-bold text-slate-400">
          Showing {{ filteredData.length }} entries
        </div>
      </div>
    </div>
  </div>

  <InviteCollaboratorModal
    :open="isInviteModalOpen"
    @close="isInviteModalOpen = false"
    @submit="submitInvite"
  />
</template>

<style scoped></style>
