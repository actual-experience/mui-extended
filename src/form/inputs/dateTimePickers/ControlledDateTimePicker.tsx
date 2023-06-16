import {
  DatePickerProps,
  DateTimePickerProps,
  TimePickerProps
} from "@mui/x-date-pickers";

import { ComponentType, FocusEvent, useMemo } from "react";
import { debugRender } from "../../debug";
import { FormFieldAttributes } from "../../FormField";

export const withControlledDateTimePicker = <
  Props extends
    | DatePickerProps<any, any>
    | DateTimePickerProps<any, any>
    | TimePickerProps<any, any>
>(
  Picker: ComponentType<Props>
) => {
  const DecoratedPicker = ({
    name,
    onChange,
    onBlur,
    error,
    helperText,
    renderInput,
    DialogProps = {},
    ...props
  }: Props & FormFieldAttributes) => {
    debugRender(name);

    const _onChange = useMemo(
      () => (value: unknown) => {
        onChange(name, value);
      },
      [onChange, name]
    );

    const dialogId = DialogProps.id || "form-date-picker-dialog";

    const _DialogProps = { id: dialogId, ...DialogProps };

    const _onBlur = useMemo(
      () => (event: FocusEvent<HTMLInputElement>) => {
        let propagate = true;
        let relatedTarget = event.relatedTarget;
        while (relatedTarget && relatedTarget.tagName != "BODY") {
          if (relatedTarget.id == dialogId) {
            propagate = false;
            break;
          }
          relatedTarget = relatedTarget.parentElement;
        }

        if (propagate) {
          onBlur(name);
        }
      },
      [onBlur, name, dialogId]
    );

    return (
      <Picker
        {...(props as any)}
        renderInput={params => {
          return renderInput({
            ...params,
            error,
            helperText,
            onBlur: _onBlur
          });
        }}
        onChange={_onChange}
        DialogProps={_DialogProps}
      />
    );
  };

  return DecoratedPicker;
};
