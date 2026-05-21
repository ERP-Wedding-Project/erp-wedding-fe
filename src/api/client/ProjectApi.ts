import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
  ResponseData,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export interface IFormInviteCollaborator {
  email: string;
}

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

  const inviteCollaborator = async (code: string, request: IFormInviteCollaborator) => {
    try {
      loadingBlock();
      const response = await ApiService.post<IFormInviteCollaborator, ResponseData>(
        `projects/${code}/invite`,
        request
      );

      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw e;
    } finally {
      loadingUnBlock();
    }
  }

  return {
    getListProject,
    getDetailProject,
    inviteCollaborator,
    // responseError,
  };
}
