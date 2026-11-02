import { useField } from "@rvf/react-router";
import classNames from "classnames";
import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import type { KlageParteien } from "../shared/klageParties/klagePartySchemas";
import { getBeklagteText } from "./components/nebenantragContent";

type Props = {
  name: string;
  parties: KlageParteien;
  selectedBeklagte: Record<string, string> | undefined;
  zahlungsantragIndex: number;
};

const getPartyNumbers = (
  parties: KlageParteien,
  selectedBeklagte: Record<string, string> | undefined,
) => {
  return parties
    .filter((party) => party.id && selectedBeklagte?.[party.id] === "on")
    .map((party) => party.id);
};

export const AnnahmeverzugCheckbox = ({
  name,
  parties,
  selectedBeklagte,
  zahlungsantragIndex,
}: Props) => {
  const field = useField<"on" | "off">(name);
  const fieldValue = field.value() ?? "off";

  const beklagteNumbers = getPartyNumbers(parties, selectedBeklagte);

  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  const label = (
    <>
      Es wird festgestellt, dass sich{" "}
      <strong>
        {getBeklagteText(beklagteNumbers.length)}{" "}
        {beklagteNumbers.map((partyId, index) => (
          <span key={partyId}>
            {index > 0 ? ", " : ""}
            zu {parties.findIndex((party) => party.id === partyId) + 1})
          </span>
        ))}
      </strong>{" "}
      mit der Annahme der im Antrag zu{" "}
      <strong>{zahlungsantragIndex + 1})</strong> genannten Gegenleistung in{" "}
      <strong>Annahmeverzug</strong>{" "}
      {beklagteNumbers.length === 1 ? "befindet" : "befinden"}.
    </>
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
      <div className="kern-fieldset__body">
        <div className="flex items-center">
          <div className="kern-form-check">
            {fieldValue !== "on" && (
              <input type="hidden" name={name} value="off" />
            )}

            <input
              type="checkbox"
              name={name}
              id={name}
              className="kern-form-check__checkbox"
              checked={fieldValue === "on"}
              value="on"
              onChange={(event) => {
                field.setValue(event.target.checked ? "on" : "off");
              }}
            />

            <InputLabel name={name} label={label} />
          </div>
        </div>
      </div>

      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};
