import { z } from "zod";
import { beratungshilfePersoenlicheDatenDone } from "../doneFunctions";

const context = {
  context: {
    beruf: "Software Engineer",
    geburtsdatum: "01.01.2021",
    vorname: "John",
    nachname: "Doe",
    ort: "Berlin",
    plz: "10119",
    strasseHausnummer: "33",
    telefonnummer: "555",
  },
};

describe("eigentumDone", () => {
  it("passes with all fields set", () => {
    expect(beratungshilfePersoenlicheDatenDone(context)).toBeTruthy();
  });
  it("fails with an empty vornamename field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, vorname: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty nachname field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, nachname: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty geburtsdatum field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, geburtsdatum: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty ort field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, ort: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty plz field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, plz: "" },
      }),
    ).toBeFalsy();
  });
  it("fails with an empty strasseHausnummer field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, strasseHausnummer: "" },
      }),
    ).toBeFalsy();
  });
  it("passes with an empty telefonnummer field", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({
        context: { ...context.context, telefonnummer: z.object({}) },
      }),
    ).toBeTruthy();
  });
});
