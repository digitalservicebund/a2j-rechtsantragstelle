import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungAbschnittProps } from "./BegruendungBeschreibungAbschnitt";
import { arrayIsNonEmpty } from "~/util/array";
import { BegruendungBeschreibungBeweisItems } from "./BegruendungBeschreibungBeweisItems";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungAbschnitte } from "./begruendungAbschnitteContext";
import {
  hasDocumentsToBeReusedFromOtherAbschnitte,
  hasPersonenToBeReusedFromOtherAbschnitte,
} from "./reuseBeweise";
import { useRef } from "react";
import { ReuseBeweiseDialog } from "./ReuseBeweiseDialog";
import z from "zod";

const MAX_DOCUMENT_ITEMS = 20;
const MAX_PERSON_ITEMS = 10;

const reuseDialogSchema = z.object({
  "reuse-option": z.enum(["reuse", "new"]),
});

const reuseDocumentsDialogOptions = [
  { text: "Ein bereits genanntes Dokument erneut angeben", value: "reuse" },
  { text: "Ein neues Dokument beschreiben", value: "new" },
];

const reusePersonsDialogOptions = [
  { text: "Eine bereits genannte Person erneut angeben", value: "reuse" },
  { text: "Eine neue Person", value: "new" },
];

const errorMessages = [
  {
    code: "required" as const,
    text: translations.feedback["validation-error"].de,
  },
];

export const BegruendungBeschreibungBeweise = ({
  itemIndexAbschnitt,
  abschnitt,
}: BegruendungBeschreibungAbschnittProps) => {
  const nextDocumentItemIndex = arrayIsNonEmpty(abschnitt.dokumenten)
    ? abschnitt.dokumenten.length
    : 0;

  const nextPersonItemIndex = arrayIsNonEmpty(abschnitt.personen)
    ? abschnitt.personen.length
    : 0;

  const addDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/dokumenten/${nextDocumentItemIndex}/daten`;
  const addPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/personen/${nextPersonItemIndex}/auswahl`;

  const { abschnitte } = useBegruendungAbschnitte();

  const dialogDocumentRef = useRef<HTMLDialogElement>(null);
  const hasDocumentsToBeReused = hasDocumentsToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitt,
  );

  const dialogPersonRef = useRef<HTMLDialogElement>(null);
  const hasPersonsToBeReused = hasPersonenToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitt,
  );

  return (
    <div className="flex flex-col p-kern-space-default border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
      <div className="kern-description-list-item">
        <div className="flex flex-col gap-kern-space-small">
          <h3
            className="kern-body kern-body--default kern-body--bold p-0!"
            id={`abschnitt-beweis-${itemIndexAbschnitt}`}
            tabIndex={-1}
          >
            {translations.geldEinklagen.begruendungBeschreibungEvidenceTitle.de}
          </h3>
          <span className="kern-body kern-body--default kern-body--regular text-kern-layout-text-muted! text-pretty p-0!">
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceDescription.de
            }
          </span>
        </div>

        <BegruendungBeschreibungBeweisItems
          dokumenten={abschnitt.dokumenten}
          personen={abschnitt.personen}
          itemIndexAbschnitt={itemIndexAbschnitt}
        />

        <div className="flex sm:flex-row flex-col gap-24 w-full justify-between py-kern-space-large md:py-0">
          <Button
            href={!hasDocumentsToBeReused ? addDocumentUrl : undefined}
            onClick={() =>
              hasDocumentsToBeReused && dialogDocumentRef.current?.showModal()
            }
            aria-haspopup={hasDocumentsToBeReused ? "dialog" : undefined}
            look="secondary"
            className="text-wrap"
            fullWidth
            disabled={nextDocumentItemIndex >= MAX_DOCUMENT_ITEMS}
            aria-disabled={nextDocumentItemIndex >= MAX_DOCUMENT_ITEMS}
            iconLeft={
              <Icon name={"draft"} className="fill-kern-action-default!" />
            }
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceAddButton.de
            }
          </Button>
          {hasDocumentsToBeReused && (
            <ReuseBeweiseDialog
              dialogRef={dialogDocumentRef}
              title={
                translations.geldEinklagen
                  .begruendungBeschreibungReuseDocumentDialogTitle.de
              }
              closeDialog={() => dialogDocumentRef.current?.close()}
              formSchema={reuseDialogSchema}
              options={reuseDocumentsDialogOptions}
              itemIndexAbschnitt={itemIndexAbschnitt}
              nextItemBeweis={nextDocumentItemIndex}
              errorMessages={errorMessages}
              beweiseType="document"
            />
          )}
          <Button
            href={!hasPersonsToBeReused ? addPersonUrl : undefined}
            onClick={() =>
              hasPersonsToBeReused && dialogPersonRef.current?.showModal()
            }
            aria-haspopup={hasPersonsToBeReused ? "dialog" : undefined}
            look="secondary"
            className="text-wrap"
            fullWidth
            disabled={nextPersonItemIndex >= MAX_PERSON_ITEMS}
            aria-disabled={nextPersonItemIndex >= MAX_PERSON_ITEMS}
            iconLeft={
              <Icon name={"person"} className="fill-kern-action-default!" />
            }
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceAddPersonButton.de
            }
          </Button>
          {hasPersonsToBeReused && (
            <ReuseBeweiseDialog
              dialogRef={dialogPersonRef}
              title={
                translations.geldEinklagen
                  .begruendungBeschreibungReusePersonDialogTitle.de
              }
              closeDialog={() => dialogPersonRef.current?.close()}
              formSchema={reuseDialogSchema}
              options={reusePersonsDialogOptions}
              itemIndexAbschnitt={itemIndexAbschnitt}
              nextItemBeweis={nextPersonItemIndex}
              errorMessages={errorMessages}
              beweiseType="person"
            />
          )}
        </div>
      </div>
    </div>
  );
};
