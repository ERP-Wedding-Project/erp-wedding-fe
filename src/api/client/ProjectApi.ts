import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export default function useProjectApi() {
  const responseError = ref<ResponseError | null>(null);

  const getListProject = async () => {
    try {
      loadingBlock();
      const response =
        await ApiService.get<ResponseDataCollectionWithoutPagination<any>>(
          "projects?include=users",
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
    // responseError,
  };
}
