import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js/max";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/de";

dayjs.extend(customParseFormat);

function phoneNumberValid(phoneNumber: string): string {
  const phoneNumberParsed = parsePhoneNumber(phoneNumber, "DE");
  if (!phoneNumberParsed || !phoneNumberParsed.isValid()) {
    return ""; // empty string is falsy for z.refine()
  }
  return phoneNumberParsed.number;
}

function validDateString(dateStr: string, ctx: z.RefinementCtx): string {
  // parse german date and add zod issue in case it throws
  try {
    return dayjs(dateStr, ["D.M.YY"], "de").toISOString();
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      message: "Ungültiges Datum",
    });
    return z.NEVER;
  }
}

// Quelle: Datensatz für das Meldewesen (Koordinierungsstelle für IT-Standards ( KoSIT) Bremen)
// 14. Änderung, Wirksam ab 1. November 2022, Seite 98, https://www1.osci.de/meldewesen/dsmeld/dsmeld-14-aenderung-24448
export const FamilienStandSchema = z.enum([
  "ledig",
  "verheiratet",
  "verwitwet",
  "geschieden",
  "Ehe aufgehoben",
  "in eingetragener Lebenspartnerschaft",
  "durch Tod aufgelöste Lebenspartnerschaft",
  "aufgehobene Lebenspartnerschaft",
  "durch Todeserklärung aufgelöste Lebenspartnerschaft",
  "nicht bekannt",
]);

// FIXME: some of these are optional for people living abroad
const AddressSchema = z.object({
  streetName: z.string().min(1, "Straße darf nicht leer sein"),
  streetNumber: z.coerce.string().min(1, "Hausnummer darf nicht leer sein"),
  postcode: z.coerce
    .number()
    .int()
    .gte(10000, "Ungültige Postleitzahl")
    .lte(99999, "Ungültige Postleitzahl"),
  city: z.string().min(2, "Ungültige Stadt"),
});

const NameSchema = z.object({
  first: z.string().min(1, "Vorname darf nicht leer sein"),
  family: z.string().min(2, "Nachname darf nicht leer sein"),
});

const PhoneNumberSchema = z.string().refine(phoneNumberValid, {
  message: "Ungültige Telefonnummer",
});

export const ApplicantSchema = z.object({
  name: NameSchema,
  job: z.string(),
  birthday: z.string().transform(validDateString),
  familienStand: FamilienStandSchema,
  address: AddressSchema,
  phoneNumber: PhoneNumberSchema,
});

export type ApplicantType = z.infer<typeof ApplicantSchema>;
