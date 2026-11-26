import { useFormFlow } from "~/components/hooks/formFlowContext";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import { getConnectedAntraege } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import {
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";
import {
  applyStringReplacement,
  type Replacements,
} from "~/util/applyStringReplacement";

type KlageParteiDeletionDialogProps = {
  partei: KlageParteien[number];
  relationship: KlageParteiVerhaeltnis;
  partyText: string;
};

const getStringReplacements = (replacements: Replacements) => ({
  singlePartyDeletionTitle: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft.antragWithOnePartyDeletionTitle.de,
    replacements,
  ),
  singularPartyDeletionDescription: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft.antragWithOnePartyDeletionDescription
      .de,
    replacements,
  ),
  multiplePartiesDeletionTitle: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft
      .antragWithMultiplePartiesDeletionTitle.de,
    replacements,
  ),
  multiplePartiesDeletionDescription: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft
      .antragWithMultiplePartiesDeletionDescription.de,
    replacements,
  ),
  keepAndEditText: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft.keepAndEditBodyText.de,
    replacements,
  ),
  deletePermanentlyText: applyStringReplacement(
    translations.geldEinklagenAnwaltschaft.deletePermanentlyText.de,
    replacements,
  ),
});

export const KlageParteiDeletionDialog = ({
  partei,
  relationship,
  partyText,
}: KlageParteiDeletionDialogProps) => {
  const { userData } = useFormFlow();
  const { singlePartyConnectedAntraege, multiPartyConnectedAntraege } =
    getConnectedAntraege(partei.id, relationship, userData);
  const isNatuerlichePerson = partei.type === "natuerliche-person";

  const replacements = {
    partyText,
    partyTextShort: partyText.substring(0, partyText.indexOf(" ")),
    partyTextPlural: relationship === "klagende" ? "Klägern" : "Beklagten",
    partyType: isNatuerlichePerson
      ? translations.geldEinklagenAnwaltschaft.person.de
      : translations.geldEinklagenAnwaltschaft.organisationHeadline.de,
  };
  const {
    singlePartyDeletionTitle,
    singularPartyDeletionDescription,
    multiplePartiesDeletionTitle,
    multiplePartiesDeletionDescription,
    keepAndEditText,
    deletePermanentlyText,
  } = getStringReplacements(replacements);

  return (
    <DeletionDialog
      description={`${
        relationship === "klagende"
          ? translations.geldEinklagenAnwaltschaft.followingKlaeger.de
          : translations.geldEinklagenAnwaltschaft.followingBeklagter.de
      } ${translations.geldEinklagenAnwaltschaft.willBeDeletedWithRepresentatives.de}`}
      itemIcon={isNatuerlichePerson ? "person" : "business"}
      itemLabel={
        isNatuerlichePerson
          ? getFullPlaintiffName(
              partei.anrede,
              partei.titel,
              partei.vorname,
              partei.nachname,
            )
          : partei.orgName
      }
      warning={
        [...singlePartyConnectedAntraege, ...multiPartyConnectedAntraege]
          .length > 0
          ? {
              title:
                translations.geldEinklagenAnwaltschaft
                  .klageParteiDeletionWarning.de,
              auswirkungenText: (
                <div className="flex flex-col gap-kern-space-default">
                  {singlePartyConnectedAntraege.length > 0 && (
                    <span>
                      <span className="kern-body--bold">
                        {singlePartyDeletionTitle}{" "}
                      </span>
                      {singularPartyDeletionDescription}
                    </span>
                  )}
                  {multiPartyConnectedAntraege.length > 0 && (
                    <span>
                      <span className="kern-body--bold">
                        {multiplePartiesDeletionTitle}{" "}
                      </span>
                      {multiplePartiesDeletionDescription}
                    </span>
                  )}
                </div>
              ),
              keepAndEditText,
              deletePermanentlyText,
            }
          : undefined
      }
    />
  );
};
