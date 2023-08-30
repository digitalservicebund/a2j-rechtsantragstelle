import { z } from "zod";

export const YesNoAnswer = z.enum(["yes", "no"], {
  errorMap: (issue, ctx) => ({ message: "required" }),
});
