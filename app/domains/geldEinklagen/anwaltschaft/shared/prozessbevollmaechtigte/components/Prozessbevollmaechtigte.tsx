import Button from "~/components/common/Button";
import { DeleteButton } from "~/components/common/DeleteButton";
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
  onDelete,
}: {
  readonly prozessbevollmaechtigte: ProzessbevollmaechtigteData[number];
  readonly index: number;
  readonly relationship: KlageParteiVerhaeltnis;
  readonly onDelete: () => Promise<void>;
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
    <div
      data-testid="prozessbevollmaechtigte"
      id={`${relationship}-prozessbevollmaechtigte-${index}`}
      tabIndex={-1}
    >
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        <div className="flex flex-col gap-kern-space-large">
          <div className="flex gap-kern-space-default justify-between items-center">
            <div className="flex flex-col kern-body kern-body--default text-pretty gap-20">
              <div className="flex flex-col">
                <span className="kern-body--bold">{nameText}</span>
                {prozessbevollmaechtigte.geschaeftszeichen && (
                  <span>
                    {
                      translations.geldEinklagenAnwaltschaft.geschaeftszeichen
                        .de
                    }
                    : {prozessbevollmaechtigte.geschaeftszeichen}
                  </span>
                )}
                <span>
                  {prozessbevollmaechtigte.strasse}{" "}
                  {prozessbevollmaechtigte.hausnummer}
                </span>
                <span>
                  {prozessbevollmaechtigte.plz} {prozessbevollmaechtigte.ort}
                </span>
                <span>{prozessbevollmaechtigte.land}</span>
                {prozessbevollmaechtigte.telefonnummer && (
                  <span>{prozessbevollmaechtigte.telefonnummer}</span>
                )}
                {prozessbevollmaechtigte.email && (
                  <span>{prozessbevollmaechtigte.email}</span>
                )}
                {"isProzessbevollmaechtigt" in prozessbevollmaechtigte &&
                  prozessbevollmaechtigte.isProzessbevollmaechtigt && (
                    <>
                      <span className="kern-body--bold pt-kern-space-small">
                        {
                          translations.geldEinklagenAnwaltschaft
                            .prozessbevollmaechtigtePerson.de
                        }
                      </span>
                      <span>
                        {
                          translations.geldEinklagenAnwaltschaft.gesamteKanzlei
                            .de
                        }
                      </span>
                    </>
                  )}
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
        <div className="flex justify-end">
          <DeleteButton
            label={`${nameText} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
            title={
              translations.geldEinklagenAnwaltschaft
                .prozessbevollmaechtigteDeleteTitle.de
            }
            description={
              <div className="flex flex-col gap-kern-space-small">
                <p>{translations.deleteDialog.description.de}</p>
                <p className="font-bold">{nameText}</p>
              </div>
            }
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Prozessbevollmaechtigte;
