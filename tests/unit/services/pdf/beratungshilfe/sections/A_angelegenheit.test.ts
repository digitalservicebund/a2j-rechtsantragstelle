import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { Attachment } from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillAngelegenheit } from "~/services/pdf/beratungshilfe/sections/A_angelegenheit";

describe("A_angelegenheit", () => {
  it("should fill angelegenheit pdf field if ", async () => {
    const context: BeratungshilfeFormularContext = {
      bereich: "authorities",
      beschreibung: "beschreibung",
      eigeninitiativeBeschreibung: "eigeninitiativeBeschreibung",
      keineEigeninitiativeBeschreibung: "keineEigeninitiativeBeschreibung",
    };
    const attachment = new Attachment(context);
    const pdfFields = await getBeratungshilfeParameters();

    fillAngelegenheit(attachment, pdfFields);

    // expect(
    //   pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern,
    // ).toBe(
    //   attachment.descriptions.map((x) => `${x.title} ${x.text} `).join("\n"),
    // );
  });
});
