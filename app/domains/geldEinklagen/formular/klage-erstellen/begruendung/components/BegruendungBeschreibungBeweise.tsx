import { translations } from "~/services/translations/translations";
import { type BegruendungBeschreibungAbschnittProps } from "./BegruendungBeschreibungAbschnitt";
import { BegruendungBeschreibungBeweisItems } from "./BegruendungBeschreibungBeweisItems";
import { BeweiseButtons } from "./BeweiseButtons";

export const BegruendungBeschreibungBeweise = ({
  itemIndexAbschnitt,
  abschnitt,
}: BegruendungBeschreibungAbschnittProps) => {
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

        <BeweiseButtons
          abschnitt={abschnitt}
          itemIndexAbschnitt={itemIndexAbschnitt}
        />
      </div>
    </div>
  );
};
