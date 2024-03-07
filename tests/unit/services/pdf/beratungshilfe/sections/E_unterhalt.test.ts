/* 
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export function fillUnterhalt(
  context: BeratungshilfeFormularContext,
  pdfFields: BeratungshilfePDF,
) {
  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "no" &&
    context.unterhalt === "yes"
  ) {
    pdfFields.e1Person1.value = [
      context.partnerVorname ?? "",
      context.partnerNachname ?? "",
    ].join(" ");
    pdfFields.e3Familienverhaeltnis.value = "Partner:in";
    pdfFields.e4Zahlung1.value = context.unterhaltsSumme;
  }
}
*/

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillUnterhalt } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";

describe("E_unterhalt", () => {
  it("should fill unterhalt pdf fields when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "no",
      unterhalt: "yes",
      partnerVorname: "Donald",
      partnerNachname: "Duck",
      klageEingereicht: "yes",
      unterhaltsSumme: "1000€",
    };
    const pdfFields = await getBeratungshilfeParameters();

    fillUnterhalt(pdfFields, context);

    expect(pdfFields.e1Person1.value).toBe("Donald Duck");
    expect(pdfFields.e3Familienverhaeltnis.value).toBe("Partner:in");
    expect(pdfFields.e4Zahlung1.value).toBe("1000€");
  });
});
