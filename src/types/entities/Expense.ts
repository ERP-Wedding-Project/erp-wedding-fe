import type ITask from "./Task";
import type IProject from "./Project";

export interface IExpenseCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default interface IExpense {
  id: number;
  description: string;
  amount: number;
  allocated_amount: number;
  is_paid: string;
  task_id: number;
  project_id: number;
  expense_category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  task?: ITask;
  expense_category?: IExpenseCategory;
  project?: IProject;
}
