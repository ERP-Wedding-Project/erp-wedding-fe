import {loadingBlock, loadingUnBlock} from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
    ResponseData,
    ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import {ref} from "vue";
import {refreshActiveProject} from "@/core/helpers/utils";

export interface IFormRequestProfile {
    name: string;
    email: string;
    avatar: string | null;
}

export interface IFormChangePasswordRequestProfile {
    current_password: string | null;
    password: string;
    password_confirmation: string;
}

export default function useProfileApi() {
    const responseError = ref<ResponseError | null>(null);
    const profile = ref<any>(null);

    const updateProfile = async (request: IFormRequestProfile) => {
        try {
            loadingBlock();
            const response = await ApiService.post<IFormRequestProfile, ResponseData>(
                `profile/update`,
            );
            profile.value = response.data;

            await HandlerService.responseSuccess(response);
            await refreshActiveProject();
        } catch (e: any) {
            await HandlerService.responseError(e, responseError);
            throw e;
        } finally {
            loadingUnBlock();
        }
    };

    const updatePassword = async (request: IFormChangePasswordRequestProfile) => {
        try {
            loadingBlock();
            const response = await ApiService.post<IFormChangePasswordRequestProfile, ResponseData>(
                'profile/update-password',
            );
            profile.value = response.data;

            await HandlerService.responseSuccess(response);
        } catch (e: any) {
            await HandlerService.responseError(e, responseError);
            throw e;
        } finally {
            loadingUnBlock();
        }
    }


    return {
        updateProfile,
        updatePassword,
        profile,
        responseError,
    };
}
