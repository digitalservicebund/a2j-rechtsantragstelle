import { useField } from "@rvf/react";
import classNames from "classnames";
import InputLabel from "~/components/formElements/InputLabel";
import { type NumberIncrementProps } from "~/services/cms/models/formElements/StrapiNumberIncrement";

const NumberIncrement = ({ name, label, min, max }: NumberIncrementProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  return (
    <div className="w-full">
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <div className="ds-input-group">
        <input
          {...field.getInputProps({
            type: "number",
            id: name,
            min,
            max,
          })}
          className={classNames(
            "ds-input forced-colors:border-4 ph-no-capture",
            {
              "has-error": field.error(),
            },
          )}
          aria-invalid={field.error() !== null}
          aria-describedby={[field.error() && errorId].join(" ")}
        ></input>
      </div>
    </div>
  );
};

export default NumberIncrement;
