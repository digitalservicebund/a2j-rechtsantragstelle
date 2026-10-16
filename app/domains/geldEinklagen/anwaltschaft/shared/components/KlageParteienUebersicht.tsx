import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { InlineNotice } from "~/components/content/InlineNotice";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import {
  getPluralOfKlageParteiRelationship,
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import KlagePartei from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlagePartei";
import { KlageParteienContext } from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlageParteienContext";
import {
  MAX_KLAGE_PARTEIEN,
  useKlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/useKlageParteien";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { translations } from "~/services/translations/translations";

const getBaseKlageParteiUrl = (relationship: KlageParteiVerhaeltnis) =>
  `/geld-einklagen/anwaltschaft/${relationship}-partei/${getPluralOfKlageParteiRelationship(relationship)}`;

export const KlageParteienUebersicht = ({
  relationship,
}: {
  relationship: KlageParteiVerhaeltnis;
}) => {
  const { userData, flowId } = useFormFlow();
  const userDataGeldEinklagenAnwaltschaft =
    userData as GeldEinklagenAnwaltschaftUserData;

  const { klageParteien, nextItemIndex } = useKlageParteien({
    relationship,
    userData: userDataGeldEinklagenAnwaltschaft,
  });

  if (flowId !== "/geld-einklagen/anwaltschaft") {
    return null;
  }

  return (
    <div className="flex flex-col gap-kern-space-default">
      <div>
        <KlageParteienContext.Provider value={klageParteien}>
          <NaturalPersonenList
            naturalPersonen={klageParteien.naturalPersonen}
            addPersonHref={`${getBaseKlageParteiUrl(relationship)}/${nextItemIndex}/natuerliche-person-daten`}
            relationship={relationship}
          />

          <OrganizationsList
            organizations={klageParteien.organizations}
            addOrganizationHref={`${getBaseKlageParteiUrl(relationship)}/${nextItemIndex}/organisation-daten`}
            relationship={relationship}
          />
        </KlageParteienContext.Provider>
      </div>
    </div>
  );
};

const NaturalPersonenList = ({
  naturalPersonen,
  addPersonHref,
  relationship,
}: {
  naturalPersonen: KlageParteien;
  addPersonHref: string;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const shouldDisableAddButton = naturalPersonen.length >= MAX_KLAGE_PARTEIEN;
  return (
    <>
      {naturalPersonen.map((person) => (
        <KlagePartei
          key={person.index}
          itemIndex={person.index}
          partei={person}
          relationship={relationship}
        />
      ))}

      {shouldDisableAddButton && (
        <InlineNotice
          className="w-full"
          tagName="h2"
          look="info"
          title={
            translations.geldEinklagenAnwaltschaft
              .natuerlichePersonenMaximumReachedTitleNotice.de
          }
          content={
            translations.geldEinklagenAnwaltschaft[
              relationship === "klagende"
                ? "natuerlichePersonenMaximumReachedContentNotice"
                : "beklagteNatuerlichePersonenMaximumReachedContentNotice"
            ].de
          }
          wrap
        />
      )}

      <Button
        look="secondary"
        iconLeft={<Icon name="plus" className="text-kern-action-default" />}
        href={addPersonHref}
        data-testid="add-natuerliche-person"
        fullWidth={true}
        disabled={shouldDisableAddButton}
        aria-disabled={shouldDisableAddButton}
      >
        {`${translations.geldEinklagenAnwaltschaft.natuerlichePersonHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`}
      </Button>
    </>
  );
};

const OrganizationsList = ({
  organizations,
  addOrganizationHref,
  relationship,
}: {
  organizations: KlageParteien;
  addOrganizationHref: string;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const shouldDisableAddButton = organizations.length >= MAX_KLAGE_PARTEIEN;
  return (
    <>
      {organizations.map((organization) => (
        <KlagePartei
          key={organization.index}
          itemIndex={organization.index}
          partei={organization}
          relationship={relationship}
        />
      ))}

      {shouldDisableAddButton && (
        <InlineNotice
          className="w-full"
          tagName="h2"
          look="info"
          title={
            translations.geldEinklagenAnwaltschaft
              .organisationMaximumReachedTitleNotice.de
          }
          content={
            translations.geldEinklagenAnwaltschaft[
              relationship === "klagende"
                ? "organisationMaximumReachedContentNotice"
                : "beklagteOrganisationMaximumReachedContentNotice"
            ].de
          }
          wrap
        />
      )}

      <Button
        look="secondary"
        iconLeft={<Icon name="plus" className="text-kern-action-default" />}
        href={addOrganizationHref}
        data-testid="add-organisation"
        fullWidth={true}
        disabled={shouldDisableAddButton}
        aria-disabled={shouldDisableAddButton}
      >
        {`${translations.geldEinklagenAnwaltschaft.organisationHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`}
      </Button>
    </>
  );
};
