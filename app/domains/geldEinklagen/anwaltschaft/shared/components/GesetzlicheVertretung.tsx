import {
  MAX_NATURAL_PERSON_REPRESENTATIVES,
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
  type KlageParteien,
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
      <span className="kern-body kern-body--muted">
        <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
          {
            translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline
              .de
          }
        </span>{" "}
        - Optional
      </span>
      <span className="kern-body kern-body--muted">
        {
          translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungSubheader
            .de
        }
      </span>
      {gesetzlicheVertretung?.map((vertreter, index) => (
        <div
          // oxlint-disable-next-line react/no-array-index-key
          key={`partei-${parentArrayItemIndex}-vertreter-${index}`}
          className="kern-body kern-body--muted"
        >
          {vertreter.art}
        </div>
      ))}

      {(partyType !== "natuerliche-person" ||
        nextItemIndex < MAX_NATURAL_PERSON_REPRESENTATIVES) && (
        <a
          href={`${getBaseKlageParteiUrl(relationship)}/${parentArrayItemIndex}/gesetzliche-vertretung/${nextItemIndex}/daten`}
        >
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
