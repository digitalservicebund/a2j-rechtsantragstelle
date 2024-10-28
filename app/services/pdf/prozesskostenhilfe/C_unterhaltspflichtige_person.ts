import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillUnterhaltsanspruch: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const unterhaltspflichtigePerson = userData.unterhaltspflichtigePerson;
  if (
    unterhaltspflichtigePerson &&
    unterhaltspflichtigePerson.vorname &&
    unterhaltspflichtigePerson.nachname
  ) {
    pdfValues.jaichhabeAngehoerigedieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind.value =
      true;
    pdfValues.namedesUnterhaltspflichtingen.value = `${unterhaltspflichtigePerson.vorname} ${unterhaltspflichtigePerson.nachname}`;
  } else {
    pdfValues.neinichhabekeineAngehoerigendieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind.value =
      true;
  }
  return { pdfValues };
};
