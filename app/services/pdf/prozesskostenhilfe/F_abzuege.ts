import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PdfFillFunction, PdfFillFunctionProps } from "./fillOutFunction";

export const fillAbzuege: PdfFillFunction<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
> = ({
  userData,
  pdfValues,
  attachment,
}: PdfFillFunctionProps<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
>) => {
  if (userData.hasAusgaben !== "yes") return { pdfValues }; // TODO: remove after pruning

  return {
    pdfValues: {
      ...pdfValues,
      sonstigeVersicherungen: {
        ...pdfValues.sonstigeVersicherungen,
        value: userData.versicherungen
          ?.map(
            (versicherung) =>
              `${versicherung.art !== "sonstige" ? versicherung.art : versicherung.sonstigeArt}: ${versicherung.beitrag} €`,
          )
          .join("\n"),
      },
    },
    attachment,
  };
};
