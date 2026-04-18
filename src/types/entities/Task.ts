import type ITaskCategory from "./TaskCategory";

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
  assignees?: any[];
}
