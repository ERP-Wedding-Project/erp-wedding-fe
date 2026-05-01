import type IAvatar from "./Avatar";
import type IProject from "./Project";
import type ITask from "./Task";

export interface ICreatedBy {
  id: string;
  full_name: string;
  email: string;
}

export interface IPermission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface IRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export default interface IUser {
  id: number;
  email: string;
  name: string | null;
  avatar: IAvatar | null;
  complete_onboarding: boolean;
  projects_count: number;
  tasks_count: number;
  external_id: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  list_roles: string[];
  list_permissions: string[];
  access_token: string;
  projects?: IProject[];
  assigned_tasks?: ITask[];
  permissions?: IPermission[];
  roles?: IRole[];
}

