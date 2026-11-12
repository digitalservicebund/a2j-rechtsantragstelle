import { DeleteButton } from "~/components/common/DeleteButton";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { focusOnItem } from "~/domains/geldEinklagen/anwaltschaft/shared/focusOnItem";
import { useAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeContext";
import { BeweisangeboteList } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/BeweisangeboteList";
import type { Absatz as AbsatzType } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import type { OrderedBeweis } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/beweisOrdering";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { translations } from "~/services/translations/translations";

export const Absatz = ({
  absatz,
  index,
  beweise,
}: {
  absatz: AbsatzType;
  index: number;
  beweise: OrderedBeweis[];
}) => {
  const absatzTitle = `${translations.geldEinklagenAnwaltschaft.absatz.de} ${index + 1}`;
  const { absaetzeBaseUrl, absaetzeArrayName } = useAbsaetze();
  const deleteArrayItem = useDeleteArrayItem(
    absaetzeArrayName,
    absaetzeBaseUrl,
    focusOnItem("absatz-"),
  );
  const hasBeweise = absatz.beweise && absatz.beweise.length > 0;
  return (
    <ArrayItemCard
      dataTestId="absatz"
      heading={{
        text: absatzTitle,
        id: `absatz-${index}`,
        level: "h2",
      }}
      content={<p>{absatz.formulierung}</p>}
      editButton={{
        id: `${EDIT_BUTTON_ID_PREFIX}absatz-${index}`,
        ariaLabel: `${absatzTitle} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${absaetzeBaseUrl}/${index}/daten`,
      }}
      deleteButton={
        <DeleteButton
          label={`${absatzTitle} ${hasBeweise ? translations.geldEinklagenAnwaltschaft.undDazugehoerigeBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
          title={`${absatzTitle} ${hasBeweise ? translations.geldEinklagenAnwaltschaft.undBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}?`}
          onDelete={() => deleteArrayItem(index)}
        />
      }
    >
      <BeweisangeboteList beweise={beweise} absatzArrayIndex={index} />
    </ArrayItemCard>
  );
};
