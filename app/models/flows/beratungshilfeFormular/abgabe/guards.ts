import { type BeratungshilfeAntragContext } from "..";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: (context: BeratungshilfeAntragContext) =>
    Boolean(
      context.rechtsschutzversicherung === "no" &&
        context.wurdeVerklagt === "no" &&
        context.klageEingereicht === "no" &&
        context.beratungshilfeBeantragt === "no" &&
        context.bereich &&
        context.beschreibung &&
        context.eigeninitiative &&
        (context.eigeninitiativeBeschreibung ||
          context.keineEigeninitiativeBeschreibung),
    ),
};
