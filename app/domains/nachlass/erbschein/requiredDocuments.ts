import {
  determineHeirs,
  shareLabel,
  type Heir,
} from "~/domains/nachlass/erbschein/shared/determineHeirs";
import { personName } from "./shared/personName";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { translations } from "~/services/translations/translations";

type FamilyMember = {
  vorname?: string;
  nachname?: string;
  isAlive?: string;
  kinder?: FamilyMember[];
};

export type PersonDocuments = {
  name: string;
  documents: string;
  /**
   * Displays alongside name.
   * Used to indicate inheritance share, the Verstorbene person themselves, or if the person is deceased.
   */
  additionalDisplayText?: string;
};

const HEIR_DOCUMENTS = "Geburtsurkunde";
const DEAD_RELATIVE_DOCUMENTS = "Sterbeurkunde, Geburtsurkunde";
const LAST_SPOUSE_LABEL = "Letzter Ehepartner oder letzte Ehepartnerin";

function walkFamilyTree(members: FamilyMember[]): PersonDocuments[] {
  return members.flatMap((member) => [
    {
      name: personName(member),
      documents:
        member.isAlive === "no" ? DEAD_RELATIVE_DOCUMENTS : HEIR_DOCUMENTS,
      additionalDisplayText:
        member.isAlive === "no"
          ? `(${translations.nachlass.deceased.de})`
          : undefined,
    },
    ...walkFamilyTree(member.kinder ?? []),
  ]);
}

// The spouse's documents depend on the familienstand. Divorced and widowed
// spouses were never asked by name, so they get a generic label. A spouse
// never needs a Geburtsurkunde.
function spouseEntries(
  data: NachlassErbscheinAnfrageUserData,
): PersonDocuments[] {
  switch (data.verstorbeneFamilienstand) {
    case "verheiratet":
      return [
        {
          name: personName({
            vorname: data.ehepartnerVorname,
            nachname: data.ehepartnerNachname,
          }),
          documents:
            data.hasEhevertrag === "yes"
              ? "Heiratsurkunde, Ehevertrag"
              : "Heiratsurkunde",
        },
      ];
    case "geschieden":
      return [
        {
          name: LAST_SPOUSE_LABEL,
          documents:
            "Rechtskräftiges Scheidungsurteil bzw. Scheidungsbeschluss",
        },
      ];
    case "verwitwet":
      return [{ name: LAST_SPOUSE_LABEL, documents: "Sterbeurkunde" }];
    default:
      return [];
  }
}

// The parents themselves are proven by the deceased's Geburtsurkunde: living
// parents need no documents at all, dead ones only their Sterbeurkunde. Their
// descendants prove descent like first-order heirs.
function elternteilEntries(elternteile: FamilyMember[]): PersonDocuments[] {
  return elternteile.flatMap((elternteil) => [
    ...(elternteil.isAlive === "no"
      ? [
          {
            name: personName(elternteil),
            documents: "Sterbeurkunde",
            additionalDisplayText: `(${translations.nachlass.deceased.de})`,
          },
        ]
      : []),
    ...walkFamilyTree(elternteil.kinder ?? []),
  ]);
}

function addErbanteile(entry: PersonDocuments, heirs: Heir[]) {
  const matchingHeir = heirs.find((heir) => {
    // Can't perform simple name matching against heirs, but order=0 depth=0 is always spouse
    if (entry.name === LAST_SPOUSE_LABEL) {
      return heir.order === 0 && heir.depth === 0;
    }
    return heir.name === entry.name;
  });
  return {
    ...entry,
    additionalDisplayText: matchingHeir
      ? `(erhält ${shareLabel(matchingHeir.share)})`
      : entry.additionalDisplayText,
  };
}

// One entry per person. With second-order heirs the deceased also needs their
// own Geburtsurkunde as proof of who the parents are.
export function collectRequiredDocuments(
  data: NachlassErbscheinAnfrageUserData,
): PersonDocuments[] {
  const hasSecondOrderHeirs = (data.elternteile ?? []).length > 0;
  const heirs = determineHeirs(data);

  return [
    {
      name: personName({
        vorname: data.verstorbeneVorname,
        nachname: data.verstorbeneNachname,
      }),
      documents: hasSecondOrderHeirs
        ? "Sterbeurkunde, Geburtsurkunde"
        : "Sterbeurkunde",
      additionalDisplayText: `(${translations.nachlass.verstorbenePerson.de})`,
    },
    ...spouseEntries(data),
    ...walkFamilyTree(data.kinder ?? []),
    ...elternteilEntries(data.elternteile ?? []),
  ].map((entry) => addErbanteile(entry, heirs));
}
