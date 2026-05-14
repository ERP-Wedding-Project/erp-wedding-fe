import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseData,
  ResponseDataCollectionWithoutPagination,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";
import { refreshActiveProject } from "@/core/helpers/utils";

export type FormSaving = {
  type: "SAVING" | "ALLOCATE" | "UNALLOCATE";
  amount: number;
  note: string | null;
  expense_id: number | null;
};

export default function useSavingApi() {
  const responseError = ref<ResponseError | null>(null);

  const createSaving = async (request: {
    projectCode: string;
    payload: FormSaving;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.post<FormSaving, ResponseData>(
        `projects/${request.projectCode}/savings`,
        request.payload,
      );
      await HandlerService.responseSuccess(response);
      await refreshActiveProject();
      return response;
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw e;
    } finally {
      loadingUnBlock();
    }
  };

  const getListSaving = async (projectCode: string, params?: any) => {
    try {
      loadingBlock();
      const response = await ApiService.get<
        ResponseDataCollectionWithoutPagination<any>
      >(`projects/${projectCode}/savings?include=expense`, {
        params: {
          ...params,
        },
      });

      return response.data;
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  return {
    createSaving,
    getListSaving,
    responseError,
  };
}
