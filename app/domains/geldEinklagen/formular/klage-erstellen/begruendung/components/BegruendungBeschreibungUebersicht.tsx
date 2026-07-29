import { Icon } from "~/components/common/Icon";
import { translations as translationProvider } from "~/services/translations/translations";
import Button from "~/components/common/Button";

const BegruendungBeschreibungUebersicht = () => {
  const addButtonUrl =
    "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/0/abschnitte";

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        <Button
          look="secondary"
          iconLeft={<Icon name="plus" className="text-kern-action-default" />}
          href={addButtonUrl}
          data-testid="add-abschnitt"
        >
          {`Abschnitt ${translationProvider.arraySummary.arrayAddButtonLabel.de}`}
        </Button>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungUebersicht;
