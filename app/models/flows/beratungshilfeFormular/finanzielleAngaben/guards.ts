import { type BeratungshilfeFinanzielleAngaben } from "./context";

type Guard = (context: BeratungshilfeFinanzielleAngaben) => boolean;

function yesNoGuards<Field extends keyof BeratungshilfeFinanzielleAngaben>(
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

export const finanzielleAngabeGuards = {
  staatlicheLeistungenIsGrundsicherung: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsAsylbewerberleistungen: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "asylbewerberleistungen",
  staatlicheLeistungenIsBuergergeld: (
    context: BeratungshilfeFinanzielleAngaben,
  ) => context.staatlicheLeistungen === "buergergeld",
  ...yesNoGuards("erwerbstaetig"),
};
