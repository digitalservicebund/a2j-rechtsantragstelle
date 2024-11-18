import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  type AttachmentEntries,
} from "~/domains/shared/pdf/attachment";
import { maritalDescriptionMapping } from "~/domains/shared/pdf/maritalDescriptionMapping";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { checkboxListToString } from "~/services/pdf/checkboxListToString";
import type { BerHPdfFillFunction } from "..";

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

export const fillHeader: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];
  pdfValues.antragstellerNameVornameggfGeburtsname.value = `${userData.nachname}, ${userData.vorname}`;
  pdfValues.geburtsdatumdesAntragstellers.value = userData.geburtsdatum;
  pdfValues.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = `${userData.strasseHausnummer}, ${userData.plz} ${userData.ort}`;
  const court = findCourtIfUnique(userData.plz);
  if (court) {
    const courtName = court.BEZEICHNUNG.replace("Amtsgericht", "").trim();
    pdfValues.namedesAmtsgerichts.value = courtName;
    pdfValues.postleitzahlOrt.value = `${court.STR_HNR}, ${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`;
  }

  pdfValues.tagsueberTelefonischerreichbarunterNummer.value =
    userData.telefonnummer;

  const { staatlicheLeistungen } = userData;
  const occupationDetails =
    staatlicheLeistungen && staatlicheLeistungen !== "keine"
      ? staatlicheLeistungMapping[staatlicheLeistungen]
      : getOccupationDetails(userData);

  pdfValues.berufErwerbstaetigkeit.value = occupationDetails;

  const maritalDescription =
    maritalDescriptionMapping[userData.partnerschaft ?? ""];
  pdfValues.familienstanddesAntragstellers.value = maritalDescription;

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
    pdfValues.familienstanddesAntragstellers.value = "Anhang";
  }

  if (occupationDetails.length > 30) {
    attachment.push({
      title: "Beruf / Erwerbstätigkeit",
      text: getOccupationDetails(userData, false),
    });

    attachment.push({
      title: "Weiteres Einkommen",
      text: checkboxListToString(
        weiteresEinkommenMapping,
        userData.weitereseinkommen,
      ),
    });

    pdfValues.berufErwerbstaetigkeit.value = SEE_IN_ATTACHMENT_DESCRIPTION;
  }
  return { pdfValues, attachment };
};

const staatlicheLeistungMapping = {
  grundsicherung: "Grundsicherung",
  asylbewerberleistungen: "Asylbewerberleistungen",
  buergergeld: "Bürgergeld",
  "": "",
} as const;

const getOccupationDetails = (
  userData: BeratungshilfeFormularContext,
  withAdditionalIncome = true,
) => {
  const description: string[] = [];

  if (userData.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (userData.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = checkboxListToString(
      {
        selbststaendig: "selbstständig",
        festangestellt: "festangestellt",
      },
      userData.berufart,
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

  description.push(berufsituationMapping[userData.berufsituation ?? "no"]);

  if (userData.weitereseinkommen && withAdditionalIncome) {
    const otherIncomes = checkboxListToString(
      weiteresEinkommenMapping,
      userData.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
};
