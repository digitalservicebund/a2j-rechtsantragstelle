import z from "zod";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

const grundbesitzFields = {
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  adresszusatz: stringOptionalSchema,
};

export const grundbesitzArraySchema = z.array(
  z.object({
    ...grundbesitzFields,
  }),
);

export const unternehmenArraySchema = z.array(
  z.object({
    firmenname: stringRequiredSchema,
  }),
);

export const nachlassPages = {
  grundbesitz: {
    stepId: "/nachlass/grundbesitz-frage",
    pageSchema: {
      hasGrundbesitz: z.enum(["yes", "no", "unknown"]),
    },
  },
  grundBesitzOverview: {
    stepId: "/nachlass/grundbesitz/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "grundbesitz",
      schema: grundbesitzArraySchema,
      fieldName: "hasGrundbesitz",
    },
  },
  grundbesitzAdresse: {
    stepId: "/nachlass/grundbesitz/#/adresse",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "grundbesitz#strasse": grundbesitzFields.strasse,
      "grundbesitz#hausnummer": grundbesitzFields.hausnummer,
      "grundbesitz#plz": grundbesitzFields.plz,
      "grundbesitz#ort": grundbesitzFields.ort,
      "grundbesitz#adresszusatz": grundbesitzFields.adresszusatz,
    },
  },
  grundbesitzWarnung: {
    stepId: "/nachlass/grundbesitz/warnung",
  },
  unternehmen: {
    stepId: "/nachlass/unternehmen-frage",
    pageSchema: {
      hasUnternehmen: z.enum(["yes", "no", "unknown"]),
    },
  },
  unternehmenOverview: {
    stepId: "/nachlass/unternehmen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "unternehmen",
      schema: unternehmenArraySchema,
      fieldName: "hasUnternehmen",
    },
  },
  unternehmenWarnung: {
    stepId: "/nachlass/unternehmen/warnung",
  },
  unternehmenName: {
    stepId: "/nachlass/unternehmen/#/name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "unternehmen#firmenname": stringRequiredSchema,
    },
  },
  vermoegen: {
    stepId: "/nachlass/vermoegen-frage",
    pageSchema: {
      hasVermoegen: z.enum(["yes", "no", "unknown"]),
    },
  },
} as const satisfies PageConfigMap;
