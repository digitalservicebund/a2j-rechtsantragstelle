import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  BESCHREIBUNG_ANGELEGENHEIT_TITLE,
  EIGENBEMUEHUNG_TITLE,
  GEGNER_TITLE,
  MARITIAL_STATUS_TITLE,
  THEMA_RECHTSPROBLEM_TITLE,
  ZIEL_ANGELEGENHEIT_TITLE,
  createAttachment,
} from "~/services/pdf/beratungshilfe/attachment";

describe("createAttachment", () => {
  it("should add marital description in the attachment is bigger than 10 characters", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
    };

    const attachment = createAttachment(context);
    const hasMaritalDescription = attachment.descriptions.some(
      (description) => description.title === MARITIAL_STATUS_TITLE,
    );
    expect(hasMaritalDescription).toBeTruthy();
  });

  it("should not add marital description in the attachment is lower than 10 characters", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
    };

    const attachment = createAttachment(context);
    const hasMaritalDescription = attachment.descriptions.some(
      (description) => description.title === MARITIAL_STATUS_TITLE,
    );
    expect(hasMaritalDescription).toBeFalsy();
  });

  it("should add bereich description in the attachment", () => {
    const context: BeratungshilfeFormularContext = {
      bereich: "inheritance",
    };

    const attachment = createAttachment(context);
    const hasThemeRechtsproblem = attachment.descriptions.some(
      (description) => description.title === THEMA_RECHTSPROBLEM_TITLE,
    );
    expect(hasThemeRechtsproblem).toBeTruthy();
  });
  it("should add gegner description in the attachment", () => {
    const context: BeratungshilfeFormularContext = {
      gegenseite: "gegner",
    };

    const attachment = createAttachment(context);
    const hasGegner = attachment.descriptions.some(
      (description) => description.title === GEGNER_TITLE,
    );
    expect(hasGegner).toBeTruthy();
  });
  it("should add beschreibung der angelegenheit in the attachment", () => {
    const context: BeratungshilfeFormularContext = {
      beschreibung: "beschreibung",
    };

    const attachment = createAttachment(context);
    const hasBeschreibungAngelegenheit = attachment.descriptions.some(
      (description) => description.title === BESCHREIBUNG_ANGELEGENHEIT_TITLE,
    );
    expect(hasBeschreibungAngelegenheit).toBeTruthy();
  });
  it("should add ziel der angelegenheit in the attachment", () => {
    const context: BeratungshilfeFormularContext = {
      ziel: "ziel",
    };

    const attachment = createAttachment(context);
    const hasZielAngelegenheit = attachment.descriptions.some(
      (description) => description.title === ZIEL_ANGELEGENHEIT_TITLE,
    );
    expect(hasZielAngelegenheit).toBeTruthy();
  });
  it("should add eigenbemuehung in the attachment", () => {
    const context: BeratungshilfeFormularContext = {
      eigeninitiativeBeschreibung: "eigeninitiativeBeschreibung",
    };

    const attachment = createAttachment(context);
    const hasEigeninitiativeBeschreibung = attachment.descriptions.some(
      (description) => description.title === EIGENBEMUEHUNG_TITLE,
    );
    expect(hasEigeninitiativeBeschreibung).toBeTruthy();
  });
});
