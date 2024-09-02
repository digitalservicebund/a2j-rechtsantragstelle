import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillVorraussetzungen } from "~/services/pdf/beratungshilfe/sections/B_vorraussetzungen";

describe("B_vorraussetzungen", () => {
  it("should not check vorraussetzung checkbox pdf fields when context vorraussetzung is yes", () => {
    const context: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "yes",
      beratungshilfeBeantragt: "yes",
      eigeninitiativeGrundvorraussetzung: "yes",
      klageEingereicht: "yes",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillVorraussetzungen(pdfFields, context);

    expect(
      pdfFields
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(false);
    expect(
      pdfFields
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(false);
    expect(
      pdfFields
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(false);
    expect(
      pdfFields
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(false);
  });

  it("should not check vorraussetzung checkbox pdf fields when context vorraussetzung is no", () => {
    const context: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      klageEingereicht: "no",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillVorraussetzungen(pdfFields, context);

    expect(
      pdfFields
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(true);
    expect(
      pdfFields
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(true);
    expect(
      pdfFields
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(true);
    expect(
      pdfFields
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(true);
  });

  it("should check and uncheck vorraussetzung checkbox pdf fields when context vorraussetzung is with yes or no", () => {
    const context: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "no",
      beratungshilfeBeantragt: "yes",
      eigeninitiativeGrundvorraussetzung: "yes",
      klageEingereicht: "no",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillVorraussetzungen(pdfFields, context);

    expect(
      pdfFields
        .bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein
        .value,
    ).toBe(true);
    expect(
      pdfFields
        .b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden
        .value,
    ).toBe(false);
    expect(
      pdfFields
        .b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen
        .value,
    ).toBe(false);
    expect(
      pdfFields
        .b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt
        .value,
    ).toBe(true);
  });
});
