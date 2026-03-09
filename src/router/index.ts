import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/themes";
import demoRoute from "@/router/demo";
import {useAuthStore} from "@/stores/auth";
import ApiService from "@/core/services/ApiService";
import i18n from "@/core/helpers/i18n";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/dashboard",
          name: "dashboard-overview-1",
          component: () => import("../pages/DashboardOverview1.vue"),
        },

          // This is demo route, delete later
          ...demoRoute
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },

    // {
    //   path: "/register",
    //   name: "register",
    //   component: () => import("../pages/Register.vue"),
    // },
    {
      path: "/error-page",
      name: "error-page",
      component: () => import("../pages/ErrorPage.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const {isAuthenticated, getRoles} = useAuthStore();
  const isAuthenticatedAndAllowedToProceed = isAuthenticated();

  const systemAdminHost = import.meta.env.VITE_SYSTEM_ADMIN;
  const currentHost = window.location.host;
  const isSystemAdmin = currentHost === systemAdminHost;
  if (isAuthenticatedAndAllowedToProceed) {
    ApiService.vueInstance.axios.defaults.headers.common["Authorization"] = 'Bearer ' + localStorage.getItem("access_token");
  }
  if (to.meta.pageTitle) {
    const {t} = i18n.global;
    let title = `${t(('menu.' + to.meta.pageTitle) as string)}`;
    title = String(title).charAt(0).toUpperCase() + String(title).slice(1);
    document.title = title.replace("Menu.", "");
  }

  if (to.path === "/"){
    if (isSystemAdmin){
      return next({name: "login-system-admin"});
    }else{
      return next({name: "login"});
    }
  }

  if (to.meta.requiresAuth && !isAuthenticatedAndAllowedToProceed) {
    return next({name: isSystemAdmin ? "login-system-admin" : "login"});
  }

  if (to.name === "login" && isSystemAdmin) {
    return next({name: "login-system-admin"});
  }

  if (to.name === "login-system-admin" && isSystemAdmin && isAuthenticatedAndAllowedToProceed) {
    return next({name: "system-admin-dashboard"});
  }

  if (to.name === "login" && !isSystemAdmin && isAuthenticatedAndAllowedToProceed) {
    if (getRoles().includes("institution-admin")){
      return next({name: "admin-dashboard"});
    }else if(getRoles().includes("educator")){
      return next({name: "educator-dashboard"});
    }else if(getRoles().includes("student")){
      return next({name: "student-dashboard"});
    }
  }

  if (to.name === "login-system-admin" && !isSystemAdmin) {
    return next({name: "login"});
  }

  if (to.meta.guestOnly && isAuthenticatedAndAllowedToProceed) {
    return next({name: "dashboard-overview-1"});
  }

  next();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
