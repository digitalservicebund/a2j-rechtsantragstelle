import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import { familyRelationshipMap } from "../shared/unterhaltHelpers";

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
