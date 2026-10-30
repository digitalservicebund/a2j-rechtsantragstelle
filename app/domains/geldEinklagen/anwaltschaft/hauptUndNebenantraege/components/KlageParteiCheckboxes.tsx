import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import type { KlageParteien } from "../../shared/klageParties/klagePartySchemas";
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
  const [checkboxes, setCheckboxes] = useState(
    selectableParties.map((party) => ({
      id: party.id!,
      value: selectedParties[party.id!] ?? "off",
    })),
  );

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
        {checkboxes.map(({ id, value }, index) => {
          const party = selectableParties[index];
          const checkboxName = `${name}.${id}`;

          return (
            <div key={id} className="flex items-center">
              <div className="kern-form-check">
                {value !== "on" && (
                  <input type="hidden" name={checkboxName} value="off" />
                )}
                <input
                  type="checkbox"
                  name={checkboxName}
                  id={checkboxName}
                  className="kern-form-check__checkbox"
                  checked={value === "on"}
                  value="on"
                  onChange={(event) => {
                    const newValue = event.target.checked ? "on" : "off";
                    setCheckboxes((prev) =>
                      prev.map((checkbox) =>
                        checkbox.id === id
                          ? { ...checkbox, value: newValue }
                          : checkbox,
                      ),
                    );
                    field.setValue({
                      [id]: newValue,
                    });
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
