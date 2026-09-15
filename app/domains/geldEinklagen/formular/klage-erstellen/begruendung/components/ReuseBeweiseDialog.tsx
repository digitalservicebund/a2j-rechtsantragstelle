import { ValidatedForm } from "@rvf/react-router";
import { useEffect } from "react";
import type z from "zod";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { type ErrorMessageProps } from "~/components/common/types";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import RadioGroup from "~/components/formElements/inputs/radio/RadioGroup";
import { translations } from "~/services/translations/translations";

type Props = {
  title: string;
  closeDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  formSchema: z.ZodObject<any>;
  options: Array<{ text: string; value: string }>;
  errorMessages?: ErrorMessageProps[];
  itemIndexAbschnitt: number;
  nextItemBeweis: number;
  beweiseType: "document" | "person";
};

const dialogLabelId = "dialog-label";
const dialogDescriptionId = "dialog-description";

export const ReuseBeweiseDialog = ({
  title,
  closeDialog,
  dialogRef,
  formSchema,
  options,
  errorMessages,
  itemIndexAbschnitt,
  nextItemBeweis,
  beweiseType,
}: Props) => {
  useEffect(() => {
    const dialog = dialogRef?.current;
    if (!dialog) return;

    if (dialog.open) {
      requestAnimationFrame(() => {
        const heading = dialog.querySelector("h2");
        heading?.focus();
      });
    }
  }, [dialogRef]);

  return (
    <ValidatedForm
      schema={formSchema}
      defaultValues={{ "reuse-option": "" }}
      method="post"
      action={"/action/geld-einklagen/reuse-beweise"}
    >
      <dialog
        aria-modal="true"
        ref={dialogRef}
        tabIndex={-1}
        aria-labelledby={dialogLabelId}
        aria-describedby={dialogDescriptionId}
        className="kern-dialog m-auto max-w-l grounded-2xl bg-white p-0"
      >
        <header className="kern-dialog__header">
          <h2
            id={dialogLabelId}
            tabIndex={-1}
            className="kern-title kern-title--large text-wrap"
          >
            {title}
          </h2>
          <Button
            type="button"
            look="ghost"
            iconLeft={
              <Icon name="close" className="fill-kern-action-default!" />
            }
            aria-label={translations.feedback.close.de}
            onClick={closeDialog}
          />
        </header>
        <section
          id={dialogDescriptionId}
          className="kern-dialog__body text-wrap"
        >
          <CsrfInput />
          <input
            type="hidden"
            name="itemIndexAbschnitt"
            value={itemIndexAbschnitt}
          />
          <input type="hidden" name="nextItemBeweis" value={nextItemBeweis} />
          <input type="hidden" name="beweiseType" value={beweiseType} />
          <RadioGroup
            name={"reuse-option"}
            errorMessages={errorMessages}
            options={options}
          />
        </section>
        <footer className="kern-dialog__footer">
          <Button
            onClick={closeDialog}
            look="secondary"
            className="w-fit print:hidden"
          >
            {translations.feedback.cancel.de}
          </Button>
          <Button type="submit" name="_action" value="next" className="w-fit">
            {translations.buttonNavigation.nextButtonDefaultLabel.de}
          </Button>
        </footer>
      </dialog>
    </ValidatedForm>
  );
};
