import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseError,
  ResponseSingleData,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export type FormOnboarding = {
  wedding_date: string;
  groom_name: string;
  bride_name: string;
  city: string;
  creator_role: string;
  total_budget: number;
  template_id: string;
  venue: Array<{
    place_name: string;
    address: string;
    description: string;
  }>;
  partner_email: string;
  avatar: File | any;
};
export interface FormError {
  wedding_date: string | null;
  groom_name: string | null;
  bride_name: string | null;
  city: string | null;
  creator_role: string | null;
  total_budget: number | null;
  template_id: string | null;
  venue: Array<{
    place_name: string | null;
    address: string | null;
    description: string | null;
  }>;
  partner_email: string | null;
  avatar: File | any;
}

export default function useClientOnboardingApi() {
  const responseError = ref<ResponseError | null>(null);
  const onboarding = async (request: FormOnboarding) => {
    try {
      loadingBlock();
      const formData = new FormData();
      formData.append("wedding_date", request.wedding_date);
      formData.append("groom_name", request.groom_name);
      formData.append("bride_name", request.bride_name);
      formData.append("city", request.city);
      formData.append("creator_role", request.creator_role);
      formData.append("total_budget", request.total_budget.toString());
      if (request.template_id) {
        formData.append("template_id", request.template_id);
      }
      if (request.avatar) {
        formData.append("avatar", request.avatar);
      }
      if (request.partner_email) {
        formData.append("partner_email", request.partner_email);
      }

      request.venue.forEach((v, index) => {
        formData.append(`venue[${index}][place_name]`, v.place_name);
        formData.append(`venue[${index}][address]`, v.address);
        if (v.description) {
          formData.append(`venue[${index}][description]`, v.description);
        }
      });

      const response = await ApiService.post<
        FormData,
        ResponseDataCollectionWithoutPagination<any>
      >("/profile/onboarding", formData);
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  return {
    onboarding,
    responseError,
  };
}
