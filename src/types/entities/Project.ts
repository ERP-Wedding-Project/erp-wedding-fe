import type IUser from "./User";
import type IVenue from "./Venue";
import type ITask from "./Task";

export interface ITaskProgress {
  pending: number;
  in_progress: number;
  completed: number;
  total: number;
  completion_percentage: number;
}

export interface IBudgetSummary {
  id: number;
  project_id: number;
  total_saved: number;
  total_unallocated: number;
  total_allocated: number;
  total_expense: number;
  shortfall: number;
}

export default interface IProject {
  id: number;
  name: string;
  code: string;
  wedding_date: string;
  bride_name: string;
  groom_name: string;
  city: string;
  total_budget: number;
  user_role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  users?: IUser[];
  venues?: IVenue[];
  tasks?: ITask[];
  task_progress?: ITaskProgress;
  budget_summary?: IBudgetSummary;
  tasks_count?: number;
  tasks_exists?: boolean;
}

