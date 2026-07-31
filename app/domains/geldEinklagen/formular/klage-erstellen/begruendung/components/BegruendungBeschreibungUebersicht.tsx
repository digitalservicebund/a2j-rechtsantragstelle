import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";
import Button from "~/components/common/Button";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { arrayIsNonEmpty } from "~/util/array";
import BegruendungBeschreibungItems from "./BegruendungBeschreibungItems";

const BegruendungBeschreibungUebersicht = () => {
  const { userData, flowId } = useFormFlow();

  if (flowId !== "/geld-einklagen/formular") {
    return null;
  }

  const userDataGeldEinklagen =
    userData as GeldEinklagenFormularKlageErstellenUserData;

  const nextItemIndex = arrayIsNonEmpty(userDataGeldEinklagen.abschnitte)
    ? String(userDataGeldEinklagen.abschnitte?.length ?? 0)
    : "0";

  const addButtonUrl = `/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/abschnitte/${nextItemIndex}/daten`;

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        {arrayIsNonEmpty(userDataGeldEinklagen.abschnitte) &&
          userDataGeldEinklagen.abschnitte.map((abschnitt, index) => (
            <BegruendungBeschreibungItems
              key={abschnitt.beschreibung}
              itemIndex={index}
              abschnitte={abschnitt}
            />
          ))}
        <div className="flex flex-col items-start p-kern-space-default border border-dotted border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] bg-white ">
          <Button
            look="secondary"
            iconLeft={<Icon name="plus" className="text-kern-action-default" />}
            href={addButtonUrl}
            data-testid="add-abschnitt"
            className="w-full"
          >
            {`${translations.geldEinklagen.begruendungBeschreibungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungUebersicht;
