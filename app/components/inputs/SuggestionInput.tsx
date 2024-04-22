import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from ".";
import airports from "data/airports/data.json";
import type { ControlProps } from "react-select";
import Select, { components } from "react-select";
import { useEffect, useState } from "react";
import Input from "./Input";

const COMPONENT_HOVER_FOCUS_STYLE = "solid 2px #004b76 !important";

const widthClass = (width: string) => {
  return {
    "3": "w-[9ch]",
    "5": "w-[11ch]",
    "7": "w-[13ch]",
    "10": "w-[16ch]",
    "16": "w-[22ch]",
    "24": "w-[30ch]",
    "36": "w-[42ch]",
    "54": "w-[60ch]",
  }[width];
};

interface DataListOptions {
  value: string;
  label: string;
  subDescription?: string;
}

export type SuggestionInputProps = Readonly<{
  name: string;
  label?: string;
  step?: string | number;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
  formId?: string;
  dataList?: "airports";
}>;

function getDataListOptions(dataListType?: string): DataListOptions[] {
  if (dataListType === "airports") {
    return [...airports]
      .sort((a, b) => a.iata.localeCompare(b.iata))
      .map((airport) => ({
        value: airport.iata,
        label: airport.airport.includes(airport.city)
          ? `${airport.airport} (${airport.iata})`
          : `${airport.city} ${airport.airport} (${airport.iata})`,
        subDescription: `${airport.city}, ${airport.country}`,
      }));
  }
  return [];
}

const filterOption = (option: DataListOptions, inputValue: string) => {
  if (inputValue.length <= 2) {
    return false;
  }
  return option.label.toLowerCase().includes(inputValue.toLocaleLowerCase());
};

function getDescriptioByValue(
  dataListOptions: DataListOptions[],
  value: string,
): DataListOptions | null {
  return (
    dataListOptions.find((dataOption) => dataOption.value === value) ?? null
  );
}

const formatOptionLabel = ({ label, subDescription }: DataListOptions) => (
  <div style={{ flex: "10" }}>
    <span>{label}</span>
    <div>
      <span className="primary">{subDescription}</span>
    </div>
  </div>
);

const ControlComponent = (props: ControlProps<DataListOptions, false>) => (
  <components.Control className="ds-select" {...props} />
);

const SuggestionInput = ({
  name,
  label,
  placeholder,
  errorMessages,
  width,
  formId,
  dataList,
}: SuggestionInputProps) => {
  const items = getDataListOptions(dataList);
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;

  const currentItemValue = getDescriptioByValue(
    items,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    getInputProps().defaultValue,
  );

  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  // In case user does not have Javascript, it should render the Input as suggestion input
  if (!jsAvailable) {
    return (
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        formId={formId}
        dataList={dataList}
        width={width}
        errorMessages={errorMessages}
      />
    );
  }

  return (
    <>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <Select
        className={classNames(
          "w-full",
          { "has-error": error },
          width && widthClass(width),
        )}
        isSearchable
        isClearable
        options={items}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
        id={name}
        inputId={name}
        name={name}
        filterOption={filterOption}
        defaultValue={currentItemValue}
        placeholder={placeholder}
        instanceId={name}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length > 2
            ? "Leider konnten wir kein passenden Flughafen finden. Bitte prüffen Sie ihre Angabe"
            : null
        }
        components={{
          Control: ControlComponent,
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "",
            backgroundImage: "none",
            borderColor: "",
            outline: "none",
            paddingRight: "0rem",
            paddingLeft: "0.5rem",
            borderStyle: "",
            boxShadow: "",
            "&:hover": {
              border: COMPONENT_HOVER_FOCUS_STYLE,
            },
            "&:focus": {
              border: COMPONENT_HOVER_FOCUS_STYLE,
            },
            "&:active": {
              border: COMPONENT_HOVER_FOCUS_STYLE,
            },
          }),
        }}
      />

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </>
  );
};

export default SuggestionInput;
