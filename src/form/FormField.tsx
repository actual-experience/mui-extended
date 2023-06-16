import { capitalize, isEqualWith, snakeCase, words } from "lodash";
import {
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  memo,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
  useMemo
} from "react";
import { debugPropChanges } from "./debug";
import { useFormContext } from "./FormContext";

const labelFromName = (name: string) => {
  return words(snakeCase(name)).map(capitalize).join(" ");
};

export type ControlledInputAttributes = {
  name: string;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  onBlur: (name: string) => void;
};

export type FormFieldAttributes = ControlledInputAttributes & {
  label?: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
  disabled?: boolean;
};

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

export type FormFieldProps<T extends FormFieldAttributes> = DistributiveOmit<
  T,
  keyof ControlledInputAttributes
> &
  Pick<ControlledInputAttributes, "name"> &
  Partial<Omit<ControlledInputAttributes, "name" | "value">> &
  RefAttributes<HTMLDivElement>;

export const withFormField = <T extends PropsWithChildren<FormFieldAttributes>>(
  FormFieldComponent: ComponentType<T> | ForwardRefExoticComponent<T>
) => {
  const PureFormFieldComponent = memo(
    FormFieldComponent,
    (prevProps, nextProps) => {
      debugPropChanges(prevProps, nextProps);
      return isEqualWith(prevProps, nextProps, (value, other, propName) => {
        if (propName == "onChange" || propName == "onBlur") {
          return true;
        }
      });
    }
  );

  const DecoratedFormField = forwardRef<
    HTMLTextAreaElement | HTMLInputElement,
    T
  >(function FormField({ children, name, label, ...props }, ref) {
    const formContext = useFormContext();

    if (!formContext) {
      throw new Error("FormField is rendered with out Form");
    }

    const _label = label || labelFromName(name);

    const value = formContext.values[name];

    const onChange = useMemo(
      () => (name: string, value: unknown) => {
        formContext.onFieldChange(name, value);
        if (props.onChange) {
          props.onChange(name, value);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.onChange]
    );

    const onBlur = useMemo(
      () => (name: string) => {
        formContext.onFieldBlur(name);
        if (props.onBlur) {
          props.onBlur(name);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.onBlur]
    );

    const error = formContext.errors[name];

    const disabled = props.disabled || formContext.isSubmitting;

    const helperText = error || props.helperText;

    return (
      <PureFormFieldComponent
        {...(props as any)}
        name={name}
        label={_label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
        disabled={disabled}
        helperText={error || helperText}
        ref={ref}
      >
        {children}
      </PureFormFieldComponent>
    );
  });
  return DecoratedFormField;
};
