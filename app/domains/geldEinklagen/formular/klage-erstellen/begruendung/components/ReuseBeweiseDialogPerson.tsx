import { ValidatedForm } from "@rvf/react-router";
import { useEffect } from "react";
import z from "zod";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import RadioGroup from "~/components/formElements/inputs/radio/RadioGroup";
import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungAbschnittProps } from "./BegruendungBeschreibungAbschnitt";

type Props = {
  closeDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  itemIndexAbschnitt: number;
  nextItemBeweis: number;
  abschnittPersons: BegruendungBeschreibungAbschnittProps["abschnitt"]["personen"];
};

const dialogLabelId = "dialog-label";
const dialogDescriptionId = "dialog-description";

const reuseDialogSchema = z.object({
  "reuse-option": z.enum(["reuse", "new", "beklagte", "klagende"]),
});

const errorMessages = [
  {
    code: "required" as const,
    text: translations.feedback["validation-error"].de,
  },
];

export const ReuseBeweiseDialogPerson = ({
  closeDialog,
  dialogRef,
  itemIndexAbschnitt,
  nextItemBeweis,
  abschnittPersons,
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

  const hasBeklagtePerson = abschnittPersons?.some(
    (person) => person.personAuswahl === "beklagte",
  );
  const hasKlagendePerson = abschnittPersons?.some(
    (person) => person.personAuswahl === "klagende",
  );

  const dialogOptions = [
    { text: "Eine bereits genannte Person erneut angeben", value: "reuse" },
    { text: "Eine neue Person", value: "new" },
    {
      text: "Die klagende Person (mich selbst)",
      value: "klagende",
      disabled: hasKlagendePerson,
    },
    {
      text: "Die beklagte Person",
      value: "beklagte",
      disabled: hasBeklagtePerson,
    },
  ];

  return (
    <ValidatedForm
      schema={reuseDialogSchema}
      defaultValues={{ "reuse-option": "reuse" }}
      method="post"
      action={"/action/geld-einklagen/reuse-beweise-person"}
      onSubmitSuccess={closeDialog}
    >
      <dialog
        aria-modal="true"
        ref={dialogRef}
        tabIndex={-1}
        aria-labelledby={dialogLabelId}
        aria-describedby={dialogDescriptionId}
        className="kern-dialog m-auto max-w-l rounded-2xl bg-white p-0"
      >
        <header className="kern-dialog__header">
          <h2
            id={dialogLabelId}
            tabIndex={-1}
            className="kern-title kern-title--large text-wrap"
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungReusePersonDialogTitle.de
            }
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
          <RadioGroup
            name={"reuse-option"}
            errorMessages={errorMessages}
            options={dialogOptions}
          />
        </section>
        <footer className="kern-dialog__footer">
          <Button onClick={closeDialog} look="secondary" className="w-fit">
            {translations.feedback.cancel.de}
          </Button>
          <Button
            type="submit"
            name="_dialog_action"
            value="next"
            className="w-fit"
          >
            {translations.buttonNavigation.nextButtonDefaultLabel.de}
          </Button>
        </footer>
      </dialog>
    </ValidatedForm>
  );
};
