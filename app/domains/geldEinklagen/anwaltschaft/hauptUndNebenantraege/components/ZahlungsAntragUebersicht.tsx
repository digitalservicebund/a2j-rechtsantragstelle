import { useFormFlow } from "~/components/hooks/formFlowContext";
import { arrayIsNonEmpty } from "~/util/array";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BezifferterZahlungsantrag } from "./BezifferterZahlungsantrag";
import { translations } from "~/services/translations/translations";
import { InlineNotice } from "~/components/content/InlineNotice";
import { AddArrayItemButton } from "~/components/common/AddArrayItemButton";

const BASE_URL_ZAHLUNGS_ANTRAG =
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
              userData={userDataGeldEinklagen}
            />
          ))}
        {shouldDisableAddButton && (
          <div className="pb-24">
            <InlineNotice
              title={
                translations.geldEinklagenAnwaltschaft
                  .zahlungsAntragInlineNoticeTitle.de
              }
              tagName={"p"}
              look={"info"}
              content={
                translations.geldEinklagenAnwaltschaft
                  .zahlungsAntragInlineNoticeContent.de
              }
            />
          </div>
        )}
        <AddArrayItemButton
          href={addButtonUrl}
          buttonText={
            translations.geldEinklagenAnwaltschaft.zahlungsAntragHinzufuegen.de
          }
          disabled={shouldDisableAddButton}
          dataTestId="add-zahlungsantrag"
        />
      </div>
    </div>
  );
};

export default ZahlungsAntragUebersicht;
