import z from "zod";

export const bankDataSchema = z
  .array(
    z.object({
      Bankleitzahl: z.number(),
      Merkmal: z.number(),
      Bezeichnung: z.string(),
      PLZ: z.number(),
      Ort: z.string(),
      Kurzbezeichnung: z.string(),
      PAN: z.number().or(z.literal("")),
      BIC: z.string(),
      Prüfzifferberechnungsmethode: z.number().or(z.string()),
      Datensatznummer: z.number(),
      Änderungskennzeichen: z.string(),
      Bankleitzahllöschung: z.number(),
      "Nachfolge-Bankleitzahl": z.number(),
    }),
  )
  .transform(
    (data) =>
      data.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.Bankleitzahl]: curr.Bezeichnung,
        }),
        {},
      ) as Record<number, string>,
  );

export type BankData = z.output<typeof bankDataSchema>;

export function bankNameFromIBAN(iban: string, banks: BankData) {
  const bankCode = Number(iban.replaceAll(" ", "").substring(4, 12));
  return banks[bankCode];
}
