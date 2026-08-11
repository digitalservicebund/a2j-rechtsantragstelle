import { personName } from "../shared/personName";

type FamilyMember = {
  vorname?: string;
  nachname?: string;
  isAlive?: string;
  kinder?: FamilyMember[];
};

type RequiredDocumentsInput = {
  verstorbeneVorname?: string;
  verstorbeneNachname?: string;
  familienstand?: string;
  ehepartnerVorname?: string;
  ehepartnerNachname?: string;
  ehevertrag?: string;
  kinder?: FamilyMember[];
  elternteile?: FamilyMember[];
};

export type PersonDocuments = { name: string; documents: string };

const HEIR_DOCUMENTS = "Geburtsurkunde";
const DEAD_RELATIVE_DOCUMENTS = "Sterbeurkunde, Geburtsurkunde";
const LAST_SPOUSE_LABEL = "Letzter Ehepartner oder letzte Ehepartnerin";

function walkFamilyTree(members: FamilyMember[]): PersonDocuments[] {
  return members.flatMap((member) => [
    {
      name: personName(member),
      documents:
        member.isAlive === "no" ? DEAD_RELATIVE_DOCUMENTS : HEIR_DOCUMENTS,
    },
    ...walkFamilyTree(member.kinder ?? []),
  ]);
}

// The spouse's documents depend on the familienstand. Divorced and widowed
// spouses were never asked by name, so they get a generic label. A spouse
// never needs a Geburtsurkunde.
function spouseEntries(input: RequiredDocumentsInput): PersonDocuments[] {
  switch (input.familienstand) {
    case "verheiratet":
      return [
        {
          name: personName({
            vorname: input.ehepartnerVorname,
            nachname: input.ehepartnerNachname,
          }),
          documents:
            input.ehevertrag === "yes"
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
      ? [{ name: personName(elternteil), documents: "Sterbeurkunde" }]
      : []),
    ...walkFamilyTree(elternteil.kinder ?? []),
  ]);
}

// One entry per person. With second-order heirs the deceased also needs their
// own Geburtsurkunde as proof of who the parents are.
export function collectRequiredDocuments(
  input: RequiredDocumentsInput,
): PersonDocuments[] {
  const hasSecondOrderHeirs = (input.elternteile ?? []).length > 0;

  return [
    {
      name: personName({
        vorname: input.verstorbeneVorname,
        nachname: input.verstorbeneNachname,
      }),
      documents: hasSecondOrderHeirs
        ? "Sterbeurkunde, Geburtsurkunde"
        : "Sterbeurkunde",
    },
    ...spouseEntries(input),
    ...walkFamilyTree(input.kinder ?? []),
    ...elternteilEntries(input.elternteile ?? []),
  ];
}
