import { type Menu } from "@/stores/menu";

const menu: Array<Menu | "divider"> = [
  {
    icon: "Home",
    pageName: "dashboard-client",
    title: "Dashboard",
  },
  {
    icon: "Calendar",
    pageName: "timeline-client",
    title: "Timeline",
  },
  {
    icon: "DollarSign",
    pageName: "budget-tracker-client",
    title: "Budget",
  },
  {
    icon: "PiggyBank",
    pageName: "saving-client",
    title: "Saving",
  },
  "divider",
  {
    icon: "User",
    pageName: "profile-client",
    title: "Profile",
  },
];

export default menu;
