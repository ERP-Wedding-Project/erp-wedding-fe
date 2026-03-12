import { ref, toRaw } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { loadingBlock, loadingUnBlock } from "@/core/helpers/helpers";
import HandlerService from "@/core/services/HandlerService";
import type { ResponseError, ResponseSingleData } from "@/types/response";
import type IUser from "@/types/entities/User";
import ApiService from "@/core/services/ApiService";

export interface FormToken {
  token: string;
}

export interface FormAuthentication {
  email: string | null;
  password: string | null;
}

export interface FormResetPassword {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface FormRegister {
  email: string;
  full_name: string;
  password: string;
  password_confirmation: string;
}

export default function useAuthApi() {
  const user = ref<IUser | null>(null);
  const { setAuthenticated } = useAuthStore();
  const responseError = ref<ResponseError | null>(null);
  const router = useRouter();
  /**
   * @param credentials
   */
  const authenticate = async (credentials: FormAuthentication) => {
    try {
      loadingBlock();
      const response = await ApiService.post<
        FormAuthentication,
        ResponseSingleData<IUser>
      >("login", toRaw(credentials));
      user.value = response.data.payload.data;
      if (user.value) {
        setAuthenticated(user.value);
        const roles = user.value.roles || [];
        const rolePriority = ["student", "educator", "institution-admin"];
        const destinationMap: Record<string, string> = {
          "institution-admin": "admin-dashboard",
          educator: "educator-dashboard",
          student: "student-dashboard",
        };

        const matchedRole = rolePriority.find((role) => roles.includes(role));
        const destinationRoute =
          destinationMap[matchedRole ?? ""] || "dashboard-overview-1";

        await router.push({ name: destinationRoute });
      }
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const register = async (credentials: FormRegister) => {
    try {
      loadingBlock();
      console.log(toRaw(credentials), "credentials");

      const response = await ApiService.post<
        FormRegister,
        ResponseSingleData<IUser>
      >("register", toRaw(credentials));
      console.log(response, "response");
      user.value = response.data.payload.data;
      if (user.value) {
        setAuthenticated(user.value);
        await router.push({ name: "email-verification" });
      }
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      loadingBlock();
      const response = await ApiService.post<
        {
          email: string;
        },
        ResponseSingleData<IUser>
      >("v1/public/forgot-password/request-reset", {
        email: email,
      });
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const resetPassword = async (formReset: FormResetPassword) => {
    try {
      loadingBlock();
      const response = await ApiService.post<
        FormResetPassword,
        ResponseSingleData<IUser>
      >("v1/public/forgot-password/reset-password", formReset);
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const unauthenticate = async () => {
    try {
      loadingBlock();
      const response = await ApiService.post<
        FormResetPassword,
        ResponseSingleData<IUser>
      >("v1/internal/auth/logout");
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const checkAuthenticate = async (token: FormToken) => {
    try {
      loadingBlock();
      const response = await ApiService.post<
        FormToken,
        ResponseSingleData<IUser>
      >("v1/public/institution/authenticate/check", token);
      user.value = response.data.payload.data;
      if (user.value) {
        setAuthenticated(user.value);
      }
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  /**
   * POST ke endpoint OAuth Google dengan id_token dari Google Identity Services.
   * @param idToken - JWT id_token dari callback Google GIS
   */
  const loginWithGoogle = async (idToken: string) => {
    try {
      loadingBlock();
      console.log(idToken, "idToken");

      const response = await ApiService.post<object, any>("login/google", {
        id_token: idToken,
      });
      const redirectUrl: string | undefined =
        response.data?.data?.redirect_url ??
        response.data?.redirect_url ??
        response.data?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
    } finally {
      loadingUnBlock();
    }
  };

  /**
   * Kirim ulang email verifikasi ke user yang sedang login.
   */
  const resendVerificationEmail = async () => {
    try {
      loadingBlock();
      const response = await ApiService.post<object, any>(
        "email/verification-notification",
      );
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  return {
    user,
    authenticate,
    register,
    forgotPassword,
    resetPassword,
    unauthenticate,
    checkAuthenticate,
    loginWithGoogle,
    resendVerificationEmail,
  };
}
