import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
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
  pdfFields.antragstellerNameVornameggfGeburtsname.value = `${context.nachname}, ${context.vorname}`;
  pdfFields.geburtsdatumdesAntragstellers.value = context.geburtsdatum;
  pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = `${context.strasseHausnummer}, ${context.plz} ${context.ort}`;
  const court = findCourtIfUnique(context.plz);
  if (court) {
    const courtName = court.BEZEICHNUNG.replace("Amtsgericht", "").trim();
    pdfFields.namedesAmtsgerichts.value = courtName;
    pdfFields.postleitzahlOrt.value = `${court.STR_HNR}, ${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`;
  }

  pdfFields.tagsueberTelefonischerreichbarunterNummer.value =
    context.telefonnummer;

  const { staatlicheLeistungen } = context;
  const occupationDetails =
    staatlicheLeistungen && staatlicheLeistungen !== "keine"
      ? staatlicheLeistungMapping[staatlicheLeistungen]
      : getOccupationDetails(context);

  pdfFields.berufErwerbstaetigkeit.value = occupationDetails;

  const maritalDescription =
    maritalDescriptionMapping[context.partnerschaft ?? ""];
  pdfFields.familienstanddesAntragstellers.value = maritalDescription;

  if (occupationDetails.length > 30 || maritalDescription.length > 10) {
    attachment.push({
      title: "Persönliche Angaben",
      level: "h2",
    });
  }

  if (maritalDescription.length > 10) {
    attachment.push({
      title: "Familienstand:",
      text: maritalDescription,
    });
    pdfFields.familienstanddesAntragstellers.value = "Anhang";
  }

  if (occupationDetails.length > 30) {
    attachment.push({
      title: "Beruf / Erwerbstätigkeit",
      text: getOccupationDetails(context, false),
    });

    attachment.push({
      title: "Weiteres Einkommen",
      text: checkboxListToString(
        weiteresEinkommenMapping,
        context.weitereseinkommen,
      ),
    });

    pdfFields.berufErwerbstaetigkeit.value = newPageHint;
  }
}

const maritalDescriptionMapping = {
  yes: "verheiratet / in eingetragener Lebenspartnerschaft",
  no: "ledig",
  separated: "getrennt",
  widowed: "verwitwet",
  "": "",
} as const;

const staatlicheLeistungMapping = {
  grundsicherung: "Grundsicherung",
  asylbewerberleistungen: "Asylbewerberleistungen",
  buergergeld: "Bürgergeld",
  "": "",
} as const;

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
