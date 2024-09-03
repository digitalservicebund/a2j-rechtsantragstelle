import type { z } from "zod";
import type { StrapiFieldsetComponentSchema } from "../components/StrapiFieldset";
import type { StrapiSelectComponentSchema } from "../components/StrapiSelect";
import { getFieldsByFormElements } from "../getFieldsByFormElements";

describe("getFieldsByFormElements", () => {
  it("should return the field name for the form component", () => {
    const formElements: z.infer<typeof StrapiSelectComponentSchema> = {
      name: "doMigration",
      label: null,
      altLabel:
        "Wollen Sie die Angaben aus dem Vorab-Check für die Klage übernehmen?",
      options: [
        {
          text: "Ich möchte die Daten aus dem Vorabcheck übernehmen",
          value: "yes",
          id: 1557,
        },
        {
          text: "Ich möchte die Daten aus dem Vorabcheck nicht übernehmen. Sie treffen nicht zu",
          value: "no",
          id: 1558,
        },
      ],
      errors: {
        data: [],
      },
      id: 472,
      __component: "form-elements.select",
    };

    const actual = getFieldsByFormElements([formElements]);

    expect(actual).toStrictEqual(["doMigration"]);
  });

  it("should return the field names for the form component when it is fieldset", () => {
    const formElements: z.infer<typeof StrapiFieldsetComponentSchema> = {
      name: "direktAbflugsDatum",
      heading: "Abflug von Startflughafen Berlin Brandenburg Flughafen (BER)",
      fieldsetGroup: {
        data: {
          id: 1,
          attributes: {
            name: "Fluggastrechte-Flugdaten - Abflug von Flughafen",
            formComponents: [
              {
                name: "direktAbflugsDatum",
                label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
                placeholder: null,
                errors: {
                  data: [],
                },
                id: 76,
                __component: "form-elements.date-input",
              },
              {
                name: "direktAbflugsZeit",
                label: "Zeit geplanter Abflug (z.B. 09:08)",
                placeholder: null,
                errors: {
                  data: [],
                },
                id: 40,
                __component: "form-elements.time-input",
              },
            ],
            locale: "de",
            createdAt: "2024-09-02T13:14:23.736Z",
            updatedAt: "2024-09-02T15:38:48.389Z",
            publishedAt: "2024-09-02T13:14:27.096Z",
          },
        },
      },
      id: 2,
      __component: "form-elements.fieldset",
    };

    const actual = getFieldsByFormElements([formElements]);

    expect(actual).toStrictEqual(["direktAbflugsDatum", "direktAbflugsZeit"]);
  });
});
