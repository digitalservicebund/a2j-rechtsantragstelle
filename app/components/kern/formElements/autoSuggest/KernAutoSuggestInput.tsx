import { useField } from "@rvf/react-router";
import { matchSorter } from "match-sorter";
import { type RefObject, useEffect, useRef, useState } from "react";
import Input from "react-imask/esm/input";
import { useRouteLoaderData } from "react-router";
import Select, { type InputActionMeta } from "react-select";
import Creatable from "react-select/creatable";
import classNames from "classnames";
import {
  ariaLiveMessages,
  screenReaderStatus,
} from "~/components/formElements/autoSuggestInput/accessibilityConfig/ariaLiveMessages";
import { type AutoSuggestInputProps } from "~/components/formElements/autoSuggestInput/types";
import useDataListOptions from "~/components/formElements/autoSuggestInput/useDataListOptions";
import useLiveMessage from "~/components/formElements/autoSuggestInput/useLiveMessage";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type RootLoader } from "~/root";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import InputError from "../InputError";
import { FormatOptionLabel } from "~/components/formElements/autoSuggestInput/customComponents";
import KernAutoSuggestClearInput from "./KernAutoSuggestClearInput";
import KernAutoSuggestController from "./KernAutoSuggestController";
import KernAutoSuggestCustomInput from "./KernAutoSuggestCustomInput";
import KernAutoSuggestValueContainer from "./KernAutoSuggestValueContainer";
import kernCustomStyles from "./customStyles";

const MINIMUM_SEARCH_SUGGESTION_CHARACTERS = 3;
const AIRPORT_CODE_LENGTH = 3;
const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 10;

