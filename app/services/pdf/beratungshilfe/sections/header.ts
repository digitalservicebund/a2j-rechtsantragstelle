import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { checkboxListToString } from "../../checkboxListToString";
import { newPageHint, type Attachment } from "../attachment";

const weiteresEinkommenMapping = {
  unterhaltszahlungen: "Unterhaltszahlungen",
  arbeitlosengeld: "Arbeitlosengeld 1",
  wohngeld: "Wohngeld",
  kindergeld: "Kindergeld",
  bafoeg: "Bafög oder Ausbildungsförderung",
  krankengeld: "Krankengeld oder Pflegegeld",
  rente: "Rente",
  elterngeld: "Elterngeld",
  insolvenzgeld: "Insolvenzgeld",
  ueberbrueckungsgeld: "Überbrückungsgeld (nach einer Haftentlassung)",
  others: "Sonstiges",
};

export default function fillHeader(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const hasStaatlicheLeistung = context.staatlicheLeistungen != "keine";

  pdfFields.antragstellerNameVornameggfGeburtsname.value = [
    context.nachname,
    context.vorname,
  ]
    .filter((entry) => entry)
    .join(", ");
  pdfFields.geburtsdatumdesAntragstellers.value = context.geburtsdatum ?? "";
  pdfFields.familienstanddesAntragstellers.value =
    getMaritalDescriptionByContext(context);
  pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value =
    [context.strasseHausnummer, context.plz, context.ort]
      .filter((entry) => entry)
      .join(", ");
  pdfFields.tagsueberTelefonischerreichbarunterNummer.value =
    context.telefonnummer ?? "";
  const occupationDetails = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
  pdfFields.berufErwerbstaetigkeit.value = occupationDetails;

  if (!hasStaatlicheLeistung && occupationDetails.length > 30) {
    attachment.descriptions.unshift({
      title: "Weiteres Einkommen:",
      text: checkboxListToString(
        weiteresEinkommenMapping,
        context.weitereseinkommen,
      ),
    });
    attachment.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });

    attachment.descriptions.unshift({
      title: "Persönliche Angaben",
      text: "",
    });
    attachment.shouldCreateAttachment = true;
    pdfFields.berufErwerbstaetigkeit.value = newPageHint;
  }
}

export const getMaritalDescriptionByContext = ({
  partnerschaft,
}: BeratungshilfeFormularContext): string => {
  if (typeof partnerschaft === "undefined") {
    return "";
  }

  return maritalDescriptionMapping[partnerschaft];
};

const maritalDescriptionMapping = {
  yes: "verheiratet/ in eingetragener Lebenspartnerschaft",
  no: "ledig",
  separated: "getrennt",
  widowed: "verwitwet",
};

const staatlicheLeistungMapping = {
  grundsicherung: "Grundsicherung",
  asylbewerberleistungen: "Asylbewerberleistungen",
  buergergeld: "Bürgergeld",
  keine: "Keine",
};

const getOccupationDetails = (
  context: BeratungshilfeFormularContext,
  withAdditionalIncome = true,
) => {
  const description: string[] = [];

  if (context.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (context.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = checkboxListToString(
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
    const otherIncomes = checkboxListToString(
      weiteresEinkommenMapping,
      context.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
};
