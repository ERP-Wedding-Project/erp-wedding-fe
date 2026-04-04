import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type { ResponseData, ResponseError } from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";

export type FormTask = {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  user_id: number | null;
  task_category_id: number | null;
};

export interface FormTaskError {
  title: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  user_id: string | null;
  task_category_id: string | null;
}

export default function useTaskApi() {
  const responseError = ref<ResponseError | null>(null);

  const createTask = async (request: {
    projectCode: string;
    payload: FormTask;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.post<FormTask, ResponseData>(
        `projects/ZYY24SGT/tasks`,
        request.payload,
      );
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  return {
    createTask,
    responseError,
  };
}
