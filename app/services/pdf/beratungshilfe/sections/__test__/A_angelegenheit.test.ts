/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  createAttachment,
  newPageHint,
} from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import {
  fillAngelegenheit,
  BESCHREIBUNG_ANGELEGENHEIT_TITLE,
  EIGENBEMUEHUNG_TITLE,
  GEGNER_TITLE,
  THEMA_RECHTSPROBLEM_TITLE,
  ZIEL_ANGELEGENHEIT_TITLE,
} from "~/services/pdf/beratungshilfe/sections/A_angelegenheit";

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
    const pdfFields = getBeratungshilfeParameters();

    fillAngelegenheit(attachment, pdfFields, context);

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

  it("should fill angelegenheit in the attachment when exceeded limit length", async () => {
    const context: BeratungshilfeFormularContext = {
      bereich: "authorities",
      gegenseite: "gegner gegner gegner gegner gegner",
      beschreibung:
        "beschreibung beschreibung beschreibung beschreibung beschreibung",
      ziel: "ziel ziel ziel ziel ziel ziel ziel ziel ziel",
      eigeninitiativeBeschreibung:
        "eigeninitiativeBeschreibung eigeninitiativeBeschreibung eigeninitiativeBeschreibung eigeninitiativeBeschreibung",
    };
    const attachment = createAttachment(context);
    const pdfFields = getBeratungshilfeParameters();

    fillAngelegenheit(attachment, pdfFields, context);

    expect(
      pdfFields
        .ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern
        .value,
    ).toBe(newPageHint);

    expect(attachment.shouldCreateAttachment).toBe(true);

    const hasBeschreibungAngelegenheit = attachment.descriptions.some(
      (description) => description.title === BESCHREIBUNG_ANGELEGENHEIT_TITLE,
    );

    const hasThemeRechtsproblem = attachment.descriptions.some(
      (description) => description.title === THEMA_RECHTSPROBLEM_TITLE,
    );
    const hasGegner = attachment.descriptions.some(
      (description) => description.title === GEGNER_TITLE,
    );
    const hasZielAngelegenheit = attachment.descriptions.some(
      (description) => description.title === ZIEL_ANGELEGENHEIT_TITLE,
    );
    const hasEigeninitiativeBeschreibung = attachment.descriptions.some(
      (description) => description.title === EIGENBEMUEHUNG_TITLE,
    );
    expect(hasBeschreibungAngelegenheit).toBeTruthy();
    expect(hasThemeRechtsproblem).toBeTruthy();
    expect(hasGegner).toBeTruthy();
    expect(hasZielAngelegenheit).toBeTruthy();
    expect(hasEigeninitiativeBeschreibung).toBeTruthy();
  });
});
