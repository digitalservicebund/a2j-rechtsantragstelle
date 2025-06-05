import { useField } from "@rvf/react-router";
import { useEffect } from "react";
import {
  components,
  type InputProps,
  type Props,
  type GroupBase,
} from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";

//Will become obsolete with the next version bump: https://github.com/JedWatson/react-select/pull/6016
type CustomSelectProps = Props<
  DataListOptions,
  false,
  GroupBase<DataListOptions>
> & {
  "aria-describedby": string;
};

const CustomInput = (props: InputProps<DataListOptions, false>) => {
  const selectProps = props.selectProps as CustomSelectProps;

  const field = useField(props.selectProps.id ?? "");
  const hasError = !isFieldEmptyOrUndefined(field.error() ?? "");
  const divInputId = `input-div-${props.selectProps.id}`;

  useEffect(() => {
    const div = document.querySelector<HTMLDivElement>(`#${divInputId}`);
    if (!div) return;

    const handleFocus = () => {
      const input = div.querySelector("input");
      if (input) {
        input.focus();
      }
    };

    div.addEventListener("focus", handleFocus);

    return () => {
      div.removeEventListener("focus", handleFocus);
    };
  }, [divInputId]);

  return (
    <div
      id={divInputId}
      tabIndex={-1}
      className="inline-grid col-start-1 row-start-1"
      ref={hasError ? field.refs.controlled() : null}
    >
      <components.Input
        // avoid to clear the previous auto suggestion input when press enter
        // this cannot be tested, thus manually tested with device(s)
        onKeyDown={(e) => {
          if (e.key === "Enter" && !props.selectProps.menuIsOpen) {
            e.preventDefault();
          }
        }}
        {...props}
        maxLength={INPUT_CHAR_LIMIT}
        aria-describedby={selectProps["aria-describedby"]}
        aria-required={props.selectProps.className?.includes(
          "auto-suggest-input-required",
        )}
      />
    </div>
  );
};
export default CustomInput;
