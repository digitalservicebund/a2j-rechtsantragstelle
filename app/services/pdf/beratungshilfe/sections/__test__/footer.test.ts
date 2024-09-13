import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { pdfFillReducer } from "~/services/pdf/prozesskostenhilfe/fillOutFunction";
import { today, toGermanDateFormat } from "~/util/date";
import { fillFooter } from "../footer";

describe("fillFooter", () => {
  it("Adds lawyer if available", () => {
    const { pdfValues } = pdfFillReducer({
      userData: {
        anwaltskanzlei: "yes",
        beratungStattgefunden: "yes",
        anwaltName: "foo bar",
        anwaltStrasseUndHausnummer: "bar 12",
        anwaltPlz: "12345",
        anwaltOrt: "foobar",
      },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillFooter],
    });

    expect(pdfValues.beratungsperson.value).toEqual(
      "foo bar, bar 12, 12345 foobar",
    );
  });

  it("Adds note if lawyer has been contacted", () => {
    const { pdfValues } = pdfFillReducer({
      userData: {
        anwaltskanzlei: "yes",
        beratungStattgefunden: "no",
      },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillFooter],
    });

    expect(pdfValues.beratungsperson.value).toEqual(
      "Kontakt mit Kanzlei bereits aufgenommen, aber eine Beratung hat noch nicht stattgefunden",
    );
  });

  it("Adds capitalized location and date", () => {
    const { pdfValues } = pdfFillReducer({
      userData: { ort: "test" },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillFooter],
    });

    expect(pdfValues.ortDatum2.value).toEqual(
      `Test, ${toGermanDateFormat(today())}`,
    );
  });

  it("Adds name when handing in online", () => {
    const { pdfValues } = pdfFillReducer({
      userData: { abgabeArt: "online", vorname: "a", nachname: "b" },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillFooter],
    });

    expect(
      pdfValues.unterschriftdesAntragstellersderAntragstellerin.value,
    ).toEqual("a b");
  });
});
