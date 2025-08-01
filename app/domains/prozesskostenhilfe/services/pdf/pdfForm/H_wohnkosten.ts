import type { PkhPdfFillFunction } from "../types";

export const fillWohnkosten: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues[
    "1GesamtgroessedesWohnraumsdenSiealleinodergemeinsammitanderenPersonenbewohnen"
  ].value = userData.apartmentSizeSqm?.toString();
  pdfValues["2ZahlderZimmer"].value = userData.numberOfRooms?.toString();
  pdfValues["3AnzahlderPersonendiedenWohnrauminsgesamtbewohnen"].value =
    userData.livingSituation === "alone"
      ? "1"
      : userData.apartmentPersonCount?.toString();

  pdfValues.h1.value = userData.rentsApartment === "no";
  pdfValues.h2.value = userData.rentsApartment === "yes";

  // using as owner no / yes
  pdfValues.h3.value = userData.rentsApartment === "yes";
  pdfValues.h4.value = userData.rentsApartment === "no";

  pdfValues.wohnkostenalsMieterMieterinMieteohneNebenkosten.value =
    userData.rentWithoutUtilities;
  pdfValues.wohnkostenalsMieterMieterinHeizungskosten.value =
    userData.heatingCosts;
  pdfValues.wohnkostenalsMieterMieterinuebrigeNebenkosten.value =
    userData.utilitiesCost;
  pdfValues.gesamtbetragalsMieterMieterin.value = userData.totalRent;
  pdfValues.ichalleinzahledavonalsMieterMieterin.value =
    userData.sharedRent ?? userData.totalRent;

  pdfValues.kostenalsEigentuemerEigentuemerinHeizungskosten.value =
    userData.heatingCostsOwned;
  pdfValues.kostenalsEigentuemerEigentuemerinuebrigeNebenkosten.value =
    userData.utilitiesCostOwned;
  pdfValues.ichalleinzahledavonalsEigentuemerEigentuemerin.value =
    userData.utilitiesCostOwnShared;

  return { pdfValues };
};
