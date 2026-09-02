import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { arrayIsNonEmpty } from "~/util/array";
import BegruendungBeschreibungAbschnitte from "./BegruendungBeschreibungAbschnitte";
import { InlineNotice } from "~/components/content/InlineNotice";
import { geldEinklagenTranslations } from "~/services/translations/domains/geldEinklagen";
import { commonTranslations } from "~/services/translations/common";

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

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.abschnitte)
    ? (userDataGeldEinklagen.abschnitte?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${nextItemIndex}/daten`;

  const shouldDisableAddButton = nextItemIndex >= MAX_ABSCHNITTE_ITEMS;

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
        <div className="flex flex-col items-start gap-24 p-kern-space-default border-1 border-dashed border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white">
          {shouldDisableAddButton && (
            <InlineNotice
              className="w-full"
              tagName="h2"
              look="info"
              title={
                geldEinklagenTranslations.geldEinklagen
                  .begruendungBeschreibungMaximumReachedTitleNotice.de
              }
              content={
                geldEinklagenTranslations.geldEinklagen
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
            {`${geldEinklagenTranslations.geldEinklagen.begruendungBeschreibungHeadline.de} ${commonTranslations.common.add.de}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungUebersicht;