const focusOnInput = (inputId: string) => {
  setTimeout(function () {
    const inputElement = document.querySelector<HTMLInputElement>(
      `#${inputId}`,
    );

    if (inputElement) {
      inputElement.focus();
    }
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

// When leave the input, it should focus on the exclusion button when it uses the tab, due problems for change the className in the component CustomValueContainer
const keyDownOnInput = (
  inputId: string,
  buttonExclusionRef: RefObject<HTMLButtonElement | null>,
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

const getSortingAirportsByCode = (
  filteredOptions: DataListOptions[],
  inputCode: string,
): DataListOptions[] => {
  if (inputCode.length === AIRPORT_CODE_LENGTH) {
    return matchSorter(filteredOptions, inputCode, {
      keys: ["value", "subDescription"],
      threshold: matchSorter.rankings.NO_MATCH,
    });
  }

  return filteredOptions;
};

const KernAutoSuggestInput = ({
  name,
  label,
  placeholder,
  errorMessages,
  helperText,
  width,
  dataList,
  dataListArgument,
  noSuggestionMessage,
  isDisabled,
  minSuggestCharacters = MINIMUM_SEARCH_SUGGESTION_CHARACTERS,
  supportsFreeText: isCreatable = false,
}: AutoSuggestInputProps) => {
  const items = useDataListOptions(dataList, dataListArgument);
  const [currentItemValue, setCurrentItemValue] =
    useState<DataListOptions | null>();
  const field = useField(name);
  const { defaultValue } = field.getInputProps();
  const errorId = `${name}-error`;
  const hasError = (field.error()?.length ?? 0) > 0;
  const inputId = `input-${name}`;
  const helperId = `${name}-helper`;
  const buttonExclusionRef = useRef<HTMLButtonElement>(null);

  const jsAvailable = useJsAvailable();
  const [optionWasSelected, setOptionWasSelected] = useState(false);
  const { liveMessage, liveMessageKey, announceLiveMessage } = useLiveMessage();
  const [options, setOptions] = useState<DataListOptions[]>([]);
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  const onInputChange = (value: string, { action }: InputActionMeta) => {
    if (action === "input-change") {
      if (value.length < minSuggestCharacters) {
        setOptions([]);
        return;
      }
      let filteredOptions = items.filter((item) =>
        item.label.toLowerCase().includes(value.toLocaleLowerCase()),
      );

      // In case is the airports list, sorting by the code
      if (dataList === "airports") {
        filteredOptions = getSortingAirportsByCode(filteredOptions, value);
      }

      setOptions(filteredOptions);
      if (filteredOptions.length === 0) {
        announceLiveMessage(noSuggestionMessage ?? "");
      }
    }
  };

  useEffect(() => {
    keyDownOnInput(inputId, buttonExclusionRef);
  });

  useEffect(() => {
    let value =
      items.find((dataOption) => dataOption.value === defaultValue) ?? null;
    if (isCreatable && !value && defaultValue) {
      value = { value: defaultValue, label: defaultValue };
    }

    setCurrentItemValue(value);
  }, [defaultValue, items, isCreatable]);

  // In case user does not have Javascript, it should render the Input as suggestion input
  if (!jsAvailable) {
    return (
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        width={width}
      />
    );
  }

  const SelectComponent = isCreatable ? Creatable : Select;

  return (
    <div
      data-testid={items.length > 0 ? `${inputId}-loaded` : ""}
      className={classNames("w-full kern-form-input", {
        "kern-form-input--error": hasError,
      })}
    >
      {label && (
        <label
          className="kern-label text-kern-layout-text-default!"
          htmlFor="input-street"
        >
          {label}
        </label>
      )}

      <div className="w-full">
        <SelectComponent
          aria-describedby={[
            field.error() && errorId,
            helperText && helperId,
          ].join("")}
          aria-invalid={field.error() !== null}
          {...(isCreatable && {
            formatCreateLabel: (creatableValue) => creatableValue,
          })}
          ariaLiveMessages={ariaLiveMessages(
            rootLoaderData?.accessibilityTranslations,
          )}
          className="w-full"
          components={{
            ClearIndicator: (props) =>
              KernAutoSuggestClearInput(props, buttonExclusionRef),
            Control: KernAutoSuggestController,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            Input: KernAutoSuggestCustomInput,
            ValueContainer: KernAutoSuggestValueContainer,
          }}
          filterOption={() => true}
          formatOptionLabel={FormatOptionLabel}
          id={name}
          inputId={inputId}
          instanceId={name}
          isClearable={!isDisabled}
          isSearchable={!isDisabled}
          menuShouldScrollIntoView
          name={name}
          noOptionsMessage={({ inputValue }) =>
            inputValue.length > 2 ? noSuggestionMessage : null
          }
          onBlur={() => {
            // call the validation only if an option was selected
            if (optionWasSelected) {
              setOptionWasSelected(false);

              if (hasError) {
                field.validate();
              }
            }
          }}
          onChange={(newValue, { action }) => {
            // remix remove the focus on the input when clicks with the keyboard to clear the value, so we need to force the focus again
            setOptionWasSelected(action === "select-option");
            if (action === "clear" || action === "select-option") {
              focusOnInput(inputId);
              // TODO: check later why the field.validate() is validating all the fields in the form
              if (hasError) {
                field.validate();
              }
            }
            setCurrentItemValue(newValue);
          }}
          onInputChange={onInputChange}
          options={options}
          placeholder={placeholder ?? ""}
          screenReaderStatus={screenReaderStatus(
            rootLoaderData?.accessibilityTranslations,
          )}
          styles={kernCustomStyles()}
          classNames={{
            control: () =>
              classNames("kern-form-input__input bg-white!", {
                "kern-form-input__input--error": hasError,
              }),
          }}
          tabIndex={0}
          value={currentItemValue}
          menuPortalTarget={document.body}
        />
      </div>

      {helperText && (
        <div
          className="label-text mt-6 text-kern-layout-text-muted!"
          id={helperId}
        >
          {helperText}
        </div>
      )}
      <div key={liveMessageKey} aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default KernAutoSuggestInput;
