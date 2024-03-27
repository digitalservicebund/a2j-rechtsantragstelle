/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  BESCHREIBUNG_ANGELEGENHEIT_TITLE,
  EIGENBEMUEHUNG_TITLE,
  GEGNER_TITLE,
  THEMA_RECHTSPROBLEM_TITLE,
  ZIEL_ANGELEGENHEIT_TITLE,
  createAttachment,
} from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillAngelegenheit } from "~/services/pdf/beratungshilfe/sections/A_angelegenheit";

describe("A_angelegenheit", () => {
  it("should fill angelegenheit pdf field when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      bereich: "authorities",
      gegenseite: "gegner",
      beschreibung: "beschreibung",
      ziel: "ziel",
      eigeninitiativeBeschreibung: "eigeninitiativeBeschreibung",
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
        `${THEMA_RECHTSPROBLEM_TITLE} Behörden`,
        `${GEGNER_TITLE} gegner`,
        `${BESCHREIBUNG_ANGELEGENHEIT_TITLE} beschreibung`,
        `${ZIEL_ANGELEGENHEIT_TITLE} ziel`,
        `${EIGENBEMUEHUNG_TITLE} eigeninitiativeBeschreibung`,
      ].join("\n"),
    );
  });
});
