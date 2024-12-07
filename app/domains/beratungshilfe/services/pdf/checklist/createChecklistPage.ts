import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { createHeading } from "~/services/pdf/createHeading";
import { createHeader } from "~/services/pdf/header/createHeader";
import { createChecklistSteps } from "./createChecklistSteps";

export const createChecklistPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: BeratungshilfeFormularContext,
) => {
  // Setting PDF metadata is redundant since it is overwritten during appendPagesToPdf function
  createHeader(
    doc,
    documentStruct,
    userData,
    "Merkblatt: Antrag auf Bewilligung von Beratungshilfe",
  );
  const checklistPageStruct = doc.struct("Sect");

  createHeading(doc, checklistPageStruct, "Ihre nächsten Schritte", "H1");

  createHeading(
    doc,
    checklistPageStruct,
    userData.abgabeArt === "online"
      ? "So stellen Sie den Antrag online"
      : "So schicken Sie den Antrag ins Amtsgericht",
    "H2",
  );

  createChecklistSteps(doc, checklistPageStruct, userData);

  documentStruct.add(checklistPageStruct);
};
