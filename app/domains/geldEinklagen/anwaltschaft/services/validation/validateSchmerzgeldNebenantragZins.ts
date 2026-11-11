import z from "zod";
import type { FunctionMultiFieldsValidation } from "~/domains/types";
import { hauptUndNebenantraegePages } from "../../hauptUndNebenantraege/pages";
import { validateDateRange } from "./validateDateRange";

const _schema =
  hauptUndNebenantraegePages.schmerzengeldNebenantragDaten.pageSchema;

export function validateSchmerzgeldNebenantragZins(): FunctionMultiFieldsValidation<
  Pick<
    typeof _schema,
    | "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinssatzInProzent"
    | "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsmethode"
    | "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsbeginn"
    | "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsende"
  >
> {
  return function (baseSchema) {
    return baseSchema.check((ctx) => {
      const zinssatz =
        ctx.value[
          "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinssatzInProzent"
        ];
      const zinsmethode =
        ctx.value[
          "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsmethode"
        ];
      const startDate =
        ctx.value[
          "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsbeginn"
        ];
      const endDate =
        ctx.value[
          "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsende"
        ];

      const hasZinssatz = typeof zinssatz === "number";
      const hasZinsmethode =
        typeof zinsmethode === "string" && zinsmethode !== "";

      if (hasZinssatz && !hasZinsmethode) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie eine Zinsmethode an",
          path: [
            "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsmethode",
          ],
          fatal: true,
          input: zinsmethode,
        });
      }

      if (hasZinsmethode && !hasZinssatz) {
        ctx.issues.push({
          code: "custom",
          message: "Bitte geben Sie einen Zinssatz an",
          path: [
            "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinssatzInProzent",
          ],
          fatal: true,
          input: zinssatz,
        });
      }
      validateDateRange(
        ctx,
        startDate,
        endDate,
        "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsende",
      );
      return z.NEVER;
    });
  };
}
