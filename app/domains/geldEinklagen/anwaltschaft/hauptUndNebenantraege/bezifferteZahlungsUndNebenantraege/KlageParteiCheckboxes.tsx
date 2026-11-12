import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import { translations } from "~/services/translations/translations";
import type {
  KlageParteien,
  KlageParteiVerhaeltnis,
  GesetzlicherVertreter,
} from "../../shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  type KlagePartyWithArrayIndex,
  useKlageParties,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";

type CheckboxRepresentative = Partial<GesetzlicherVertreter> & {
  /**
   * Used to delineate between the default organizational representative, and additional ones entered
   */
  source?: "organisation-default" | "additional";
};

export type GetCheckboxLabel = (
  index: number,
  party: KlageParteien[number],
  relationship: KlageParteiVerhaeltnis,
  representative?: CheckboxRepresentative,
) => React.ReactNode;

type SelectableParty = {
  id: string;
  index: number;
  party: KlageParteien[number];
  relationship: KlageParteiVerhaeltnis;
  representative?: CheckboxRepresentative;
};

type Props = {
  name: string;
  userData: GeldEinklagenAnwaltschaftUserData;
  label: string;
  relationship?: KlageParteiVerhaeltnis;
  includeGesetzlicheVertretung?: boolean;
  showPaymentHint?: boolean;
  getCheckboxLabel: GetCheckboxLabel;
};

export const getPartyLabel = (party: KlageParteien[number]) => {
  if (party.type === "natuerliche-person") {
    return getFullPlaintiffName(
      party.anrede,
      party.titel,
      party.vorname,
      party.nachname,
    );
  }
  return party.orgName;
};

const getSelectableKlageParties = (
  parties: KlagePartyWithArrayIndex[],
  relationship: KlageParteiVerhaeltnis,
  includeGesetzlicheVertretung: boolean,
) =>
  [...parties]
    .sort((a, b) => a.displayIndex - b.displayIndex)
    .flatMap(({ partei: party, displayIndex: index }) => {
      if (!party.id) return [];
      const options: SelectableParty[] =
        includeGesetzlicheVertretung && party.type === "organisation"
          ? []
          : [{ id: party.id, index, party, relationship }];
      if (includeGesetzlicheVertretung) {
        if (party.type === "organisation" && party.orgVertretungId) {
          options.push({
            id: party.orgVertretungId,
            index,
            party,
            relationship,
            representative: {
              anrede: party.orgVertretungAnrede,
              titel: party.orgVertretungTitel,
              vorname: party.orgVertretungVorname,
              nachname: party.orgVertretungNachname,
              art: party.orgVertretungArt,
              source: "organisation-default",
            },
          });
        }
        for (const representative of party["gesetzliche-vertretung"] ?? []) {
          if (representative.id) {
            options.push({
              id: representative.id,
              index,
              party,
              relationship,
              representative: {
                ...representative,
                source:
                  party.type === "organisation" ? "additional" : undefined,
              },
            });
          }
        }
      }
      return options;
    });

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
