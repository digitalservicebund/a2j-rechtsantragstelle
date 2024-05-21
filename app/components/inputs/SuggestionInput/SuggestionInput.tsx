import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import { type ErrorMessageProps } from "..";
import airports from "data/airports/data.json";
import Select from "react-select";
import { RefObject, useEffect, useRef, useState } from "react";
import Input from "../Input";
import {
  CustomClearIndicator,
  CustomControl,
  CustomValueContainer,
  CustomInput,
  customStyles,
  FormatOptionLabel,
} from "./customComponents";

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

export interface DataListOptions {
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

const focusOnInput = (action: string, inputId: string) => {
  if (action === "clear" || action === "select-option") {
    setTimeout(function () {
      const inputElement = document.querySelector<HTMLInputElement>(
        `#${inputId}`,
      );

      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }
};

// When leave the input, it should focus on the exclusion button when it uses the tab, due problems for change the className in the component CustomValueContainer
const keyDownOnInput = (
  inputId: string,
  buttonExclusionRef: RefObject<HTMLButtonElement>,
) => {
  const inputElement = document.querySelector<HTMLInputElement>(`#${inputId}`);

  if (inputElement) {
    inputElement.addEventListener("keydown", function (event: KeyboardEvent) {
      // Only tab without shiftKey
      if (event.key === "Tab" && !event.shiftKey) {
        setTimeout(function () {
          if (buttonExclusionRef.current !== null) {
            buttonExclusionRef.current.focus();
          }
        }, 100);
      }
    });
  }
};

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
  const { error, getInputProps, validate } = useField(name, { formId });
  const errorId = `${name}-error`;
  const hasError = typeof error !== "undefined" && error.length > 0;
  const inputId = `input-${name}`;
  const buttonExclusionRef = useRef<HTMLButtonElement>(null);

  const currentItemValue = getDescriptionByValue(
    items,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    getInputProps().defaultValue,
  );

  const [jsAvailable, setJsAvailable] = useState(false);
  const [optionWasSelected, setOptionWasSelected] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  useEffect(() => {
    keyDownOnInput(inputId, buttonExclusionRef);
  });

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
        inputId={inputId}
        filterOption={filterOption}
        defaultValue={currentItemValue}
        placeholder={placeholder ?? ""}
        instanceId={name}
        formatOptionLabel={FormatOptionLabel}
        onChange={(_newValue, actionMeta) => {
          validate();
          // remix remove the focus on the input when clicks with the keyboard to clear the value, so we need to force the focus again
          setOptionWasSelected(actionMeta.action === "select-option");
          focusOnInput(actionMeta.action, inputId);
        }}
        onBlur={() => {
          setOptionWasSelected(false);
          validate();
        }}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length > 2 ? noSuggestionMessage : null
        }
        components={{
          Control: (props) => CustomControl(props, error),
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
          ClearIndicator: (props) =>
            CustomClearIndicator(props, buttonExclusionRef),
          Input: CustomInput,
          ValueContainer: (props) =>
            CustomValueContainer(props, optionWasSelected),
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
