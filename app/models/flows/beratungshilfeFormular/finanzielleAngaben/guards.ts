import { type BeratungshilfeFinanzielleAngaben } from "./context";

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
};
