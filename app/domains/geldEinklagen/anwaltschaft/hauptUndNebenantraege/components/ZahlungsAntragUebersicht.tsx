import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

export const BASE_URL_ZAHLUNGS_ANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/antrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 50;

const ZahlungsAntragUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const userDataGeldEinklagen = userData as GeldEinklagenAnwaltschaftUserData;

  const nextItemIndex = arrayIsNonEmpty(
    userDataGeldEinklagen.sonstigeNebenUndProzessantraege,
  )
    ? (userDataGeldEinklagen.sonstigeNebenUndProzessantraege?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_ZAHLUNGS_ANTRAG}/${nextItemIndex}/daten`;

  const shouldDisableAddButton =
    nextItemIndex >= MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {/* {arrayIsNonEmpty(
          userDataGeldEinklagen.sonstigeNebenUndProzessantraege,
        ) &&
          userDataGeldEinklagen.sonstigeNebenUndProzessantraege.map(
            (item, index) => (
              <SonstigeNebenUndProzessantraege
                key={item.antrag}
                itemIndex={index}
                item={item}
                onDelete={onSonstigeNebenUndProzessantraegeDelete}
              />
            ),
          )} */}
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
           Zahlungsantrag hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZahlungsAntragUebersicht;
