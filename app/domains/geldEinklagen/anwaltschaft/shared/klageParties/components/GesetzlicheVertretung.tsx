import { Icon } from "~/components/common/Icon";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import {
  type GesetzlicherVertreter,
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
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

const getGesetzlicheVertretungUrl = (
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
) =>
  `${getBaseKlagePartyUrl(relationship)}/${parentArrayItemIndex}/gesetzliche-vertretung`;

const VertreterDetails = ({
  vertreter,
}: {
  readonly vertreter: GesetzlicherVertreter;
}) => (
  <>
    <span>
      {translations.geldEinklagenAnwaltschaft.gesetzlicheVertretungArt.de}:{" "}
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
  </>
);

const VertreterDeletionDescription = ({
  vertreter,
}: {
  readonly vertreter: GesetzlicherVertreter;
}) => (
  <div className="flex flex-col gap-kern-space-small">
    <p>
      {
        translations.geldEinklagenAnwaltschaft
          .additionalPersonDeletionDescription.de
      }
    </p>
    <div className="flex gap-kern-space-small items-start">
      <Icon name="person" className="size-kern-dimension-default" />
      <div className="flex flex-col">
        <p className="font-bold">
          {getFullPlaintiffName(
            vertreter.anrede,
            vertreter.titel,
            vertreter.vorname,
            vertreter.nachname,
          )}
        </p>
        <p>({getGesetzlicheVertretungArtLabel(vertreter.art)})</p>
      </div>
    </div>
  </div>
);

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
  const datenPageSuffix = partyType === "organisation" ? "-organisation" : "";
  const { gesetzlicheVetretungHeadline } =
    translations.geldEinklagenAnwaltschaft;

  const gesetzlicheVertretungArrayItems = (gesetzlicheVertretung ?? []).map(
    (vertreter, index) => ({
      key: `partei-${parentArrayItemIndex}-vertreter-${index}`,
      content: <VertreterDetails vertreter={vertreter} />,
      editButton: {
        ariaLabel: `${gesetzlicheVetretungHeadline.de} ${vertreter.vorname} ${vertreter.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${getGesetzlicheVertretungUrl(relationship, parentArrayItemIndex)}/${index}/daten${datenPageSuffix}`,
      },
      deleteButton: {
        title:
          translations.geldEinklagenAnwaltschaft
            .gesetzlicheVetretungDeletionTitle.de,
        description: <VertreterDeletionDescription vertreter={vertreter} />,
        onDelete: () => deleteArrayItem(index),
      },
    }),
  );

  return (
    <NestedArrayItemList
      heading={
        partyType === "organisation"
          ? translations.geldEinklagenAnwaltschaft
              .gesetzlicheVetretungOrganisationHeadline.de
          : gesetzlicheVetretungHeadline.de
      }
      headingId={`${relationship}-partei-${parentArrayItemIndex}-gesetzliche-vertretung`}
      headingSuffix={translations.geldEinklagenAnwaltschaft.optionalSuffix.de}
      subtitle={
        translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungSubheader.de
      }
      items={gesetzlicheVertretungArrayItems}
      addLinks={
        nextItemIndex < MAX_REPRESENTATIVES
          ? [
              {
                href: `${getGesetzlicheVertretungUrl(relationship, parentArrayItemIndex)}/${nextItemIndex}/daten${datenPageSuffix}`,
                label: `${gesetzlicheVetretungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
              },
            ]
          : undefined
      }
    />
  );
};
