import { useField } from "@rvf/react-router";
import classNames from "classnames";

import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import { KlageParteien } from "../../shared/klageParties/klagePartySchemas";
import { translations } from "~/services/translations/translations";

type Props = {
  name: string;
  parties: KlageParteien;
  relationship: "klagende" | "beklagte";
};

const getPartyLabel = (party: KlageParteien[number]) => {
  if (party.type === "natuerliche-person") {
    return `${party.anrede ?? ""} ${party.titel ?? ""} ${party.vorname} ${party.nachname}`;
  }
  return party.orgName;
};

export const KlageParteiCheckboxes = ({
  name,
  parties,
  relationship,
}: Props) => {
  const field = useField<Record<string, string> | undefined>(name);
  const fieldValue = field.value();
  const selectedParties =
    fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)
      ? fieldValue
      : {};
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  const selectableParties = parties.filter((party) => party.id);

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      <div className="flex flex-col">
        <legend className="kern-label">{`${relationship === "beklagte" ? translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantragCheckboxesBeklagteLabel.de : translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantragCheckboxesKlagendeLabel.de} ${translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantragCheckboxesLeistungLabel.de}`}</legend>
        {selectableParties.length > 0 && (
          <span className="kern-body pb-16!">
            {
              translations.geldEinklagenAnwaltschaft
                .bezifferterZahlungsantragCheckboxesHint.de
            }
          </span>
        )}{" "}
      </div>
      <div className="kern-fieldset__body">
        {selectableParties.map((party, index) => {
          const id = party.id!;
          const checkboxName = `${name}.${id}`;
          const value = selectedParties[id] ?? "off";
          return (
            <div key={id} className="flex items-center">
              <div className="kern-form-check">
                <input
                  type="checkbox"
                  name={checkboxName}
                  id={checkboxName}
                  className="kern-form-check__checkbox"
                  checked={selectedParties[id] === "on"}
                  value="on"
                  onChange={(event) => {
                    const newValue = event.target.checked ? "on" : "off";

                    field.setValue({
                      ...selectedParties,
                      [id]: newValue,
                    });
                    const nextParties = {
                      ...selectedParties,
                      [id]: newValue,
                    };

                    field.setValue(nextParties);
                  }}
                />

                <InputLabel
                  name={checkboxName}
                  label={
                    <>
                      <strong>zu {index + 1})</strong> {getPartyLabel(party)}
                    </>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};
