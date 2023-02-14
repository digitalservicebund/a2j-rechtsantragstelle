import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js/max";

function phone_number_valid(phone_number: string): string {
  const phone_number_parsed = parsePhoneNumber(phone_number, "DE");
  if (!phone_number_parsed || !phone_number_parsed.isValid()) {
    return ""; // empty string is falsy for z.refine()
  }
  return phone_number_parsed.number;
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
  street_name: z.string().min(1),
  street_no: z.coerce.string().min(1),
  postcode: z.coerce.number().int().gte(10000).lte(99999),
  city: z.string().min(2),
});

const NameSchema = z.object({
  family: z.string().min(1),
  first: z.string().min(1),
});

const PhoneNumberSchema = z
  .string()
  .refine((phoneNumber) => phone_number_valid(phoneNumber), {
    message: "Phone number not valid",
  });

export const ApplicantSchema = z.object({
  name: NameSchema,
  job: z.string().min(1),
  birthday: z.string().transform((dateStr) => new Date(dateStr)),
  familienStand: FamilienStandSchema,
  address: AddressSchema,
  phone_number: PhoneNumberSchema,
});

export type ApplicantType = z.infer<typeof ApplicantSchema>;
