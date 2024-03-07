import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillVorraussetzungen } from "~/services/pdf/beratungshilfe/sections/B_vorraussetzungen";

describe("B_angelegenheit", () => {
  it("should fill vorraussetzung pdf fields when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      rechtsschutzversicherung: "yes",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      klageEingereicht: "yes",
    };
    const pdfFields = await getBeratungshilfeParameters();

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
    ).toBe(false);
  });
});
