import { PDFCheckBox, PDFDocument } from "pdf-lib";
import {
  quicktype,
  InputData,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
} from "quicktype-core";
import * as fs from "fs";

import { normalizePropertyName } from "../pdf.server";
import { getBeratungshilfePdf } from "./beratungshilfe.server";
import path from "path";

const generate = async () => {
  const pdfDoc = await PDFDocument.load(getBeratungshilfePdf());
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const quickTypeJSONSchema: { [k: string]: any } = {};

  quickTypeJSONSchema["$ref"] = "#/definitions/BeratungshilfePDF";
  quickTypeJSONSchema["definitions"] = {
    BeratungshilfePDF: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
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
      additionalProperties: false,
    },
  };

  const beratungshilfePDF = {
    type: "object",
    additionalProperties: false,
    properties: {} as { [k: string]: any },
  };

  fields
    .sort((x, y) => x.getName().localeCompare(y.getName()))
    .forEach((field) => {
      const fieldName = normalizePropertyName(field.getName());
      let ref = "#/definitions/StringField";

      if (field instanceof PDFCheckBox) {
        ref = "#/definitions/BooleanField";
      }

      beratungshilfePDF.properties[fieldName] = {
        $ref: ref,
      };
    });
  quickTypeJSONSchema["definitions"]["BeratungshilfePDF"] = beratungshilfePDF;

  const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
  await schemaInput.addSource({
    name: "BeratungshilfePdf",
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
    path.join(__dirname, "/beratungshilfe.generated.ts"),
    quickType.lines.join("\n"),
  );

  console.log("Done");
};

generate();
