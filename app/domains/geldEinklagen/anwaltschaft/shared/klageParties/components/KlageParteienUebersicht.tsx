import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import KlagePartei from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/KlagePartei";
import {
  getBaseKlagePartyUrl,
  getPartyTypeTranslations,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import {
  MAX_KLAGE_PARTIES,
  useKlageParties,
  type KlagePartyWithArrayIndex,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

export const KlageParteienUebersicht = ({
  relationship,
}: {
  relationship: KlageParteiVerhaeltnis;
}) => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;

  const { klageParteienWithIndex, nextItemIndex } = useKlageParties({
    relationship,
    userData: userDataGeldEinklagenAnwaltschaft,
  });

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  return (
    <div className="flex flex-col gap-kern-space-2x-large">
      <KlageParteienList
        parties={klageParteienWithIndex.filter(
          ({ partei }) => partei.type === "natuerliche-person",
        )}
        partyType="natuerliche-person"
        addPartyHref={`${getBaseKlagePartyUrl(relationship)}/${nextItemIndex}/natuerliche-person-daten`}
        relationship={relationship}
      />

      <KlageParteienList
        parties={klageParteienWithIndex.filter(
          ({ partei }) => partei.type === "organisation",
        )}
        partyType="organisation"
        addPartyHref={`${getBaseKlagePartyUrl(relationship)}/${nextItemIndex}/organisation-daten`}
        relationship={relationship}
      />
    </div>
  );
};

const KlageParteienList = ({
  parties,
  partyType,
  addPartyHref,
  relationship,
}: {
  parties: KlagePartyWithArrayIndex[];
  partyType: "natuerliche-person" | "organisation";
  addPartyHref: string;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const shouldDisableAddButton = parties.length >= MAX_KLAGE_PARTIES;

  const {
    heading,
    helperText,
    addButtonLabel,
    testId,
    maximumReachedTitle,
    maximumReachedContent,
  } = getPartyTypeTranslations(partyType, relationship);
  return (
    <div className="kern-summary flex flex-col gap-kern-space-default">
      <div className="flex flex-col kern-summary__header p-0!">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          id={`${relationship}-${partyType}`}
          tabIndex={-1}
        >
          {heading}
        </h2>
        {helperText && (
          <p className="kern-body kern-body--regular p-0!">{helperText}</p>
        )}
      </div>

      {parties.map(({ partei, arrayIndex, displayIndex }) => (
        <KlagePartei
          key={partei.id ?? arrayIndex}
          index={arrayIndex}
          displayIndex={displayIndex}
          partei={partei}
          relationship={relationship}
        />
      ))}

      {shouldDisableAddButton && (
        <InlineNotice
          className="w-full"
          tagName="h2"
          look="info"
          title={maximumReachedTitle}
          content={maximumReachedContent}
          wrap
        />
      )}

      <div className="bg-kern-white px-kern-space-default py-kern-space-large border-dashed border border-kern-neutral-200">
        <Button
          look="secondary"
          iconLeft={<Icon name="plus" className="text-kern-action-default" />}
          href={addPartyHref}
          data-testid={testId}
          fullWidth={true}
          disabled={shouldDisableAddButton}
          aria-disabled={shouldDisableAddButton}
        >
          {`${addButtonLabel} ${translations.arraySummary.arrayAddButtonLabel.de}`}
        </Button>
      </div>
    </div>
  );
};
