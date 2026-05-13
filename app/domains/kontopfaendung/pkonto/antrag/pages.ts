import { bankNameFromIBAN } from "~/components/formElements/inputs/iban/bankNameFromIBAN";
import { fetchBanks } from "~/components/formElements/inputs/iban/fetchBanks";
import type {
  FieldValueChangeHandlerProps,
  PagesConfig,
} from "~/domains/pageSchemas";
import { translations } from "~/services/translations/translations";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { emailSchema } from "~/services/validation/email";
import { ibanSchema } from "~/services/validation/iban";
import { integerSchema } from "~/services/validation/integer";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const kontopfaendungPkontoAntragPages = {
  grundvoraussetzungenDatenverarbeitung: {
    stepId: "grundvoraussetzungen/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  bestehendesPkonto: {
    stepId: "grundvoraussetzungen/bestehendes-pkonto",
    pageSchema: {
      bestehendesPkonto: YesNoAnswer,
    },
  },
  ende: {
    stepId: "grundvoraussetzungen/ende",
  },
  bankdatenEinleitung: {
    stepId: "bankdaten/einleitung",
  },
  bankdatenKontodaten: {
    stepId: "bankdaten/kontodaten",
    pageSchema: {
      iban: ibanSchema,
      bankName: stringRequiredSchema,
    },
    controlledFieldConfig: {
      fieldName: "bankName",
      handleFieldValueChange: async ({
        originalValue,
        value,
        controlledField,
        setControlledFieldSrValue,
      }: FieldValueChangeHandlerProps) => {
        const banks = await fetchBanks();

        // needed to ensure value isn't automatically set upon initial render
        if (originalValue !== value) {
          if (value && typeof value === "string" && value.length > 0 && banks) {
            // Debounce needed to not clobber the screen reader while typing
            const timeout = setTimeout(() => {
              const matchedBankName = bankNameFromIBAN(value, banks);
              if (matchedBankName) {
                setControlledFieldSrValue(matchedBankName);
                controlledField.setValue(matchedBankName);
                controlledField.validate();
              } else {
                setControlledFieldSrValue("");
                controlledField.setValue("");
              }
            }, 1000);

            return () => clearTimeout(timeout);
          }
          setControlledFieldSrValue("");
          controlledField?.setValue("");
        }
      },
      getScreenReaderAnnouncementText: (controlledFieldSrValue: string) =>
        `${translations.iban.bankIdentified.de}: ${controlledFieldSrValue}`,
    },
  },
  kontoinhaberName: {
    stepId: "persoenliche-daten/kontoinhaber-name",
    pageSchema: {
      vollstaendigerName: stringRequiredSchema,
    },
  },
  kontoinhaberAnschrift: {
    stepId: "persoenliche-daten/kontoinhaber-anschrift",
    pageSchema: {
      kontoinhaberStrasseHausnummer: stringRequiredSchema,
      kontoinhaberPlz: integerSchema,
      kontoinhaberOrt: stringRequiredSchema,
      kontoinhaberLand: stringOptionalSchema,
    },
  },
  kontakt: {
    stepId: "persoenliche-daten/kontakt",
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
      emailadresse: schemaOrEmptyString(emailSchema),
    },
  },
  zusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  ergebnis: {
    stepId: "abgabe/p-konto-vorhanden",
  },
} as const satisfies PagesConfig;
