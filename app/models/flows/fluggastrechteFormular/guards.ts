import type { Guards } from "../guards.server";
import { type FluggastrechtContext } from "./context";

function yesNoGuards<Field extends keyof FluggastrechtContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guards[string] } & {
  [field in Field as `${field}No`]: Guards[string];
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ({ context }) => context[field] === "yes",
    [`${field}No`]: ({ context }) => context[field] === "no",
  } satisfies Guards;
}

export const fluggastrechteGuards = {
  ...yesNoGuards("zwischenstopps"),
  ...yesNoGuards("ankunftWithSameFlight"),
};
