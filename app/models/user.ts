import { z } from "zod";

function phone_number_valid(phone_number: Number): Boolean {
  // FIXME: validate phone number
  return true;
}

// Quelle: Datensatz für das Meldewesen (Koordinierungsstelle für IT-Standards ( KoSIT) Bremen)
// 14. Änderung, Wirksam ab 1. November 2022, Seite 98, https://www1.osci.de/meldewesen/dsmeld/dsmeld-14-aenderung-24448
const FamilienStandSchema = z.enum([
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
  street_no: z.number().int().nonnegative().finite(),
  postcode: z.number().int().gte(10000).lte(99999),
  city: z.string().min(2),
});

const NameSchema = z.object({
  family: z.string().min(1),
  first: z.string().min(1),
});

const PhoneNumberSchema = z.number().int().refine(phone_number_valid);

export const ApplicantSchema = z.object({
  name: NameSchema,
  job: z.string().min(1),
  birthday: z.coerce.date(), // The coerce parses incoming string into a javascript Date
  familienStand: FamilienStandSchema,
  address: AddressSchema,
  phone_number: PhoneNumberSchema,
});

export type ApplicantType = z.infer<typeof ApplicantSchema>;
