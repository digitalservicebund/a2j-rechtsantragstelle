/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillAngelegenheit } from "~/services/pdf/beratungshilfe/sections/A_angelegenheit";

describe("A_angelegenheit", () => {
  it("should fill angelegenheit pdf field when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      bereich: "authorities",
      beschreibung: "beschreibung",
      eigeninitiativeBeschreibung: "eigeninitiativeBeschreibung",
      keineEigeninitiativeBeschreibung: "keineEigeninitiativeBeschreibung",
    };
    const attachment = createAttachment(context);
    const pdfFields = await getBeratungshilfeParameters();

    fillAngelegenheit(attachment, pdfFields);

    expect(
      pdfFields
        .ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern
        .value,
    ).toBe(
      [
        "Thema des Rechtsproblems: Behörden",
        "Beschreibung Angelegenheit: beschreibung",
        "Eigenbemühungen: eigeninitiativeBeschreibung",
      ].join("\n"),
    );
  });
});
