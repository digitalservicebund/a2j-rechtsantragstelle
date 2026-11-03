import { translations } from "~/services/translations/translations";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { arrayIsNonEmpty } from "~/util/array";
import BegruendungBeschreibungAbschnitt from "./BegruendungBeschreibungAbschnitt";
import { InlineNotice } from "~/components/content/InlineNotice";
import { BegruendungAbschnitteContext } from "./begruendungAbschnitteContext";
import { useMemo } from "react";
import { AddArrayItemButton } from "~/components/common/AddArrayItemButton";

export const BASE_URL_BESCHREIBUNG_ABSCHNITTE =
  "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte";

const MAX_ABSCHNITTE_ITEMS = 50;

const BegruendungBeschreibungUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/formular") {
    return null;
  }

  const userDataGeldEinklagen =
    userData as GeldEinklagenFormularKlageErstellenUserData;

  const abschnitteContextValue = useMemo(
    () => ({ abschnitte: userDataGeldEinklagen.abschnitte ?? [] }),
    [userDataGeldEinklagen.abschnitte],
  );

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.abschnitte)
    ? (userDataGeldEinklagen.abschnitte?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${nextItemIndex}/daten`;

  const shouldDisableAddButton = nextItemIndex >= MAX_ABSCHNITTE_ITEMS;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {arrayIsNonEmpty(userDataGeldEinklagen.abschnitte) && (
          <BegruendungAbschnitteContext.Provider value={abschnitteContextValue}>
            {userDataGeldEinklagen.abschnitte.map((abschnitt, index) => (
              <BegruendungBeschreibungAbschnitt
                // oxlint-disable-next-line react/no-array-index-key
                key={index}
                itemIndexAbschnitt={index}
                abschnitt={abschnitt}
              />
            ))}
          </BegruendungAbschnitteContext.Provider>
        )}
        <AddArrayItemButton
          href={addButtonUrl}
          disabled={shouldDisableAddButton}
          dataTestId="add-abschnitt"
          buttonText={`${translations.geldEinklagen.begruendungBeschreibungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`}
          additionalContent={
            shouldDisableAddButton && (
              <InlineNotice
                className="w-full"
                tagName="h2"
                look="info"
                title={
                  translations.geldEinklagen
                    .begruendungBeschreibungMaximumReachedTitleNotice.de
                }
                content={
                  translations.geldEinklagen
                    .begruendungBeschreibungMaximumReachedContentNotice.de
                }
                wrap
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default BegruendungBeschreibungUebersicht;
