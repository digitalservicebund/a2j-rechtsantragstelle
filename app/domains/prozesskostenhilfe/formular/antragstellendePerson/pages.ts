import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { familyRelationshipSchema } from "../finanzielleAngaben/andere-unterhaltszahlungen/pages";

export const pkhFormularAntragstellendePersonPages = {
  empfaenger: {
    stepId: "/antragstellende-person/empfaenger",
    pageSchema: {
      empfaenger: z.enum(["myself", "child", "otherPerson"]),
    },
  },
  ...pkhFormularVereinfachteErklaerungPages,
  unterhaltsanspruch: {
    stepId: "/antragstellende-person/unterhaltsanspruch",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhaltsanspruch: z.enum([
        "keine",
        "unterhalt",
        "anspruchNoUnterhalt",
        "sonstiges",
      ]),
    },
  },
  unterhaltsbeschreibung: {
    stepId: "/antragstellende-person/unterhaltsbeschreibung",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhaltsbeschreibung: stringRequiredSchema,
    },
  },
  unterhaltLebenFrage: {
    stepId: "/antragstellende-person/unterhalt-leben-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      couldLiveFromUnterhalt: YesNoAnswer,
    },
  },
  unterhalt: {
    stepId: "/antragstellende-person/unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhaltsSumme: buildMoneyValidationSchema(),
    },
  },
  unterhaltspflichtigePersonBeziehung: {
    stepId: "/antragstellende-person/unterhaltspflichtige-person-beziehung",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      personWhoCouldPayUnterhaltBeziehung: familyRelationshipSchema,
    },
  },
  warumKeinerUnterhalt: {
    stepId: "/antragstellende-person/warum-keiner-unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      whyNoUnterhalt: stringRequiredSchema,
    },
  },
  unterhaltHauptsaechlichesLeben: {
    stepId: "/antragstellende-person/unterhalt-hauptsaechliches-leben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      livesPrimarilyFromUnterhalt: YesNoAnswer,
    },
  },
  unterhaltspflichtigePerson: {
    stepId: "/antragstellende-person/unterhaltspflichtige-person",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhaltspflichtigePerson: z
        .object({
          beziehung: familyRelationshipSchema,
          vorname: stringRequiredSchema,
          nachname: stringRequiredSchema,
        })
        .optional(),
    },
  },
  eigenesExemplar: {
    stepId: "/antragstellende-person/eigenes-exemplar",
    shouldCollapseIntoParentNavItem: true,
  },
  zweiFormulare: {
    stepId: "/antragstellende-person/zwei-formulare",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;
