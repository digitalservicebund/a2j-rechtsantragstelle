import { useField } from "@rvf/react-router";
import classNames from "classnames";

import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import { KlageParteien } from "../../shared/klageParties/klagePartySchemas";

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
  const field = useField<string[] | undefined>(name);

  const selectedIds = field.value() ?? [];
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  const selectableParties = parties.filter((party) => party.id);

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      <div className="flex flex-col">
        <legend className="kern-label">{`${relationship === "beklagte" ? "Beklagte:" : "Klagende:"} ${"Zahlung zu leisten von"}`}</legend>
        {selectableParties.length > 0 && (
          <span className="kern-body pb-16!">
            Wenn Sie mehr als eine Person auswählen, werden die Personen im
            Antrag automatisch als Gesamtschuldner aufgeführt. Wählen Sie bitte
            nur eine Person aus, wenn im Antrag keine Gesamtschuldnerschaft
            genannt werden soll. Fügen Sie für getrennte Forderungen gegen
            einzelne Beklagte bitte separate Zahlungsanträge hinzu.
          </span>
        )}
      </div>
      <div className="kern-fieldset__body">
        {selectableParties.map((party, index) => {
          const id = party.id!;

          return (
            <div key={id} className="flex items-center">
              <div className="kern-form-check">
                <input
                  type="checkbox"
                  name={name}
                  id={`${name}-${id}`}
                  value={id}
                  className={classNames("kern-form-check__checkbox", {
                    "kern-form-check__checkbox--error": hasError,
                  })}
                  checked={selectedIds.includes(id)}
                  onChange={(event) => {
                    const nextIds = event.target.checked
                      ? [...selectedIds, id]
                      : selectedIds.filter((selectedId) => selectedId !== id);

                    field.setValue(nextIds);
                  }}
                />

                <InputLabel
                  name={`${name}-${id}`}
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
