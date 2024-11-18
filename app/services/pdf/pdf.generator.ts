import fs from "node:fs";
import path from "node:path";
import type { PDFField } from "pdf-lib";
import {
  PDFCheckBox,
  PDFDocument,
  PDFTextField,
  PDFName,
  PDFArray,
  PDFString,
} from "pdf-lib";
import { pdfs } from "~/services/pdf/pdfs";
import { uppercaseFirstLetter } from "~/util/strings";
import { normalizePropertyName } from "./normalizePropertyName";

const dataDirectory = "data/pdf/";
// For most fonts, the average character width is around 0.5 to 0.6 times the font size.
const CHARACTER_WIDTH_TO_HEIGHT_RATIO = 0.5;
const LINE_HEIGHT_TO_FONT_SIZE_RATIO = 1.2;
const FONT_SIZE_DEFAULT = 12;

function isCheckBoxOrTextField(field: PDFField) {
  return field instanceof PDFCheckBox || field instanceof PDFTextField;
}

function fontSizeFromTextField(field: PDFField) {
  // DA holds "default appearance settings" in the format like "/Helv 12 Tf 0 g"
  // "FontName, fontSize, Operator Texffont, color grescale, set grayscale"
  const daEntry = field.acroField.dict.lookup(PDFName.of("DA"));
  if (daEntry instanceof PDFString) {
    return Number(daEntry.asString().split(" ").at(1));
  }
}

function rectangleFromTextField(field: PDFField) {
  // Rect holds the rectangle coordinates of the form field
  const rect = field.acroField.dict.lookup(PDFName.of("Rect"));

  if (rect instanceof PDFArray) return rect.asRectangle();
}

function calculateMaxCharactersAndLinebreaksInRectangle(field: PDFTextField) {
  const width = rectangleFromTextField(field)?.width;
  const height = rectangleFromTextField(field)?.height;

  const textFieldFontSize = fontSizeFromTextField(field);
  // font size 0 means auto scale and is replaced with default font size
  const fontSize =
    !textFieldFontSize || textFieldFontSize === 0
      ? FONT_SIZE_DEFAULT
      : textFieldFontSize;
  const characterWidth = fontSize * CHARACTER_WIDTH_TO_HEIGHT_RATIO;

  return {
    maxCharacters: width ? Math.floor(width / characterWidth) : undefined,
    maxLineBreaks: height
      ? Math.floor(height / (fontSize * LINE_HEIGHT_TO_FONT_SIZE_RATIO))
      : undefined,
  };
}

function pdfFieldToEntry(field: PDFField) {
  if (field instanceof PDFTextField) {
    const { maxCharacters, maxLineBreaks } =
      calculateMaxCharactersAndLinebreaksInRectangle(field);
    return [
      normalizePropertyName(field.getName()),
      {
        name: field.getName(),
        ...{ maxCharacters },
        ...{ maxLineBreaks },
      },
    ];
  } else
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
