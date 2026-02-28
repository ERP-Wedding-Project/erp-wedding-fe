import {toast} from "vue3-toastify";
import type {AxiosError, AxiosResponse} from "axios";
import type {ResponseError, ResponseData} from "@/types/response";
import type {Ref} from "vue";

export default class HandlerService {
    public static async responseSuccess(response: AxiosResponse<ResponseData>) {
        toast.success(`<h1 style="font-weight: bold">${response.data.code}</h1><span>${response.data.message}</span>`, {
            "dangerouslyHTMLString": true
        });
    }

    public static async responseFailed(response: AxiosError<ResponseError>) {
        toast.error(`<h1 style="font-weight: bold">${response.response?.data.code}</h1><span>${response.response?.data.message}</span>`, {
            "dangerouslyHTMLString": true
        });
    }

    public static async responseError(error: AxiosError<ResponseError>, responseError: Ref<ResponseError|null>) {
        responseError.value = error.response?.data ?? null
    }
}