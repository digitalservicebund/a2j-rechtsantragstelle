import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

export const staatlicheLeistungMapping = {
  grundsicherung: "Grundsicherung",
  asylbewerberleistungen: "Asylbewerberleistungen",
  buergergeld: "Bürgergeld",
  andereLeistung: "Andere Leistung",
  keine: "Keine",
};

export const getOccupationDetails = (
  context: BeratungshilfeFormularContext,
  withAdditionalIncome = true,
) => {
  const description: string[] = [];

  if (context.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (context.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = getSelectedOptions(
      {
        selbststaendig: "selbstständig",
        festangestellt: "festangestellt",
      },
      context.berufart,
    );

    description.push(
      `${occupation}${
        occupationTypeSelected ? " (" + occupationTypeSelected + ")" : ""
      }`,
    );
  }

  const berufsituationMapping = {
    no: "",
    pupil: "Schüler:in",
    student: "Student:in",
    retiree: "Rentner:in",
  };

  description.push(berufsituationMapping[context.berufsituation ?? "no"]);

  if (context.weitereseinkommen && withAdditionalIncome) {
    const otherIncomes = getSelectedOptions(
      {
        unterhaltszahlungen: "Unterhaltszahlungen",
        wohngeld: "Wohngeld",
        kindergeld: "Kindergeld",
        bafoeg: "Bafög",
        others: "Sonstiges",
      },
      context.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
};

export function getSelectedOptions(
  mapping: { [key: string]: string },
  options?: { [key: string]: CheckboxValue },
) {
  if (!options) {
    return "";
  }

  return Object.entries(options)
    .map(([key, value]) => {
      if (value === CheckboxValue.on) {
        return mapping[key];
      }
      return "";
    })
    .filter((entry) => entry)
    .join(", ");
}
