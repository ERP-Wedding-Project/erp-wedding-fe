import type { ResponseError } from "@/types/response";

const isFormError = (
    responseError: ResponseError | null | undefined,
    key: string): boolean => {
    return (responseError?.errors?.[key] ?? []).length > 0;
}

const getFormErrorMessages = (responseError: ResponseError | null | undefined, key: string): string => {
    let message = "";
    (responseError?.errors?.[key] ?? []).forEach((item: string) => {
        message += `${item} <br>`;
    });
    return message;
}

export { isFormError, getFormErrorMessages };