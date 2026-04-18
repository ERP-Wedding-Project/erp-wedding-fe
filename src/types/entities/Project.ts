import type IUser from "./User";

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
}
