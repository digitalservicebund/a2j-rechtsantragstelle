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
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { type KlagePartyWithArrayIndex } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";
import { ArrayItemListSection } from "~/components/content/arrayItemList/ArrayItemListSection";

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
    <ArrayItemListSection
      heading={heading}
      headingId={`${relationship}-${partyType}`}
      helperText={helperText}
      notice={
        shouldDisableAddButton && (
          <InlineNotice
            className="w-full"
            tagName="h2"
            look="info"
            title={maximumReachedTitle}
            content={maximumReachedContent}
            wrap
          />
        )
      }
      addButton={{
        href: addPartyHref,
        buttonText: `${addButtonLabel} ${translations.arraySummary.arrayAddButtonLabel.de}`,
        disabled: shouldDisableAddButton,
        dataTestId: testId,
      }}
    >
      {parties.map(({ partei, arrayIndex, displayIndex }) => (
        <KlagePartei
          key={partei.id ?? arrayIndex}
          index={arrayIndex}
          displayIndex={displayIndex}
          partei={partei}
          relationship={relationship}
        />
      ))}
    </ArrayItemListSection>
  );
};
