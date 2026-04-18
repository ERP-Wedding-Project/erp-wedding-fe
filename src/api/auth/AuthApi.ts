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
      console.log(toRaw(user.value), "user");

      // user.value.access_token = response.data.payload.access_token;
      if (user.value.email_verified_at == null) {
        console.log("email not verified");

        await router.push({ name: "verify-email" });
      } else {
        console.log("email verified");

        if (user.value) {
          setAuthenticated(user.value);
          const roles = user.value.list_roles || [];
          const rolePriority = ["User"];
          const destinationMap: Record<string, string> = {
            User: "dashboard-client",
          };

          const matchedRole = rolePriority.find((role) => roles.includes(role));
          const destinationRoute =
            destinationMap[matchedRole ?? ""] || "dashboard-client";

          if (user.value.complete_onboarding) {
            await router.push({ name: destinationRoute });
          } else {
            await router.push({ name: "onboarding" });
          }
        }
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

      const response = await ApiService.post<
        FormRegister,
        ResponseSingleData<IUser>
      >("register", toRaw(credentials));
      console.log(response, "response");
      user.value = response.data.payload.data;
      // user.value.access_token = response.data.payload.access_token;

      if (user.value) {
        // setAuthenticated(user.value);
        await router.push({ name: "verify-email" });
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
      console.log(email, "email");
      const response = await ApiService.post<
        {
          email: string;
        },
        ResponseSingleData<IUser>
      >("password/forgot", {
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
      >("password/reset", formReset);
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
      const roles = response.data.payload.data.list_roles || [];
      const rolePriority = ["User"];
      const destinationMap: Record<string, string> = {
        User: "dashboard-client",
      };

      const matchedRole = rolePriority.find((role) => roles.includes(role));
      const destinationRoute =
        destinationMap[matchedRole ?? ""] || "dashboard-client";

      if (response.data.payload.data.complete_onboarding) {
        window.location.href = destinationRoute;
      } else {
        window.location.href = "/onboarding";
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
      const response = await ApiService.post<object, any>("email/resend", {});
      await HandlerService.responseSuccess(response);
    } catch (e: any) {
      await HandlerService.responseError(e, responseError);
      throw new Error(e);
    } finally {
      loadingUnBlock();
    }
  };

  const verifyEmail = async (credentials) => {
    try {
      loadingBlock();
      const response = await ApiService.get<any>(
        `email/verify/${credentials.id}/${credentials.hash}?expires=${credentials.expires}&signature=${credentials.signature}`,
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
    verifyEmail,
  };
}
