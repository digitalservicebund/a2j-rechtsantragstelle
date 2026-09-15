import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
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

const MAX_DOCUMENT_ITEMS = 20;
const MAX_PERSON_ITEMS = 10;

export const BegruendungBeschreibungBeweise = ({
  itemIndexAbschnitte,
  abschnitt,
}: BegruendungBeschreibungAbschnitteProps) => {
  const nextDocumentItemIndex = arrayIsNonEmpty(abschnitt.dokumenten)
    ? abschnitt.dokumenten.length
    : 0;

  const nextPersonItemIndex = arrayIsNonEmpty(abschnitt.personen)
    ? abschnitt.personen.length
    : 0;

  const addDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/dokumenten/${nextDocumentItemIndex}/daten`;
  const addPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/personen/${nextPersonItemIndex}/auswahl`;

  const { abschnitte } = useBegruendungAbschnitte();

  const dialogDocumentRef = useRef<HTMLDialogElement>(null);
  const hasDocumentsToBeReused = hasDocumentsToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitte,
  );

  const dialogPersonRef = useRef<HTMLDialogElement>(null);
  const hasPersonsToBeReused = hasPersonenToBeReusedFromOtherAbschnitte(
    abschnitte,
    itemIndexAbschnitte,
  );

  return (
    <div className="flex flex-col p-kern-space-default border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
      <div className="kern-description-list-item">
        <div className="flex flex-col gap-kern-space-small">
          <h3
            className="kern-body kern-body--default kern-body--bold p-0!"
            id={`abschnitt-beweis-${itemIndexAbschnitte}`}
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
          itemIndexAbschnitte={itemIndexAbschnitte}
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
          <ReuseBeweiseDialog
            dialogRef={dialogDocumentRef}
            title={"Beweis: Bereits genannte Dokumente erneut angeben?"}
            closeDialog={() => dialogDocumentRef.current?.close()}
          />
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
          <ReuseBeweiseDialog
            dialogRef={dialogPersonRef}
            title={
              "Beweis: Bereits genannte Zeugen oder Zeuginnen erneut angeben?"
            }
            closeDialog={() => dialogPersonRef.current?.close()}
          />
        </div>
      </div>
    </div>
  );
};
