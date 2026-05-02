import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import ApiService from "@/core/services/ApiService";
import type {
  ResponseDataCollectionWithoutPagination,
  ResponseError,
} from "@/types/response";
import HandlerService from "@/core/services/HandlerService";
import { ref } from "vue";
import { type IExpenseCategory } from "@/types/entities/Expense";

export default function useExpenseCategoryApi() {
  const responseError = ref<ResponseError | null>(null);

  const getListExpenseCategory = async (params?: any) => {
    try {
      loadingBlock();
      const response = await ApiService.get<
        ResponseDataCollectionWithoutPagination<IExpenseCategory>
      >(`expenses/categories`, {
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
    getListExpenseCategory,
    responseError,
  };
}
