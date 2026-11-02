import { type BeweiseArray } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";

export const BeweisangeboteList = ({
  beweise,
  absatzArrayIndex,
}: {
  beweise: BeweiseArray;
  absatzArrayIndex: number;
}) => {
  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex gap-kern-space-small items-center">
        <h4
          className="kern-body kern-body--default kern-body--bold text-pretty p-0!"
          id={`absatz-${absatzArrayIndex}-beweisangebote`}
          tabIndex={-1}
        >
          {translations.geldEinklagenAnwaltschaft.beweisangeboteTitle.de}
        </h4>
        <span className="kern-body kern-body--muted p-0!">
          {translations.geldEinklagenAnwaltschaft.optionalSuffix.de}
        </span>
      </div>
      {beweise && beweise.length > 0 && (
        <>
          {beweise.map((beweis, index) => (
            <div
              // oxlint-disable-next-line react/no-array-index-key
              key={`absatz-${absatzArrayIndex}-beweisangebote-${index}`}
              id={`absatz-${absatzArrayIndex}-beweisangebote-${index}`}
              tabIndex={-1}
              className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
            >
              {/* <div className="flex gap-24">
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
                  onDelete={() => deleteAdditionalPerson(index)}
                />
              </div> */}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
