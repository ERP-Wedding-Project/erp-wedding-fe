export interface ICreatedBy {
  id: string;
  full_name: string;
  email: string;
}

export default interface IUser {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  complete_onboarding: boolean;
  projects_count: number;
  external_id: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  list_roles: string[];
  list_permissions: string[];
  access_token: string;
}
