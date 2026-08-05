import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";
import Button from "~/components/common/Button";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { arrayIsNonEmpty } from "~/util/array";
import BegruendungBeschreibungAbschnitte from "./BegruendungBeschreibungAbschnitte";
import { InlineNotice } from "~/components/content/InlineNotice";

export const BASE_URL_BESCHREIBUNG_ABSCHNITTE =
  "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte";

const BegruendungBeschreibungUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/formular") {
    return null;
  }

  const userDataGeldEinklagen =
    userData as GeldEinklagenFormularKlageErstellenUserData;

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.abschnitte)
    ? (userDataGeldEinklagen.abschnitte?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${nextItemIndex}/daten`;

  const shouldDisableAddButton = nextItemIndex >= 50;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {arrayIsNonEmpty(userDataGeldEinklagen.abschnitte) &&
          userDataGeldEinklagen.abschnitte.map((abschnitt, index) => (
            <BegruendungBeschreibungAbschnitte
              // oxlint-disable-next-line react/no-array-index-key
              key={index}
              itemIndexAbschnitte={index}
              abschnitte={abschnitt}
            />
          ))}
        <div className="flex flex-col items-start gap-24 p-kern-space-default border border-dotted border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white">
          {shouldDisableAddButton && (
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
          )}

          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={addButtonUrl}
            data-testid="add-abschnitt"
            fullWidth={true}
            disabled={shouldDisableAddButton}
            aria-disabled={shouldDisableAddButton}
          >
            {`${translations.geldEinklagen.begruendungBeschreibungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungUebersicht;
