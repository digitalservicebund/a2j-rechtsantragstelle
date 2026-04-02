import { today, pdfDateFormat } from "~/util/date";

const PAGE_TITLE_PREFIX_FGR_PRINT_PAGE =
  "Anleitung_Fluggastrechte_digitale_Klage_einreichen_";

const PAGE_TITLE_PREFIX_TGA_PRINT_PAGE =
  "Anleitung_Geld_einklagen_Klage_einreichen_";

export const generatePrintTitle = (
  originalTitle: string | undefined,
  pathname: string,
) => {
  if (pathname.startsWith("/fluggastrechte/formular")) {
    return `${PAGE_TITLE_PREFIX_FGR_PRINT_PAGE}${pdfDateFormat(today())}`;
  }

  if (pathname.startsWith("/geld-einklagen/formular")) {
    return `${PAGE_TITLE_PREFIX_TGA_PRINT_PAGE}${pdfDateFormat(today())}`;
  }

  return originalTitle;
};
