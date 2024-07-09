import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  findCourt,
  edgeCasesForPlz,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { logError } from "~/services/logging";
import { newPageHint, type AttachmentEntries } from "../../attachment";
import { checkboxListToString } from "../../checkboxListToString";

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
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { nachname, vorname } = context;
  const name = [nachname, vorname].filter((s): s is string => !!s);
  pdfFields.antragstellerNameVornameggfGeburtsname.value = name.join(", ");
  pdfFields.geburtsdatumdesAntragstellers.value = context.geburtsdatum ?? "";
  const maritalDescription = getMaritalDescriptionByContext(context);
  pdfFields.familienstanddesAntragstellers.value = maritalDescription;

  if (maritalDescription.length > 10) {
    attachment.push({
      title: "Familienstand:",
      text: maritalDescription,
    });
  }

  pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = `${context.strasseHausnummer ?? ""}, ${context.plz ?? ""} ${context.ort ?? ""}`;

  try {
    const court = findCourt({ zipCode: context.plz ?? "" });
    if (court && edgeCasesForPlz(context.plz).length == 0) {
      pdfFields.namedesAmtsgerichts.value = court.ORT;
      pdfFields.postleitzahlOrt.value = `${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`;
    }
  } catch (error) {
    context.plz !== undefined && logError({ error });
  }

  pdfFields.tagsueberTelefonischerreichbarunterNummer.value =
    context.telefonnummer ?? "";

  const { staatlicheLeistungen } = context;
  const occupationDetails =
    staatlicheLeistungen && staatlicheLeistungen !== "keine"
      ? staatlicheLeistungMapping[staatlicheLeistungen]
      : getOccupationDetails(context);

  pdfFields.berufErwerbstaetigkeit.value = occupationDetails;

  if (occupationDetails.length > 30) {
    attachment.unshift({
      title: "Weiteres Einkommen:",
      text: checkboxListToString(
        weiteresEinkommenMapping,
        context.weitereseinkommen,
      ),
    });
    attachment.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });

    attachment.unshift({
      title: "Persönliche Angaben",
      text: "",
    });
    pdfFields.berufErwerbstaetigkeit.value = newPageHint;
  }
}

export const getMaritalDescriptionByContext = ({
  partnerschaft,
}: BeratungshilfeFormularContext): string =>
  partnerschaft ? maritalDescriptionMapping[partnerschaft] : "";

const maritalDescriptionMapping = {
  yes: "verheiratet / in eingetragener Lebenspartnerschaft",
  no: "ledig",
  separated: "getrennt",
  widowed: "verwitwet",
};

const staatlicheLeistungMapping = {
  grundsicherung: "Grundsicherung",
  asylbewerberleistungen: "Asylbewerberleistungen",
  buergergeld: "Bürgergeld",
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
