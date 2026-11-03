import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import {
  getPluralOfKlageParteiRelationship,
  type KlageParteiVerhaeltnis,
  type KlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { GesetzlicheVertretung } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/GesetzlicheVertretung";
import {
  getBaseKlagePartyUrl,
  getGesetzlicheVertretungArtLabel,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { translations } from "~/services/translations/translations";
import { DeleteButton } from "~/components/common/DeleteButton";

type KlageParteiProps = {
  readonly partei: KlageParteien[number];
  readonly index: number;
  readonly displayIndex: number;
  readonly relationship: KlageParteiVerhaeltnis;
};

const KlageParteiDetails = ({
  partei,
}: {
  readonly partei: KlageParteien[number];
}) => {
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
            {translations.geldEinklagenAnwaltschaft.gesetzlicheVertretungArt.de}
            :{" "}
            <span className="kern-body--bold">
              {getGesetzlicheVertretungArtLabel(partei.orgVertretungArt)}
            </span>
          </span>
          <span>
            {getFullPlaintiffName(
              partei.orgVertretungAnrede,
              partei.orgVertretungTitel,
              partei.orgVertretungVorname,
              partei.orgVertretungNachname,
            )}
          </span>
        </div>
      )}
    </div>
  );
};

const KlagePartei = ({
  partei,
  index,
  displayIndex,
  relationship,
}: KlageParteiProps) => {
  const headingText = `${translations.geldEinklagenAnwaltschaft[relationship === "klagende" ? "klagendeParteiHeadline" : "beklagteParteiHeadline"].de} ${displayIndex + 1})`;

  return (
    <ArrayItemCard
      dataTestId="klage-partei"
      heading={{ text: headingText, id: `${relationship}-partei-${index}` }}
      content={<KlageParteiDetails partei={partei} />}
      editButton={{
        id: `${EDIT_BUTTON_ID_PREFIX}${getPluralOfKlageParteiRelationship(relationship)}-${index}`,
        ariaLabel: `${headingText} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${getBaseKlagePartyUrl(relationship)}/${index}/${"orgName" in partei ? "organisation" : "natuerliche-person"}-daten`,
      }}
      deleteButton={
        //TODO: fix when deletion is implemented
        <DeleteButton
          label={`${headingText} ${
            (Boolean(partei["gesetzliche-vertretung"]?.length) &&
              partei["gesetzliche-vertretung"]!.length > 0) ||
            "orgName" in partei
              ? translations.geldEinklagenAnwaltschaft
                  .gesetzlicheVertretungDeletionLabel.de
              : ""
          } ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`}
          title={""}
          onDelete={() => Promise.resolve()}
        />
      }
    >
      <GesetzlicheVertretung
        gesetzlicheVertretung={partei["gesetzliche-vertretung"]}
        partyType={partei.type}
        parentArrayItemIndex={index}
        relationship={relationship}
      />
    </ArrayItemCard>
  );
};

export default KlagePartei;
