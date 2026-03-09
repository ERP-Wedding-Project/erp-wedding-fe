
export interface ICreatedBy {
    id: string;
    full_name: string;
    email: string;
}

export default interface IUser {
    id: string,
    email: string,
    username: string,
    name: string | null,
    created_at: string,
    roles: string[],
    role_ids: string[],
    access_token: string,
    permissions: string[],
}