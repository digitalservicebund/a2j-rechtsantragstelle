import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import {
  getGesetzlicheVertretungArtLabel,
  MAX_NATURAL_PERSON_REPRESENTATIVES,
  type KlageParteien,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { getBaseKlageParteiUrl } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParteiHelpers";
import { translations } from "~/services/translations/translations";

export const GesetzlicheVertretung = ({
  gesetzlicheVertretung,
  partyType,
  parentArrayItemIndex,
  relationship,
}: {
  gesetzlicheVertretung: KlageParteien[number]["gesetzliche-vertretung"];
  partyType: KlageParteiType;
  parentArrayItemIndex: number;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const nextItemIndex = gesetzlicheVertretung?.length ?? 0;
  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex flex-col">
        <span className="kern-body kern-body--muted">
          <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
            {partyType === "organisation"
              ? translations.geldEinklagenAnwaltschaft
                  .gesetzlicheVetretungOrganisationHeadline.de
              : translations.geldEinklagenAnwaltschaft
                  .gesetzlicheVetretungHeadline.de}
          </span>{" "}
          - Optional
        </span>
        <span className="kern-body kern-body--muted">
          {
            translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungSubheader
              .de
          }
        </span>
      </div>
      {gesetzlicheVertretung && gesetzlicheVertretung.length > 0 && (
        <div>
          {gesetzlicheVertretung.map((vertreter, index) => (
            <div
              // oxlint-disable-next-line react/no-array-index-key
              key={`partei-${parentArrayItemIndex}-vertreter-${index}`}
              className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
            >
              <div className="kern-body kern-body--default text-pretty flex flex-col">
                <span>
                  {
                    translations.geldEinklagenAnwaltschaft
                      .gesetzlicheVertretungArt.de
                  }
                  :{" "}
                  <span className="kern-body--bold">
                    {getGesetzlicheVertretungArtLabel(vertreter.art)}
                  </span>
                </span>
                <span>
                  {vertreter.anrede} {vertreter.titel} {vertreter.vorname}{" "}
                  {vertreter.nachname}
                </span>
                <span>
                  {vertreter.strasse} {vertreter.hausnummer}
                </span>
                <span>
                  {vertreter.plz} {vertreter.ort}
                </span>
                <span>{vertreter.land}</span>
              </div>
              <div className="flex gap-24">
                <Button
                  look="secondary"
                  iconLeft={
                    <Icon
                      name="edit"
                      className="size-kern-dimension-default text-kern-action-default"
                    />
                  }
                  // TODO: Fix aria-label
                  aria-label={`${translations.arraySummary.arrayEditButtonLabel.de}`}
                  href={`${getBaseKlageParteiUrl(relationship)}/${parentArrayItemIndex}/gesetzliche-vertretung/${index}/daten`}
                  className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
                />
                <Button
                  look="secondary"
                  iconLeft={
                    <Icon
                      name="trash"
                      className="size-kern-dimension-default text-kern-feedback-danger"
                    />
                  }
                  disabled // TODO: reenable once deletion functionality is implemented
                  // TODO: Fix aria-label
                  aria-label={`${translations.arraySummary.arrayDeleteButtonLabel.de}`}
                  className="p-kern-space-small! min-h-0! border-kern-feedback-danger! size-kern-dimension-x-large"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {(partyType === "organisation" ||
        nextItemIndex < MAX_NATURAL_PERSON_REPRESENTATIVES) && (
        <a
          href={`${getBaseKlageParteiUrl(relationship)}/${parentArrayItemIndex}/gesetzliche-vertretung/${nextItemIndex}/daten${partyType === "organisation" ? "-organisation" : ""}`}
          className="text-kern-action-default flex items-center pt-24"
        >
          <Icon name="plus" className="text-kern-action-default" />
          {
            translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline
              .de
          }{" "}
          {translations.arraySummary.arrayAddButtonLabel.de}
        </a>
      )}
    </div>
  );
};
