import z from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import { hauptUndNebenantraegePages } from "../../hauptUndNebenantraege/pages";
import { validateDateRange } from "./validateDateRange";

const _schema = hauptUndNebenantraegePages.nebenantragDaten.pageSchema;

export function validateNebenantragZins(): FunctionMultiFieldsValidation<
  Pick<
    typeof _schema,
    | "hauptantrag#nebenantraege#nebenantragZinssatzInProzent"
    | "hauptantrag#nebenantraege#nebenantragZinsmethode"
    | "hauptantrag#nebenantraege#nebenantragZinsbeginn"
    | "hauptantrag#nebenantraege#nebenantragZinsende"
  >
> {
  return function (baseSchema) {
    return baseSchema.check((ctx) => {
      const zinssatz =
        ctx.value["hauptantrag#nebenantraege#nebenantragZinssatzInProzent"];
      const zinsmethode =
        ctx.value["hauptantrag#nebenantraege#nebenantragZinsmethode"];
      const startDate =
        ctx.value["hauptantrag#nebenantraege#nebenantragZinsbeginn"];
      const endDate =
        ctx.value["hauptantrag#nebenantraege#nebenantragZinsende"];

      const hasZinssatz = typeof zinssatz === "number";
      const hasZinsmethode =
        typeof zinsmethode === "string" && zinsmethode !== "";

      if (hasZinssatz && !hasZinsmethode) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie eine Zinsmethode an",
          path: ["hauptantrag#nebenantraege#nebenantragZinsmethode"],
          fatal: true,
          input: zinsmethode,
        });
      }

      if (hasZinsmethode && !hasZinssatz) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie einen Zinssatz an",
          path: ["hauptantrag#nebenantraege#nebenantragZinssatzInProzent"],
          fatal: true,
          input: zinssatz,
        });
      }
      validateDateRange(
        ctx,
        startDate,
        endDate,
        "hauptantrag#nebenantraege#nebenantragZinsende",
      );
      return z.NEVER;
    });
  };
}
