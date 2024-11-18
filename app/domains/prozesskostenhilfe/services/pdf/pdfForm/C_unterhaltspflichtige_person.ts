import { familyRelationshipMap } from "~/domains/shared/pdf/unterhaltHelpers";
import type { PkhPdfFillFunction } from "..";

export const fillUnterhaltsanspruch: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const unterhaltspflichtigePerson = userData.unterhaltspflichtigePerson;
  if (
    unterhaltspflichtigePerson &&
    unterhaltspflichtigePerson.vorname &&
    unterhaltspflichtigePerson.nachname &&
    unterhaltspflichtigePerson.beziehung
  ) {
    pdfValues.jaichhabeAngehoerigedieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind.value =
      true;
    pdfValues.namedesUnterhaltspflichtingen.value = `${unterhaltspflichtigePerson.vorname} ${unterhaltspflichtigePerson.nachname}, ${familyRelationshipMap[unterhaltspflichtigePerson.beziehung]}`;
  } else {
    pdfValues.neinichhabekeineAngehoerigendieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind.value =
      true;
  }
  return { pdfValues };
};
