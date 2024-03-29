import { PDFCheckBox, PDFDocument } from "pdf-lib";
import {
  quicktype,
  InputData,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
} from "quicktype-core";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { normalizePropertyName } from "./pdf.server";

const dataDirectory = "data/pdf/";

const question = (questionText: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) =>
    rl.question(questionText, resolve),
  ).finally(() => rl.close());
};

// This will generate a TypeScript file from a PDF file based on the PDF's form fields.
// The generated file will contain a TypeScript interface
// that can be used to validate the PDF's form fields.
// To map the generated properties to the PDF's form fields,
// use tools like pdffiller.com to find the form field id names
const generate = async () => {
  const pdfFilePath = await question(
    "Enter the path to the PDF file (example: beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf): ",
  );
  const definitionName = await question(
    "Enter the name of the definition (example: BeratungshilfePDF): ",
  );
  const generatedFile = await question(
    "Enter the path to the generated output file (example: beratungshilfe/beratungshilfe.generated.ts): ",
  );

  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(
      path.resolve(path.join(process.cwd(), dataDirectory, pdfFilePath)),
    ),
  );
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const quickTypeJSONSchema: { [k: string]: any } = {};

  quickTypeJSONSchema["$ref"] = "#/definitions/" + definitionName;
  quickTypeJSONSchema["definitions"] = {
    BooleanField: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        value: {
          type: "boolean",
        },
      },
      additionalProperties: false,
      required: ["name"],
    },
    StringField: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        value: {
          type: "string",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  };

  quickTypeJSONSchema["definitions"][definitionName] = {
    type: "object",
    additionalProperties: false,
    properties: {},
  };

  const sortedFields = [...fields].sort((x, y) =>
    x.getName().localeCompare(y.getName()),
  );

  const requiredFields = sortedFields.map((field) =>
    normalizePropertyName(field.getName()),
  );

  const jsonPDF = {
    type: "object",
    additionalProperties: false,
    properties: {} as { [k: string]: any },
    required: requiredFields,
  };

  sortedFields.forEach((field) => {
    const fieldName = normalizePropertyName(field.getName());
    let ref = "#/definitions/StringField";

    if (field instanceof PDFCheckBox) {
      ref = "#/definitions/BooleanField";
    }

    jsonPDF.properties[fieldName] = {
      $ref: ref,
    };
  });
  jsonPDF.required = requiredFields;

  quickTypeJSONSchema["definitions"][definitionName] = jsonPDF;

  const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
  await schemaInput.addSource({
    name: definitionName,
    schema: JSON.stringify(quickTypeJSONSchema),
  });
  const inputData = new InputData();
  inputData.addInput(schemaInput);

  const quickType = await quicktype({
    inputData,
    lang: "typescript",
    rendererOptions: {
      "nice-property-names": "true",
      "explicit-unions": "true",
    },
  });

  fs.writeFileSync(
    path.join(process.cwd(), dataDirectory, generatedFile),
    quickType.lines.join("\n"),
  );

  console.log("Done");
};

void generate();
