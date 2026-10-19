import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import KlagePartei from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlagePartei";
import {
  getBaseKlageParteiUrl,
  getPartyTypeTranslations,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParteiHelpers";
import {
  MAX_KLAGE_PARTEIEN,
  useKlageParteien,
  type KlageParteiWithArrayIndex,
} from "~/domains/geldEinklagen/anwaltschaft/shared/useKlageParteien";
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

  const { klageParteienWithIndex, nextItemIndex } = useKlageParteien({
    relationship,
    userData: userDataGeldEinklagenAnwaltschaft,
  });

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  return (
    <div className="flex flex-col gap-kern-space-default">
      <KlageParteienList
        parties={klageParteienWithIndex.filter(
          ({ partei }) => partei.type === "natuerliche-person",
        )}
        partyType="natuerliche-person"
        addPartyHref={`${getBaseKlageParteiUrl(relationship)}/${nextItemIndex}/natuerliche-person-daten`}
        relationship={relationship}
      />

      <KlageParteienList
        parties={klageParteienWithIndex.filter(
          ({ partei }) => partei.type === "organisation",
        )}
        partyType="organisation"
        addPartyHref={`${getBaseKlageParteiUrl(relationship)}/${nextItemIndex}/organisation-daten`}
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
  parties: KlageParteiWithArrayIndex[];
  partyType: "natuerliche-person" | "organisation";
  addPartyHref: string;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const shouldDisableAddButton = parties.length >= MAX_KLAGE_PARTEIEN;

  const {
    heading,
    addButtonLabel,
    testId,
    maximumReachedTitle,
    maximumReachedContent,
  } = getPartyTypeTranslations(partyType, relationship);
  return (
    <div className="kern-summary flex flex-col gap-kern-space-default">
      <div className="kern-summary__header p-0!">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          tabIndex={-1}
        >
          {heading}
        </h2>
      </div>

      {parties.map(({ partei, arrayIndex }) => (
        <KlagePartei
          key={arrayIndex}
          index={arrayIndex}
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
  );
};
