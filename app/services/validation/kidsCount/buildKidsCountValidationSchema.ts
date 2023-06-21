import { z } from "zod";

export const buildKidsCountValidationSchema = () => {
  return z
    .string()
    .trim()
    .regex(/^-?\d*([,.]5)?$/, "wrong_format")
    .transform((v) => Number(v.replace(",", ".")))
    .refine((v) => v >= 0 && v <= 50, { message: "out_of_range" })
    .transform((v) => v.toString().replace(".", ","));
};
