import type { ProzesskostenhilfePersoenlicheDaten } from "../context";
import { prozesskostenhilfePersoenlicheDatenDone } from "../doneFunctions";

const context: ProzesskostenhilfePersoenlicheDaten = {
  beruf: "Software Engineer",
  geburtsdatum: "01.01.2021",
  vorname: "John",
  nachname: "Doe",
  ort: "Berlin",
  plz: "10119",
  strasseHausnummer: "33",
};

const contextWithPhonenumber = { ...context, telefonnummer: 12345 };

describe("eigentumDone", () => {
  it("passes with all fields set", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: contextWithPhonenumber,
      }),
    ).toBeTruthy();
  });
  it("fails with an empty vornamename field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, vorname: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty nachname field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, nachname: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty geburtsdatum field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, geburtsdatum: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty ort field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, ort: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty plz field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, plz: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty strasseHausnummer field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context, strasseHausnummer: "" },
      }),
    ).toBeFalsy();
  });
  it("passes with an empty telefonnummer field", () => {
    expect(
      prozesskostenhilfePersoenlicheDatenDone({
        context: { ...context },
      }),
    ).toBeTruthy();
  });
});
