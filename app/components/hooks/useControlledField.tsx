import { useField, useFormContext } from "@rvf/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ControlledFieldConfig } from "~/domains/pageSchemas";
import { type AllowedUserTypes } from "~/domains/userData";

export const useControlledField = (
  fieldName: string,
  controlledFieldConfig?: ControlledFieldConfig,
) => {
  const {
    fieldName: controlledFieldName,
    getScreenReaderAnnouncementText,
    handleFieldValueChange,
  } = controlledFieldConfig ?? {};
  const field = useField<AllowedUserTypes>(fieldName);
  const value = field.value();
  const originalValue = useRef(value).current;
  const form = useFormContext<any>();
  const controlledField = form?.field(controlledFieldName ?? "");
  const [controlledFieldSrValue, setControlledFieldSrValue] =
    useState<string>();

  useEffect(() => {
    async function fieldValueChangeHandler() {
      await handleFieldValueChange?.({
        originalValue,
        value,
        controlledField,
        setControlledFieldSrValue,
      });
    }
    fieldValueChangeHandler();
  }, [value, controlledField, originalValue, handleFieldValueChange]);

  const MemoizedScreenReaderAnnouncement = useMemo(
    () =>
      ScreenReaderAnnouncement(
        getScreenReaderAnnouncementText?.(controlledFieldSrValue ?? "") ?? "",
        controlledFieldSrValue,
      ),
    [controlledFieldSrValue, getScreenReaderAnnouncementText],
  );

  return {
    SrAnnouncementComponent: MemoizedScreenReaderAnnouncement,
  };
};

/**
 * ScreenReader-only element used to read out controlled field changes
 */
function ScreenReaderAnnouncement(
  srText: string,
  controlledFieldSrValue?: string,
) {
  return (
    <div
      aria-live="polite"
      aria-relevant="all"
      aria-atomic="true"
      className="sr-only"
    >
      <span key={controlledFieldSrValue}>
        {controlledFieldSrValue && srText}
      </span>
    </div>
  );
}
