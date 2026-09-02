import { Badge } from "~/components/common/Badge";
import { type UserData } from "~/domains/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { BeweisItemRow } from "./BeweisItemRow";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { renderPersonItem } from "./BegruendungBeschreibungBeweisItems";
import { type BegruendungBeschreibungAbschnitteProps } from "./BegruendungBeschreibungAbschnitte";
import { geldEinklagenTranslations } from "~/services/translations/domains/geldEinklagen";
import { commonTranslations } from "~/services/translations/common";

type Props = {
  readonly userData: UserData;
};

const renderItems = (userData: UserData) => {
  const dokumenten =
    "dokumenten" in userData && Array.isArray(userData?.dokumenten)
      ? userData?.dokumenten
      : [];

  const personen =
    "personen" in userData && Array.isArray(userData?.personen)
      ? userData?.personen
      : [];

  const hasDocumentItems = arrayIsNonEmpty(dokumenten);
  const hasPersonItems = arrayIsNonEmpty(personen);

  if (!hasDocumentItems && !hasPersonItems) {
    return (
      <div className="flex flex-col gap-kern-space-default">
        <span>
          {commonTranslations.common.noInformationAvailable.de}
        </span>
        <Badge icon="info" variant="info">
          {
            geldEinklagenTranslations.geldEinklagen
              .summaryOverviewBoxBegruendungBeschreibungBeweiseNoDataNotice.de
          }
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {hasDocumentItems &&
        dokumenten.map((dokument, dokumentIndex) => {
          const documentKey = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/dokumenten/${dokumentIndex}/daten`;

          return (
            <BeweisItemRow
              key={documentKey}
              icon="draft"
              content={
                <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
                  {dokument.beschreibung as string}
                </span>
              }
            />
          );
        })}

      {hasPersonItems &&
        personen.map((person, personIndex) => {
          const personKey = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/personen/${personIndex}/auswahl`;

          return (
            <BeweisItemRow
              key={personKey}
              icon="person"
              content={renderPersonItem(
                person as Exclude<
                  BegruendungBeschreibungAbschnitteProps["abschnitte"]["personen"],
                  undefined
                >[number],
              )}
            />
          );
        })}
    </div>
  );
};

export const SummaryOverviewBoxBegruendungBeschreibungBeweise = ({
  userData,
}: Props) => {
  return (
    <div className="flex flex-col gap-kern-space-small">
      <h3 className="kern-body kern-body--default kern-body--bold p-0!">
        {
          geldEinklagenTranslations.geldEinklagen
            .begruendungBeschreibungEvidenceTitle.de
        }
      </h3>

      {renderItems(userData)}
    </div>
  );
};
