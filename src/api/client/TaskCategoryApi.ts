import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export type FormTask = {
  user_id: string;
  project_id: string;
  task_category_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
};

export interface FormTaskError {
  user_id: string | null;
  project_id: string | null;
  task_category_id: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
}

export default function useTaskCategoryApi() {
  const responseError = ref<ResponseError | null>(null);

  const getListTaskCategory = async () => {
    try {
      loadingBlock();
      const response =
        await ApiService.get<ResponseDataCollectionWithoutPagination<any>>(
          "tasks/categories",
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
    getListTaskCategory,
    // responseError,
  };
}
