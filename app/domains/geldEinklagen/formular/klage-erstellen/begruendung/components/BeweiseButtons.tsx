import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungAbschnittProps } from "./BegruendungBeschreibungAbschnitt";
import { ReuseBeweiseDialogDocument } from "./ReuseBeweiseDialogDocument";
import { ReuseBeweiseDialogPerson } from "./ReuseBeweiseDialogPerson";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import z from "zod";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import {
  hasDocumentsToBeReusedFromOtherAbschnitte,
  hasPersonenToBeReusedFromOtherAbschnitte,
} from "./reuseBeweise";
import { useRef } from "react";
import { useBegruendungAbschnitte } from "./begruendungAbschnitteContext";
import { arrayIsNonEmpty } from "~/util/array";

const MAX_DOCUMENT_ITEMS = 20;
const MAX_PERSON_ITEMS = 10;

export const reuseDialogPersonSchema = z.object({
  "reuse-option-person": z.enum(["reuse", "new", "beklagte", "klagende"]),
});

const reuseDialogDocumentSchema = z.object({
  "reuse-option-document": z.enum(["reuse", "new"]),
});

const uncheckedRadios = (option: "person" | "document") => {
  document
    .querySelectorAll<HTMLInputElement>(
      `input[type="radio"][name="reuse-option-${option}"]:checked`,
    )
    .forEach((radio) => (radio.checked = false));
};

export const BeweiseButtons = ({
  itemIndexAbschnitt,
  abschnitt,
}: BegruendungBeschreibungAbschnittProps) => {
  const jsAvailable = useJsAvailable();

  const nextDocumentItemIndex = arrayIsNonEmpty(abschnitt.dokumenten)
    ? abschnitt.dokumenten.length
    : 0;

  const nextPersonItemIndex = arrayIsNonEmpty(abschnitt.personen)
    ? abschnitt.personen.length
    : 0;

  const addDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/dokumenten/${nextDocumentItemIndex}/daten`;
  const addPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/personen/${nextPersonItemIndex}/auswahl`;
  const reuseDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/beweis-dokument-wiederverwenden`;
  const reusePersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/beweis-person-wiederverwenden`;

  const { abschnitte } = useBegruendungAbschnitte();

  const dialogDocumentRef = useRef<HTMLDialogElement>(null);
  const hasDocumentsToBeReused = hasDocumentsToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitt,
  );
  const hasPersonsToBeReused = hasPersonenToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitt,
  );
  const dialogPersonRef = useRef<HTMLDialogElement>(null);

  const closePersonDialog = () => {
    dialogPersonRef.current?.close();
    uncheckedRadios("person");
  };

  const closeDocumentDialog = () => {
    dialogDocumentRef.current?.close();
    uncheckedRadios("document");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-24 w-full py-kern-space-large md:py-0">
      <div className="order-1">
        <Button
          href={
            !hasDocumentsToBeReused || !jsAvailable ? addDocumentUrl : undefined
          }
          onClick={() =>
            hasDocumentsToBeReused &&
            jsAvailable &&
            dialogDocumentRef.current?.showModal()
          }
          aria-haspopup={
            hasDocumentsToBeReused && jsAvailable ? "dialog" : undefined
          }
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
              .begruendungBeschreibungEvidenceAddDocumentButton.de
          }
        </Button>
        {hasDocumentsToBeReused && jsAvailable && (
          <ReuseBeweiseDialogDocument
            dialogRef={dialogDocumentRef}
            closeDialog={closeDocumentDialog}
            itemIndexAbschnitt={itemIndexAbschnitt}
            nextItemBeweis={nextDocumentItemIndex}
            formSchema={reuseDialogDocumentSchema}
          />
        )}
      </div>

      <div className="order-3 sm:order-2">
        <Button
          href={jsAvailable ? undefined : addPersonUrl}
          onClick={() => jsAvailable && dialogPersonRef.current?.showModal()}
          aria-haspopup={jsAvailable ? "dialog" : undefined}
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

        {jsAvailable && (
          <ReuseBeweiseDialogPerson
            dialogRef={dialogPersonRef}
            closeDialog={closePersonDialog}
            itemIndexAbschnitt={itemIndexAbschnitt}
            nextItemBeweis={nextPersonItemIndex}
            abschnittPersons={abschnitt.personen}
            hasPersonsToBeReused={hasPersonsToBeReused}
            formSchema={reuseDialogPersonSchema}
          />
        )}
      </div>

      {!jsAvailable && (hasPersonsToBeReused || hasDocumentsToBeReused) && (
        <>
          <noscript className="order-2 sm:order-3">
            {hasDocumentsToBeReused && (
              <div>
                <Button
                  href={reuseDocumentUrl}
                  look="secondary"
                  className="text-wrap"
                  fullWidth
                  disabled={nextDocumentItemIndex >= MAX_DOCUMENT_ITEMS}
                  aria-disabled={nextDocumentItemIndex >= MAX_DOCUMENT_ITEMS}
                  iconLeft={
                    <Icon
                      name={"draft"}
                      className="fill-kern-action-default!"
                    />
                  }
                >
                  {
                    translations.geldEinklagen
                      .begruendungBeschreibungReuseDocumentDialogDescription.de
                  }
                </Button>
              </div>
            )}
          </noscript>

          {hasPersonsToBeReused && (
            <noscript className="order-4">
              <div>
                <Button
                  href={reusePersonUrl}
                  look="secondary"
                  className="text-wrap"
                  fullWidth
                  disabled={nextPersonItemIndex >= MAX_PERSON_ITEMS}
                  aria-disabled={nextPersonItemIndex >= MAX_PERSON_ITEMS}
                  iconLeft={
                    <Icon
                      name={"person"}
                      className="fill-kern-action-default!"
                    />
                  }
                >
                  {
                    translations.geldEinklagen
                      .begruendungBeschreibungReusePersonDialogDescription.de
                  }
                </Button>
              </div>
            </noscript>
          )}
        </>
      )}
    </div>
  );
};
