import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export default function useProjectApi() {
  const responseError = ref<ResponseError | null>(null);

  const getListProject = async () => {
    try {
      loadingBlock();
      const response = await ApiService.get<
        ResponseDataCollectionWithoutPagination<any>
      >("projects?include=users&include=budget_summary");

      return response.data;
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };
  const getDetailProject = async (code: string) => {
    try {
      loadingBlock();
      const response = await ApiService.get<ResponseSingleData<any>>(
        `projects/${code}?include=users&include=budget_summary`,
      );

      return response.data;
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  return {
    getListProject,
    getDetailProject,
    // responseError,
  };
}
