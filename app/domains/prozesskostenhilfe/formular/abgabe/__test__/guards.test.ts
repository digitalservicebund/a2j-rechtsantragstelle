import type { ProzesskostenhilfeFormularUserData } from "../../userData";
import { readyForAbgabe } from "../guards";

describe("readyForAbgabe", () => {
  const allStepsDone = {
    pageData: {
      subflowDoneStates: {
        "/start": true,
        "/grundvoraussetzungen": true,
        "/antragstellende-person": true,
        "/rechtsschutzversicherung": true,
        "/finanzielle-angaben": true,
        "/gesetzliche-vertretung": true,
        "/persoenliche-daten": true,
        "/weitere-angaben": true,
        "/abgabe": true,
        "/finanzielle-angaben/einkuenfte": true,
      },
      arrayIndexes: [],
    },
  };

  const rechtsschutzversicherungNotDone = {
    pageData: {
      subflowDoneStates: {
        ...allStepsDone.pageData.subflowDoneStates,
        "/rechtsschutzversicherung": false,
      },
      arrayIndexes: [],
    },
  };

  it("should return false when erstantrag and not all steps are done", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      ...rechtsschutzversicherungNotDone,
      formularArt: "erstantrag",
    };

    expect(readyForAbgabe({ context })).toBe(false);
  });

  it("should return true when erstantrag and all steps are done", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      ...allStepsDone,
      formularArt: "erstantrag",
    };

    expect(readyForAbgabe({ context })).toBe(true);
  });

  it("should return true when nachueberpruefung and /rechtsschutzversicherung is skipped", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      ...rechtsschutzversicherungNotDone,
      formularArt: "nachueberpruefung",
    };

    expect(readyForAbgabe({ context })).toBe(true);
  });

  it("should return true when nachueberpruefung and all steps including /rechtsschutzversicherung are done", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      ...allStepsDone,
      formularArt: "nachueberpruefung",
    };

    expect(readyForAbgabe({ context })).toBe(true);
  });

  it("should return false when missing subflowDoneStates", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      pageData: { arrayIndexes: [] },
      formularArt: "erstantrag",
    };

    expect(readyForAbgabe({ context })).toBe(false);
  });

  it("should return false when other steps are not done", () => {
    const context: ProzesskostenhilfeFormularUserData = {
      pageData: {
        subflowDoneStates: {
          ...allStepsDone.pageData.subflowDoneStates,
          "/finanzielle-angaben": false,
        },
        arrayIndexes: [],
      },
      formularArt: "erstantrag",
    };

    expect(readyForAbgabe({ context })).toBe(false);
  });
});
