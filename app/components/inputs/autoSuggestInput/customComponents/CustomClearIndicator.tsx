import CloseIcon from "@digitalservicebund/icons/Close";
import type { RefObject } from "react";
import { useRouteLoaderData } from "react-router";
import type { ClearIndicatorProps } from "react-select";
import { type RootLoader } from "~/root";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";

const AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY =
  "auto-suggestion-input-button-arial";

const CustomClearIndicator = (
  props: ClearIndicatorProps<DataListOptions, false>,
  buttonExclusionRef: RefObject<HTMLButtonElement | null>,
) => {
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");
  return (
    <button
      aria-label={getTranslationByKey(
        AUTO_SUGGESTION_INPUT_BUTTON_ARIAL_KEY,
        rootLoaderData?.accessibilityTranslations,
      )}
      ref={buttonExclusionRef}
      data-testid="clear-input-button"
      className="outline-none focus-visible:outline-blue-800 focus-visible:outline-4 outline-offset-4 hover:outline-[2px] hover:outline-gray-900"
      onClick={() => {
        props.clearValue();
      }}
      onTouchStart={() => {
        props.clearValue();
      }}
      tabIndex={0}
    >
      <CloseIcon className="text-blue-800 forced-colors:text-[ButtonText]" />
    </button>
  );
};

export default CustomClearIndicator;
