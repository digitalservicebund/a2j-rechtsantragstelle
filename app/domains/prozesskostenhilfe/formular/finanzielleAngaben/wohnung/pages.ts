import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenWohnungPages = {
  wohnungAlleineZusammen: {
    stepId: "finanzielle-angaben/wohnung/alleine-zusammen",
    pageSchema: {
      livingSituation: z.enum(["alone", "withRelatives", "withOthers"]),
    },
  },
  wohnungAnzahlMitbewohner: {
    stepId: "finanzielle-angaben/wohnung/anzahl-mitbewohner",
    pageSchema: {
      apartmentPersonCount: integerSchema,
    },
  },
  wohnungGroesse: {
    stepId: "finanzielle-angaben/wohnung/groesse",
    pageSchema: {
      apartmentSizeSqm: integerSchema,
    },
  },
  wohnungAnzahlZimmer: {
    stepId: "finanzielle-angaben/wohnung/anzahl-zimmer",
    pageSchema: {
      numberOfRooms: integerSchema,
    },
  },
  wohnungMieteEigenheim: {
    stepId: "finanzielle-angaben/wohnung/miete-eigenheim",
    pageSchema: {
      rentsApartment: YesNoAnswer,
    },
  },
  wohnungMieteAlleine: {
    stepId: "finanzielle-angaben/wohnung/miete-alleine",
    pageSchema: {
      totalRent: buildMoneyValidationSchema(),
      rentWithoutUtilities: buildMoneyValidationSchema().or(z.literal("")),
    },
  },
  wohnungMieteZusammen: {
    stepId: "finanzielle-angaben/wohnung/miete-zusammen",
    pageSchema: {
      totalRent: buildMoneyValidationSchema(),
      sharedRent: buildMoneyValidationSchema(),
    },
  },
  wohnungGarageParkplatz: {
    stepId: "finanzielle-angaben/wohnung/garage-parkplatz",
    pageSchema: {
      garageParkplatz: z.enum([
        "yesPartOfTheContract",
        "yesNotPartOfTheContract",
        "no",
      ]),
    },
  },
  wohnungNebenkosten: {
    stepId: "finanzielle-angaben/wohnung/nebenkosten",
    pageSchema: {
      utilitiesCost: buildMoneyValidationSchema().or(z.literal("")),
      heatingCosts: buildMoneyValidationSchema().or(z.literal("")),
    },
  },
  wohnungEigenheimNebenkosten: {
    stepId: "finanzielle-angaben/wohnung/eigenheim-nebenkosten",
    pageSchema: {
      utilitiesCostOwned: buildMoneyValidationSchema(),
      heatingCostsOwned: buildMoneyValidationSchema(),
    },
  },
  wohnungEigenheimNebenkostenGeteilt: {
    stepId: "finanzielle-angaben/wohnung/eigenheim-nebenkosten-geteilt",
    pageSchema: {
      utilitiesCostOwned: buildMoneyValidationSchema(),
      heatingCostsOwned: buildMoneyValidationSchema(),
      utilitiesCostOwnShared: buildMoneyValidationSchema(),
    },
  },
} as const satisfies PagesConfig;
