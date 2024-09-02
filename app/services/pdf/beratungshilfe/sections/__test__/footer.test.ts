import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { today, toGermanDateFormat } from "~/util/date";
import { fillFooter } from "../footer";

describe("fillFooter", () => {
  it("Adds lawyer if available", () => {
    const pdfFields = getBeratungshilfeParameters();
    fillFooter(pdfFields, {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "yes",
      anwaltName: "foo bar",
      anwaltStrasseUndHausnummer: "bar 12",
      anwaltPlz: "12345",
      anwaltOrt: "foobar",
    });
    expect(pdfFields.beratungsperson.value).toEqual(
      "foo bar, bar 12, 12345 foobar",
    );
  });

  it("Adds note if lawyer has been contacted", () => {
    const pdfFields = getBeratungshilfeParameters();
    fillFooter(pdfFields, {
      anwaltskanzlei: "yes",
      beratungStattgefunden: "no",
    });
    expect(pdfFields.beratungsperson.value).toEqual(
      "Kontakt mit Kanzlei bereits aufgenommen, aber eine Beratung hat noch nicht stattgefunden",
    );
  });

  it("Adds capitalized location and date", () => {
    const pdfFields = getBeratungshilfeParameters();
    fillFooter(pdfFields, { ort: "test" });
    expect(pdfFields.ortDatum2.value).toEqual(
      `Test, ${toGermanDateFormat(today())}`,
    );
  });

  it("Adds name when handing in online", () => {
    const pdfFields = getBeratungshilfeParameters();
    fillFooter(pdfFields, { abgabeArt: "online", vorname: "a", nachname: "b" });
    expect(
      pdfFields.unterschriftdesAntragstellersderAntragstellerin.value,
    ).toEqual("a b");
  });
});
