import classNames from "classnames";
import Button from "~/components/common/Button";
import { DeleteButton } from "~/components/common/DeleteButton";
import { Icon } from "~/components/common/Icon";
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
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex flex-col">
        <h4
          className="kern-body kern-body--default kern-body--bold text-pretty p-0!"
          id={`prozessbevollmaechtigte-${parentArrayItemIndex}-additional-persons`}
          tabIndex={-1}
        >
          {additionalPersonTranslations.itemTitle}
        </h4>
        <span className="kern-body kern-body--muted">
          {translations.geldEinklagenAnwaltschaft.additionalPersonsSubtitle.de}
        </span>
      </div>
      {personsArray && personsArray.length > 0 && (
        <div>
          {personsArray.map((additionalPerson, index) => (
            <div
              // oxlint-disable-next-line react/no-array-index-key
              key={`prozessbevollmaechtigte-${parentArrayItemIndex}-zusaetzliche-person-${index}`}
              id={`${additionalPersonIdPrefix}-${index}`}
              tabIndex={-1}
              className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
            >
              <div className="kern-body kern-body--default text-pretty flex flex-col">
                {"namedInSignature" in additionalPerson &&
                  additionalPerson.namedInSignature === "on" && (
                    <span className="kern-body--muted">
                      {
                        translations.geldEinklagenAnwaltschaft
                          .namedInSignatureLabel.de
                      }
                    </span>
                  )}
                <span
                  className={classNames({
                    "kern-body--bold":
                      "namedInSignature" in additionalPerson ||
                      relationship === "beklagte",
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
                {"telefonnummer" in additionalPerson &&
                  additionalPerson.telefonnummer && (
                    <span>{additionalPerson.telefonnummer}</span>
                  )}
                {"email" in additionalPerson && additionalPerson.email && (
                  <span>{additionalPerson.email}</span>
                )}
              </div>
              <div className="flex gap-24">
                <Button
                  look="secondary"
                  iconLeft={
                    <Icon
                      name="edit"
                      className="size-kern-dimension-default text-kern-action-default"
                    />
                  }
                  aria-label={`${additionalPersonTranslations.itemTitle} ${additionalPerson.vorname} ${additionalPerson.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`}
                  href={`${baseAdditionalPersonUrl}/${index}/daten`}
                  onClick={onEditAdditionalPerson(index)}
                  className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
                />
                <DeleteButton
                  title={additionalPersonTranslations.deletionTitle}
                  label={""}
                  className={
                    "border-1! border-kern-feedback-danger! px-8! min-w-48!"
                  }
                  description={
                    <div className="flex flex-col gap-kern-space-small">
                      <p>
                        {
                          translations.geldEinklagenAnwaltschaft
                            .additionalPersonDeletionDescription.de
                        }
                      </p>
                      <div className="flex gap-kern-space-small items-start">
                        <Icon
                          name="person"
                          className="size-kern-dimension-default"
                        />
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
                  }
                  onDelete={deleteAdditionalPerson(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {nextItemIndex < MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS && (
        <a
          id={`${additionalPersonIdPrefix}-add`}
          href={`${baseAdditionalPersonUrl}/${nextItemIndex}/daten`}
          className="text-kern-action-default flex items-center pt-24"
        >
          <Icon name="plus" className="text-kern-action-default" />
          {additionalPersonTranslations.itemTitle}{" "}
          {translations.arraySummary.arrayAddButtonLabel.de}
        </a>
      )}
    </div>
  );
};
