import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { FormPages } from "~/models/flows/FormPages";

export const buildAllValidators = (formPages: FormPages) =>
  Object.fromEntries(
    Object.entries(formPages).map(([key, step]) => [
      key,
      "schema" in step ? withZod(step.schema) : withZod(z.object({})),
    ])
  ) as Record<string, ReturnType<typeof withZod>>;
