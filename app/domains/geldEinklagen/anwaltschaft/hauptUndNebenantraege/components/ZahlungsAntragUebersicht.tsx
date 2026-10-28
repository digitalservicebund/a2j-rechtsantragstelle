import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BezifferterZahlungsantrag } from "./BezifferterZahlungsantrag";
import { translations } from "~/services/translations/translations";

export const BASE_URL_ZAHLUNGS_ANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 50;

const ZahlungsAntragUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag)
    ? (userDataGeldEinklagen.hauptantrag?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_ZAHLUNGS_ANTRAG}/${nextItemIndex}/daten`;

  const shouldDisableAddButton =
    nextItemIndex >= MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {arrayIsNonEmpty(userDataGeldEinklagen.hauptantrag) &&
          userDataGeldEinklagen.hauptantrag.map((item, index) => (
            <BezifferterZahlungsantrag
              key={item.internesSchlagwortFordureung}
              itemIndex={index}
              item={item}
              index={index}
            />
          ))}
        <div className="flex flex-col items-start gap-24 p-kern-space-default border-1 border-dashed border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white">
          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={addButtonUrl}
            data-testid="add-zahlungsantrag"
            fullWidth={true}
            disabled={shouldDisableAddButton}
            aria-disabled={shouldDisableAddButton}
          >
            {
              translations.geldEinklagenAnwaltschaft.zahlungsAntragHinzufuegen
                .de
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZahlungsAntragUebersicht;
