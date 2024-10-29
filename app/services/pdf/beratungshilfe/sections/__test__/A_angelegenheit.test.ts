import { type BeratungshilfeFormularContext } from "app/flows/beratungshilfe/formular";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  fillAngelegenheit,
  BESCHREIBUNG_ANGELEGENHEIT_TITLE,
  EIGENBEMUEHUNG_TITLE,
  GEGNER_TITLE,
  THEMA_RECHTSPROBLEM_TITLE,
  ZIEL_ANGELEGENHEIT_TITLE,
} from "~/services/pdf/beratungshilfe/sections/A_angelegenheit";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";

describe("A_angelegenheit", () => {
  it("should fill angelegenheit in the attachment when exceeded new line limit count", () => {
    const userData: BeratungshilfeFormularContext = {
      bereich: "authorities",
      gegenseite: "gegner",
      beschreibung: "beschreibung",
      ziel: "ziel",
      eigeninitiativeBeschreibung: "eigeninitiativeBeschreibung",
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAngelegenheit],
    });

    expect(
      pdfValues
        .ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern
        .value,
    ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);

    const hasBeschreibungAngelegenheit = attachment.some(
      (description) => description.title === BESCHREIBUNG_ANGELEGENHEIT_TITLE,
    );

    const hasThemeRechtsproblem = attachment.some(
      (description) => description.title === THEMA_RECHTSPROBLEM_TITLE,
    );
    const hasGegner = attachment.some(
      (description) => description.title === GEGNER_TITLE,
    );
    const hasZielAngelegenheit = attachment.some(
      (description) => description.title === ZIEL_ANGELEGENHEIT_TITLE,
    );
    const hasEigeninitiativeBeschreibung = attachment.some(
      (description) => description.title === EIGENBEMUEHUNG_TITLE,
    );
    expect(hasBeschreibungAngelegenheit).toBeTruthy();
    expect(hasThemeRechtsproblem).toBeTruthy();
    expect(hasGegner).toBeTruthy();
    expect(hasZielAngelegenheit).toBeTruthy();
    expect(hasEigeninitiativeBeschreibung).toBeTruthy();
  });

  it("should fill angelegenheit in the attachment when exceeded character limit length", () => {
    const userData: BeratungshilfeFormularContext = {
      bereich: "authorities",
      gegenseite: "gegner gegner gegner gegner gegner",
      beschreibung:
        "beschreibung beschreibung beschreibung beschreibung beschreibung",
      ziel: "ziel ziel ziel ziel ziel ziel ziel ziel ziel",
      eigeninitiativeBeschreibung:
        "eigeninitiativeBeschreibung eigeninitiativeBeschreibung eigeninitiativeBeschreibung eigeninitiativeBeschreibung",
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAngelegenheit],
    });

    expect(
      pdfValues
        .ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern
        .value,
    ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);

    const hasBeschreibungAngelegenheit = attachment.some(
      (description) => description.title === BESCHREIBUNG_ANGELEGENHEIT_TITLE,
    );

    const hasThemeRechtsproblem = attachment.some(
      (description) => description.title === THEMA_RECHTSPROBLEM_TITLE,
    );
    const hasGegner = attachment.some(
      (description) => description.title === GEGNER_TITLE,
    );
    const hasZielAngelegenheit = attachment.some(
      (description) => description.title === ZIEL_ANGELEGENHEIT_TITLE,
    );
    const hasEigeninitiativeBeschreibung = attachment.some(
      (description) => description.title === EIGENBEMUEHUNG_TITLE,
    );
    expect(hasBeschreibungAngelegenheit).toBeTruthy();
    expect(hasThemeRechtsproblem).toBeTruthy();
    expect(hasGegner).toBeTruthy();
    expect(hasZielAngelegenheit).toBeTruthy();
    expect(hasEigeninitiativeBeschreibung).toBeTruthy();
  });
});
