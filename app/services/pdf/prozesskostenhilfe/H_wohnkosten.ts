import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillWohnkosten: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.gesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen.value =
    userData.apartmentSizeSqm?.toString();
  pdfValues.zahlderZimmer.value = userData.numberOfRooms?.toString();
  pdfValues.personenanzahl.value =
    userData.livingSituation === "alone"
      ? "1"
      : userData.apartmentPersonCount?.toString();

  pdfValues.nutzenSiedenRaumalsMieteroderineinemaehnlichenNutzungsverhaeltnis.value =
    userData.rentsApartment === "no";
  pdfValues.undefined_10.value = userData.rentsApartment === "yes";

  // using as owner no / yes
  pdfValues.undefined_11.value = userData.rentsApartment === "yes";
  pdfValues.undefined_12.value = userData.rentsApartment === "no";

  pdfValues.mieteohneNebenkosten.value = userData.rentWithoutUtilities;
  pdfValues.heizungskosten.value = userData.heatingCosts;
  pdfValues.uebrigeNebenkosten.value = userData.utilitiesCost;
  pdfValues.gesamtbetrag.value = userData.totalRent;
  pdfValues.ichalleinzahledavon.value =
    userData.sharedRent ?? userData.totalRent;

  pdfValues.heizungskosten_2.value = userData.heatingCostsOwned;
  pdfValues.uebrigeNebenkosten2.value = userData.utilitiesCostOwned;
  pdfValues.ichalleinzahledavon2.value = userData.utilitiesCostOwnShared;

  return { pdfValues };
};
