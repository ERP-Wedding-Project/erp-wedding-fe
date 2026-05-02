import type ITask from "./Task";

export default interface ITaskCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tasks?: ITask[];
}

