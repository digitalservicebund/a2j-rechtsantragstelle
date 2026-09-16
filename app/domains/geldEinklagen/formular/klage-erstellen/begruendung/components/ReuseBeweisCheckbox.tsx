import { useField } from "@rvf/react";
import classNames from "classnames";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";

type Props = {
  name: string;
  options: Array<{ label: string; value: string }>;
};

export const ReuseBeweisCheckbox = ({ name, options }: Props) => {
  const field = useField(name);

  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      <div className="kern-fieldset__body">
        {options.map(({ label, value }) => (
          <div key={value} className="flex items-center">
            <div className="kern-form-check">
              <input
                type="checkbox"
                name={`${name}.${value}`}
                className={classNames("kern-form-check__checkbox", {
                  "kern-form-check__checkbox--error": hasError,
                })}
                value={value}
                id={`${name}.${value}`}
                checked={value === "on"}
              />
              {label && <InputLabel name={`${name}.${value}`} label={label} />}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
