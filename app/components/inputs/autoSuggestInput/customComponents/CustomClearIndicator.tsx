import type { RefObject } from "react";
import { components, type ClearIndicatorProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { useTranslations } from "~/services/translations/translationsContext";

const CustomClearIndicator = (
  props: ClearIndicatorProps<DataListOptions, false>,
  buttonExclusionRef: RefObject<HTMLButtonElement>,
) => {
  const { accessibility: translations } = useTranslations();
  return (
    <button
      aria-label={translations["auto-suggestion-input-button-arial"]}
      ref={buttonExclusionRef}
      data-testid="clear-input-button"
      className="outline-none focus-visible:ring-blue-800 focus-visible:ring-4"
      onClick={() => {
        props.clearValue();
      }}
      tabIndex={0}
    >
      <components.ClearIndicator
        className="text-blue-800 hover:text-blue-300"
        {...props}
      />
    </button>
  );
};

export default CustomClearIndicator;
