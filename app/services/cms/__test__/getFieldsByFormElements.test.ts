import type { z } from "zod";
import { type StrapiFieldSetComponentSchema } from "../components/StrapiFieldSet";
import type { StrapiSelectComponentSchema } from "../components/StrapiSelect";
import { getFieldsByFormElements } from "../getFieldsByFormElements";

describe("getFieldsByFormElements", () => {
  it("should return the field name for the form component", () => {
    const formElements: z.infer<typeof StrapiSelectComponentSchema> = {
      name: "doMigration",
      options: [
        {
          text: "Ich möchte die Daten aus dem Vorabcheck übernehmen",
          value: "yes",
        },
        {
          text: "Ich möchte die Daten aus dem Vorabcheck nicht übernehmen. Sie treffen nicht zu",
          value: "no",
        },
      ],
      errorMessages: [],
      id: 472,
      __component: "form-elements.select",
    };

    const actual = getFieldsByFormElements([formElements]);

    expect(actual).toStrictEqual(["doMigration"]);
  });

  it("should return the field names for the form component when it is fieldset", () => {
    const formElements: z.infer<typeof StrapiFieldSetComponentSchema> = {
      heading: "Abflug von Startflughafen Berlin Brandenburg Flughafen (BER)",
      fieldSetGroup: {
        formComponents: [
          {
            name: "direktAbflugsDatum",
            label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
            errorMessages: [],
            id: 76,
            __component: "form-elements.date-input",
          },
          {
            name: "direktAbflugsZeit",
            label: "Zeit geplanter Abflug (z.B. 09:08)",
            errorMessages: [],
            id: 40,
            __component: "form-elements.time-input",
          },
        ],
      },
      id: 2,
      __component: "form-elements.fieldset",
    };

    const actual = getFieldsByFormElements([formElements]);

    expect(actual).toStrictEqual(["direktAbflugsDatum", "direktAbflugsZeit"]);
  });
});
