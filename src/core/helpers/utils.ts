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
