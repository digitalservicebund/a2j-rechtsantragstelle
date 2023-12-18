import { type FluggastrechtContext } from "./context";

type Guard = (context: FluggastrechtContext) => boolean;

function yesNoGuards<Field extends keyof FluggastrechtContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context[field] === "no") as Guard,
  };
}

export const fluggastrechteGuards = {
  ...yesNoGuards("zwischenstopps"),
  ...yesNoGuards("ankunftWithSameFlight"),
};
