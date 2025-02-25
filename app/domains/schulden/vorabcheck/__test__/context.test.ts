import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  hasKontopfaendung,
  hasPKonto,
  schuldenBei,
  euroSchwelle,
  context,
} from "../context";

const contextSchema = z.object(context).partial();

describe("Tests for hasKontopfaendung Zod Enum Types", () => {
  it("hasKontopfaendung accepts valid values", () => {
    expect(hasKontopfaendung.parse("ja")).toBe("ja");
    expect(hasKontopfaendung.parse("nein")).toBe("nein");
    expect(hasKontopfaendung.parse("weissNicht")).toBe("weissNicht");
  });

  it("hasKontopfaendung rejects invalid values", () => {
    expect(() => hasKontopfaendung.parse("maybe")).toThrow();
  });

  it("hasPKonto accepts valid values", () => {
    expect(hasPKonto.parse("nein")).toBe("nein");
    expect(hasPKonto.parse("ja")).toBe("ja");
    expect(hasPKonto.parse("nichtAktiv")).toBe("nichtAktiv");
    expect(hasPKonto.parse("bank")).toBe("bank");
  });

  it("hasPKonto rejects invalid values", () => {
    expect(() => hasPKonto.parse("active")).toThrow();
  });

  it("schuldenBei accepts valid values", () => {
    expect(schuldenBei.parse("privat")).toBe("privat");
    expect(schuldenBei.parse("behoerden")).toBe("behoerden");
    expect(schuldenBei.parse("weissNicht")).toBe("weissNicht");
  });

  it("schuldenBei rejects invalid values", () => {
    expect(() => schuldenBei.parse("unknown")).toThrow();
  });

  it("euroSchwelle accepts valid values", () => {
    expect(euroSchwelle.parse("nein")).toBe("nein");
    expect(euroSchwelle.parse("ja")).toBe("ja");
    expect(euroSchwelle.parse("weissNicht")).toBe("weissNicht");
    expect(euroSchwelle.parse("unterschiedlich")).toBe("unterschiedlich");
  });

  it("euroSchwelle rejects invalid values", () => {
    expect(() => euroSchwelle.parse("maybe")).toThrow();
  });
});

describe("Context Schema", () => {
  it("should accept an empty object (all fields are optional)", () => {
    expect(() => contextSchema.parse({})).not.toThrow();
  });

  it("should accept a valid context object", () => {
    const validContext = {
      hasKontopfaendung: "ja",
      hasPKonto: "bank",
      schuldenBei: "privat",
      euroSchwelle: "nein",
    };
    expect(contextSchema.parse(validContext)).toEqual(validContext);
  });

  it("should reject an object with an invalid value", () => {
    const invalidContext = {
      hasKontopfaendung: "maybe", // invalid value
    };
    expect(() => contextSchema.parse(invalidContext)).toThrow();
  });
});
