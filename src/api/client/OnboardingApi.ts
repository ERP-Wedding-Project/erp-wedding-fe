import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type { ResponseDataCollectionWithoutPagination, ResponseError, ResponseSingleData } from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export type FormOnboarding = {
    wedding_date: string
    groom_name: string
    bride_name: string
    city: string
    creator_role: string
    total_budget: number
    template_id: string
    venue: {
        place_name: string
        address: string
        description: string
    }
    partner_email: string
    avatar: File | any
}
export interface FormError {
    wedding_date: string | null
    groom_name: string | null
    bride_name: string | null
    city: string | null
    creator_role: string | null
    total_budget: number | null
    template_id: string | null
    venue: {
        place_name: string | null
        address: string | null
        description: string | null
    }
    partner_email: string | null
    avatar: File | any
}

export default function useClientOnboardingApi() {
    const responseError = ref<ResponseError | null>(null)
    const onboarding = async (request: FormOnboarding) => {
        ApiService.vueInstance.axios.defaults.headers.common["Accept"] = "application/json";

        try {
            loadingBlock()
            const response = await ApiService.post<FormOnboarding, ResponseDataCollectionWithoutPagination<any>>("/profile/onboarding", request)
            await HandlerService.responseSuccess(response)
        } catch (e: any) {
            await HandlerService.responseError(e, responseError)
            throw new Error(e)
        } finally {
            loadingUnBlock()
        }
    }

    return {
        onboarding,
        responseError,
    }
}