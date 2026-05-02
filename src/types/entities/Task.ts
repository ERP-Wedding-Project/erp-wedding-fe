import type ITaskCategory from "./TaskCategory";
import type IUser from "./User";
import type IProject from "./Project";
import type IExpense from "./Expense";

export default interface ITask {
  id: number;
  assignee_ids?: number[];
  project_id: number;
  task_category_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  task_category?: ITaskCategory;
  assignees?: IUser[];
  project?: IProject;
  expense?: IExpense;
}

