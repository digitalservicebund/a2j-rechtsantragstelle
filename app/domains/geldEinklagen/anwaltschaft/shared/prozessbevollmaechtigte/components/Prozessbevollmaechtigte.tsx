import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { translations } from "~/services/translations/translations";
import { type KlageParteiVerhaeltnis } from "../../klageParties/klagePartySchemas";
import {
  getBaseProzessbevollmaechtigteUrl,
  getProzessbevollmaechtigteArrayName,
} from "../prozessbevollmaechtigteHelpers";
import { type Prozessbevollmaechtigte as ProzessbevollmaechtigteData } from "../prozessbevollmaechtigteSchemas";

const Prozessbevollmaechtigte = ({
  prozessbevollmaechtigte,
  index,
  relationship,
}: {
  readonly prozessbevollmaechtigte: ProzessbevollmaechtigteData[number];
  readonly index: number;
  readonly relationship: KlageParteiVerhaeltnis;
}) => {
  const nameText =
    prozessbevollmaechtigte.type === "berufsausuebungsgesellschaft"
      ? prozessbevollmaechtigte.name
      : getFullPlaintiffName(
          prozessbevollmaechtigte.anrede,
          prozessbevollmaechtigte.titel,
          prozessbevollmaechtigte.vorname,
          prozessbevollmaechtigte.nachname,
        );

  return (
    <div data-testid="prozessbevollmaechtigte">
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        <div className="flex flex-col gap-kern-space-large">
          <div className="flex gap-kern-space-default justify-between items-center">
            <div className="flex flex-col kern-body kern-body--default text-pretty gap-20">
              <div className="flex flex-col">
                <span className="kern-body--bold p-0!">{nameText}</span>
                <span className="text-pretty p-0!">
                  {prozessbevollmaechtigte.strasse}{" "}
                  {prozessbevollmaechtigte.hausnummer}
                </span>
                <span className="text-pretty p-0!">
                  {prozessbevollmaechtigte.plz} {prozessbevollmaechtigte.ort}
                </span>
                <span className="text-pretty p-0!">
                  {prozessbevollmaechtigte.land}
                </span>
              </div>
            </div>
            <Button
              id={`${EDIT_BUTTON_ID_PREFIX}${getProzessbevollmaechtigteArrayName(relationship)}-${index}`}
              look="secondary"
              iconLeft={
                <Icon
                  name="edit"
                  className="size-kern-dimension-default text-kern-action-default"
                />
              }
              aria-label={`${nameText} ${translations.arraySummary.arrayEditButtonLabel.de}`}
              href={`${getBaseProzessbevollmaechtigteUrl(relationship)}/${index}/${prozessbevollmaechtigte.type}-daten`}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
          </div>
        </div>
        <a
          href="./uebersicht" //TODO: fix when deletion is implemented
          className="justify-end text-kern-feedback-danger! kern-body kern-body--bold flex gap-8 p-0!"
        >
          <Icon
            name="trash"
            className="size-kern-dimension-default text-kern-feedback-danger"
          />
          {nameText}{" "}
          {translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}
        </a>
      </div>
    </div>
  );
};

export default Prozessbevollmaechtigte;
