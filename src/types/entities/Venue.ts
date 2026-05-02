import type IProject from "./Project";

export default interface IVenue {
  id: number;
  name: string;
  address: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project?: IProject;
}
