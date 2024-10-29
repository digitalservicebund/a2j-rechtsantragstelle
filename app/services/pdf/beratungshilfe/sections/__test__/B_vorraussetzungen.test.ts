import { type BeratungshilfeFormularContext } from "app/flows/beratungshilfe/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillVorraussetzungen } from "~/services/pdf/beratungshilfe/sections/B_vorraussetzungen";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";

describe("B_vorraussetzungen", () => {
  it("should not check vorraussetzung checkbox pdf fields when context vorraussetzung is yes", () => {
    const userData: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "yes",
      beratungshilfeBeantragt: "yes",
      eigeninitiativeGrundvorraussetzung: "yes",
      klageEingereicht: "yes",
    };
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillVorraussetzungen],
    });

    expect(
      pdfValues
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(false);
    expect(
      pdfValues
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(false);
    expect(
      pdfValues
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(false);
    expect(
      pdfValues
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(false);
  });

  it("should not check vorraussetzung checkbox pdf fields when context vorraussetzung is no", () => {
    const userData: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      klageEingereicht: "no",
    };
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillVorraussetzungen],
    });

    expect(
      pdfValues
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(true);
    expect(
      pdfValues
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(true);
    expect(
      pdfValues
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(true);
    expect(
      pdfValues
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(true);
  });

  it("should check and uncheck vorraussetzung checkbox pdf fields when context vorraussetzung is with yes or no", () => {
    const userData: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "no",
      beratungshilfeBeantragt: "yes",
      eigeninitiativeGrundvorraussetzung: "yes",
      klageEingereicht: "no",
    };
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillVorraussetzungen],
    });

    expect(
      pdfValues
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(true);
    expect(
      pdfValues
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(false);
    expect(
      pdfValues
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(false);
    expect(
      pdfValues
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(true);
  });
});
