import {
  Checkbox,
  CheckboxProps,
  FormGroup,
  FormGroupProps
} from "@mui/material";
import {
  ChangeEvent,
  ChangeEventHandler,
  createContext,
  forwardRef,
  FunctionComponent,
  useMemo
} from "react";
import { ControlledInputAttributes, withFormField } from "../FormField";
import { withFormInputControl } from "./FormInputControl";
import { useSafeContext } from "../../utils/useSafeContext";

export type CheckboxGroupContextType = {
  name: string;
  values?: string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextType | null>(
  null
);

CheckboxGroupContext.displayName = "CheckboxGroupContext";

export const useCheckboxGroup = () =>
  useSafeContext(CheckboxGroupContext, undefined, "CheckboxGroup");

export type CheckboxGroupProps = Omit<FormGroupProps, "onChange"> & {
  name: string;
  values?: string[];
  onChange: (event: ChangeEvent<HTMLInputElement>, values: string[]) => void;
};

export const CheckboxGroup: FunctionComponent<CheckboxGroupProps> = ({
  name,
  values,
  onChange,
  children,
  ...props
}) => {
  const _onChange = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const checked = event.target.checked;
      let _values = [...(values || [])];
      _values = _values.filter(v => v != value);
      if (checked) {
        _values.push(value);
      }
      onChange(event, _values);
    },
    [onChange, values]
  );
  return (
    <CheckboxGroupContext.Provider
      value={{ name, values, onChange: _onChange }}
    >
      <FormGroup {...props}>{children}</FormGroup>
    </CheckboxGroupContext.Provider>
  );
};

export const FormCheckbox = forwardRef<
  HTMLButtonElement,
  Omit<CheckboxProps, "checked" | "onChange" | "indeterminate"> &
    Required<Pick<CheckboxProps, "value">>
>(function CheckboxWithGroup({ value, ...props }, ref) {
  const groupContext = useCheckboxGroup();

  if (!groupContext) {
    throw new Error("FormCheckbox is used without CheckboxGroup");
  }
  const checked =
    (groupContext.values?.filter(v => v == value).length || 0) > 0;

  return (
    <Checkbox
      value={value}
      checked={checked}
      onChange={groupContext.onChange}
      {...props}
      ref={ref}
    />
  );
});

const ControlledCheckboxGroup: FunctionComponent<
  Omit<CheckboxGroupProps, "values" | "onChange"> & ControlledInputAttributes
> = ({ name, value, onChange, onBlur, children, ...props }) => {
  const _onChange = useMemo(() => {
    return (event: ChangeEvent<HTMLInputElement>, values: string[]) => {
      onChange(name, values);
    };
  }, [onChange, name]);

  const _onBlur = useMemo(() => {
    return () => {
      onBlur(name);
    };
  }, [onBlur, name]);

  return (
    <CheckboxGroup
      {...props}
      name={name}
      values={value as string[]}
      onChange={_onChange}
      onBlur={_onBlur}
    >
      {children}
    </CheckboxGroup>
  );
};

export const FormCheckboxGroup = withFormField(
  withFormInputControl(ControlledCheckboxGroup)
);
