import { Icon } from "~/components/common/Icon";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { type Berufsausuebungsgesellschaft } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { useVerantwortendePersonen } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/useVerantwortendePersonen";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";

type VerantwortendePerson = NonNullable<
  ReturnType<typeof useVerantwortendePersonen>["personsArray"]
>[number];

const VerantwortendePersonDetails = ({
  verantwortendePerson,
}: {
  readonly verantwortendePerson: VerantwortendePerson;
}) => (
  <>
    <span>
      {getFullPlaintiffName(
        undefined,
        verantwortendePerson.titel,
        verantwortendePerson.vorname,
        verantwortendePerson.nachname,
      )}
    </span>
    {verantwortendePerson.berufsbezeichnung && (
      <span>({verantwortendePerson.berufsbezeichnung})</span>
    )}
  </>
);

const VerantwortendePersonDeletionDescription = ({
  additionalPerson,
}: {
  readonly additionalPerson: VerantwortendePerson;
}) => (
  <div className="flex flex-col gap-kern-space-small">
    <p>
      {
        translations.geldEinklagenAnwaltschaft
          .additionalPersonDeletionDescription.de
      }
    </p>
    <div className="flex gap-kern-space-small items-start">
      <Icon name="person" className="size-kern-dimension-default" />
      <div className="flex flex-col">
        <p className="font-bold">
          {getFullPlaintiffName(
            undefined,
            additionalPerson.titel,
            additionalPerson.vorname,
            additionalPerson.nachname,
          )}
        </p>
        {additionalPerson.berufsbezeichnung && (
          <p>({additionalPerson.berufsbezeichnung})</p>
        )}
      </div>
    </div>
  </div>
);

export const VerantwortendePersonenList = ({
  berufsausuebungsgesellschaft,
  parentArrayItemIndex,
}: {
  berufsausuebungsgesellschaft: Berufsausuebungsgesellschaft;
  parentArrayItemIndex: number;
}) => {
  const {
    personsArray,
    baseAdditionalPersonUrl,
    nextItemIndex,
    deleteAdditionalPerson,
    additionalPersonIdPrefix,
    onEditAdditionalPerson,
  } = useVerantwortendePersonen(
    berufsausuebungsgesellschaft,
    parentArrayItemIndex,
  );
  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.verantwortendePersonen.de}
      headingId={`prozessbevollmaechtigte-${parentArrayItemIndex}-verantwortende-personen`}
      subtitle={
        translations.geldEinklagenAnwaltschaft.additionalPersonsSubtitle.de
      }
      items={(personsArray ?? []).map((additionalPerson, index) => ({
        key: `prozessbevollmaechtigte-${parentArrayItemIndex}-verantwortende-person-${index}`,
        id: `${additionalPersonIdPrefix}-${index}`,
        content: (
          <VerantwortendePersonDetails
            verantwortendePerson={additionalPerson}
          />
        ),
        editButton: {
          ariaLabel: `${translations.geldEinklagenAnwaltschaft.verantwortendePerson.de} ${additionalPerson.vorname} ${additionalPerson.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`,
          href: `${baseAdditionalPersonUrl}/${index}/daten`,
          onClick: onEditAdditionalPerson(index),
        },
        deleteButton: {
          title:
            translations.geldEinklagenAnwaltschaft
              .verantwortendePersonDeletionTitle.de,
          description: (
            <VerantwortendePersonDeletionDescription
              additionalPerson={additionalPerson}
            />
          ),
          onDelete: () => deleteAdditionalPerson(index),
        },
      }))}
      addLinks={
        nextItemIndex < MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS
          ? [
              {
                id: `${additionalPersonIdPrefix}-add`,
                href: `${baseAdditionalPersonUrl}/${nextItemIndex}/daten`,
                label: `${translations.geldEinklagenAnwaltschaft.verantwortendePerson.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
              },
            ]
          : undefined
      }
    />
  );
};
