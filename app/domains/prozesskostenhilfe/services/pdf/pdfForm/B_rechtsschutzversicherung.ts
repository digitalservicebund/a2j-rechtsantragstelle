import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import type { PkhPdfFillFunction } from "..";

export const fillRechtsschutzversicherung: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.hasRsv !== "yes" && userData.hasRsvThroughOrg !== "yes") {
    pdfValues["1Nein"].value = true;
    pdfValues.nein_3.value = true;
    return { pdfValues };
  }

  let field1Text = "";
  let field2Text = "";

  if (userData.hasRsv === "yes") {
    ({ pdfValues, field1Text, field2Text } = fillRSVCoverage({
      pdfValues,
      userData,
      field1Text,
      field2Text,
    }));
  }

  if (userData.hasRsvThroughOrg === "yes") {
    ({ pdfValues, field1Text, field2Text } = fillOrgCoverage({
      pdfValues,
      userData,
      field1Text,
      field2Text,
    }));
  }

  pdfValues.hoehederKosten.value = field1Text;
  pdfValues.bezeichnungderVersicherung.value = field2Text;
  return {
    pdfValues,
  };
};

type FillCoverageProps = {
  pdfValues: ProzesskostenhilfePDF;
  userData: ProzesskostenhilfeFormularContext;
  field1Text: string;
  field2Text: string;
};

export function fillRSVCoverage({
  pdfValues,
  userData,
  field1Text,
  field2Text,
}: FillCoverageProps) {
  if (userData.hasRsvCoverage === "partly") {
    pdfValues.ja.value = true;
    field1Text += "RSV: Teilweise Kostenübernahme (siehe Belege)";
  } else if (userData.hasRsvCoverage === "no") {
    pdfValues["1Nein"].value = true;
    field1Text += "RSV: Nein";
    pdfValues.ja_2.value = true;
    field2Text += "RSV: Ja (siehe Belege)";
  }
  return {
    pdfValues,
    field1Text,
    field2Text,
  };
}

export function fillOrgCoverage({
  pdfValues,
  userData,
  field1Text,
  field2Text,
}: FillCoverageProps) {
  if (userData.hasOrgCoverage === "partly") {
    pdfValues["1Nein"].value = undefined;
    pdfValues.ja.value = true;
    field1Text += `${field1Text === "" ? "" : ", "}Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)`;
  } else if (userData.hasOrgCoverage === "no") {
    if (pdfValues.ja.value !== true) {
      pdfValues["1Nein"].value = true;
    }
    field1Text += `${field1Text === "" ? "" : ", "}Verein/Organisation: Nein`;
    pdfValues.ja_2.value = true;
    field2Text += `${field2Text === "" ? "" : ", "}Verein/Organisation: Ja (siehe Belege)`;
  }
  return { pdfValues, field1Text, field2Text };
}
