type FamilyMember = {
  name?: string;
  isAlive?: string;
  kinder?: FamilyMember[];
};

type RequiredDocumentsInput = {
  name?: string;
  ehepartnerName?: string;
  kinder?: FamilyMember[];
  elternteile?: FamilyMember[];
};

export type PersonDocuments = { name: string; documents: string };

const HEIR_DOCUMENTS =
  "Geburtsurkunde, gültiger Personalausweis oder Reisepass";
const DEAD_RELATIVE_DOCUMENTS = "Sterbeurkunde, Geburtsurkunde";

function walkFamilyTree(members: FamilyMember[]): PersonDocuments[] {
  return members.flatMap((member) => [
    {
      name: member.name ?? "",
      documents:
        member.isAlive === "no" ? DEAD_RELATIVE_DOCUMENTS : HEIR_DOCUMENTS,
    },
    ...walkFamilyTree(member.kinder ?? []),
  ]);
}

// One entry per person: the deceased needs their Sterbeurkunde, living heirs
// prove identity and descent, dead relatives need both certificates.
export function collectRequiredDocuments(
  input: RequiredDocumentsInput,
): PersonDocuments[] {
  const spouse = input.ehepartnerName
    ? [{ name: input.ehepartnerName, documents: HEIR_DOCUMENTS }]
    : [];

  return [
    { name: input.name ?? "", documents: "Sterbeurkunde" },
    ...spouse,
    ...walkFamilyTree(input.kinder ?? []),
    ...walkFamilyTree(input.elternteile ?? []),
  ];
}
