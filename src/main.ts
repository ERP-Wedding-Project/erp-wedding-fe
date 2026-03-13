import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import ApiService from "@/core/services/ApiService";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import GoogleSignInPlugin from "vue3-google-signin";

const app = createApp(App);
const pinia = createPinia();

app.use(createPinia());
app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 5000,
} as ToastContainerOptions);
ApiService.init(app);
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount("#app");
