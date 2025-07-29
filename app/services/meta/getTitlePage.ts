import { pdfDateFormat, today } from "~/util/date";

const PAGE_TITLE_PREFIX_FGR_PRINT_PAGE =
  "Anleitung_Fluggastrechte_digitale_Klage_einreichen_";

export const getTitlePage = (
  originalTitle: string | undefined,
  pathname: string,
  shouldPrint: boolean,
) => {
  if (!shouldPrint || !pathname.startsWith("/fluggastrechte/formular")) {
    return originalTitle;
  }

  return `${PAGE_TITLE_PREFIX_FGR_PRINT_PAGE}${pdfDateFormat(today())}`;
};
