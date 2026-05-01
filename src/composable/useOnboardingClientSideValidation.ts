import { type Ref } from "vue";

export const useOnboardingClientSideValidation = () => {
  const validate = (
    step: number,
    form: Ref<any>,
    formError: Ref<any>
  ) => {
    // Placeholder validation logic
    // You can implement custom validation per step here if needed
    console.log(`Validating step ${step}`, form.value);
    return true;
  };

  return {
    validate,
  };
};