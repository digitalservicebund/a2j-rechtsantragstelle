import { Icon } from "~/components/common/Icon";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import {
  type Hauptantrag,
  type Schmerzensgeldantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  type KlageParteiType,
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";

type KlageParteiDeletionDialogProps = {
  partei: KlageParteien[number];
  relationship: KlageParteiVerhaeltnis;
  partyText: string;
};

const KlageParteiDescription = ({
  partei,
  relationship,
}: Omit<KlageParteiDeletionDialogProps, "partyText">) => (
  <div className="flex flex-col gap-kern-space-small">
    <p className="kern-body kern-body--default">
      {relationship === "klagende"
        ? translations.geldEinklagenAnwaltschaft.followingKlaeger.de
        : translations.geldEinklagenAnwaltschaft.followingBeklagter.de}{" "}
      {
        translations.geldEinklagenAnwaltschaft.willBeDeletedWithRepresentatives
          .de
      }
    </p>
    <div className="flex gap-kern-space-small items-start">
      <Icon
        name={partei.type === "natuerliche-person" ? "person" : "business"}
        className="size-kern-dimension-default"
      />
      <p className="font-bold">
        {partei.type === "natuerliche-person"
          ? getFullPlaintiffName(
              partei.anrede,
              partei.titel,
              partei.vorname,
              partei.nachname,
            )
          : partei.orgName}
      </p>
    </div>
  </div>
);

const DeletionInlineNoticeText = ({
  connectedAntraege,
  partyText,
  relationship,
  partyType,
}: {
  connectedAntraege: Array<Hauptantrag | Schmerzensgeldantrag>;
  partyText: string;
  relationship: KlageParteiVerhaeltnis;
  partyType: KlageParteiType;
}) => {
  /**
   * If there is an Antrag with only one party of the given relationship,
   * we need to inform the user that the entire Antrag will be affected,
   * and not just the party itself.
   */
  const hasAntragWithSingularParty = connectedAntraege.some(
    (antrag) =>
      Object.keys(antrag[relationship]).filter(
        (key) => antrag[relationship][key] === "on",
      ).length === 1,
  );
  const partyTypeText =
    partyType === "natuerliche-person"
      ? translations.geldEinklagenAnwaltschaft.person.de.toLocaleLowerCase()
      : translations.geldEinklagenAnwaltschaft.organisationHeadline.de.toLocaleLowerCase();
  const deletionDescriptionText = applyStringReplacement(
    translations.geldEinklagenAnwaltschaft[
      hasAntragWithSingularParty
        ? "antragWithOnePartyDeletionDescription"
        : "antragWithMultiplePartiesDeletionDescription"
    ].de,
    {
      partyText,
      partyType: partyTypeText,
    },
  );
  return (
    <div className="flex flex-col gap-kern-space-small kern-body">
      <span className="kern-body--bold">
        {translations.geldEinklagenAnwaltschaft.auswirkungen.de}
      </span>
      <span className="kern-body--default">{deletionDescriptionText}</span>
      <span className="kern-body--bold">
        {translations.geldEinklagenAnwaltschaft.dasKoennenSieTun.de}:
      </span>
      <ul className="list-disc pl-kern-dimension-large">
        <li>
          <span className="kern-body--bold">
            {translations.geldEinklagenAnwaltschaft.keepAndEdit.de}:{" "}
          </span>
          <span className="kern-body--default">
            {applyStringReplacement(
              translations.geldEinklagenAnwaltschaft.keepAndEditBodyText.de,
              {
                partyText,
                partyType: partyTypeText,
              },
            )}
          </span>
        </li>
        <li>
          <span className="kern-body--bold">
            {translations.geldEinklagenAnwaltschaft.deletePermanently.de}:{" "}
          </span>
          <span className="kern-body--default">
            {applyStringReplacement(
              translations.geldEinklagenAnwaltschaft.deletePermanentlyText.de,
              {
                partyText,
                partyType: partyTypeText,
              },
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export const KlageParteiDeletionDialog = ({
  partei,
  relationship,
  partyText,
}: KlageParteiDeletionDialogProps) => {
  const { userData } = useFormFlow();
  const hauptAntraege = [
    ...((userData as GeldEinklagenAnwaltschaftUserData).hauptantrag ?? []),
    ...((userData as GeldEinklagenAnwaltschaftUserData).schmerzengeldantrag ??
      []),
  ];
  const connectedAntraege = hauptAntraege.filter(
    (antrag: Hauptantrag | Schmerzensgeldantrag) =>
      Object.entries(antrag[relationship]).some(
        ([key, value]) => key === partei.id && value === "on",
      ),
  );

  return (
    <div className="flex flex-col gap-kern-space-default">
      {connectedAntraege.length > 0 && (
        <InlineNotice
          title={
            translations.geldEinklagenAnwaltschaft.klageParteiDeletionWarning.de
          }
          tagName="p"
          look="warning"
          content={
            <DeletionInlineNoticeText
              connectedAntraege={connectedAntraege}
              partyText={partyText}
              relationship={relationship}
              partyType={partei.type}
            />
          }
        />
      )}
      <KlageParteiDescription partei={partei} relationship={relationship} />
    </div>
  );
};
