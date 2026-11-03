import classNames from "classnames";
import { Icon } from "~/components/common/Icon";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  type BeklagteBerufsausuebungsgesellschaft,
  type BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt,
  type Berufsausuebungsgesellschaft,
  type BerufsausuebungsgesellschaftProzessbevollmaechtigt,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";
import { useAdditionalPersons } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/useAdditionalPersons";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";

type AdditionalPerson = NonNullable<
  ReturnType<typeof useAdditionalPersons>["personsArray"]
>[number];

const AdditionalPersonDetails = ({
  additionalPerson,
  relationship,
}: {
  readonly additionalPerson: AdditionalPerson;
  readonly relationship: KlageParteiVerhaeltnis;
}) => (
  <>
    {"namedInSignature" in additionalPerson &&
      additionalPerson.namedInSignature === "on" && (
        <span className="kern-body--muted">
          {translations.geldEinklagenAnwaltschaft.namedInSignatureLabel.de}
        </span>
      )}
    <span
      className={classNames({
        "kern-body--bold":
          "namedInSignature" in additionalPerson || relationship === "beklagte",
      })}
    >
      {getFullPlaintiffName(
        undefined,
        additionalPerson.titel,
        additionalPerson.vorname,
        additionalPerson.nachname,
      )}
    </span>
    {additionalPerson.berufsbezeichnung && (
      <span>({additionalPerson.berufsbezeichnung})</span>
    )}
    {"telefonnummer" in additionalPerson && additionalPerson.telefonnummer && (
      <span>{additionalPerson.telefonnummer}</span>
    )}
    {"email" in additionalPerson && additionalPerson.email && (
      <span>{additionalPerson.email}</span>
    )}
  </>
);

const AdditionalPersonDeletionDescription = ({
  additionalPerson,
}: {
  readonly additionalPerson: AdditionalPerson;
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

export const AdditionalPersonsList = ({
  berufsausuebungsgesellschaft,
  parentArrayItemIndex,
  relationship,
}: {
  berufsausuebungsgesellschaft:
    | Berufsausuebungsgesellschaft
    | BerufsausuebungsgesellschaftProzessbevollmaechtigt
    | BeklagteBerufsausuebungsgesellschaft
    | BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt;
  parentArrayItemIndex: number;
  relationship: KlageParteiVerhaeltnis;
}) => {
  const {
    personsArray,
    baseAdditionalPersonUrl,
    nextItemIndex,
    deleteAdditionalPerson,
    additionalPersonIdPrefix,
    onEditAdditionalPerson,
    additionalPersonTranslations,
  } = useAdditionalPersons(
    berufsausuebungsgesellschaft,
    relationship,
    parentArrayItemIndex,
  );
  return (
    <NestedArrayItemList
      heading={additionalPersonTranslations.itemTitle}
      headingId={`prozessbevollmaechtigte-${parentArrayItemIndex}-additional-persons`}
      subtitle={
        translations.geldEinklagenAnwaltschaft.additionalPersonsSubtitle.de
      }
      items={(personsArray ?? []).map((additionalPerson, index) => ({
        key: `prozessbevollmaechtigte-${parentArrayItemIndex}-zusaetzliche-person-${index}`,
        id: `${additionalPersonIdPrefix}-${index}`,
        content: (
          <AdditionalPersonDetails
            additionalPerson={additionalPerson}
            relationship={relationship}
          />
        ),
        editButton: {
          ariaLabel: `${additionalPersonTranslations.itemTitle} ${additionalPerson.vorname} ${additionalPerson.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`,
          href: `${baseAdditionalPersonUrl}/${index}/daten`,
          onClick: onEditAdditionalPerson(index),
        },
        deleteButton: {
          title: additionalPersonTranslations.deletionTitle,
          description: (
            <AdditionalPersonDeletionDescription
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
                label: `${additionalPersonTranslations.itemTitle} ${translations.arraySummary.arrayAddButtonLabel.de}`,
              },
            ]
          : undefined
      }
    />
  );
};
