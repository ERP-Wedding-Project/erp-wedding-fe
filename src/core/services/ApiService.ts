import type {App} from "vue";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "@/router";
import {toast} from "vue3-toastify";
import HandlerService from "@/core/services/HandlerService";
import {useAuthStore} from "@/stores/auth";

export default class ApiService {
    public static vueInstance: App;

    public static init(app: App<Element>) {
        ApiService.vueInstance = app;
        ApiService.vueInstance.use(VueAxios, axios);
        ApiService.setDefaultConfig()
        ApiService.setDefaultHeaders()
        ApiService.setInterceptor();
    }

    public static async get<Response = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Response>> {
        return ApiService.vueInstance.axios.get(url, config);
    }

    public static async patch<Request = any, Response = any>(
        url: string,
        data?: Request,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Response>> {
        return ApiService.vueInstance.axios.patch(url, data, config);
    }

    public static put<Request = any, Response = any>(
        url: string,
        data?: Request,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Response>> {
        return ApiService.vueInstance.axios.put(url, data, config);
    }


    public static async post<Request = any, Response = any>(
        url: string,
        data?: Request,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Response>> {
        return ApiService.vueInstance.axios.post(url, data, config);
    }

    public static delete<Response = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Response>> {
        return ApiService.vueInstance.axios.delete(url, config);
    }


    private static setDefaultHeaders(): void {
        ApiService.vueInstance.axios.defaults.headers.common["Accept"] = "application/json";
    }

    private static setDefaultConfig(): void {
        let baseUrl = import.meta.env.VITE_APP_API_URL
        if (!baseUrl) {
            throw new Error("Base url is not set")
        }
        ApiService.vueInstance.axios.defaults.baseURL = baseUrl
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
                if (!error.response) {
                    await router.replace({
                        path: "/500",
                    });
                } else if (error.response.status == 401) {
                    const {setUnauthenticated} = useAuthStore();
                    setUnauthenticated()
                    toast.error(`<h1 style="font-weight: bold">${error.response.data.code}</h1><span>${error.response.data.message}</span>`, {
                        "dangerouslyHTMLString": true
                    });
                    await router.push({name: "login"});
                } else if (error.response.status == 404) {
                    toast.error("DATA NOT FOUND, THIS TOASTER IS TEMPORARY FOR DEVELOPMENT PURPOSE")
                    // await router.push({name: "error-page", params:{type: "404"}});
                } else if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    if (error?.response?.data?.rc === "ERR_ACTION_UNAUTHORIZED") {
                        await router.push({name: "error-page", params:{type: "403"}});
                    }
                    await HandlerService.responseFailed(error)
                }

                return Promise.reject(error);
            }
        );
    }
}