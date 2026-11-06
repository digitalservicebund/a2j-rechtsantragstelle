import React, { useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router";
import { type FormApi } from "@rvf/react-router";
import { type UserData } from "~/domains/userData";
import { DialogWithButtons } from "../common/dialog/DialogWithButtons";

type UnsavedChangesModalProps = {
  form: FormApi<any>;
  isSubmitting?: boolean;
};

const allowedPaths = ["/persoenliche-daten-loeschen"];

const isAllowed = (targetPathOrUrl: string) => {
  return allowedPaths.some((allowed) => {
    let targetPath = targetPathOrUrl;
    try {
      const parsed = new URL(targetPathOrUrl, window.location.origin);
      targetPath = parsed.pathname;
    } catch {
      // relative path
    }

    const normTarget = targetPath.replace(/\/+$/, "") || "/";
    const normAllowed = allowed.replace(/\/+$/, "") || "/";

    if (normTarget === normAllowed) {
      return true;
    }

    if (normAllowed !== "/" && normTarget.startsWith(`${normAllowed}/`)) {
      return true;
    }

    return false;
  });
};

function isAnyVisibleFieldDirty(form: FormApi<any>): boolean {
  const formElement = document.querySelector(
    "form#form-flow",
  ) as HTMLFormElement;
  if (!formElement) return false;

  // Query all interactive input elements
  const elements = formElement.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input, select, textarea");

  const checkedNames = new Set<string>();

  const stepData = form.defaultValue() as UserData;

  const allValuesUndefined = Object.values(stepData).every(
    (val) => val === undefined,
  );

  if (allValuesUndefined) {
    return false;
  }

  for (const element of Array.from(elements)) {
    const name = element.name;
    const isAutoSuggestionInput =
      element.parentElement &&
      element.parentElement.className.includes("auto-suggestion-input-div");

    // Ignore nameless elements
    if (!name) {
      continue;
    }

    // Ignore hidden inputs that are not auto suggestion
    if (element.type === "hidden" && !isAutoSuggestionInput) {
      continue;
    }

    if (checkedNames.has(name)) {
      continue;
    }
    checkedNames.add(name);

    if (
      form.dirty(name) ||
      // Workaround for the autosuggestion input
      (isAutoSuggestionInput &&
        form.getInputProps(name).defaultValue !== element.value)
    ) {
      return true;
    }
  }

  return false;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  form,
  isSubmitting = false,
}) => {
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (
      isSubmitting ||
      currentLocation.pathname === nextLocation.pathname ||
      isAllowed(nextLocation.pathname)
    )
      return false;

    return isAnyVisibleFieldDirty(form);
  });

  useEffect(() => {
    if (isSubmitting) return;

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      if (!href || href.startsWith("#") || targetAttr === "_blank") {
        return;
      }

      if (isAllowed(anchor.href) || isAllowed(href)) {
        return;
      }

      if (isAnyVisibleFieldDirty(form)) {
        event.preventDefault();
        event.stopPropagation();
        setPendingExternalUrl(anchor.href);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [form, isSubmitting]);

  const isModalOpen =
    blocker.state === "blocked" || pendingExternalUrl !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isModalOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isModalOpen]);

  const handleCancel = () => {
    dialogRef.current?.close();
    if (blocker.state === "blocked") {
      blocker.reset();
    }
    setPendingExternalUrl(null);
  };

  const handleConfirmLeave = () => {
    dialogRef.current?.close();
    if (blocker.state === "blocked") {
      blocker.proceed();
    } else if (pendingExternalUrl) {
      window.location.href = pendingExternalUrl;
    }
    setPendingExternalUrl(null);
  };

  // Keep DeleteDialog mounted at all times so dialogRef stays attached to the DOM node
  return (
    <DialogWithButtons
      title="Bearbeitung abbrechen?"
      description={
        <p>
          Mögliche Änderungen auf dieser Seite wurden noch nicht gespeichert.
          Sie gehen verloren, wenn Sie die Bearbeitung jetzt abbrechen.
        </p>
      }
      leftButton={{
        onClick: handleCancel,
        description: "Weiter bearbeiten",
      }}
      rightButton={{
        onClick: handleConfirmLeave,
        description: "Abbrechen ohne zu speichern",
      }}
      dialogRef={dialogRef}
      pending={false}
    />
  );
};
