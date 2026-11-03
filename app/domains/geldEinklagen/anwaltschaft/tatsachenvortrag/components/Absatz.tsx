import { DeleteButton } from "~/components/common/DeleteButton";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { focusOnItem } from "~/domains/geldEinklagen/anwaltschaft/shared/focusOnItem";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { BeweisangeboteList } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/BeweisangeboteList";
import type { Absatz as AbsatzType } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { translations } from "~/services/translations/translations";

export const Absatz = ({
  absatz,
  index,
  hauptantragIndex,
}: {
  absatz: AbsatzType;
  index: number;
  hauptantragIndex: number;
}) => {
  const absatzTitle = `${translations.geldEinklagenAnwaltschaft.absatz.de} ${index + 1}`;
  const deleteArrayItem = useDeleteArrayItem(
    "hauptantrag#absaetze",
    getAbsaetzeBaseUrl(hauptantragIndex),
    focusOnItem(`hauptantrag-${hauptantragIndex}-absatz-`),
  );
  const hasBeweise = absatz.beweise && absatz.beweise.length > 0;
  return (
    <ArrayItemCard
      dataTestId="absatz"
      heading={{
        text: absatzTitle,
        id: `hauptantrag-${hauptantragIndex}-absatz-${index}`,
        level: "h2",
      }}
      content={<p>{absatz.formulierung}</p>}
      editButton={{
        id: `${EDIT_BUTTON_ID_PREFIX}absatz-${index}`,
        ariaLabel: `${absatzTitle} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${getAbsaetzeBaseUrl(hauptantragIndex)}/${index}/daten`,
      }}
      deleteButton={
        <DeleteButton
          label={`${absatzTitle} ${hasBeweise ? translations.geldEinklagenAnwaltschaft.undDazugehoerigeBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
          title={`${absatzTitle} ${hasBeweise ? translations.geldEinklagenAnwaltschaft.undBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}?`}
          onDelete={() => deleteArrayItem(index)}
        />
      }
    >
      <BeweisangeboteList beweise={absatz.beweise} absatzArrayIndex={index} />
    </ArrayItemCard>
  );
};
