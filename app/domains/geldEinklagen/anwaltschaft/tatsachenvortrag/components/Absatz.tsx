import Button from "~/components/common/Button";
import { DeleteButton } from "~/components/common/DeleteButton";
import { Icon } from "~/components/common/Icon";
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
  return (
    <div className="flex flex-col gap-kern-space-default">
      <h2
        className="kern-body kern-body--large kern-body--bold p-0!"
        id={`hauptantrag-${hauptantragIndex}-absatz-${index}`}
        tabIndex={-1}
      >
        {absatzTitle}
      </h2>
      <div data-testid="prozessbevollmaechtigte">
        <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
          <div className="flex gap-kern-space-default justify-between items-center">
            <p>{absatz.formulierung}</p>
            <Button
              id={`${EDIT_BUTTON_ID_PREFIX}absatz-${index}`}
              look="secondary"
              iconLeft={
                <Icon
                  name="edit"
                  className="size-kern-dimension-default text-kern-action-default"
                />
              }
              aria-label={`${absatzTitle} ${translations.arraySummary.arrayEditButtonLabel.de}`}
              href={`${getAbsaetzeBaseUrl(hauptantragIndex)}/${index}/daten`}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
          </div>
          <BeweisangeboteList
            beweise={absatz.beweise}
            absatzArrayIndex={index}
          />
          <div className="flex justify-end">
            <DeleteButton
              label={`${absatzTitle} ${absatz.beweise && absatz.beweise.length > 0 ? translations.geldEinklagenAnwaltschaft.undDazugehoerigeBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
              title={`${absatzTitle} ${absatz.beweise && absatz.beweise.length > 0 ? translations.geldEinklagenAnwaltschaft.undBeweisangebote.de : ""} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}?`}
              onDelete={() => deleteArrayItem(index)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
