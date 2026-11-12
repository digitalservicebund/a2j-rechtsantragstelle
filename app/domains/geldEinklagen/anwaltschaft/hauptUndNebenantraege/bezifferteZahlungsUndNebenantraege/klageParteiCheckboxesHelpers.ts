import {
  type KlageParteien,
  type KlageParteiVerhaeltnis,
  type GesetzlicherVertreter,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type KlagePartyWithArrayIndex } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";

type CheckboxRepresentative = Partial<GesetzlicherVertreter> & {
  /**
   * Used to delineate between the default organizational representative, and additional ones entered
   */
  source?: "organisation-default" | "additional";
};

type SelectableParty = {
  id: string;
  index: number;
  party: KlageParteien[number];
  relationship: KlageParteiVerhaeltnis;
  representative?: CheckboxRepresentative;
};

export type GetCheckboxLabel = (
  index: number,
  party: KlageParteien[number],
  relationship: KlageParteiVerhaeltnis,
  representative?: CheckboxRepresentative,
) => React.ReactNode;

export const getKlagePartyCheckboxLabel = (party: KlageParteien[number]) => {
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

export const getSelectableKlageParties = (
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
