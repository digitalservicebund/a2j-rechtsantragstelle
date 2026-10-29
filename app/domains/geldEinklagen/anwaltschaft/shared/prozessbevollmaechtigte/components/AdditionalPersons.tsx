import Button from "~/components/common/Button";
import { DeleteButton } from "~/components/common/DeleteButton";
import { Icon } from "~/components/common/Icon";
import { type KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
  type Berufsausuebungsgesellschaft,
  type BerufsausuebungsgesellschaftProzessbevollmaechtigt,
} from "~/domains/geldEinklagen/anwaltschaft/shared/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { useAdditionalPersons } from "~/domains/geldEinklagen/anwaltschaft/shared/prozessbevollmaechtigte/useAdditionalPersons";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { translations } from "~/services/translations/translations";

export const AdditionalPersons = ({
  berufsausuebungsgesellschaft,
  parentArrayItemIndex,
  relationship,
}: {
  berufsausuebungsgesellschaft:
    | Berufsausuebungsgesellschaft
    | BerufsausuebungsgesellschaftProzessbevollmaechtigt;
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
          {translations.geldEinklagenAnwaltschaft.signaturangabenTitle.de}
        </h4>
        <span className="kern-body kern-body--muted">
          {translations.geldEinklagenAnwaltschaft.signaturangabenSubtitle.de}
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
                <span>
                  {getFullPlaintiffName(
                    undefined,
                    additionalPerson.titel,
                    additionalPerson.vorname,
                    additionalPerson.nachname,
                  )}
                </span>
                {additionalPerson.berufsbezeichnung && (
                  <span>{additionalPerson.berufsbezeichnung}</span>
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
                  aria-label={`${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${additionalPerson.vorname} ${additionalPerson.nachname} ${translations.arraySummary.arrayEditButtonLabel.de}`}
                  href={`${baseAdditionalPersonUrl}/${index}/daten`}
                  onClick={onEditAdditionalPerson(index)}
                  className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
                />
                <DeleteButton
                  title={
                    translations.geldEinklagenAnwaltschaft
                      .signaturangabenDeletionTitle.de
                  }
                  label={""}
                  description={
                    <div className="flex flex-col gap-kern-space-small">
                      <p>
                        {
                          translations.geldEinklagenAnwaltschaft
                            .signaturangabenDeletionDescription.de
                        }
                      </p>
                      <div className="flex gap-kern-space-small items-start">
                        <Icon
                          name="business"
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
          {translations.geldEinklagenAnwaltschaft.signaturangaben.de}{" "}
          {translations.arraySummary.arrayAddButtonLabel.de}
        </a>
      )}
    </div>
  );
};
