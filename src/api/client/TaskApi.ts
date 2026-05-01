import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseData,
  ResponseDataCollectionWithoutPagination,
  ResponseError,
  ResponseSingleData,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";
import type ITask from "@/types/entities/Task";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export type FormTask = {
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assignee_ids: number[];
  task_category_id: number | null;
};

export interface FormTaskError {
  title: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  assignee_ids: string | null;
  task_category_id: string | null;
}

export default function useTaskApi() {
  const responseError = ref<ResponseError | null>(null);

  const formatTaskPayload = (payload: Partial<FormTask>) => {
    const formatted = { ...payload };
    if (formatted.due_date) {
      const parsedDate = dayjs(formatted.due_date, ["D MMM, YYYY", "YYYY-MM-DD"], true);
      if (parsedDate.isValid()) {
        formatted.due_date = parsedDate.format("YYYY-MM-DD HH:mm:ss");
      }
    }
    return formatted;
  };

  const createTask = async (request: {
    projectCode: string;
    payload: FormTask;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.post<FormTask, ResponseData>(
        `projects/${request.projectCode}/tasks`,
        formatTaskPayload(request.payload) as FormTask,
      );
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const getListTask = async (projectCode: string, params?: any) => {
    try {
      loadingBlock();
      const response = await ApiService.get<
        ResponseDataCollectionWithoutPagination<ITask>
      >(`projects/${projectCode}/tasks`, {
        params: {
          include: "task_category,assignees",
          show_all: 1,
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

  const updateTask = async (request: {
    projectCode: string;
    taskId: number;
    payload: Partial<FormTask>;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.put<Partial<FormTask>, ResponseData>(
        `projects/${request.projectCode}/tasks/${request.taskId}`,
        formatTaskPayload(request.payload),
      );
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const deleteTask = async (request: {
    projectCode: string;
    taskId: number;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.delete<ResponseData>(
        `projects/${request.projectCode}/tasks/${request.taskId}`,
      );
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const getTaskDetail = async (projectCode: string, taskId: number) => {
    try {
      loadingBlock();
      const response = await ApiService.get<ResponseSingleData<ITask>>(
        `projects/${projectCode}/tasks/${taskId}?include=task_category,assignees`,
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
    createTask,
    getListTask,
    getTaskDetail,
    updateTask,
    deleteTask,
    responseError,
  };
}
