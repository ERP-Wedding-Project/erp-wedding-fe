import { computed } from "vue";
import type IUser from "@/types/entities/User";

export default function useLocalUser() {
  const user = computed<IUser | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as IUser) : null;
    } catch {
      return null;
    }
  });

  const userId = computed(() => user.value?.id ?? null);
  const userName = computed(() => user.value?.name ?? "");
  const userEmail = computed(() => user.value?.email ?? "");
  const userAvatar = computed(() => user.value?.avatar ?? null);
  const userRoles = computed(() => user.value?.list_roles ?? []);
  const userPermissions = computed(() => user.value?.list_permissions ?? []);

  return {
    user,
    userId,
    userName,
    userEmail,
    userAvatar,
    userRoles,
    userPermissions,
  };
}
