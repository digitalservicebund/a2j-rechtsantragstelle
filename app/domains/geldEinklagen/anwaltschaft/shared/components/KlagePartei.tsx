import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  getGesetzlicheVertretungArtLabel,
  type KlageParteiVerhaeltnis,
  type KlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { GesetzlicheVertretung } from "~/domains/geldEinklagen/anwaltschaft/shared/components/GesetzlicheVertretung";
import { getBaseKlagePartyUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klagePartyHelpers";
import { translations } from "~/services/translations/translations";

type KlageParteiProps = {
  readonly partei: KlageParteien[number];
  readonly index: number;
  readonly relationship: KlageParteiVerhaeltnis;
};

const KlagePartei = ({ partei, index, relationship }: KlageParteiProps) => {
  const headingText = `${translations.geldEinklagenAnwaltschaft[relationship === "klagende" ? "klagendeParteiHeadline" : "beklagteParteiHeadline"].de} ${index + 1})`;
  const nameText =
    "orgName" in partei
      ? partei.orgName
      : getFullPlaintiffName(
          partei.anrede,
          partei.titel,
          partei.vorname,
          partei.nachname,
        );
  return (
    <div data-testid="klage-partei">
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--large kern-body--bold p-0!">
            {headingText}
          </span>
          <div className="flex gap-kern-space-default justify-between items-center">
            <div className="flex flex-col kern-body kern-body--default text-pretty gap-20">
              <div className="flex flex-col">
                <span className="kern-body--bold p-0!">{nameText}</span>

                <span className="text-pretty p-0!">
                  {partei.strasse} {partei.hausnummer}
                </span>
                <span className="text-pretty p-0!">
                  {partei.plz} {partei.ort}
                </span>
                <span className="text-pretty p-0!">{partei.land}</span>
              </div>
              {partei.type === "organisation" && (
                <div className="flex flex-col">
                  <span className="kern-body--bold text-pretty p-0!">
                    {
                      translations.geldEinklagenAnwaltschaft
                        .gesetzlicheVetretungHeadline.de
                    }
                  </span>
                  <span className="text-pretty p-0!">
                    {
                      translations.geldEinklagenAnwaltschaft
                        .gesetzlicheVertretungArt.de
                    }
                    :{" "}
                    <span className="kern-body--bold">
                      {getGesetzlicheVertretungArtLabel(
                        partei.orgVertretungArt,
                      )}
                    </span>
                  </span>
                  <span>
                    {partei.orgVertretungAnrede} {partei.orgVertretungTitel}{" "}
                    {partei.orgVertretungVorname} {partei.orgVertretungNachname}
                  </span>
                </div>
              )}
            </div>
            <Button
              look="secondary"
              iconLeft={
                <Icon
                  name="edit"
                  className="size-kern-dimension-default text-kern-action-default"
                />
              }
              aria-label={`${headingText} ${translations.arraySummary.arrayEditButtonLabel.de}`}
              href={`${getBaseKlagePartyUrl(relationship)}/${index}/${"orgName" in partei ? "organisation" : "natuerliche-person"}-daten`}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
          </div>
        </div>
        <GesetzlicheVertretung
          gesetzlicheVertretung={partei["gesetzliche-vertretung"]}
          partyType={partei.type}
          parentArrayItemIndex={index}
          relationship={relationship}
        />
        <a
          href="./uebersicht" //TODO: fix when deletion is implemented
          className="justify-end text-kern-feedback-danger! kern-body kern-body--bold flex gap-8 p-0!"
        >
          <Icon
            name="trash"
            className="size-kern-dimension-default text-kern-feedback-danger"
          />
          {headingText}{" "}
          {Boolean(partei["gesetzliche-vertretung"]?.length) &&
          partei["gesetzliche-vertretung"]!.length > 0
            ? translations.geldEinklagenAnwaltschaft
                .gesetzlicheVertretungDeletionLabel.de
            : ""}{" "}
          {translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}
        </a>
      </div>
    </div>
  );
};

export default KlagePartei;
