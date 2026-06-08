import type { App } from "vue";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "@/router";
import { toast } from "vue3-toastify";
import HandlerService from "@/core/services/HandlerService";
import { useAuthStore } from "@/stores/auth";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  failedQueue = [];
};
export default class ApiService {
  public static vueInstance: App;

  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.setDefaultConfig();
    ApiService.setDefaultHeaders();
    ApiService.setInterceptor();
  }

  public static async get<Response = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return ApiService.vueInstance.axios.get(url, config);
  }

  public static async patch<Request = any, Response = any>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return ApiService.vueInstance.axios.patch(url, data, config);
  }

  public static put<Request = any, Response = any>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return ApiService.vueInstance.axios.put(url, data, config);
  }

  public static async post<Request = any, Response = any>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return ApiService.vueInstance.axios.post(url, data, config);
  }

  public static delete<Response = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<Response>> {
    return ApiService.vueInstance.axios.delete(url, config);
  }

  private static setDefaultHeaders(): void {
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  private static setDefaultConfig(): void {
    let baseUrl = import.meta.env.VITE_APP_API_URL;
    if (!baseUrl) {
      throw new Error("Base url is not set");
    }
    ApiService.vueInstance.axios.defaults.baseURL = baseUrl;
    ApiService.vueInstance.axios.defaults.withCredentials = true;
  }

  private static setInterceptor(): void {
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        if (response.status >= 200 && response.status < 300) {
          localStorage.removeItem("errors");
          return Promise.resolve(response);
        } else {
          return Promise.reject(response);
        }
      },
      async (error) => {
        console.log("err", error.response);

        if (!error.response) {
          toast.error(
            '<h1 style="font-weight:bold">Connection Error</h1><span>Cannot connect to the server. Please make sure the backend is running.</span>',
            { dangerouslyHTMLString: true },
          );
          return Promise.reject(error);
        } else if (error.response.status === 401) {
          const originalRequest = error.config;
          console.log("originalRequest", originalRequest);

          // Kalau 401 ketika login, berarti user belum ada atau credential salah

          if (originalRequest.url?.includes("login")) {
            return toast.error(error.response.data.message);
          }

          // Kalau refresh request itu sendiri yang 401 → jangan loop
          if (originalRequest.url?.includes("/auth/refresh")) {
            const { setUnauthenticated } = useAuthStore();
            setUnauthenticated();
            return Promise.reject(error);
          }

          if (originalRequest._retry) {
            // Sudah dicoba refresh tapi masih 401 → logout
            const { setUnauthenticated } = useAuthStore();
            setUnauthenticated();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            // Refresh sedang berjalan → queue request ini, tunggu token baru
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return ApiService.vueInstance.axios(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const { data } = await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/token/refresh`,
              {},
              { withCredentials: true },
            );

            const newToken: string = data.access_token;

            // Simpan token baru
            localStorage.setItem("access_token", newToken);
            ApiService.vueInstance.axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;

            // Selesaikan semua request yang tertahan
            processQueue(null, newToken);

            // Retry request original dengan token baru
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return ApiService.vueInstance.axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            const { setUnauthenticated } = useAuthStore();
            setUnauthenticated(); // clear localStorage + redirect /login
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else if (error.response.status == 404) {
          toast.error(
            "DATA NOT FOUND, THIS TOASTER IS TEMPORARY FOR DEVELOPMENT PURPOSE",
          );
          // await router.push({name: "error-page", params:{type: "404"}});
        } else if (error.response.status == 422) {
          console.log("err2", error.response.data);

          toast.error(error.response.data.message);
          //   await router.push({ name: "error-page", params: { type: "422" } });
        } else if (
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          console.log("err1", error);

          if (error?.response?.data?.rc === "ERR_ACTION_UNAUTHORIZED") {
            await router.push({ name: "error-page", params: { type: "403" } });
          }
          await HandlerService.responseFailed(error);
        }

        return Promise.reject(error);
      },
    );
  }
}
