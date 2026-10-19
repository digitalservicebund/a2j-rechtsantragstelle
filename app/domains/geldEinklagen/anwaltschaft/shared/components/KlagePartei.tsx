import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import {
  type KlageParteiVerhaeltnis,
  type KlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { GesetzlicheVertretung } from "~/domains/geldEinklagen/anwaltschaft/shared/components/GesetzlicheVertretung";
import { getBaseKlageParteiUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParteiHelpers";
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
      : `${partei.anrede} ${partei.titel} ${partei.vorname} ${partei.nachname}`;
  return (
    <div data-testid="klage-partei">
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default)">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--large kern-body--bold p-0!">
            {headingText}
          </span>
          <div className="flex gap-kern-space-default justify-between items-center">
            <div className="flex flex-col">
              <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
                {nameText}
              </span>

              <span className="kern-body kern-body--default text-pretty p-0!">
                {partei.strasse} {partei.hausnummer}
              </span>
              <span className="kern-body kern-body--default text-pretty p-0!">
                {partei.plz} {partei.ort}
              </span>
              <span className="kern-body kern-body--default text-pretty p-0!">
                {partei.land}
              </span>
              {partei.type === "organisation" && (
                <span className="kern-body kern-body--default text-pretty p-0!">
                  {partei.orgVertretungArt}: {partei.orgVertretungAnrede}{" "}
                  {partei.orgVertretungTitel} {partei.orgVertretungVorname}{" "}
                  {partei.orgVertretungNachname}
                </span>
              )}
            </div>
            <Button
              look="secondary"
              iconLeft={<Icon name="edit" className="size-[1em]" />}
              aria-label={`${headingText} ${translations.arraySummary.arrayEditButtonLabel.de}`}
              href={`${getBaseKlageParteiUrl(relationship)}/${index}/${"orgName" in partei ? "organisation" : "natuerliche-person"}-daten`}
              className="p-kern-space-small! min-h-0!"
            />
          </div>
        </div>
        <GesetzlicheVertretung
          gesetzlicheVertretung={partei["gesetzliche-vertretung"]}
          partyType={partei.type}
          parentArrayItemIndex={index}
          relationship={relationship}
        />
      </div>
    </div>
  );
};

export default KlagePartei;
