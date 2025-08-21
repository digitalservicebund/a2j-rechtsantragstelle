import { type PagesConfig } from "~/domains/pageSchemas";
import {
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  wertsachenArraySchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenEigentumPages = {
  eigentumInfo: {
    stepId: "finanzielle-angaben/eigentum/eigentum-info",
    pageSchema: {},
  },
  eigentumHeiratInfo: {
    stepId: "finanzielle-angaben/eigentum/heirat-info",
    pageSchema: {},
  },
  eigentumBankkontenFrage: {
    stepId: "finanzielle-angaben/eigentum/bankkonten-frage",
    pageSchema: {
      hasBankkonto: YesNoAnswer,
    },
  },
  eigentumGeldanlagenFrage: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen-frage",
    pageSchema: {
      hasGeldanlage: YesNoAnswer,
    },
  },
  eigentumWertgegenstaendeFrage: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende-frage",
    pageSchema: {
      hasWertsache: YesNoAnswer,
    },
  },
  eigentumGrundeigentumFrage: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum-frage",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
    pageSchema: {
      hasKraftfahrzeug: YesNoAnswer,
    },
  },
  eigentumZusammenfassung: {
    stepId: "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    arrayPages: {
      bankkonten: {
        pageSchema: {
          bankkonten: bankkontenArraySchema,
        },
        arrayPages: {
          daten: {
            pageSchema: {
              "bankkonten#bankName":
                bankkontenArraySchema.element.shape.bankName,
              "bankkonten#kontostand":
                bankkontenArraySchema.element.shape.kontostand,
              "bankkonten#iban": bankkontenArraySchema.element.shape.iban,
              "bankkonten#kontoEigentuemer":
                bankkontenArraySchema.element.shape.kontoEigentuemer,
              "bankkonten#kontoDescription":
                bankkontenArraySchema.element.shape.kontoDescription,
            },
          },
        },
      },
      kraftfahrzeuge: {
        pageSchema: {
          kraftfahrzeuge: kraftfahrzeugeArraySchema,
        },
        arrayPages: {
          arbeitsweg: {
            pageSchema: {
              "kraftfahrzeuge#hasArbeitsweg":
                kraftfahrzeugeArraySchema.element.shape.hasArbeitsweg,
            },
          },
          wert: {
            pageSchema: {
              "kraftfahrzeuge#wert":
                kraftfahrzeugeArraySchema.element.shape.wert,
            },
          },
          fahrzeuge: {
            pageSchema: {
              "kraftfahrzeuge#art": kraftfahrzeugeArraySchema.element.shape.art,
              "kraftfahrzeuge#marke":
                kraftfahrzeugeArraySchema.element.shape.marke,
              "kraftfahrzeuge#eigentuemer":
                kraftfahrzeugeArraySchema.element.shape.eigentuemer,
              "kraftfahrzeuge#verkaufswert":
                kraftfahrzeugeArraySchema.element.shape.verkaufswert,
              "kraftfahrzeuge#kilometerstand":
                kraftfahrzeugeArraySchema.element.shape.kilometerstand,
              "kraftfahrzeuge#anschaffungsjahr":
                kraftfahrzeugeArraySchema.element.shape.anschaffungsjahr,
              "kraftfahrzeuge#baujahr":
                kraftfahrzeugeArraySchema.element.shape.baujahr,
            },
          },
        },
      },
      geldanlagen: {
        pageSchema: {
          geldanlagen: geldanlagenArraySchema,
        },
        arrayPages: {
          art: {
            pageSchema: {
              "geldanlagen#art": geldanlagenArraySchema.element.shape.art,
            },
          },
          bargeld: {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
            },
          },
          wertpapiere: {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
            },
          },
          "guthabenkonto-krypto": {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
              "geldanlagen#kontoBankName":
                geldanlagenArraySchema.element.shape.kontoBankName,
              "geldanlagen#kontoIban":
                geldanlagenArraySchema.element.shape.kontoIban,
              "geldanlagen#kontoBezeichnung":
                geldanlagenArraySchema.element.shape.kontoBezeichnung,
            },
          },
          "giro-tagesgeld-sparkonto": {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
              "geldanlagen#kontoBankName":
                geldanlagenArraySchema.element.shape.kontoBankName,
              "geldanlagen#kontoIban":
                geldanlagenArraySchema.element.shape.kontoIban,
              "geldanlagen#kontoBezeichnung":
                geldanlagenArraySchema.element.shape.kontoBezeichnung,
            },
          },
          befristet: {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
              "geldanlagen#befristetArt":
                geldanlagenArraySchema.element.shape.befristetArt,
            },
          },
          forderung: {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
              "geldanlagen#forderung":
                geldanlagenArraySchema.element.shape.forderung,
              "geldanlagen#verwendungszweck":
                geldanlagenArraySchema.element.shape.verwendungszweck,
              "geldanlagen#auszahlungdatum":
                geldanlagenArraySchema.element.shape.auszahlungdatum,
            },
          },
          sonstiges: {
            pageSchema: {
              "geldanlagen#eigentuemer":
                geldanlagenArraySchema.element.shape.eigentuemer,
              "geldanlagen#wert": geldanlagenArraySchema.element.shape.wert,
            },
          },
        },
      },
      grundeigentum: {
        pageSchema: {
          grundeigentum: grundeigentumArraySchema,
        },
        arrayPages: {
          "bewohnt-frage": {
            pageSchema: {
              "grundeigentum#isBewohnt":
                grundeigentumArraySchema.element.shape.isBewohnt,
            },
          },
          daten: {
            pageSchema: {
              "grundeigentum#art": grundeigentumArraySchema.element.shape.art,
              "grundeigentum#eigentuemer":
                grundeigentumArraySchema.element.shape.eigentuemer,
              "grundeigentum#flaeche":
                grundeigentumArraySchema.element.shape.flaeche,
              "grundeigentum#verkaufswert":
                grundeigentumArraySchema.element.shape.verkaufswert,
              "grundeigentum#strassehausnummer":
                grundeigentumArraySchema.element.shape.strassehausnummer,
              "grundeigentum#plz": grundeigentumArraySchema.element.shape.plz,
              "grundeigentum#ort": grundeigentumArraySchema.element.shape.ort,
              "grundeigentum#land": grundeigentumArraySchema.element.shape.land,
            },
          },
          "bewohnt-daten": {
            pageSchema: {
              "grundeigentum#art": grundeigentumArraySchema.element.shape.art,
              "grundeigentum#eigentuemer":
                grundeigentumArraySchema.element.shape.eigentuemer,
              "grundeigentum#flaeche":
                grundeigentumArraySchema.element.shape.flaeche,
              "grundeigentum#verkaufswert":
                grundeigentumArraySchema.element.shape.verkaufswert,
              "grundeigentum#strassehausnummer":
                grundeigentumArraySchema.element.shape.strassehausnummer,
              "grundeigentum#plz": grundeigentumArraySchema.element.shape.plz,
              "grundeigentum#ort": grundeigentumArraySchema.element.shape.ort,
              "grundeigentum#land": grundeigentumArraySchema.element.shape.land,
            },
          },
        },
      },
      wertgegenstaende: {
        pageSchema: {
          wertsachen: wertsachenArraySchema,
        },
        arrayPages: {
          daten: {
            pageSchema: {
              "wertsachen#art": wertsachenArraySchema.element.shape.art,
              "wertsachen#eigentuemer":
                wertsachenArraySchema.element.shape.eigentuemer,
              "wertsachen#wert": wertsachenArraySchema.element.shape.wert,
            },
          },
        },
      },
    },
  },
  eigentumZusammenfassungWarnung: {
    stepId: "finanzielle-angaben/eigentum-zusammenfassung/warnung",
    pageSchema: {},
  },
} as const satisfies PagesConfig;
