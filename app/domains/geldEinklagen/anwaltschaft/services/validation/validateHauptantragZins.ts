import z from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import type { SchemaObject } from "~/domains/userData";
import { hauptUndNebenantraegePages } from "../../hauptUndNebenantraege/pages";
import { validateDateRange } from "./validateDateRange";
import type { DateInput } from "./validateDateRange";

const _schema = hauptUndNebenantraegePages.hauptantragDaten.pageSchema;

export function validateHauptantragZins(): FunctionMultiFieldsValidation<
  Pick<
    typeof _schema,
    "hauptantrag#zinssatzInProzent" | "hauptantrag#zinsmethode"
  >
> {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const zinssatz = ctx.value["hauptantrag#zinssatzInProzent"];
      const zinsmethode = ctx.value["hauptantrag#zinsmethode"];
      const startDate = ctx.value["hauptantrag#zinsbeginn"];
      const endDate = ctx.value["hauptantrag#zinsende"];

      const hasZinssatz = typeof zinssatz === "number";
      const hasZinsmethode =
        typeof zinsmethode === "string" && zinsmethode !== "";

      if (hasZinssatz && !hasZinsmethode) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie eine Zinsmethode an",
          path: ["hauptantrag#zinsmethode"],
          fatal: true,
          input: zinsmethode,
        });
      }

      if (hasZinsmethode && !hasZinssatz) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie einen Zinssatz an",
          path: ["hauptantrag#zinssatzInProzent"],
          fatal: true,
          input: zinssatz,
        });
      }
      validateDateRange(
        ctx,
        typeof startDate === "object" && startDate !== null
          ? (startDate as DateInput)
          : undefined,
        typeof endDate === "object" && endDate !== null
          ? (endDate as DateInput)
          : undefined,
        "hauptantrag#zinsende",
      );
      return z.NEVER;
    });
  };
}
