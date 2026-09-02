import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
import { arrayIsNonEmpty } from "~/util/array";
import { BegruendungBeschreibungBeweisItems } from "./BegruendungBeschreibungBeweisItems";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { geldEinklagenTranslations } from "~/services/translations/domains/geldEinklagen";

const MAX_DOCUMENT_ITEMS = 20;
const MAX_PERSON_ITEMS = 10;

export const BegruendungBeschreibungBeweise = ({
  itemIndexAbschnitte,
  abschnitte,
}: BegruendungBeschreibungAbschnitteProps) => {
  const nextDocumentItemIndex = arrayIsNonEmpty(abschnitte.dokumenten)
    ? abschnitte.dokumenten.length
    : 0;

  const nextPersonItemIndex = arrayIsNonEmpty(abschnitte.personen)
    ? abschnitte.personen.length
    : 0;

  const addDocumentUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/dokumenten/${nextDocumentItemIndex}/daten`;
  const addPersonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/personen/${nextPersonItemIndex}/auswahl`;

  return (
    <div className="flex flex-col p-kern-space-default border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
      <div className="kern-description-list-item">
        <div className="flex flex-col gap-kern-space-small">
          <h3
            className="kern-body kern-body--default kern-body--bold p-0!"
            id={`abschnitt-beweis-${itemIndexAbschnitte}`}
            tabIndex={-1}
          >
            {
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungEvidenceTitle.de
            }
          </h3>
          <span className="kern-body kern-body--default kern-body--regular text-kern-layout-text-muted! text-pretty p-0!">
            {
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungEvidenceDescription.de
            }
          </span>
        </div>

        <BegruendungBeschreibungBeweisItems
          dokumenten={abschnitte.dokumenten}
          personen={abschnitte.personen}
          itemIndexAbschnitte={itemIndexAbschnitte}
        />

        <div className="flex sm:flex-row flex-col gap-24 w-full justify-between py-kern-space-large md:py-0">
          <Button
            href={addDocumentUrl}
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
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungEvidenceAddButton.de
            }
          </Button>
          <Button
            href={addPersonUrl}
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
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungEvidenceAddPersonButton.de
            }
          </Button>
        </div>
      </div>
    </div>
  );
};
