import { autocompleteMap } from "~/util/autocompleteMap";
import { useField } from "@rvf/react-router";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";

export type SplitDateInputProps = {
  name: string;
  helperText?: string;
};

export const SplitDateInput = ({ name, helperText }: SplitDateInputProps) => {
  const day = name + ".day";
  const month = name + ".month";
  const year = name + ".year";

  const dayField = useField(day);
  const monthField = useField(month);
  const yearField = useField(year);

  const dayError = dayField.error();
  const monthError = monthField.error();
  const yearError = yearField.error();

  const hasError = Boolean(dayError ?? monthError ?? yearError);

  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <fieldset
      className="grid-rows-[auto_auto_auto_auto] grid gap-16 gap-y-8 w-full"
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      <div>
        <legend className="ds-body-01-bold">
          {translations.splitDateComponent.legend.de}
        </legend>
      </div>

      <p className="ds-label-01-reg">
        {translations.splitDateComponent.hintText.de}
      </p>

      <div className="grid grid-rows-subgrid gap-16 grid-cols-[repeat(4,75px)]">
        <InputLabel id={day} classname="col-start-1 col-span-1">
          {translations.splitDateComponent.tagInputLabel.de}
          <input
            {...dayField.getInputProps({
              inputMode: "numeric",
              id: day,
            })}
            type="number"
            autoComplete={autocompleteMap[day] ?? "off"}
            name={day}
            className={classNames("ds-input px-16", {
              "has-error": dayError,
            })}
            aria-required="true"
            aria-invalid={dayError !== null}
            aria-describedby={[
              dayError && errorId,
              helperText && helperId,
            ].join(" ")}
          />
        </InputLabel>

        <InputLabel id={month} classname="col-start-2 col-span-1">
          {translations.splitDateComponent.monatInputLabel.de}
          <input
            {...monthField.getInputProps({
              inputMode: "numeric",
              id: month,
            })}
            type="number"
            autoComplete={autocompleteMap[month] ?? "off"}
            name={month}
            className={classNames("ds-input px-16", {
              "has-error": monthError,
            })}
            aria-required="true"
            aria-invalid={monthError !== null}
            aria-describedby={[
              monthError && errorId,
              helperText && helperId,
            ].join(" ")}
          />
        </InputLabel>

        <InputLabel id={year} classname="col-start-3 col-span-2">
          {translations.splitDateComponent.jahrInputLabel.de}
          <input
            {...yearField.getInputProps({
              inputMode: "numeric",
              id: year,
            })}
            type="number"
            autoComplete={autocompleteMap[year] ?? "off"}
            name={year}
            className={classNames("ds-input px-16", {
              "has-error": yearError,
            })}
            aria-required="true"
            aria-invalid={yearError !== null}
            aria-describedby={[
              yearError && errorId,
              helperText && helperId,
            ].join(" ")}
          />
        </InputLabel>
      </div>
      {hasError && (
        <div id={errorId}>
          <InputError id={errorId}>
            {dayError ?? monthError ?? yearError}
          </InputError>
        </div>
      )}
    </fieldset>
  );
};

export default SplitDateInput;
