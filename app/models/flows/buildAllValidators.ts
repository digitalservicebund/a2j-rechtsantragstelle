import { withZod } from "@remix-validated-form/with-zod";
import type { AnyZodObject } from "zod";
import { z } from "zod";
import type { FormPages } from "~/models/flows/steps";

export const buildAllValidators = (formPages: FormPages) =>
  Object.fromEntries(
    Object.entries(formPages).map(([key, step]) => [
      key,
      "schema" in step
        ? withZod(step.schema as AnyZodObject)
        : withZod(z.object({})),
    ])
  ) as Record<string, ReturnType<typeof withZod>>;
