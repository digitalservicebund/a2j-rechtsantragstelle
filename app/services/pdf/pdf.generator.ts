import fs from "node:fs";
import path from "node:path";
import { PDFDocument, PDFCheckBox, PDFTextField, type PDFField } from "pdf-lib";
import { pdfs } from "~/services/pdf/pdfs";
import { uppercaseFirstLetter } from "~/util/strings";
import { normalizePropertyName } from "./normalizePropertyName";

export const dataDirectory = "data/pdf/";

function isCheckBoxOrTextField(field: PDFField) {
  return field instanceof PDFCheckBox || field instanceof PDFTextField;
}

function pdfFieldToEntry(field: PDFField) {
  return [normalizePropertyName(field.getName()), { name: field.getName() }];
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
  for (const pdfConfig of pdfs) {
    await generatePdfTypes(pdfConfig);
  }
}

await main();
