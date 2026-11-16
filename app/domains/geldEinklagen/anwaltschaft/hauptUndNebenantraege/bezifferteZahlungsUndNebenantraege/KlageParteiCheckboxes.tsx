import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import { translations } from "~/services/translations/translations";
import type { KlageParteiVerhaeltnis } from "../../shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { useKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import {
  getSelectableKlageParties,
  type GetCheckboxLabel,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";

type Props = {
  name: string;
  userData: GeldEinklagenAnwaltschaftUserData;
  label: string;
  relationship?: KlageParteiVerhaeltnis;
  includeGesetzlicheVertretung?: boolean;
  showPaymentHint?: boolean;
  getCheckboxLabel: GetCheckboxLabel;
};

export const KlageParteiCheckboxes = ({
  name,
  userData,
  label,
  relationship,
  includeGesetzlicheVertretung = false,
  showPaymentHint = false,
  getCheckboxLabel,
}: Props) => {
  const { klageParteienWithIndex: klagenden } = useKlageParties({
    userData,
    relationship: "klagende",
  });
  const { klageParteienWithIndex: beklagten } = useKlageParties({
    userData,
    relationship: "beklagte",
  });
  const selectableParties = [
    ...(relationship !== "beklagte"
      ? getSelectableKlageParties(
          klagenden,
          "klagende",
          includeGesetzlicheVertretung,
        )
      : []),
    ...(relationship !== "klagende"
      ? getSelectableKlageParties(
          beklagten,
          "beklagte",
          includeGesetzlicheVertretung,
        )
      : []),
  ];
  const field = useField<Record<string, string> | undefined>(name);
  const fieldValue = field.value();
  const [selectedParties, setSelectedParties] = useState(() =>
    fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)
      ? fieldValue
      : {},
  );
  const selectableIds = new Set(selectableParties.map((option) => option.id));
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

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
        <legend className="kern-label">{label}</legend>
        {showPaymentHint && selectableParties.length > 0 && (
          <span className="kern-body pb-16!">
            {
              translations.geldEinklagenAnwaltschaft
                .bezifferterZahlungsantragCheckboxesHint.de
            }
          </span>
        )}
      </div>
      <div className="kern-fieldset__body">
        {Object.keys(selectedParties)
          .filter((id) => !selectableIds.has(id))
          .map((id) => (
            <input key={id} type="hidden" name={`${name}.${id}`} value="off" />
          ))}
        {selectableParties.map(
          ({ id, index, party, relationship, representative }) => {
            const value = selectedParties[id] ?? "off";
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
                      const nextValue = {
                        ...Object.fromEntries(
                          Object.entries(selectedParties).map(
                            ([key, value]) => [
                              key,
                              selectableIds.has(key) ? value : "off",
                            ],
                          ),
                        ),
                        [id]: newValue,
                      };
                      setSelectedParties(nextValue);
                      field.setValue(nextValue);
                    }}
                  />
                  <InputLabel
                    name={checkboxName}
                    label={getCheckboxLabel(
                      index,
                      party,
                      relationship,
                      representative,
                    )}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};
