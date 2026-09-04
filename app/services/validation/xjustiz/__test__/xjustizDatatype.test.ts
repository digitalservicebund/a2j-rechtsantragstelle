import { z } from "zod";
import { translations } from "~/services/translations/translations";
import {
  datatypeA,
  datatypeB,
  datatypeC,
  datatypeD,
  datatypeE,
} from "../xjustizDatatype";

const message = (characters: string) =>
  `${translations.xjustiz.invalidCharacters.de} ${characters}`;

describe("the xjustiz datatype check", () => {
  const requiredSchema = z.string().trim().min(1).check(datatypeA);
  const optionalSchema = z.string().trim().optional().check(datatypeA);

  it("should report the rejected characters in the translated message", () => {
    const actual = requiredSchema.safeParse("Max 1 & Co");

    expect(actual.error?.issues[0].message).toBe(message("1, &"));
  });

  it("should list a repeated character only once", () => {
    const actual = requiredSchema.safeParse("111");

    expect(actual.error?.issues[0].message).toBe(message("1"));
  });

  it("should skip an optional field that was left empty", () => {
    expect(optionalSchema.safeParse(undefined)).toEqual({
      data: undefined,
      success: true,
    });
  });
});

describe("character sets of the xjustiz datatypes", () => {
  describe("datatype A, for names of natural persons", () => {
    const schema = z.string().check(datatypeA);

    it("should accept latin letters, spaces, hyphens and apostrophes", () => {
      expect(schema.safeParse("Erika Musterfrau").success).toBe(true);
      expect(schema.safeParse("Müller-Lüdenscheidt").success).toBe(true);
      expect(schema.safeParse("O'Brien").success).toBe(true);
    });

    it("should reject digits", () => {
      expect(schema.safeParse("Max 1").error?.issues[0].message).toBe(
        message("1"),
      );
    });

    it("should reject symbols that are allowed from datatype B onwards", () => {
      expect(schema.safeParse("Müller & Söhne").error?.issues[0].message).toBe(
        message("&"),
      );
    });
  });

  describe("datatype B, for addresses and legal entities", () => {
    const schema = z.string().check(datatypeB);

    it("should accept digits and common symbols", () => {
      expect(schema.safeParse("Hauptstraße 1a").success).toBe(true);
      expect(schema.safeParse("Müller & Söhne GmbH").success).toBe(true);
    });

    it("should reject line breaks", () => {
      expect(schema.safeParse("Zeile1\nZeile2").error?.issues[0].message).toBe(
        message("\n"),
      );
    });

    it("should reject typographic quotation marks", () => {
      expect(schema.safeParse("Er sagte „nein“").error?.issues[0].message).toBe(
        message("„, “"),
      );
    });
  });

  describe("datatype C, for free text", () => {
    const schema = z.string().check(datatypeC);

    it("should accept line breaks and fractions", () => {
      expect(schema.safeParse("Zeile1\nZeile2").success).toBe(true);
      expect(schema.safeParse("½ Anteil").success).toBe(true);
    });

    it("should reject typographic quotation marks", () => {
      expect(schema.safeParse("Er sagte „nein“").error?.issues[0].message).toBe(
        message("„, “"),
      );
    });

    it("should reject cyrillic letters", () => {
      expect(schema.safeParse("Невский").error?.issues[0].message).toBe(
        message("Н, е, в, с, к, и, й"),
      );
    });
  });

  describe("datatype D, for legal entities and product names", () => {
    const schema = z.string().check(datatypeD);

    it("should accept greek letters and typographic quotation marks", () => {
      expect(schema.safeParse("Εταιρεία Α.Ε.").success).toBe(true);
      expect(schema.safeParse("Er sagte „nein“").success).toBe(true);
    });

    it("should reject line breaks", () => {
      expect(schema.safeParse("Zeile1\nZeile2").error?.issues[0].message).toBe(
        message("\n"),
      );
    });

    it("should reject cyrillic letters", () => {
      expect(schema.safeParse("Невский").error?.issues[0].message).toBe(
        message("Н, е, в, с, к, и, й"),
      );
    });
  });

  describe("datatype E, for everything the norm allows", () => {
    const schema = z.string().check(datatypeE);

    it("should accept cyrillic and greek letters as well as line breaks", () => {
      expect(schema.safeParse("Невский 15").success).toBe(true);
      expect(schema.safeParse("Εταιρεία Α.Ε.").success).toBe(true);
      expect(schema.safeParse("Zeile1\nZeile2").success).toBe(true);
    });

    it("should reject characters outside the norm", () => {
      expect(schema.safeParse("Emoji 😀").error?.issues[0].message).toBe(
        message("😀"),
      );
    });
  });
});
