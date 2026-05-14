export const formatCurrency = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num).replace("Rp", "Rp ");
};

export const formatDate = (date: string, format: string = "D MMM, YYYY") => {
  if (!date) return "-";
  // Assuming dayjs is available globally or we import it where needed
  return date; 
};

export const allowOnlyNumbers = (event: KeyboardEvent) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
};

/**
 * Silently re-fetches the active project from the API and updates localStorage.
 * Call this after any Create, Update, or Delete operation so that
 * cached project data (e.g. totals, counters) stays in sync with the backend.
 */
export const refreshActiveProject = async () => {
  try {
    const raw = localStorage.getItem("activeProject");
    if (!raw) return;

    const activeProject = JSON.parse(raw);
    const code = activeProject?.code;
    if (!code) return;

    // Dynamic import to avoid circular dependency issues
    const { default: useProjectApi } = await import("@/api/client/ProjectApi");
    const { getDetailProject } = useProjectApi();

    const response = await getDetailProject(code);
    const freshProject = response?.payload?.data;

    if (freshProject) {
      localStorage.setItem("activeProject", JSON.stringify(freshProject));
    }
  } catch (_) {
    // Fail silently – this is a background sync, not critical
  }
};
