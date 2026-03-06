import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";

type SplitDateInputProps = {
  name: string;
};

const sharedClassnames = "ds-input px-16 ph-no-capture" as const;
const sharedAttributes = {
  "aria-required": "true",
  type: "text",
  inputMode: "numeric",
  onInput: (e: React.InputEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replaceAll(/\D/g, "");
  },
} as const;

const SplitDateInput = ({ name }: SplitDateInputProps) => {
  const day = name + ".day";
  const month = name + ".month";
  const year = name + ".year";

  const dateField = useField(name);
  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

  const dateError = dateField.error();
  const dayError = dayField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();

  const hasError = Boolean(dayError ?? monthError ?? yearError ?? dateError);
  const errorId = `${name}-error`;

  return (
    <fieldset
      className="grid-rows-[auto_auto_auto_auto] grid gap-16 gap-y-8 w-full"
      {...dateField.getControlProps()}
    >
      <legend className="ds-body-01-bold">
        {translations.splitDateComponent.legend.de}
      </legend>
      <p className="ds-label-01-reg">
        {translations.splitDateComponent.hintText.de}
      </p>

      <div className="grid grid-rows-subgrid gap-16 grid-cols-[repeat(4,75px)]">
        <InputLabel id={day} classname="col-start-1 col-span-1">
          {translations.splitDateComponent.tagInputLabel.de}
          <input
            {...dayField.getInputProps({
              id: day,
              min: 1,
              max: 31,
              maxLength: 2,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[day] ?? "off"}
            className={classNames(sharedClassnames, { "has-error": dayError })}
            aria-invalid={dayError !== null}
            aria-describedby={dayError ? errorId : undefined}
          />
        </InputLabel>

        <InputLabel id={month} classname="col-start-2 col-span-1">
          {translations.splitDateComponent.monatInputLabel.de}
          <input
            {...monthField.getInputProps({
              id: month,
              min: 1,
              max: 12,
              maxLength: 2,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[month] ?? "off"}
            className={classNames(sharedClassnames, {
              "has-error": monthError,
            })}
            aria-invalid={monthError !== null}
            aria-describedby={monthError ? errorId : undefined}
          />
        </InputLabel>

        <InputLabel id={year} classname="col-start-3 col-span-2">
          {translations.splitDateComponent.jahrInputLabel.de}
          <input
            {...yearField.getInputProps({
              id: year,
              maxLength: 4,
              ...sharedAttributes,
            })}
            autoComplete={autocompleteMap[year] ?? "off"}
            className={classNames(sharedClassnames, { "has-error": yearError })}
            aria-invalid={yearError !== null}
            aria-describedby={yearError ? errorId : undefined}
          />
        </InputLabel>
      </div>
      {hasError && (
        <InputError id={errorId}>
          {dayError ?? monthError ?? yearError ?? dateError}
        </InputError>
      )}
    </fieldset>
  );
};

export default SplitDateInput;
