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
import type IExpense from "@/types/entities/Expense";
import { refreshActiveProject } from "@/core/helpers/utils";

export type FormExpense = {
  expense_category_id: number;
  description: string;
  amount: number;
  task_id: number | null;
};

export default function useExpenseApi() {
  const responseError = ref<ResponseError | null>(null);

  const createExpense = async (request: {
    projectCode: string;
    payload: FormExpense;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.post<FormExpense, ResponseData>(
        `projects/${request.projectCode}/expenses`,
        request.payload,
      );
      await HandlerService.responseSuccess(response);
      await refreshActiveProject();
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const updateExpense = async (request: {
    projectCode: string;
    expenseId: number;
    payload: FormExpense;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.put<FormExpense, ResponseData>(
        `projects/${request.projectCode}/expenses/${request.expenseId}`,
        request.payload,
      );
      await HandlerService.responseSuccess(response);
      await refreshActiveProject();
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const deleteExpense = async (request: {
    projectCode: string;
    expenseId: number;
  }) => {
    try {
      loadingBlock();
      const response = await ApiService.delete<ResponseData>(
        `projects/${request.projectCode}/expenses/${request.expenseId}`,
      );
      await HandlerService.responseSuccess(response);
      await refreshActiveProject();
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const getListExpense = async (projectCode: string, params?: any) => {
    try {
      loadingBlock();
      const response = await ApiService.get<
        ResponseDataCollectionWithoutPagination<IExpense>
      >(`projects/${projectCode}/expenses`, {
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
    createExpense,
    updateExpense,
    deleteExpense,
    getListExpense,
    responseError,
  };
}
