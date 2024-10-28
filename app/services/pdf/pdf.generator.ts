import fs from "node:fs";
import path from "node:path";
import {
  PDFArray,
  PDFDocument,
  PDFCheckBox,
  PDFTextField,
  type PDFField,
  asPDFName,
} from "pdf-lib";
import { pdfs } from "~/services/pdf/pdfs";
import { uppercaseFirstLetter } from "~/util/strings";
import { normalizePropertyName } from "./normalizePropertyName";

const dataDirectory = "data/pdf/";

function isCheckBoxOrTextField(field: PDFField) {
  return field instanceof PDFCheckBox || field instanceof PDFTextField;
}

function textfieldRectangle(field: PDFField) {
  const pdfRect = field.acroField.dict.get(asPDFName("Rect"));
  if (field instanceof PDFTextField && pdfRect instanceof PDFArray)
    return pdfRect.asRectangle();
}

function textfieldLimits(field: PDFField) {
  // Conversion factors were found by trial and error
  const pdfWidthToChar = 4;
  const pdfHeightToLines = 17;
  const rect = textfieldRectangle(field);
  if (rect) {
    return {
      maxCharWidth: Math.round(rect.width / pdfWidthToChar),
      maxLines: Math.round(rect.height / pdfHeightToLines),
    };
  }
}

function pdfFieldToEntry(field: PDFField) {
  return [
    normalizePropertyName(field.getName()),
    { name: field.getName(), ...textfieldLimits(field) },
  ];
}

function pdfFieldToType(field: PDFField) {
  return `"${normalizePropertyName(field.getName())}": ${field instanceof PDFCheckBox ? "BooleanField" : "StringField"};`;
}

async function generatePdfTypes({
  service,
  pdfFilename,
  typeName,
}: (typeof pdfs)[number]) {
  const filepath = path.resolve(
    path.join(process.cwd(), dataDirectory, service, pdfFilename),
  );
  const outputFilepath = path.join(
    process.cwd(),
    dataDirectory,
    service,
    `${service}.generated.ts`,
  );

  const pdfDoc = await PDFDocument.load(fs.readFileSync(filepath));
  const pdfFields = pdfDoc.getForm().getFields().filter(isCheckBoxOrTextField);
  const functionName = `get${uppercaseFirstLetter(service)}Parameters`;
  const pdfFieldsObject = Object.fromEntries(pdfFields.map(pdfFieldToEntry));

  const fileContent = `import type { BooleanField, StringField } from "~/services/pdf/fileTypes";

export function ${functionName}(): ${typeName} {
  return ${JSON.stringify(pdfFieldsObject, null, 2)};
}

export type ${typeName} = {
  ${[...new Set(pdfFields.map(pdfFieldToType))].join("\n  ")}
};
`;

  fs.writeFileSync(outputFilepath, fileContent);
  // eslint-disable-next-line no-console
  console.log("Done");
}

async function main() {
  pdfs.forEach((pdfConfig) => generatePdfTypes(pdfConfig));
}

main();
