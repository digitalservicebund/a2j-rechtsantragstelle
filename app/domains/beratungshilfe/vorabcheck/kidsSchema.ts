import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

export const kidsSchema = z
  .object({
    kids6Below: buildKidsCountValidationSchema(),
    kids7To14: buildKidsCountValidationSchema(),
    kids15To18: buildKidsCountValidationSchema(),
    kids18Above: buildKidsCountValidationSchema(),
  })
  .check((ctx) => {
    const allZero = Object.values(ctx.value).every((val) => val === "0");
    if (allZero)
      Object.entries(ctx.value).forEach(([key, value]) => {
        ctx.issues.push({
          code: "custom",
          message: "fill_one",
          input: value,
          path: [key],
        });
      });
  });
