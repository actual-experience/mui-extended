import { createContext } from "react";
import { useSafeContext } from "../utils/useSafeContext";

export type FormContextType<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  values: T;
  touched: Partial<Record<keyof T, boolean>>;
  errors: Partial<Record<keyof T, string>>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onFieldChange: (name: keyof T, value: T[keyof T]) => void;
  onFieldBlur: (name: keyof T) => void;
  submit: () => void;
  reset: () => void;
};

export const FormContext = createContext<FormContextType | null>(null);

FormContext.displayName = "FormContext";

export const useFormContext = <
  T extends Record<string, unknown> = Record<string, unknown>
>() => useSafeContext(FormContext, undefined, "Form") as FormContextType<T>;
