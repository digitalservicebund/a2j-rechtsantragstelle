import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";
import { familyRelationshipInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularAntragstellendePersonPages = {
  empfaenger: {
    stepId: "antragstellende-person/empfaenger",
    pageSchema: {
      empfaenger: z.enum(["myself", "child", "otherPerson"]),
    },
  },
  ...pkhFormularVereinfachteErklaerungPages,
  unterhaltsanspruch: {
    stepId: "antragstellende-person/unterhaltsanspruch",
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
    stepId: "antragstellende-person/unterhaltsbeschreibung",
    pageSchema: {
      unterhaltsbeschreibung: stringRequiredSchema,
    },
  },
  unterhaltLebenFrage: {
    stepId: "antragstellende-person/unterhalt-leben-frage",
    pageSchema: {
      couldLiveFromUnterhalt: YesNoAnswer,
    },
  },
  unterhalt: {
    stepId: "antragstellende-person/unterhalt",
    pageSchema: {
      unterhaltsSumme: buildMoneyValidationSchema(),
    },
  },
  unterhaltspflichtigePersonBeziehung: {
    stepId: "antragstellende-person/unterhaltspflichtige-person-beziehung",
    pageSchema: {
      personWhoCouldPayUnterhaltBeziehung: familyRelationshipInputSchema,
    },
  },
  warumKeinerUnterhalt: {
    stepId: "antragstellende-person/warum-keiner-unterhalt",
    pageSchema: {
      whyNoUnterhalt: stringRequiredSchema,
    },
  },
  unterhaltHauptsaechlichesLeben: {
    stepId: "antragstellende-person/unterhalt-hauptsaechliches-leben",
    pageSchema: {
      livesPrimarilyFromUnterhalt: YesNoAnswer,
    },
  },
  unterhaltspflichtigePerson: {
    stepId: "antragstellende-person/unterhaltspflichtige-person",
    pageSchema: {
      unterhaltspflichtigePerson: z
        .object({
          beziehung: familyRelationshipInputSchema,
          vorname: stringRequiredSchema,
          nachname: stringRequiredSchema,
        })
        .optional(),
    },
  },
  eigenesExemplar: {
    stepId: "antragstellende-person/eigenes-exemplar",
  },
  zweiFormulare: {
    stepId: "antragstellende-person/zwei-formulare",
  },
} as const satisfies PagesConfig;
