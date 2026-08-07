import { personName } from "~/domains/nachlass/erbschein/shared/personName";

describe("personName", () => {
  it("joins first and last name with a space", () => {
    expect(personName({ vorname: "Max", nachname: "Mustermann" })).toEqual(
      "Max Mustermann",
    );
  });

  it("omits missing first name", () => {
    expect(personName({ nachname: "Mustermann" })).toEqual("Mustermann");
  });

  it("omits missing last name", () => {
    expect(personName({ vorname: "Max" })).toEqual("Max");
  });

  it("omits both names if missing", () => {
    expect(personName({})).toEqual("");
  });

  it("includes geburtsname in parentheses if present", () => {
    expect(
      personName({
        vorname: "Max",
        nachname: "Mustermann",
        geburtsname: "Musterfrau",
      }),
    ).toEqual("Max (Musterfrau) Mustermann");
  });
});
