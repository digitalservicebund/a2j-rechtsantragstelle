import type z from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import type { SchemaObject } from "~/domains/userData";
import { hauptUndNebenantraegePages } from "../../hauptUndNebenantraege/pages";
import { validateDateRange } from "./validateDateRange";
import type { DateInput } from "./validateDateRange";

const _schema = hauptUndNebenantraegePages.nebenantragDaten.pageSchema;

export function validateNebenantragZins(): FunctionMultiFieldsValidation<
  Pick<
    typeof _schema,
    | "hauptantrag#nebenantrag#nebenantragZinssatzInProzent"
    | "hauptantrag#nebenantrag#nebenantragZinsmethode"
  >
> {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const zinssatz =
        ctx.value["hauptantrag#nebenantrag#nebenantragZinssatzInProzent"];
      const zinsmethode =
        ctx.value["hauptantrag#nebenantrag#nebenantragZinsmethode"];
      const startDate =
        ctx.value["hauptantrag#nebenantrag#nebenantragZinsbeginn"];
      const endDate = ctx.value["hauptantrag#nebenantrag#nebenantragZinsende"];

      const hasZinssatz = typeof zinssatz === "number";
      const hasZinsmethode =
        typeof zinsmethode === "string" && zinsmethode !== "";

      if (hasZinssatz && !hasZinsmethode) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie eine Zinsmethode an",
          path: ["hauptantrag#nebenantrag#nebenantragZinsmethode"],
          fatal: true,
          input: zinsmethode,
        });
      }

      if (hasZinsmethode && !hasZinssatz) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie einen Zinssatz an",
          path: ["hauptantrag#nebenantrag#nebenantragZinssatzInProzent"],
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
        "hauptantrag#nebenantrag#nebenantragZinsende",
      );
      return z.NEVER;
    });
  };
}
