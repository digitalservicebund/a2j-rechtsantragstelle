import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from ".";
import { useState, forwardRef } from "react";
import { useCombobox } from "downshift";
import airports from "data/airports/data.json";

export type SuggestionInputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  errorMessages?: ErrorMessageProps[];
  helperText?: string;
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
  formId?: string;
  dataList?: "airports";
}>;

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
  description: string;
  subDescription?: string;
}

function getDataListOptions(dataListType?: string): DataListOptions[] {
  if (dataListType === "airports") {
    return [...airports]
      .sort((a, b) => a.iata.localeCompare(b.iata))
      .map((airport) => ({
        value: airport.iata,
        description: airport.airport.includes(airport.city)
          ? `${airport.airport} (${airport.iata})`
          : `${airport.city} ${airport.airport} (${airport.iata})`,
        subDescription: `${airport.city}, ${airport.country}`,
      }));
  }
  return [];
}

function getItemsFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function itemsFilter(item: DataListOptions) {
    if (inputValue.length <= 2) {
      return true;
    }

    return item.description.toLowerCase().includes(lowerCasedInputValue);
  };
}

const SuggestionInput = forwardRef<HTMLInputElement, SuggestionInputProps>(
  function SuggestionInputComponent(
    {
      name,
      label,
      type = "text",
      step,
      placeholder,
      prefix,
      suffix,
      errorMessages,
      helperText,
      width,
      formId,
      dataList,
    },
    ref,
  ) {
    const [originalItems, setOriginalItems] = useState(
      getDataListOptions(dataList),
    );
    const [items, setItems] = useState(getDataListOptions(dataList));
    const remixField = useField(name, {
      formId,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [selectChangeItem, setSelectChangeItem] = useState(
      remixField.getInputProps().defaultValue ?? "",
    );

    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      highlightedIndex,
      getInputProps,
      getItemProps,
      selectedItem,
    } = useCombobox({
      onInputValueChange({ inputValue }) {
        if (!inputValue || inputValue.length === 0) {
          setItems(originalItems);
        } else {
          setItems(originalItems.filter(getItemsFilter(inputValue)));
        }
      },
      items,
      itemToString(item) {
        return item ? item.description : "";
      },
      initialInputValue: originalItems.find(
        (originalItem) =>
          originalItem.value === remixField.getInputProps().defaultValue,
      )?.description,
      onSelectedItemChange({ selectedItem: newSelectedItem }) {
        console.log("selected" + newSelectedItem.value);
        setSelectChangeItem(newSelectedItem.value);
      },
      onStateChange({ selectedItem: newSelectedItem }) {
        if (typeof newSelectedItem === "undefined") {
          setSelectChangeItem("ERROR");
        }
      },
    });
    const errorId = `${name}-error`;
    const helperId = `${name}-helper`;

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    console.log("selected 2" + selectChangeItem);

    return (
      <>
        {label && <InputLabel id={name}>{label}</InputLabel>}
        <div className="ds-input-group">
          {prefix && <div className="ds-input-prefix">{prefix}</div>}
          <input
            {...getInputProps({
              type: type === "number" ? "text" : type,
              step,
              inputMode: type === "number" ? "decimal" : undefined,
              placeholder,
            })}
            className={classNames(
              "ds-input",
              { "has-error": remixField.error },
              width && widthClass(width),
            )}
            aria-invalid={remixField.error !== undefined}
            aria-describedby={[
              remixField.error && errorId,
              helperText && helperId,
            ].join(" ")}
            aria-errormessage={remixField.error && errorId}
          />
          <input
            type="hidden"
            {...remixField.getInputProps({
              id: name,
              step,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value: selectChangeItem,
            })}
            ref={ref}
          />
          {suffix && <div className="ds-input-suffix">{suffix}</div>}
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
        <div className="ds-input-group">
          <ul
            className={`absolute w-auto bg-white mt-1 shadow-md max-h-96 overflow-scroll p-0 z-10 ${
              !(isOpen && items.length) && "hidden"
            }`}
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item, index) => (
                <li
                  className={classNames(
                    highlightedIndex === index && "bg-blue-300",
                    selectedItem === item && "font-bold",
                    "w-auto py-2 px-3 shadow-sm flex flex-col",
                  )}
                  key={item.value}
                  {...getItemProps({ item, index })}
                >
                  <span>{item.description}</span>
                  {item.subDescription && (
                    <span className="text-sm text-gray-700">
                      {item.subDescription}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className="label-text mt-6" id={helperId}>
          {helperText}
        </div>
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === remixField.error)?.text ??
            remixField.error}
        </InputError>
      </>
    );
  },
);

export default SuggestionInput;
