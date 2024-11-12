import type { AppLoadContext } from "@remix-run/node";
import { z } from "zod";

const remixContextSchema = z.object({
  debugId: z.string().optional(),
});

export function handleRemixContext(context: AppLoadContext) {
  return remixContextSchema.parse(context);
}
