import {defineStore} from "pinia";
import ApiService from "@/core/services/ApiService";
import router from "@/router";
import type {IUser} from "@/types/entities/User"


export const useAuthStore = defineStore("auth", () => {
    function setAuthenticated(responseUser: IUser): void {
        localStorage.setItem("permissions", JSON.stringify(responseUser.permissions))
        localStorage.setItem("roles", JSON.stringify(responseUser.roles))
        localStorage.setItem("access_token", responseUser.access_token)
        localStorage.setItem("user", JSON.stringify(responseUser))
        ApiService.vueInstance.axios.defaults.headers.common["Authorization"] = 'Bearer ' + responseUser.access_token;
    }

    function setUnauthenticated(): void {
        localStorage.removeItem("permissions")
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        localStorage.removeItem("roles")
        ApiService.vueInstance.axios.defaults.headers.common["Authorization"] = null;
        router.push({path: "/login"});
    }

    function getUser(): IUser | null {
        return JSON.parse(localStorage.getItem("user") ?? "") ?? []
    }

    function getPermissions(): string[] {
        return JSON.parse(localStorage.getItem("permissions") ?? "") ?? []
    }

    function getRoles(): string[]{
        return JSON.parse(localStorage.getItem("roles") ?? "") ?? []
    }

    function getRolesString(): string[]{
        return (JSON.parse(localStorage.getItem("roles") ?? "") ?? []).join(" | ")
    }

    function isAuthenticated(): boolean {
        return localStorage.getItem("access_token") !== null;
    }

    return {
        setAuthenticated,
        setUnauthenticated,
        getUser,
        getPermissions,
        getRoles,
        getRolesString,
        isAuthenticated,

    }
})