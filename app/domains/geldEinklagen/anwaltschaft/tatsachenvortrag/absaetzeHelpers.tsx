import { type Nebenantrag } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  type Beweis,
  type BeweisType,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";
import { nebenantragArtLabels } from "../hauptUndNebenantraege/hauptUndNebenantraegeContent";
import { getGesetzlicheVertretungArtLabel } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { ParteivernehmungBeweisBody } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/ParteivernehmungBeweisBody";
import { type GetCheckboxLabel } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";

export const getAbsaetzeBaseUrl = (
  hauptantragIndex: number,
  nebenantragIndex?: number,
) => {
  const nebenantragSlug =
    nebenantragIndex !== undefined ? `/nebenantraege/${nebenantragIndex}` : "";
  return `/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/${hauptantragIndex}${nebenantragSlug}/absaetze`;
};

export const getNebenantragTitle = (
  nebenantrag: Nebenantrag,
  index: number,
  parentIndex: number,
) => {
  const displayIndex = `${parentIndex + 1}${String.fromCodePoint(("a".codePointAt(0) ?? 0) + index)}`;
  const title =
    nebenantrag.type === "nebenantrag"
      ? translations.geldEinklagenAnwaltschaft.nebenantrag.de
      : translations.geldEinklagenAnwaltschaft.feststellungsantrag.de;
  const parentheticalInfo = `${nebenantrag.type === "nebenantrag" ? nebenantragArtLabels[nebenantrag.nebenantragArt] : translations.geldEinklagenAnwaltschaft.annahmeverzug.de}`;
  return `${title} ${displayIndex} (${parentheticalInfo})`;
};

export const getBeweisTitle = (
  type: BeweisType,
  index: number,
  isOverviewPage: boolean = false,
): string | undefined => {
  switch (type) {
    case "zeuge":
      return isOverviewPage
        ? `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.geldEinklagenAnwaltschaft.zeugnis.de}`
        : undefined;
    case "parteivernehmung":
      return `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.beweismittel.parteivernehmung.de}`;
    default:
      return `${translations.geldEinklagenAnwaltschaft.beweis.de} K${index + 1}`;
  }
};

export const getBeweisBody = (
  beweis: Beweis,
  isOverviewPage: boolean = false,
): string | React.ReactNode => {
  switch (beweis.type) {
    case "zeuge":
      return (
        <div className="flex flex-col">
          <span className="kern-body--bold">
            {beweis.anrede} {beweis.titel}
            {beweis.vorname} {beweis.nachname}
          </span>
          {isOverviewPage && (
            <>
              <span>
                {beweis.strasse} {beweis.hausnummer}
              </span>
              <span>
                {beweis.plz} {beweis.ort}
              </span>
              <span>{beweis.land}</span>
            </>
          )}
        </div>
      );
    case "parteivernehmung":
      return <ParteivernehmungBeweisBody parteivernehmung={beweis} />;
    default:
      return beweis.beschreibung;
  }
};

export const getBeweisArrayName = (isHauptantrag: boolean) =>
  `hauptantrag#${isHauptantrag ? "" : "nebenantraege#"}absaetze#beweise`;

export type BeweisCategory = "document" | "person";

export const getBeweisCategory = (type: BeweisType): BeweisCategory => {
  switch (type) {
    case "urkunde":
    case "augenschein":
    case "sachverstaendigengutachten":
      return "document";
    case "zeuge":
    case "parteivernehmung":
      return "person";
  }
};

export const getParteivernehmungBeweisCheckboxLabel: GetCheckboxLabel = (
  index,
  party,
  relationship,
  representative,
) => {
  const isOrg = party.type === "organisation";
  const isRepresentative = Boolean(representative);
  const naturalPersonTitle = isRepresentative ? (
    <span>
      {translations.geldEinklagenAnwaltschaft.gesetzlicheVertretung.de}:
    </span>
  ) : (
    !isOrg && (
      <span className="kern-body--bold">
        {getFullPlaintiffName(
          party.anrede,
          party.titel,
          party.vorname,
          party.nachname,
        )}
      </span>
    )
  );
  return (
    <div>
      <div>
        <span>
          {relationship === "klagende"
            ? translations.geldEinklagenAnwaltschaft.klaeger.de
            : translations.geldEinklagenAnwaltschaft.beklagter.de}
        </span>
        <span> zu {index + 1}) </span>

        {isOrg ? (
          <span>
            {" "}
            {party.orgName}
            {representative && (
              <>
                ,{" "}
                {representative.source === "organisation-default"
                  ? translations.geldEinklagenAnwaltschaft.gesetzlicheVertretung
                      .de
                  : translations.geldEinklagenAnwaltschaft
                      .weitereGesetzlicheVertretung.de}
                :
              </>
            )}
          </span>
        ) : (
          naturalPersonTitle
        )}
      </div>
      {representative && (
        <span className="kern-body--bold">
          {getGesetzlicheVertretungArtLabel(representative.art)},{" "}
          {getFullPlaintiffName(
            representative.anrede,
            representative.titel,
            representative.vorname,
            representative.nachname,
          )}
        </span>
      )}
    </div>
  );
};
