import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungItemsProps } from "./BegruendungBeschreibungItems";
import { arrayIsNonEmpty } from "~/util/array";

const baseUrl =
  "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte";

export const BegruendungBeschreibungBeweise = ({
  itemIndex,
  abschnitte,
}: BegruendungBeschreibungItemsProps) => {
  const nextDocumentItemIndex = arrayIsNonEmpty(abschnitte.dokumenten)
    ? String(abschnitte.dokumenten.length)
    : "0";

  const nextPersonItemIndex = arrayIsNonEmpty(abschnitte.personen)
    ? String(abschnitte.personen.length)
    : "0";

  const addDocumentUrl = `${baseUrl}/${itemIndex}/dokumenten/${nextDocumentItemIndex}/daten`;
  const addPersonUrl = `${baseUrl}/${itemIndex}/personen/${nextPersonItemIndex}/auswahl`;

  return (
    <div className="flex flex-col p-kern-space-default border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
      <div className="kern-description-list-item">
        <div className="flex flex-col gap-kern-space-small">
          <span className="kern-body kern-body--default kern-body--bold p-0!">
            {translations.geldEinklagen.begruendungBeschreibungEvidenceTitle.de}
          </span>
          <span className="kern-body kern-body--default kern-body--regular text-kern-layout-text-muted! text-pretty p-0!">
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceDescription.de
            }
          </span>
        </div>

        <div className="flex gap-24 w-full justify-between">
          <Button
            href={addDocumentUrl}
            look="secondary"
            className="w-full"
            iconLeft={
              <Icon name={"draft"} className="fill-kern-action-default!" />
            }
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceAddButton.de
            }
          </Button>
          <Button
            href={addPersonUrl}
            look="secondary"
            className="w-full"
            iconLeft={
              <Icon
                name={"local-library"}
                className="fill-kern-action-default!"
              />
            }
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungEvidenceAddPersonButton.de
            }
          </Button>
        </div>
      </div>
    </div>
  );
};
