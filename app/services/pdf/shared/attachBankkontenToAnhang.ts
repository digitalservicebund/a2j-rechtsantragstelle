import type { BankkontenArraySchema } from "~/flows/shared/finanzielleAngaben/context";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { eigentuemerMapping } from "~/services/pdf/shared/eigentumHelpers";

export const attachBankkontenToAnhang = (
  attachment: AttachmentEntries,
  bankkonten: BankkontenArraySchema,
) => {
  attachment.push({
    title: "Bankkonten",
    level: "h3",
  });

  bankkonten.forEach(
    (
      { bankName, kontoEigentuemer, kontostand, kontoDescription, iban },
      index,
    ) => {
      attachment.push(
        { title: `Bankkonto ${index + 1}`, level: "h4" },
        { title: "Bank", text: bankName },
        { title: "Inhaber", text: eigentuemerMapping[kontoEigentuemer] },
        { title: "Kontostand", text: kontostand + " €" },
      );

      if (kontoDescription)
        attachment.push({ title: "Beschreibung", text: kontoDescription });
      if (iban) attachment.push({ title: "Iban", text: iban });
    },
  );
  return { attachment };
};
