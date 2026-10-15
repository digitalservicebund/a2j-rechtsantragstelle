import { useMemo } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import { GeldEinklagenAnwaltschaftUserData } from "../userData";

export const BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/sonstige-neben-und-prozessantraege/antrag";

const MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS = 10;
const HauptUndNebenantraegeUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  const userDataGeldEinklagen =
    userData as GeldEinklagenAnwaltschaftUserData;

//   const sonstigeNebenUndProzessantraegeContextValue = useMemo(
//     () => ({ sonstigeNebenUndProzessantraege: userDataGeldEinklagen.sonstigeNebenUndProzessantraege ?? [] }),
//     [userDataGeldEinklagen.sonstigeNebenUndProzessantraege],
//   );


  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.sonstigeNebenUndProzessantraege)
    ? (userDataGeldEinklagen.sonstigeNebenUndProzessantraege?.length ?? 0)
    : 0;

  const addButtonUrl = `${BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE}/${nextItemIndex}/daten`;
  console.log("nextItemIndex:", nextItemIndex, "addButtonUrl:", addButtonUrl);

  const shouldDisableAddButton =
    nextItemIndex >= MAX_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE_ITEMS;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        <div className="flex flex-col items-start gap-24 p-kern-space-default border-1 border-dashed border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white">
          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={addButtonUrl}
            data-testid="add-sonstigeNebenUndProzessantraege"
            fullWidth={true}
            disabled={shouldDisableAddButton}
            aria-disabled={shouldDisableAddButton}
          >
            Neben- oder Prozessantrag hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HauptUndNebenantraegeUebersicht;
