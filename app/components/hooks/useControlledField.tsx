import { useField, useFormContext } from "@rvf/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ControlledFieldConfig } from "~/domains/pageSchemas";
import { type AllowedUserTypes } from "~/domains/userData";

export const useControlledField = (
  fieldName: string,
  controlledFieldConfig: ControlledFieldConfig,
) => {
  const {
    controlledFieldName,
    getScreenreaderAnnouncementText,
    handleFieldValueChange,
  } = controlledFieldConfig;
  const field = useField<AllowedUserTypes>(fieldName);
  const fieldValue = field.value();
  const originalFieldValue = useRef(fieldValue).current;
  const form = useFormContext<any>();
  const controlledField = form?.field(controlledFieldName);
  const [controlledFieldSrValue, setControlledFieldSrValue] =
    useState<string>();

  useEffect(() => {
    async function fieldValueChangeHandler() {
      await handleFieldValueChange({
        originalFieldValue: originalFieldValue,
        fieldValue,
        controlledField,
        setControlledFieldSrValue,
      });
    }
    fieldValueChangeHandler();
  }, [fieldValue, controlledField, originalFieldValue, handleFieldValueChange]);

  const MemoizedScreenreaderAnnouncement = useMemo(
    () =>
      ScreenreaderAnnouncement(
        getScreenreaderAnnouncementText(controlledFieldSrValue ?? "") ?? "",
        controlledFieldSrValue,
      ),
    [controlledFieldSrValue, getScreenreaderAnnouncementText],
  );

  return {
    SrAnnouncementComponent: MemoizedScreenreaderAnnouncement,
  };
};

/**
 * Screenreader-only element used to read out controlled field changes
 */
function ScreenreaderAnnouncement(
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
