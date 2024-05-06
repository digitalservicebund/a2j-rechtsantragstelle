import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from ".";
import airports from "data/airports/data.json";
import type {
  StylesConfig,
  ClearIndicatorProps,
  ControlProps,
  FormatOptionLabelMeta,
  InputProps,
} from "react-select";
import Select, { components } from "react-select";
import { useEffect, useState } from "react";
import Input from "./Input";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";

const MINIMUM_SEARCH_SUGGESTION_CHARACTERS = 3;

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
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
  formId?: string;
  dataList?: "airports";
  noSuggestionMessage?: string;
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
  if (inputValue.length < MINIMUM_SEARCH_SUGGESTION_CHARACTERS) {
    return false;
  }
  return option.label.toLowerCase().includes(inputValue.toLocaleLowerCase());
};

function getDescriptionByValue(
  dataListOptions: DataListOptions[],
  value: string,
): DataListOptions | null {
  return (
    dataListOptions.find((dataOption) => dataOption.value === value) ?? null
  );
}

const formatOptionLabel = (
  { label, subDescription }: DataListOptions,
  { context }: FormatOptionLabelMeta<DataListOptions>,
) => {
  if (context === "menu") {
    return (
      <div style={{ flex: "10" }}>
        <span data-testid="suggestion-input-menu-item">{label}</span>
        <div>
          <span className="primary">{subDescription}</span>
        </div>
      </div>
    );
  }

  return <span className="focus:text-blue-100">{label}</span>;
};

const getOptionBackgroundColor = (
  isFocused: boolean,
  isSelected: boolean,
): string | undefined => {
  if (isFocused) {
    return "#ECF1F4";
  }

  if (isSelected) {
    return "#DCE8EF";
  }

  return undefined;
};

const customStyles = (
  hasError: boolean,
): StylesConfig<DataListOptions, false> => {
  const hoverActiveStyle = !hasError && {
    "&:hover": {
      backgroundColor: "#F2F6F8",
    },
    "&:focus": {
      backgroundColor: "#F2F6F8",
    },
  };

  return {
    control: (base, { menuIsOpen }) => ({
      ...base,
      borderRadius: "",
      backgroundImage: "none",
      borderColor: "",
      outline: menuIsOpen ? "solid 4px #004b76" : "none",
      outlineOffset: menuIsOpen ? "-4px" : "",
      paddingRight: "0rem",
      paddingLeft: "0.5rem",
      borderStyle: "",
      boxShadow: "",
      backgroundColor: menuIsOpen ? "#F2F6F8" : "",
      ...hoverActiveStyle,
    }),
    option: (base, { isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: getOptionBackgroundColor(isFocused, isSelected),
        color: "inherit",
      };
    },
    clearIndicator: (base) => ({
      ...base,
      color: "",
      ":hover": {
        color: "",
      },
    }),
  };
};

const CustomClearIndicator = (
  props: ClearIndicatorProps<DataListOptions, false>,
) => (
  <components.ClearIndicator
    className="text-blue-800 hover:text-blue-300"
    {...props}
  />
);

const CustomControl = (
  props: ControlProps<DataListOptions, false>,
  error?: string,
) => (
  <components.Control
    className={classNames("ds-select", { "has-error": error })}
    {...props}
  />
);

const CustomInput = (props: InputProps<DataListOptions, false>) => (
  <components.Input {...props} maxLength={INPUT_CHAR_LIMIT} />
);

const SuggestionInput = ({
  name,
  label,
  placeholder,
  errorMessages,
  width,
  formId,
  dataList,
  noSuggestionMessage,
}: SuggestionInputProps) => {
  const items = getDataListOptions(dataList);
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;
  const hasError = typeof error !== "undefined" && error.length > 0;

  const currentItemValue = getDescriptionByValue(
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
        name={name}
        inputId={`input-${name}`}
        filterOption={filterOption}
        defaultValue={currentItemValue}
        placeholder={placeholder ?? ""}
        instanceId={name}
        formatOptionLabel={formatOptionLabel}
        onChange={getInputProps().onChange}
        onBlur={getInputProps().onBlur}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length > 2 ? noSuggestionMessage : null
        }
        components={{
          Control: (props) => CustomControl(props, error),
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
          ClearIndicator: CustomClearIndicator,
          Input: (props) => CustomInput(props),
        }}
        styles={customStyles(hasError)}
      />

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </>
  );
};

export default SuggestionInput;
