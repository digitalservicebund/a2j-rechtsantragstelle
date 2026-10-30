import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import {
  getPluralOfKlageParteiRelationship,
  MAX_REPRESENTATIVES,
  type KlageParteien,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  getBaseKlagePartyUrl,
  getGesetzlicheVertretungArtLabel,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";
import { DeleteButton } from "~/components/common/DeleteButton";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

const getGesetzlicheVertretungUrl = (
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
) =>
  `${getBaseKlagePartyUrl(relationship)}/${parentArrayItemIndex}/gesetzliche-vertretung`;

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
  const deleteArrayItem = useDeleteArrayItem(
    `${getPluralOfKlageParteiRelationship(relationship)}#gesetzliche-vertretung`,
    getGesetzlicheVertretungUrl(relationship, parentArrayItemIndex),
  );
  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex flex-col">
        <h4
          className="kern-body kern-body--muted"
          id={`${relationship}-partei-${parentArrayItemIndex}-gesetzliche-vertretung`}
          tabIndex={-1}
        >
          <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
            {partyType === "organisation"
              ? translations.geldEinklagenAnwaltschaft
                  .gesetzlicheVetretungOrganisationHeadline.de
              : translations.geldEinklagenAnwaltschaft
                  .gesetzlicheVetretungHeadline.de}
          </span>{" "}
          - Optional
        </h4>
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
                  {getFullPlaintiffName(
                    vertreter.anrede,
                    vertreter.titel,
                    vertreter.vorname,
                    vertreter.nachname,
                  )}
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
                  aria-label={`${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${vertreter.vorname} ${vertreter.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`}
                  href={`${getGesetzlicheVertretungUrl(relationship, index)}/daten${partyType === "organisation" ? "-organisation" : ""}`}
                  className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
                />
                <DeleteButton
                  title={
                    translations.geldEinklagenAnwaltschaft
                      .gesetzlicheVetretungDeletionTitle.de
                  }
                  className={
                    "border-1! border-kern-feedback-danger! px-8! min-w-48!"
                  }
                  description={
                    <div className="flex flex-col gap-kern-space-small">
                      <p>
                        {
                          translations.geldEinklagenAnwaltschaft
                            .additionalPersonDeletionDescription.de
                        }
                      </p>
                      <div className="flex gap-kern-space-small items-start">
                        <Icon
                          name="person"
                          className="size-kern-dimension-default"
                        />
                        <div className="flex flex-col">
                          <p className="font-bold">
                            {getFullPlaintiffName(
                              vertreter.anrede,
                              vertreter.titel,
                              vertreter.vorname,
                              vertreter.nachname,
                            )}
                          </p>
                          <p>
                            ({getGesetzlicheVertretungArtLabel(vertreter.art)})
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                  onDelete={() => deleteArrayItem(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {nextItemIndex < MAX_REPRESENTATIVES && (
        <a
          href={`${getGesetzlicheVertretungUrl(relationship, parentArrayItemIndex)}/${nextItemIndex}/daten${partyType === "organisation" ? "-organisation" : ""}`}
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
