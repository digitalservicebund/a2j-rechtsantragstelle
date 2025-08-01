import { familyRelationshipMap } from "~/domains/shared/services/pdf/unterhaltHelpers";
import type { PkhPdfFillFunction } from "../types";

export const fillUnterhaltsanspruch: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const unterhaltspflichtigePerson = userData.unterhaltspflichtigePerson;
  if (
    unterhaltspflichtigePerson?.vorname &&
    unterhaltspflichtigePerson.nachname &&
    unterhaltspflichtigePerson.beziehung
  ) {
    pdfValues.c2.value = true;
    pdfValues.namedesUnterhaltspflichtigen.value = `${unterhaltspflichtigePerson.vorname} ${unterhaltspflichtigePerson.nachname}, ${familyRelationshipMap[unterhaltspflichtigePerson.beziehung]}`;
  } else {
    pdfValues.c1.value = true;
  }
  return { pdfValues };
};
