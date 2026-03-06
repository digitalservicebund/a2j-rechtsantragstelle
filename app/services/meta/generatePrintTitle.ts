import { today } from "~/util/dateCalculations";
import { pdfDateFormat } from "~/services/validation/dateString";

const PAGE_TITLE_PREFIX_FGR_PRINT_PAGE =
  "Anleitung_Fluggastrechte_digitale_Klage_einreichen_";

export const generatePrintTitle = (
  originalTitle: string | undefined,
  pathname: string,
) => {
  if (pathname.startsWith("/fluggastrechte/formular")) {
    return `${PAGE_TITLE_PREFIX_FGR_PRINT_PAGE}${pdfDateFormat(today())}`;
  }

  return originalTitle;
};
