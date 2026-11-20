import { useFormFlow } from "~/components/hooks/formFlowContext";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import {
  getConnectedAntraege,
  antragHasOnlyOneParty,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import {
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";

type KlageParteiDeletionDialogProps = {
  partei: KlageParteien[number];
  relationship: KlageParteiVerhaeltnis;
  partyText: string;
};

export const KlageParteiDeletionDialog = ({
  partei,
  relationship,
  partyText,
}: KlageParteiDeletionDialogProps) => {
  const { userData } = useFormFlow();
  const connectedAntraege = getConnectedAntraege(
    partei.id,
    relationship,
    userData,
  );
  const isNatuerlichePerson = partei.type === "natuerliche-person";

  /**
   * If there is an Antrag with only one party of the given relationship,
   * we need to inform the user that the entire Antrag will be affected,
   * and not just the party itself.
   */
  const hasAntragWithSingularParty = connectedAntraege.some(
    antragHasOnlyOneParty(relationship),
  );
  const replacements = {
    partyText,
    partyType: isNatuerlichePerson
      ? translations.geldEinklagenAnwaltschaft.person.de.toLocaleLowerCase()
      : translations.geldEinklagenAnwaltschaft.organisationHeadline.de.toLocaleLowerCase(),
  };

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
      shouldDisplayWarning={
        connectedAntraege.length > 0
          ? {
              title:
                translations.geldEinklagenAnwaltschaft
                  .klageParteiDeletionWarning.de,
              auswirkungenText: applyStringReplacement(
                translations.geldEinklagenAnwaltschaft[
                  hasAntragWithSingularParty
                    ? "antragWithOnePartyDeletionDescription"
                    : "antragWithMultiplePartiesDeletionDescription"
                ].de,
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
            }
          : undefined
      }
    />
  );
};
